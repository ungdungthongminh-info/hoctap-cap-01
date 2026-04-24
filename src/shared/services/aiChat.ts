import { STORAGE_KEYS } from '../constants/storageKeys';

export type AIProvider = 'gemini' | 'gpt' | 'grok';

export interface AISettings {
  enabled: boolean;
  provider: AIProvider;
  apiKey: string;
  model: string;
  endpoint?: string;
  apiStoreUrl: string;
}

export interface AIResponse {
  success: boolean;
  text: string;
  error?: string;
}

interface JsonFetchResult {
  ok: boolean;
  status: number;
  data: any;
  timedOut?: boolean;
}

const DEFAULTS: AISettings = {
  enabled: false,
  provider: 'gemini',
  apiKey: '',
  model: 'gemini-2.0-flash',
  endpoint: '',
  apiStoreUrl: '',
};

const DEFAULT_MODEL: Record<AIProvider, string> = {
  gemini: 'gemini-2.0-flash',
  gpt: 'gpt-4o-mini',
  grok: 'grok-3-mini',
};

const DEFAULT_ENDPOINT: Record<AIProvider, string> = {
  gemini: 'https://generativelanguage.googleapis.com/v1beta',
  gpt: 'https://api.openai.com/v1',
  grok: 'https://api.x.ai/v1',
};

interface HistoryMsg {
  role: 'user' | 'assistant';
  content: string;
}

const history: HistoryMsg[] = [];
const MAX_HISTORY = 20;
const REQUEST_TIMEOUT_MS = 20000;

function addHistory(role: 'user' | 'assistant', content: string) {
  history.push({ role, content });
  while (history.length > MAX_HISTORY) history.shift();
}

export function clearAIHistory() {
  history.length = 0;
}

export function getAISettings(): AISettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AI_CHAT_SETTINGS);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

export function saveAISettings(patch: Partial<AISettings>) {
  const current = getAISettings();
  const provider = patch.provider ?? current.provider;
  const normalizedModel = normalizeNonEmptyString(patch.model);
  const normalizedEndpoint = normalizeEndpoint(patch.endpoint);
  const normalizedApiStoreUrl = normalizeNonEmptyString(patch.apiStoreUrl);

  const merged: AISettings = {
    ...current,
    ...patch,
    provider,
    model: normalizedModel ?? (current.model || DEFAULT_MODEL[provider]),
    endpoint: normalizedEndpoint ?? (current.endpoint || DEFAULT_ENDPOINT[provider]),
    apiStoreUrl: normalizedApiStoreUrl ?? current.apiStoreUrl,
  };

  if (!merged.model) merged.model = DEFAULT_MODEL[provider];
  if (!merged.endpoint) merged.endpoint = DEFAULT_ENDPOINT[provider];

  localStorage.setItem(STORAGE_KEYS.AI_CHAT_SETTINGS, JSON.stringify(merged));
}

export function isAIEnabled(): boolean {
  const s = getAISettings();
  return s.enabled && s.apiKey.trim().length > 10;
}

function buildSystemPrompt(themeName: string, studentName: string): string {
  return [
    `Bạn là trợ lý học tập thân thiện của ${studentName}.`,
    'Trả lời ngắn gọn, dễ hiểu cho học sinh tiểu học.',
    'Nếu câu hỏi khó, hãy tách thành các bước nhỏ.',
    `Giữ giọng điệu vui vẻ như mascot chủ đề ${themeName}.`,
    'Không đưa nội dung độc hại, không hướng dẫn nguy hiểm.',
  ].join(' ');
}

function normalizeNonEmptyString(value?: string): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeEndpoint(endpoint?: string): string | undefined {
  const cleaned = normalizeNonEmptyString(endpoint);
  if (!cleaned) return undefined;
  return cleaned.replace(/\/+$/, '');
}

async function fetchJsonWithTimeout(url: string, init: RequestInit, timeoutMs = REQUEST_TIMEOUT_MS): Promise<JsonFetchResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      return { ok: false, status: 408, data: {}, timedOut: true };
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function sendGemini(settings: AISettings, userMessage: string, themeName: string, studentName: string): Promise<AIResponse> {
  const endpoint = normalizeEndpoint(settings.endpoint) || DEFAULT_ENDPOINT.gemini;
  const model = normalizeNonEmptyString(settings.model) || DEFAULT_MODEL.gemini;
  const url = `${endpoint}/models/${model}:generateContent?key=${encodeURIComponent(settings.apiKey)}`;

  const body = {
    system_instruction: {
      parts: [{ text: buildSystemPrompt(themeName, studentName) }],
    },
    contents: [
      ...history.map((h) => ({ role: h.role === 'assistant' ? 'model' : 'user', parts: [{ text: h.content }] })),
      { role: 'user', parts: [{ text: userMessage }] },
    ],
    generationConfig: {
      temperature: 0.75,
      maxOutputTokens: 512,
    },
  };

  const result = await fetchJsonWithTimeout(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!result.ok) {
    if (result.timedOut) {
      return { success: false, text: '', error: 'Gemini timeout do mạng yếu. Hãy thử lại.' };
    }
    const err = result.data?.error?.message || `HTTP ${result.status}`;
    return { success: false, text: '', error: `Gemini lỗi: ${err}` };
  }

  const text = result.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return { success: false, text: '', error: 'Gemini không trả về nội dung.' };
  return { success: true, text };
}

async function sendOpenAICompat(settings: AISettings, userMessage: string, themeName: string, studentName: string): Promise<AIResponse> {
  const endpoint = normalizeEndpoint(settings.endpoint) || DEFAULT_ENDPOINT[settings.provider];
  const model = normalizeNonEmptyString(settings.model) || DEFAULT_MODEL[settings.provider];
  const url = `${endpoint}/chat/completions`;

  const messages = [
    { role: 'system', content: buildSystemPrompt(themeName, studentName) },
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: 'user', content: userMessage },
  ];

  const result = await fetchJsonWithTimeout(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.75,
      max_tokens: 512,
    }),
  });

  if (!result.ok) {
    if (result.timedOut) {
      const timedOutName = settings.provider === 'gpt' ? 'GPT' : 'Grok';
      return { success: false, text: '', error: `${timedOutName} timeout do mạng yếu. Hãy thử lại.` };
    }
    const err = result.data?.error?.message || `HTTP ${result.status}`;
    const name = settings.provider === 'gpt' ? 'GPT' : 'Grok';
    return { success: false, text: '', error: `${name} lỗi: ${err}` };
  }

  const text = result.data?.choices?.[0]?.message?.content;
  if (!text) return { success: false, text: '', error: 'AI không trả về nội dung.' };
  return { success: true, text };
}

export async function sendToAI(userMessage: string, themeName: string, studentName: string): Promise<AIResponse> {
  const settings = getAISettings();
  if (!settings.enabled) {
    return { success: false, text: '', error: 'AI chưa được bật trong Cài đặt.' };
  }
  if (!settings.apiKey.trim()) {
    return { success: false, text: '', error: 'Thiếu API key. Hãy nhập key trong Cài đặt AI.' };
  }

  try {
    addHistory('user', userMessage);
    const resp = settings.provider === 'gemini'
      ? await sendGemini(settings, userMessage, themeName, studentName)
      : await sendOpenAICompat(settings, userMessage, themeName, studentName);

    if (resp.success) addHistory('assistant', resp.text);
    else history.pop();

    return resp;
  } catch (err: any) {
    history.pop();
    return { success: false, text: '', error: err?.message || 'Lỗi kết nối AI.' };
  }
}

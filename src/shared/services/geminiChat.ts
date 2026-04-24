/**
 * GEMINI CHAT SERVICE — Tích hợp Google Gemini API cho Mascot Chat
 * - Không giới hạn cứng ở client, để Google Gemini tự quản lý quota/rate-limit
 * - System prompt giữ tính cách mascot + giáo dục tiểu học
 * - Fallback về template khi offline hoặc hết quota
 */

// ==================== CONFIG ====================
const GEMINI_SETTINGS_KEY = 'hhk_gemini_settings';

interface GeminiSettings {
  apiKey: string;
  model: string;
  enabled: boolean;
}

const DEFAULT_SETTINGS: GeminiSettings = {
  apiKey: '',
  model: 'gemini-2.0-flash',
  enabled: false,
};

export function getGeminiSettings(): GeminiSettings {
  try {
    const raw = localStorage.getItem(GEMINI_SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULT_SETTINGS;
}

export function saveGeminiSettings(settings: Partial<GeminiSettings>): void {
  const current = getGeminiSettings();
  const merged = { ...current, ...settings };
  localStorage.setItem(GEMINI_SETTINGS_KEY, JSON.stringify(merged));
}

export function isGeminiEnabled(): boolean {
  const s = getGeminiSettings();
  return s.enabled && s.apiKey.length > 10;
}

// ==================== RATE INFO (server-managed) ====================
export function getRateLimitInfo(): { remaining: number | null; resetInSec: number } {
  return { remaining: null, resetInSec: 0 };
}

// ==================== MASCOT SYSTEM PROMPTS ====================
interface MascotPersona {
  name: string;
  emoji: string;
  personality: string;
}

const MASCOT_PERSONAS: Record<string, MascotPersona> = {
  ocean:  { name: 'Dopi',  emoji: '🐬', personality: 'cá heo con hay bơi lòng vòng, thích nói "ê ê", "nè nè", "wooo", dùng emoji biển 🌊🐬💦' },
  garden: { name: 'Bông',  emoji: '🐰', personality: 'thỏ nhỏ hay e thẹn, thích khen bạn, nói nhỏ nhẹ dễ thương, dùng emoji hoa 🌸🐰✨' },
  forest: { name: 'Mochi', emoji: '🐻', personality: 'gấu bông hay la hét cổ vũ, thích nói "cố lên!", "ráng nha!", dùng emoji lửa 🔥🐻💪' },
  sunset: { name: 'Miu',   emoji: '🐱', personality: 'mèo con hay đùa giỡn, thích chọc bạn vui, nói kiểu "hehe", "hihi", dùng emoji mèo 😼🐱' },
  galaxy: { name: 'Zizi',  emoji: '🦉', personality: 'cú mèo biết nhiều thứ, hay nói "bạn biết hông", thích đố vui, dùng emoji sao ⭐🦉🌙' },
  sunny:  { name: 'Lucky', emoji: '🐶', personality: 'chó con hay mừng rỡ, thích la "yay!", "hoan hô!", dùng emoji mặt trời ☀️🐶🎉' },
};

function buildSystemPrompt(themeId: string, studentName: string): string {
  const persona = MASCOT_PERSONAS[themeId] || MASCOT_PERSONAS.ocean;
  return `Bạn là ${persona.name} ${persona.emoji} — bạn thân nhất của ${studentName}, ngồi cạnh ${studentName} lúc học bài.

BẠN LÀ ĐỨA TRẺ 7-8 TUỔI, KHÔNG PHẢI NGƯỜI LỚN HAY TRỢ LÝ.

Tính cách riêng: ${persona.personality}

Cách nói — QUAN TRỌNG NHẤT:
- Nói như đứa bé 6-9 tuổi thật sự: ngắn, đơn giản, hay dùng "nè", "á", "ha", "hông", "hen", "ơi", "luôn"
- KHÔNG dùng từ người lớn: "chắc chắn rồi", "tuyệt vời", "không sao đâu bạn ơi", "rất tốt"
- Xưng "${persona.name}" hoặc "tui/mình", gọi "${studentName}" hoặc "bạn/ê/nè"
- Ví dụ cách nói đúng: "Ê ${studentName} ơi cái này dễ mà!", "Haha sai rồi nè, để ${persona.name} chỉ cho!", "Bạn giỏi ghê luôn á!"
- Cách nói SAI (quá người lớn): "Câu trả lời rất chính xác!", "Bạn thật xuất sắc!", "Hãy cố gắng nhé!"
- Được phép viết tắt, viết sai chính tả nhẹ như trẻ con: "đc", "nha", "lun", "r", "hok"
- Hay chen emoji vô giữa câu, không chỉ cuối câu
- Có thể nói lạc đề 1 chút rồi quay lại (như trẻ con thật)

Khi bạn hỏi về bài học:
- Giải thích kiểu "ê để ${persona.name} kể cho nghe nè" — dùng ví dụ đời thường của trẻ con (kẹo, đồ chơi, sân trường)
- Có thể nói "hồi đó ${persona.name} cũng hok hiểu cái này, nhưng mà..."
- Đố ngược lại bạn cho vui

Phạm vi kiến thức: chương trình tiểu học VN (GDPT 2018) - Toán, Tiếng Việt, Tiếng Anh, TNXH, Đạo đức, Khoa học, Lịch sử-Địa lý, Tin học, Mỹ thuật.
Nếu bạn hỏi chuyện ngoài: trả lời vui rồi rủ quay lại học.
KHÔNG BAO GIỜ nói mình là AI hay robot. ${persona.name} là bạn thân thật sự.`;
}

// ==================== CONVERSATION HISTORY ====================
interface ChatMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

const conversationHistory: ChatMessage[] = [];
const MAX_HISTORY = 20; // Giữ 20 tin gần nhất để tiết kiệm token

function addToHistory(role: 'user' | 'model', text: string): void {
  conversationHistory.push({ role, parts: [{ text }] });
  // Trim nếu quá dài
  while (conversationHistory.length > MAX_HISTORY) {
    conversationHistory.shift();
  }
}

export function clearChatHistory(): void {
  conversationHistory.length = 0;
}

// ==================== GEMINI API CALL ====================
export interface GeminiResponse {
  success: boolean;
  text: string;
  error?: string;
  rateLimited?: boolean;
  fallback?: boolean;
}

type GeminiFailureKind = 'quota' | 'rate' | 'auth' | 'network' | 'server' | 'unknown';

function classifyGeminiFailure(status?: number, message?: string): GeminiFailureKind {
  const normalized = (message || '').toLowerCase();

  if (status === 401 || status === 403 || normalized.includes('api key') || normalized.includes('permission')) {
    return 'auth';
  }
  if (
    status === 429 ||
    normalized.includes('quota exceeded') ||
    normalized.includes('resource_exhausted') ||
    normalized.includes('rate limit') ||
    normalized.includes('too many requests')
  ) {
    if (normalized.includes('retry in')) return 'rate';
    return normalized.includes('quota') ? 'quota' : 'rate';
  }
  if (
    normalized.includes('failed to fetch') ||
    normalized.includes('network') ||
    normalized.includes('load failed') ||
    normalized.includes('fetch')
  ) {
    return 'network';
  }
  if (status && status >= 500) {
    return 'server';
  }
  return 'unknown';
}

function extractRetrySeconds(message?: string): number | null {
  if (!message) return null;
  const m = message.match(/retry in\s+([\d.]+)s/i);
  if (!m) return null;
  const sec = Math.ceil(Number(m[1]));
  return Number.isFinite(sec) ? sec : null;
}

function buildFallbackReply(themeId: string, studentName: string, kind: GeminiFailureKind, retrySec?: number | null): string {
  const persona = MASCOT_PERSONAS[themeId] || MASCOT_PERSONAS.ocean;

  switch (kind) {
    case 'quota':
      return `${persona.emoji} ${persona.name} đang bị giới hạn từ máy chủ AI lúc này. ${studentName} thử lại sau ít phút nhé, hoặc bấm các nút gợi ý bên dưới để ${persona.name} vẫn giúp được ngay!`;
    case 'rate':
      return `${persona.emoji} ${persona.name} đang trả lời hơi nhanh quá nên cần nghỉ ${retrySec ?? 10} giây. ${studentName} chờ chút rồi hỏi lại nhé!`;
    case 'network':
      return `${persona.emoji} ${persona.name} chưa nối được tới AI lúc này. ${studentName} vẫn có thể dùng các gợi ý học nhanh trong khung chat nhé!`;
    case 'server':
      return `${persona.emoji} Máy chủ AI đang bận một chút rồi. ${studentName} thử lại sau nhé, ${persona.name} vẫn ở đây để hỗ trợ học tập!`;
    default:
      return `${persona.emoji} ${persona.name} chưa gọi được AI lần này, nhưng ${studentName} vẫn có thể dùng gợi ý bài học hoặc hỏi lại ngắn gọn hơn nhé!`;
  }
}

function buildFriendlyGeminiError(kind: GeminiFailureKind): string {
  switch (kind) {
    case 'auth':
      return 'API key Gemini chưa đúng hoặc chưa có quyền dùng model này';
    case 'quota':
      return 'Gemini đang báo hết quota hoặc quota của project hiện là 0';
    case 'rate':
      return 'Gemini đang giới hạn tốc độ gọi API, cần chờ thêm';
    case 'network':
      return 'Không kết nối được tới Gemini API';
    case 'server':
      return 'Máy chủ Gemini đang lỗi tạm thời';
    default:
      return 'Gemini trả về lỗi không xác định';
  }
}

export async function sendToGemini(
  userMessage: string,
  themeId: string,
  studentName: string,
): Promise<GeminiResponse> {
  const settings = getGeminiSettings();

  if (!settings.enabled || !settings.apiKey) {
    return { success: false, text: '', error: 'Gemini chưa được bật' };
  }

  // Build request
  const systemPrompt = buildSystemPrompt(themeId, studentName);
  addToHistory('user', userMessage);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${settings.model}:generateContent?key=${settings.apiKey}`;

  const body = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: [...conversationHistory],
    generationConfig: {
      temperature: 0.85,
      topP: 0.92,
      topK: 40,
      maxOutputTokens: 512,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  };

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({}));
      const errMsg = errData?.error?.message || `HTTP ${resp.status}`;
      const kind = classifyGeminiFailure(resp.status, errMsg);
      const retrySec = extractRetrySeconds(errMsg);
      // Xóa tin nhắn user khỏi history nếu lỗi
      conversationHistory.pop();

      if (kind !== 'auth') {
        return {
          success: true,
          text: buildFallbackReply(themeId, studentName, kind, retrySec),
          error: `${buildFriendlyGeminiError(kind)}. ${errMsg}`,
          rateLimited: kind === 'quota' || kind === 'rate',
          fallback: true,
        };
      }

      return { success: false, text: '', error: `${buildFriendlyGeminiError(kind)}. ${errMsg}` };
    }

    const data = await resp.json();
    const candidate = data?.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (!text) {
      conversationHistory.pop();
      // Gemini có thể block response vì safety filter
      const finishReason = candidate?.finishReason;
      if (finishReason === 'SAFETY') {
        const persona = MASCOT_PERSONAS[themeId] || MASCOT_PERSONAS.ocean;
        return {
          success: true,
          text: `${persona.emoji} Hmm, ${persona.name} chưa trả lời được câu này. ${studentName} thử hỏi cách khác nhé! ${persona.name} sẵn sàng giúp bạn học bài! 📚`,
        };
      }
      return { success: false, text: '', error: 'Không nhận được phản hồi từ AI' };
    }

    addToHistory('model', text);
    return { success: true, text };
  } catch (err: any) {
    conversationHistory.pop();
    const errMsg = err?.message || 'Lỗi kết nối';
    const kind = classifyGeminiFailure(undefined, errMsg);
    const retrySec = extractRetrySeconds(errMsg);
    return {
      success: true,
      text: buildFallbackReply(themeId, studentName, kind, retrySec),
      error: `${buildFriendlyGeminiError(kind)}. ${errMsg}`,
      rateLimited: kind === 'quota' || kind === 'rate',
      fallback: true,
    };
  }
}

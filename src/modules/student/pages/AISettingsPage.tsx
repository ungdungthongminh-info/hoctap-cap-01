import { useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, Save, Sparkles, KeyRound, Cpu } from 'lucide-react';
import { getAISettings, saveAISettings, type AIProvider } from '../../../shared/services/aiChat';

const providerOptions: Array<{ value: AIProvider; label: string; defaultModel: string; defaultEndpoint: string }> = [
  { value: 'gemini', label: 'Gemini', defaultModel: 'gemini-2.0-flash', defaultEndpoint: 'https://generativelanguage.googleapis.com/v1beta' },
  { value: 'gpt', label: 'GPT (OpenAI API)', defaultModel: 'gpt-4o-mini', defaultEndpoint: 'https://api.openai.com/v1' },
  { value: 'grok', label: 'Grok (xAI API)', defaultModel: 'grok-3-mini', defaultEndpoint: 'https://api.x.ai/v1' },
];

export function AISettingsPage() {
  const current = getAISettings();

  const [enabled, setEnabled] = useState(current.enabled);
  const [provider, setProvider] = useState<AIProvider>(current.provider);
  const [apiKey, setApiKey] = useState(current.apiKey);
  const [model, setModel] = useState(current.model);
  const [endpoint, setEndpoint] = useState(current.endpoint || '');
  const [apiStoreUrl, setApiStoreUrl] = useState(current.apiStoreUrl || '');
  const [saved, setSaved] = useState(false);
  const saveTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  const selected = useMemo(() => providerOptions.find((p) => p.value === provider)!, [provider]);

  const handleProviderChange = (next: AIProvider) => {
    setProvider(next);
    const p = providerOptions.find((x) => x.value === next)!;
    setModel(p.defaultModel);
    setEndpoint(p.defaultEndpoint);
  };

  const save = () => {
    saveAISettings({ enabled, provider, apiKey: apiKey.trim(), model: model.trim(), endpoint: endpoint.trim(), apiStoreUrl: apiStoreUrl.trim() });
    setSaved(true);
    if (saveTimerRef.current !== null) {
      window.clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = window.setTimeout(() => setSaved(false), 1600);
  };

  return (
    <div className="fade-in max-w-3xl mx-auto">
      <div className="rounded-2xl p-5 mb-4" style={{ background: 'linear-gradient(135deg,#E0F2FE,#FDE68A)' }}>
        <h1 className="text-2xl font-black flex items-center gap-2" style={{ color: '#1F2937' }}>
          <Sparkles size={22} /> Cài Đặt Chat AI
        </h1>
        <p className="text-sm mt-1" style={{ color: '#374151' }}>
          Người dùng tự nhập API key riêng để chat với GPT, Gemini hoặc Grok.
        </p>
      </div>

      <div className="card space-y-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          <span className="font-bold">Bật Chat AI</span>
        </label>

        <div>
          <label className="text-sm font-bold">Nhà cung cấp AI</label>
          <div className="grid sm:grid-cols-3 gap-2 mt-2">
            {providerOptions.map((p) => (
              <button
                key={p.value}
                className="px-3 py-2 rounded-xl border text-sm font-bold"
                style={{
                  background: provider === p.value ? '#111827' : '#F8FAFC',
                  color: provider === p.value ? '#fff' : '#111827',
                }}
                onClick={() => handleProviderChange(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-bold flex items-center gap-1"><KeyRound size={14} /> API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Nhập API key"
              className="mt-1 w-full px-3 py-2 rounded-xl border"
            />
          </div>
          <div>
            <label className="text-sm font-bold flex items-center gap-1"><Cpu size={14} /> Model</label>
            <input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder={selected.defaultModel}
              className="mt-1 w-full px-3 py-2 rounded-xl border"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-bold">API Endpoint</label>
          <input
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder={selected.defaultEndpoint}
            className="mt-1 w-full px-3 py-2 rounded-xl border"
          />
          <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
            Mặc định: {selected.defaultEndpoint}
          </p>
        </div>

        <div>
          <label className="text-sm font-bold">Link mua API (website của bạn)</label>
          <div className="flex gap-2 mt-1">
            <input
              value={apiStoreUrl}
              onChange={(e) => setApiStoreUrl(e.target.value)}
              placeholder="https://your-api-store.example"
              className="flex-1 px-3 py-2 rounded-xl border"
            />
            <a
              href={apiStoreUrl || '#'}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-xl border inline-flex items-center gap-1"
              style={{ pointerEvents: apiStoreUrl ? 'auto' : 'none', opacity: apiStoreUrl ? 1 : 0.5 }}
            >
              <ExternalLink size={14} /> Mở
            </a>
          </div>
        </div>

        <button className="btn btn-primary" onClick={save}>
          <Save size={16} /> {saved ? 'Đã lưu' : 'Lưu cài đặt AI'}
        </button>
      </div>
    </div>
  );
}

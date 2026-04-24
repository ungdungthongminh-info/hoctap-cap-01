import { useState, useEffect } from 'react';
import { getTtsInfo, getTtsMode, setTtsMode, speakText, onVoicesReady, getTtsSpeed, setTtsSpeed, getPreferredVoice, setPreferredVoice, getVoicePreferenceOptions, type TtsInfo } from '../../../shared/utils/sounds';
import { Volume2, Wifi, WifiOff, Settings, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { MascotCharacter } from '../../../shared/components';

export function TtsSettingsPage() {
  const [ttsInfo, setTtsInfo] = useState<TtsInfo | null>(null);
  const [mode, setMode] = useState(getTtsMode());
  const [speed, setSpeed] = useState(getTtsSpeed());
  const [voiceVi, setVoiceVi] = useState(getPreferredVoice('vi'));
  const [voiceEn, setVoiceEn] = useState(getPreferredVoice('en'));
  const [testing, setTesting] = useState(false);
  const pref = getVoicePreferenceOptions();

  useEffect(() => {
    // Lắng nghe khi voices load xong (async, có thể chậm)
    const cleanup = onVoicesReady((info) => setTtsInfo(info));
    return cleanup;
  }, []);

  const refreshVoices = () => {
    setTtsInfo(getTtsInfo());
  };

  const handleModeChange = (m: 'auto' | 'google' | 'native') => {
    setMode(m);
    setTtsMode(m);
  };

  const handleSpeedChange = (nextSpeed: number) => {
    setSpeed(nextSpeed);
    setTtsSpeed(nextSpeed);
  };

  const handleVoiceChange = (lang: 'vi' | 'en', voiceName: string) => {
    if (lang === 'vi') setVoiceVi(voiceName);
    else setVoiceEn(voiceName);
    setPreferredVoice(lang, voiceName);
  };

  const voicesVi = (ttsInfo?.voices || []).filter((v) => {
    const lang = v.lang.toLowerCase();
    const name = v.name.toLowerCase();
    return lang.startsWith('vi') || name.includes('vietnam') || name.includes('viet');
  });
  const voicesEn = (ttsInfo?.voices || []).filter((v) => {
    const lang = v.lang.toLowerCase();
    const name = v.name.toLowerCase();
    return lang.startsWith('en') || name.includes('english');
  });

  const testSpeak = (lang: 'vi' | 'en') => {
    setTesting(true);
    if (lang === 'vi') {
      speakText('Xin chào! Đây là giọng đọc tiếng Việt. Chúc bạn học tốt nhé!', 'vi');
    } else {
      speakText('Hello! This is the English voice. Good luck with your studies!', 'en');
    }
    setTimeout(() => setTesting(false), 3000);
  };

  const online = navigator.onLine;

  return (
    <div className="fade-in max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <MascotCharacter size="sm" />
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
            🔊 Cài Đặt Giọng Đọc
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            Cấu hình Text-to-Speech cho việc đọc bài
          </p>
        </div>
      </div>

      {/* Connection status */}
      <div className="card mb-4 flex items-center gap-3">
        {online ? (
          <>
            <Wifi size={20} style={{ color: 'var(--color-success)' }} />
            <div>
              <div className="text-sm font-bold" style={{ color: 'var(--color-success)' }}>Đang trực tuyến</div>
              <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Google TTS sẵn sàng cho tiếng Việt</div>
            </div>
          </>
        ) : (
          <>
            <WifiOff size={20} style={{ color: '#D97706' }} />
            <div>
              <div className="text-sm font-bold" style={{ color: '#D97706' }}>Ngoại tuyến</div>
              <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                Google TTS không khả dụng. Cần voice tiếng Việt cài trên máy.
              </div>
            </div>
          </>
        )}
      </div>

      {/* Vietnamese voice detection */}
      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Settings size={18} style={{ color: 'var(--color-primary)' }} />
          <h3 className="font-bold flex-1">Giọng tiếng Việt nội bộ</h3>
          <button
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
            style={{ background: 'var(--color-surface)', color: 'var(--color-primary)' }}
            onClick={refreshVoices}
            title="Kiểm tra lại"
          >
            <RefreshCw size={12} /> Refresh
          </button>
        </div>
        {!ttsInfo?.voicesLoaded ? (
          <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: '#F3F4F6' }}>
            <RefreshCw size={16} className="animate-spin" style={{ color: '#6B7280' }} />
            <span className="text-sm" style={{ color: '#6B7280' }}>Đang tải danh sách voices...</span>
          </div>
        ) : ttsInfo?.hasVietnameseVoice ? (
          <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: '#D1FAE5' }}>
            <CheckCircle size={20} style={{ color: '#059669' }} />
            <div>
              <div className="text-sm font-bold" style={{ color: '#059669' }}>Đã cài đặt!</div>
              <div className="text-xs" style={{ color: '#065F46' }}>
                {ttsInfo.voices.filter((v) => v.lang.startsWith('vi')).map((v) => v.name).join(', ')}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl" style={{ background: '#FEF3C7' }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={20} style={{ color: '#D97706' }} />
              <div className="text-sm font-bold" style={{ color: '#92400E' }}>Chưa phát hiện giọng tiếng Việt</div>
            </div>
            <div className="text-xs mb-3" style={{ color: '#78350F' }}>
              Windows đã cài voice OneCore (An - vi-VN) nhưng Chrome/Electron không đọc được. Cần fix registry:
            </div>

            {/* Registry fix instructions */}
            <div className="p-3 rounded-lg mb-3" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
              <div className="text-xs font-bold mb-2" style={{ color: '#92400E' }}>
                ⚡ Cách sửa nhanh (chạy 1 lần):
              </div>
              <ol className="text-xs space-y-1 ml-4" style={{ color: '#78350F', listStyleType: 'decimal' }}>
                <li>Mở thư mục <strong>scripts</strong> trong thư mục app</li>
                <li>Nhấn chuột phải vào file <strong>fix-tts-voices.bat</strong></li>
                <li>Chọn <strong>"Run as administrator"</strong></li>
                <li><strong>Khởi động lại</strong> trình duyệt/app</li>
                <li>Quay lại đây và nhấn <strong>Refresh</strong></li>
              </ol>
            </div>

            {/* Manual PowerShell */}
            <details className="text-xs">
              <summary className="cursor-pointer font-bold mb-1" style={{ color: '#92400E' }}>
                📋 Hoặc chạy lệnh PowerShell (Admin)
              </summary>
              <div className="p-2 rounded font-mono text-[10px] overflow-x-auto" style={{ background: '#1F2937', color: '#D1D5DB' }}>
                Get-ChildItem "HKLM:\SOFTWARE\Microsoft\Speech_OneCore\Voices\Tokens" | ForEach-Object {'{'} $n = $_.PSChildName; if (-not (Test-Path "HKLM:\SOFTWARE\Microsoft\Speech\Voices\Tokens\$n")) {'{'} Copy-Item $_.PSPath "HKLM:\SOFTWARE\Microsoft\Speech\Voices\Tokens\$n" -Recurse {'}'} {'}'}
              </div>
            </details>

            {/* Original install instructions as fallback */}
            <details className="text-xs mt-2">
              <summary className="cursor-pointer font-bold mb-1" style={{ color: '#92400E' }}>
                📥 Chưa cài gói ngôn ngữ? Cài đặt trước
              </summary>
              <ol className="space-y-1 ml-4 mt-1" style={{ color: '#78350F', listStyleType: 'decimal' }}>
                <li>Mở <strong>Settings</strong> (Windows + I)</li>
                <li>Vào <strong>Time &amp; Language → Language &amp; Region</strong></li>
                <li>Nhấn <strong>Add a language</strong> → Tìm <strong>"Tiếng Việt"</strong></li>
                <li>Tick chọn <strong>"Text-to-speech"</strong> rồi nhấn <strong>Install</strong></li>
                <li>Khởi động lại máy tính</li>
                <li>Sau đó chạy file <strong>fix-tts-voices.bat</strong> ở trên</li>
              </ol>
            </details>
          </div>
        )}
      </div>

      {/* TTS Mode selector */}
      <div className="card mb-4">
        <h3 className="font-bold mb-3">🎛️ Chế độ đọc tiếng Việt</h3>
        <div className="grid gap-2">
          {([
            { value: 'auto' as const, label: '🤖 Tự động', desc: 'Dùng voice nội bộ nếu có, nếu không thì dùng Google TTS' },
            { value: 'google' as const, label: '🌐 Google TTS', desc: 'Luôn dùng Google Translate (cần internet, giọng tự nhiên)' },
            { value: 'native' as const, label: '💻 Nội bộ', desc: 'Luôn dùng voice cài trên máy (offline, cần cài gói tiếng Việt)' },
          ]).map((opt) => (
            <button
              key={opt.value}
              className="flex items-center gap-3 p-3 rounded-xl text-left w-full transition-all"
              style={{
                background: mode === opt.value ? 'var(--color-surface)' : '#F9FAFB',
                border: mode === opt.value ? '2px solid var(--color-primary)' : '2px solid transparent',
              }}
              onClick={() => handleModeChange(opt.value)}
            >
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: mode === opt.value ? 'var(--color-primary)' : '#D1D5DB' }}
              >
                {mode === opt.value && (
                  <div className="w-3 h-3 rounded-full" style={{ background: 'var(--color-primary)' }} />
                )}
              </div>
              <div>
                <div className="text-sm font-bold">{opt.label}</div>
                <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>{opt.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 grid md:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl" style={{ background: '#F9FAFB' }}>
            <div className="text-sm font-bold mb-2">🗣️ Giọng tiếng Việt</div>
            {mode === 'google' && (
              <div className="text-xs mb-2 p-2 rounded-lg" style={{ background: '#FEF3C7', color: '#92400E' }}>
                ⚠️ Google TTS chỉ có 1 giọng mặc định. Chuyển sang <strong>Nội bộ</strong> hoặc <strong>Tự động</strong> để chọn giọng.
              </div>
            )}
            {mode !== 'google' && !ttsInfo?.hasVietnameseVoice && voiceVi && (
              <div className="text-xs mb-2 p-2 rounded-lg" style={{ background: '#FEF3C7', color: '#92400E' }}>
                ⚠️ Chưa có voice tiếng Việt trên máy. Cài gói ngôn ngữ + chạy fix-tts-voices.bat để chọn giọng.
              </div>
            )}
            <select
              className="w-full p-2 rounded-lg text-sm"
              value={voiceVi}
              onChange={(e) => handleVoiceChange('vi', e.target.value)}
              disabled={mode === 'google'}
            >
              <option value="">Tự chọn theo hệ thống</option>
              <option value={pref.female}>Ưu tiên giọng Nữ (tự động)</option>
              <option value={pref.male}>Ưu tiên giọng Nam (tự động)</option>
              {voicesVi.map((v) => (
                <option key={`${v.lang}-${v.name}`} value={v.name}>{v.name} ({v.lang})</option>
              ))}
            </select>
          </div>
          <div className="p-3 rounded-xl" style={{ background: '#F9FAFB' }}>
            <div className="text-sm font-bold mb-2">🗣️ Giọng tiếng Anh</div>
            <select
              className="w-full p-2 rounded-lg text-sm"
              value={voiceEn}
              onChange={(e) => handleVoiceChange('en', e.target.value)}
            >
              <option value="">Tự chọn theo hệ thống</option>
              <option value={pref.female}>Prefer Female voice (auto)</option>
              <option value={pref.male}>Prefer Male voice (auto)</option>
              {voicesEn.map((v) => (
                <option key={`${v.lang}-${v.name}`} value={v.name}>{v.name} ({v.lang})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl" style={{ background: '#F9FAFB' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-bold">⏱️ Tốc độ đọc</div>
            <div className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: 'white', color: 'var(--color-primary)' }}>
              {speed.toFixed(2)}x
            </div>
          </div>
          <input
            type="range"
            min={0.6}
            max={1.6}
            step={0.05}
            value={speed}
            onChange={(e) => handleSpeedChange(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex items-center justify-between text-[11px] mt-1" style={{ color: 'var(--color-text-light)' }}>
            <span>Chậm</span>
            <span>Bình thường</span>
            <span>Nhanh</span>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              className="text-xs px-2 py-1 rounded-lg"
              style={{ background: 'white', border: '1px solid #E5E7EB' }}
              onClick={() => handleSpeedChange(1)}
            >
              Đặt lại 1.00x
            </button>
            <button
              className="text-xs px-2 py-1 rounded-lg"
              style={{ background: 'white', border: '1px solid #E5E7EB' }}
              onClick={() => testSpeak('vi')}
              disabled={testing}
            >
              Nghe thử tốc độ này
            </button>
          </div>
        </div>
      </div>

      {/* Test buttons */}
      <div className="card mb-4">
        <h3 className="font-bold mb-3">🎧 Thử giọng đọc</h3>
        <div className="flex gap-3">
          <button
            className="btn btn-primary flex items-center gap-2 flex-1"
            onClick={() => testSpeak('vi')}
            disabled={testing}
          >
            <Volume2 size={16} />
            {testing ? 'Đang đọc...' : '🇻🇳 Thử tiếng Việt'}
          </button>
          <button
            className="btn flex items-center gap-2 flex-1"
            style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}
            onClick={() => testSpeak('en')}
            disabled={testing}
          >
            <Volume2 size={16} />
            🇺🇸 Thử tiếng Anh
          </button>
        </div>
      </div>

      {/* Installed voices list */}
      {ttsInfo && ttsInfo.voices.length > 0 && (
        <div className="card">
          <h3 className="font-bold mb-3">📋 Danh sách voices đã cài ({ttsInfo.voices.length})</h3>
          <div className="grid gap-1 max-h-48 overflow-y-auto">
            {ttsInfo.voices.map((v, i) => (
              <div key={i} className="flex items-center gap-2 text-xs py-1 px-2 rounded" style={{ background: i % 2 === 0 ? '#F9FAFB' : 'transparent' }}>
                <span className="font-mono" style={{ color: 'var(--color-primary)' }}>{v.lang}</span>
                <span style={{ color: 'var(--color-text-light)' }}>{v.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

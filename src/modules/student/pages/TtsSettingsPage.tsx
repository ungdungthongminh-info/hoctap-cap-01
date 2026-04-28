import { useEffect, useMemo, useState } from 'react';
import { Cloud, DatabaseZap, Headphones, MonitorSpeaker, RefreshCw, Trash2, Volume2, Wifi, WifiOff } from 'lucide-react';
import {
  clearTtsAudioCache,
  fetchTtsCacheStats,
  getGoogleVoiceCatalog,
  getPreferredVoice,
  getTtsCacheMode,
  getTtsMode,
  getTtsSpeed,
  getVoicePreferenceOptions,
  onVoicesReady,
  setPreferredVoice,
  setTtsCacheMode,
  setTtsMode,
  setTtsSpeed,
  speakTextAsync,
  stopSpeaking,
  type TtsCacheMode,
  type TtsInfo,
} from '../../../shared/utils/sounds';
import { MascotCharacter } from '../../../shared/components';
import { buildVoiceAuditAssetKey } from '../../../shared/services/tts/ttsAssetKeys';
import { VOICE_AUDIT_LINES } from '../../../shared/services/tts/ttsNarration';
import { listStaticVoiceProfiles } from '../../../shared/services/tts/ttsVoiceProfiles';
import { isAdminUnlocked } from '../../../shared/utils/adminAccess';

type TtsModeOption = 'static' | 'advanced';
type PlaybackSource = 'static' | 'advanced' | 'native';

interface VoiceCandidate {
  id: string;
  label: string;
  voiceId: string;
  notes: string;
  candidateRank: number;
  isDefault?: boolean;
}

const cacheModeOptions: Array<{ value: TtsCacheMode; label: string; desc: string }> = [
  { value: 'manual', label: 'Thu cong', desc: 'Chi luu cache khi bam nghe.' },
  { value: 'balanced', label: 'Can bang', desc: 'Uu tien audio tinh, prefetch vua du de khong ton tai nguyen.' },
  { value: 'aggressive', label: 'Chu dong', desc: 'Lam nong cache som cho bai hoc sap mo.' },
];

const modeOptions: Array<{ value: TtsModeOption; label: string; desc: string }> = [
  {
    value: 'static',
    label: 'Mặc định - Audio tĩnh',
    desc: 'Dùng audio pre-generate trong manifest. Nếu thiếu file sẽ rơi về native.',
  },
  {
    value: 'advanced',
    label: 'Advanced / Generator',
    desc: 'Chỉ dùng khi cần tạo audio mới hoặc cần API riêng.',
  },
];

function filterVoices(info: TtsInfo | null, lang: 'vi' | 'en') {
  return (info?.voices || []).filter((voice) => {
    const code = voice.lang.toLowerCase();
    const name = voice.name.toLowerCase();
    return lang === 'vi'
      ? code.startsWith('vi') || name.includes('viet')
      : code.startsWith('en') || name.includes('english');
  });
}

function toPlaybackLabel(source: PlaybackSource): string {
  if (source === 'static') return 'asset MP3 tinh';
  if (source === 'advanced') return 'advanced generator';
  return 'native fallback';
}

export function TtsSettingsPage() {
  const [ttsInfo, setTtsInfo] = useState<TtsInfo | null>(null);
  const [mode, setModeState] = useState(getTtsMode());
  const [speed, setSpeedState] = useState(getTtsSpeed());
  const [voiceVi, setVoiceVi] = useState(getPreferredVoice('vi'));
  const [voiceEn, setVoiceEn] = useState(getPreferredVoice('en'));
  const [cacheMode, setCacheModeState] = useState<TtsCacheMode>(getTtsCacheMode());
  const [stats, setStats] = useState<Awaited<ReturnType<typeof fetchTtsCacheStats>> | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState('');
  const [clearing, setClearing] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [online, setOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [activeProfileId, setActiveProfileId] = useState('');
  const [lastPlaybackMessage, setLastPlaybackMessage] = useState('');

  const pref = getVoicePreferenceOptions();
  const showAdmin = import.meta.env.DEV || isAdminUnlocked();
  const visibleModeOptions = showAdmin
    ? modeOptions
    : modeOptions.filter((option) => option.value === 'static');
  const googleViVoices = getGoogleVoiceCatalog('vi');
  const googleEnVoices = getGoogleVoiceCatalog('en');
  const nativeViVoices = useMemo(() => filterVoices(ttsInfo, 'vi'), [ttsInfo]);
  const nativeEnVoices = useMemo(() => filterVoices(ttsInfo, 'en'), [ttsInfo]);

  const staticManifest = stats?.staticManifest;
  const hasAnyStaticAudio = Boolean(staticManifest && staticManifest.availableEntries > 0);

  const manifestViProfiles = useMemo<VoiceCandidate[]>(
    () => (staticManifest?.voiceProfiles || [])
      .filter((profile) => profile.lang === 'vi-VN')
      .map((profile) => ({
        id: profile.id,
        label: profile.label,
        voiceId: profile.voiceId,
        notes: profile.notes,
        candidateRank: profile.candidateRank,
        isDefault: profile.isDefault,
      })),
    [staticManifest],
  );

  const fallbackViProfiles = useMemo<VoiceCandidate[]>(
    () => listStaticVoiceProfiles('vi-VN').map((profile) => ({
      id: profile.id,
      label: profile.label,
      voiceId: profile.voiceId,
      notes: profile.notes,
      candidateRank: profile.candidateRank,
      isDefault: profile.isDefault,
    })),
    [],
  );

  const staticViProfiles = useMemo<VoiceCandidate[]>(
    () => (manifestViProfiles.length ? manifestViProfiles : fallbackViProfiles)
      .slice()
      .sort((a, b) => a.candidateRank - b.candidateRank)
      .slice(0, 3),
    [manifestViProfiles, fallbackViProfiles],
  );

  const defaultProfileId = staticManifest?.defaultProfileId
    || staticViProfiles.find((profile) => profile.isDefault)?.id
    || staticViProfiles[0]?.id
    || '';

  useEffect(() => {
    if (!staticViProfiles.length) {
      setActiveProfileId('');
      return;
    }

    if (!activeProfileId || !staticViProfiles.some((profile) => profile.id === activeProfileId)) {
      setActiveProfileId(defaultProfileId);
    }
  }, [activeProfileId, defaultProfileId, staticViProfiles]);

  const activeProfile = staticViProfiles.find((profile) => profile.id === activeProfileId) || staticViProfiles[0] || null;

  const auditAvailableMap = useMemo(() => {
    const map = new Map<string, boolean>();
    (staticManifest?.auditSamples || []).forEach((sample) => {
      map.set(`${sample.profileId}:${sample.sampleId}`, Boolean(sample.available));
    });
    return map;
  }, [staticManifest]);

  const loadStats = async () => {
    setStatsLoading(true);
    setStatsError('');
    try {
      const nextStats = await fetchTtsCacheStats();
      setStats(nextStats);
    } catch (error) {
      setStats(null);
      setStatsError(error instanceof Error ? error.message : 'Khong tai duoc thong tin TTS.');
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    const cleanup = onVoicesReady((info) => setTtsInfo(info));
    void loadStats();

    const handleNetwork = () => setOnline(navigator.onLine);
    window.addEventListener('online', handleNetwork);
    window.addEventListener('offline', handleNetwork);
    return () => {
      cleanup();
      window.removeEventListener('online', handleNetwork);
      window.removeEventListener('offline', handleNetwork);
    };
  }, []);

  useEffect(() => {
    if (mode === 'native' || (!showAdmin && mode !== 'static')) {
      setModeState('static');
      setTtsMode('static');
    }
  }, [mode, showAdmin]);

  const handleModeChange = (value: TtsModeOption) => {
    const nextMode: TtsModeOption = !showAdmin ? 'static' : value;
    setModeState(nextMode);
    setTtsMode(nextMode);
  };

  const handleSpeedChange = (value: number) => {
    setSpeedState(value);
    setTtsSpeed(value);
  };

  const handleVoiceChange = (lang: 'vi' | 'en', voiceName: string) => {
    if (lang === 'vi') setVoiceVi(voiceName);
    else setVoiceEn(voiceName);
    setPreferredVoice(lang, voiceName);
  };

  const handleCacheModeChange = (value: TtsCacheMode) => {
    setCacheModeState(value);
    setTtsCacheMode(value);
  };

  const handleClearCache = async () => {
    setClearing(true);
    try {
      await clearTtsAudioCache();
      await loadStats();
    } finally {
      setClearing(false);
    }
  };

  const runWithTesting = async (id: string, fn: () => Promise<void>) => {
    setTestingId(id);
    try {
      await fn();
    } finally {
      setTestingId((current) => (current === id ? null : current));
    }
  };

  const playAuditLine = async (
    profile: VoiceCandidate,
    sampleId: string,
    text: string,
  ): Promise<PlaybackSource> => {
    const sampleAvailable = Boolean(auditAvailableMap.get(`${profile.id}:${sampleId}`));
    if (sampleAvailable) {
      await speakTextAsync(text, 'vi', {
        mode: 'static',
        policy: 'lesson-read-all',
        assetKey: buildVoiceAuditAssetKey(profile.id, sampleId),
      });
      return 'static';
    }

    if (online && stats?.backendReachable !== false) {
      await speakTextAsync(text, 'vi', {
        mode: 'advanced',
        policy: 'practice-on-demand',
        voiceId: profile.voiceId,
      });
      return 'advanced';
    }

    await speakTextAsync(text, 'vi', {
      mode: 'native',
      policy: 'fallback-native',
    });
    return 'native';
  };

  const handlePreviewProfile = async (profileId: string) => {
    const profile = staticViProfiles.find((item) => item.id === profileId);
    const readingLine = VOICE_AUDIT_LINES.find((line) => line.id === 'reading-rhythm') || VOICE_AUDIT_LINES[0];
    if (!profile || !readingLine) {
      return;
    }

    setActiveProfileId(profile.id);
    await runWithTesting(`profile:${profile.id}:reading-rhythm`, async () => {
      const source = await playAuditLine(profile, readingLine.id, readingLine.text);
      setLastPlaybackMessage(`Da thu ${profile.label} bang ${toPlaybackLabel(source)}.`);
    });
  };

  const handlePlayAuditCheck = async (sampleId: string, label: string, text: string) => {
    if (!activeProfile) {
      return;
    }

    await runWithTesting(`audit:${activeProfile.id}:${sampleId}`, async () => {
      const source = await playAuditLine(activeProfile, sampleId, text);
      setLastPlaybackMessage(`Da kiem tra "${label}" cho ${activeProfile.label} bang ${toPlaybackLabel(source)}.`);
    });
  };

  const handleAdvancedTest = async () => {
    await runWithTesting('advanced:vi', async () => {
      await speakTextAsync(
        'Xin chao. Day la cau thu de nghe che do advanced generator.',
        'vi',
        {
          mode: 'advanced',
          policy: 'practice-on-demand',
          voiceId: activeProfile?.voiceId || undefined,
        },
      );
      setLastPlaybackMessage('Da thu advanced generator.');
    });
  };

  const handleNativeTest = async () => {
    await runWithTesting('native:vi', async () => {
      await speakTextAsync(
        'Xin chao. Day la cau thu cua giong native tren thiet bi.',
        'vi',
        {
          mode: 'native',
          policy: 'fallback-native',
        },
      );
      setLastPlaybackMessage('Da thu native fallback.');
    });
  };

  const handleStopPlayback = () => {
    stopSpeaking();
    setTestingId(null);
    setLastPlaybackMessage('Da dung phat audio hien tai.');
  };

  return (
    <div className="fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <MascotCharacter size="sm" />
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
            Audio tap doc
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            Flow mac dinh da doi sang audio tinh + manifest. Advanced chi dung khi can tao audio moi.
          </p>
        </div>
      </div>

      <div className="grid gap-4 mb-4 md:grid-cols-3">
        <div className="card flex items-start gap-3">
          {online ? (
            <Wifi size={20} style={{ color: 'var(--color-success)' }} />
          ) : (
            <WifiOff size={20} style={{ color: '#D97706' }} />
          )}
          <div>
            <div className="text-sm font-bold" style={{ color: online ? 'var(--color-success)' : '#D97706' }}>
              {online ? 'Dang online' : 'Dang offline'}
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>
              Offline van nghe duoc neu app da co san MP3 tinh.
            </div>
          </div>
        </div>

        <div className="card flex items-start gap-3">
          <Headphones size={20} style={{ color: hasAnyStaticAudio ? 'var(--color-success)' : '#D97706' }} />
          <div>
            <div className="text-sm font-bold" style={{ color: hasAnyStaticAudio ? 'var(--color-success)' : '#D97706' }}>
              {hasAnyStaticAudio ? 'Da co static voice pack' : 'Chua co static MP3'}
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>
              {hasAnyStaticAudio
                ? `${staticManifest?.availableEntries || 0}/${staticManifest?.totalEntries || 0} entry da co file.`
                : 'Van co the thu giong bang advanced/native, sau do generate MP3 tinh.'}
            </div>
          </div>
        </div>

        <div className="card flex items-start gap-3">
          <MonitorSpeaker size={20} style={{ color: ttsInfo?.hasVietnameseVoice ? 'var(--color-success)' : '#D97706' }} />
          <div>
            <div className="text-sm font-bold" style={{ color: ttsInfo?.hasVietnameseVoice ? 'var(--color-success)' : '#D97706' }}>
              {ttsInfo?.hasVietnameseVoice ? 'Co native TV du phong' : 'Chua thay native TV'}
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>
              Native la lop an toan khi static/advanced khong kha dung.
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Cloud size={18} style={{ color: 'var(--color-primary)' }} />
          <h3 className="font-bold">Che do phat mac dinh</h3>
        </div>
        <div className="grid gap-2">
          {visibleModeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className="flex items-center gap-3 p-3 rounded-xl text-left w-full transition-all"
              style={{
                background: mode === option.value ? 'var(--color-surface)' : '#F9FAFB',
                border: mode === option.value ? '2px solid var(--color-primary)' : '2px solid transparent',
              }}
              onClick={() => handleModeChange(option.value)}
            >
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: mode === option.value ? 'var(--color-primary)' : '#D1D5DB' }}
              >
                {mode === option.value && (
                  <div className="w-3 h-3 rounded-full" style={{ background: 'var(--color-primary)' }} />
                )}
              </div>
              <div>
                <div className="text-sm font-bold">{option.label}</div>
                <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>{option.desc}</div>
              </div>
            </button>
          ))}
        </div>
        {!showAdmin && (
          <p className="text-xs mt-3" style={{ color: 'var(--color-text-light)' }}>
            App học sinh luôn ưu tiên audio tĩnh để ổn định và dùng offline. Chế độ Advanced chỉ mở trong khu kỹ thuật.
          </p>
        )}
      </div>

      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Headphones size={18} style={{ color: 'var(--color-primary)' }} />
          <h3 className="font-bold">Giong co dinh cua app (uu tien nu, doc ro)</h3>
        </div>
        <p className="text-sm mb-3" style={{ color: 'var(--color-text-light)' }}>
          Day la 2-3 ung vien giong tieng Viet de chot bo pre-generate. Bam the de chon profile, bam nghe thu de test ngay.
        </p>

        <div className="grid gap-3 md:grid-cols-3">
          {staticViProfiles.map((profile) => {
            const selected = profile.id === activeProfile?.id;
            const readingSampleAvailable = Boolean(auditAvailableMap.get(`${profile.id}:reading-rhythm`));
            return (
              <div
                key={profile.id}
                role="button"
                tabIndex={0}
                className="p-3 rounded-xl border text-left cursor-pointer"
                style={{
                  borderColor: selected ? 'var(--color-primary)' : '#E5E7EB',
                  background: selected ? '#EFF6FF' : '#FFFFFF',
                }}
                onClick={() => setActiveProfileId(profile.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActiveProfileId(profile.id);
                  }
                }}
              >
                <div className="text-sm font-bold mb-1">{profile.label}</div>
                <div className="text-xs font-mono mb-2" style={{ color: 'var(--color-primary-dark)' }}>
                  {profile.voiceId}
                </div>
                <div className="text-xs mb-3" style={{ color: 'var(--color-text-light)' }}>
                  {profile.notes}
                </div>
                <div className="text-[11px] mb-3" style={{ color: readingSampleAvailable ? 'var(--color-success)' : '#B45309' }}>
                  {readingSampleAvailable ? 'Co MP3 mau nhac nhip' : 'Chua co MP3 mau, se thu online/native'}
                </div>
                <button
                  type="button"
                  className="btn btn-primary w-full flex items-center justify-center gap-2"
                  onClick={(event) => {
                    event.stopPropagation();
                    void handlePreviewProfile(profile.id);
                  }}
                >
                  <Volume2 size={14} />
                  {testingId === `profile:${profile.id}:reading-rhythm` ? 'Dang nghe thu...' : 'Nghe thu profile'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 rounded-xl" style={{ background: '#F9FAFB' }}>
          <div className="text-sm font-bold mb-2">
            Kiem tra nhip phat am tap doc ({activeProfile?.label || 'chua chon profile'})
          </div>
          <div className="grid gap-2">
            {VOICE_AUDIT_LINES.map((line) => (
              <button
                key={line.id}
                type="button"
                className="flex items-center justify-between p-2 rounded-lg text-left"
                style={{ background: 'white', border: '1px solid #E5E7EB' }}
                onClick={() => void handlePlayAuditCheck(line.id, line.label, line.text)}
              >
                <span className="text-sm">
                  {line.label}
                </span>
                <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                  {testingId === `audit:${activeProfile?.id || ''}:${line.id}` ? 'Dang phat...' : 'Nghe'}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap mt-4">
          <button
            type="button"
            className="btn flex items-center gap-2"
            style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}
            onClick={() => void handleNativeTest()}
          >
            <Volume2 size={16} />
            {testingId === 'native:vi' ? 'Dang phat native...' : 'Thu native du phong'}
          </button>
          <button
            type="button"
            className="btn flex items-center gap-2"
            style={{ background: '#FEF2F2', color: '#B91C1C' }}
            onClick={handleStopPlayback}
          >
            <Trash2 size={16} />
            Dung audio
          </button>
        </div>

        {lastPlaybackMessage && (
          <p className="text-xs mt-3" style={{ color: 'var(--color-text-light)' }}>
            {lastPlaybackMessage}
          </p>
        )}
      </div>

      {showAdmin ? (
        <details className="card mb-4">
          <summary className="font-bold cursor-pointer">Advanced / Generator (kỹ thuật)</summary>
          <div className="text-sm mt-3 mb-4" style={{ color: 'var(--color-text-light)' }}>
            Dùng để tạo audio mới bằng API hoặc cấu hình API riêng. Người học bình thường không cần dùng mục này.
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-bold block mb-2">Voice tiếng Việt (advanced)</label>
              <select
                className="w-full p-2 rounded-lg text-sm"
                value={voiceVi}
                onChange={(event) => handleVoiceChange('vi', event.target.value)}
              >
                <option value="">Tự động theo generator</option>
                <optgroup label="Google Cloud">
                  {googleViVoices.map((voice) => (
                    <option key={voice.id} value={voice.id}>{voice.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Native">
                  <option value={pref.female}>Ưu tiên giọng nữ</option>
                  <option value={pref.male}>Ưu tiên giọng nam</option>
                  {nativeViVoices.map((voice) => (
                    <option key={`${voice.lang}-${voice.name}`} value={voice.name}>{voice.name} ({voice.lang})</option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="text-sm font-bold block mb-2">Voice tiếng Anh (advanced)</label>
              <select
                className="w-full p-2 rounded-lg text-sm"
                value={voiceEn}
                onChange={(event) => handleVoiceChange('en', event.target.value)}
              >
                <option value="">Tự động theo generator</option>
                <optgroup label="Google Cloud">
                  {googleEnVoices.map((voice) => (
                    <option key={voice.id} value={voice.id}>{voice.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Native">
                  <option value={pref.female}>Prefer female voice</option>
                  <option value={pref.male}>Prefer male voice</option>
                  {nativeEnVoices.map((voice) => (
                    <option key={`${voice.lang}-${voice.name}`} value={voice.name}>{voice.name} ({voice.lang})</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap mt-4">
            <button
              type="button"
              className="btn btn-primary flex items-center gap-2"
              onClick={() => void handleAdvancedTest()}
            >
              <Volume2 size={16} />
              {testingId === 'advanced:vi' ? 'Đang gọi advanced...' : 'Thử advanced'}
            </button>
            {!stats?.backendReachable && stats?.backendError && (
              <div className="text-xs px-3 py-2 rounded-lg" style={{ background: '#FEF2F2', color: '#B91C1C' }}>
                Backend advanced chưa sẵn sàng: {stats.backendError}
              </div>
            )}
          </div>
        </details>
      ) : (
        <div className="card mb-4">
          <h3 className="font-bold mb-2">Advanced / Generator</h3>
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            Mục này dành cho kỹ thuật để tạo thêm audio mới bằng API. Flow học mặc định của app dùng audio tĩnh đã đóng gói.
          </p>
        </div>
      )}

      <div className="card mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-bold">Toc do doc</div>
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
          onChange={(event) => handleSpeedChange(Number(event.target.value))}
          className="w-full"
        />
        <p className="text-xs mt-2" style={{ color: 'var(--color-text-light)' }}>
          Toc do nay ap dung cho static, advanced va native fallback.
        </p>
      </div>

      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-3">
          <DatabaseZap size={18} style={{ color: 'var(--color-primary)' }} />
          <h3 className="font-bold">Cache audio</h3>
        </div>
        <div className="grid gap-2 mb-4">
          {cacheModeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className="flex items-center gap-3 p-3 rounded-xl text-left w-full transition-all"
              style={{
                background: cacheMode === option.value ? 'var(--color-surface)' : '#F9FAFB',
                border: cacheMode === option.value ? '2px solid var(--color-primary)' : '2px solid transparent',
              }}
              onClick={() => handleCacheModeChange(option.value)}
            >
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: cacheMode === option.value ? 'var(--color-primary)' : '#D1D5DB' }}
              >
                {cacheMode === option.value && (
                  <div className="w-3 h-3 rounded-full" style={{ background: 'var(--color-primary)' }} />
                )}
              </div>
              <div>
                <div className="text-sm font-bold">{option.label}</div>
                <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>{option.desc}</div>
              </div>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="btn flex items-center gap-2"
          style={{ background: '#FEF2F2', color: '#B91C1C' }}
          onClick={() => void handleClearCache()}
          disabled={clearing}
        >
          <Trash2 size={16} />
          {clearing ? 'Dang xoa cache...' : 'Xoa local cache + advanced cache'}
        </button>
        <p className="text-xs mt-2" style={{ color: 'var(--color-text-light)' }}>
          Khong xoa audio tinh dong goi san trong app. Chi xoa cache local va advanced cache phat sinh.
        </p>
      </div>

      <details className="card">
        <summary className="font-bold cursor-pointer">Thong ke va audit</summary>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-3 mb-3">
            <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
              Dung cho kiem tra tinh trang pack MP3 va backend TTS.
            </p>
            <button
              type="button"
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
              style={{ background: 'var(--color-surface)', color: 'var(--color-primary)' }}
              onClick={() => void loadStats()}
            >
              <RefreshCw size={12} className={statsLoading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>

          {statsLoading && (
            <div className="text-sm" style={{ color: 'var(--color-text-light)' }}>
              Dang tai thong tin TTS...
            </div>
          )}

          {!statsLoading && statsError && (
            <div className="text-sm" style={{ color: '#B91C1C' }}>
              {statsError}
            </div>
          )}

          {!statsLoading && !statsError && stats && (
            <>
              {staticManifest && (
                <div className="grid gap-3 md:grid-cols-4 mb-4">
                  <div className="p-3 rounded-xl" style={{ background: '#F9FAFB' }}>
                    <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Tong entry manifest</div>
                    <div className="text-xl font-bold">{staticManifest.totalEntries}</div>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: '#F9FAFB' }}>
                    <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Asset da co</div>
                    <div className="text-xl font-bold">{staticManifest.availableEntries}</div>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: '#F9FAFB' }}>
                    <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Asset con thieu</div>
                    <div className="text-xl font-bold">{staticManifest.missingEntries}</div>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: '#F9FAFB' }}>
                    <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Profile mac dinh</div>
                    <div className="text-sm font-bold">{defaultProfileId || '-'}</div>
                  </div>
                </div>
              )}

              {stats.localDeviceCache && (
                <div className="p-3 rounded-xl mb-4" style={{ background: '#EFF6FF' }}>
                  <div className="text-sm font-bold mb-1">Cache luu tren may user</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                    {stats.localDeviceCache.entries} file / {(stats.localDeviceCache.totalBytes / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              )}

              {showAdmin && (
                <div className="grid gap-3 md:grid-cols-4 mb-4">
                  <div className="p-3 rounded-xl" style={{ background: '#F9FAFB' }}>
                    <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Advanced file cache</div>
                    <div className="text-xl font-bold">{stats.totalFiles}</div>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: '#F9FAFB' }}>
                    <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Ky tu thang nay</div>
                    <div className="text-xl font-bold">{stats.month.chars.toLocaleString('vi-VN')}</div>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: '#F9FAFB' }}>
                    <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Quota thang</div>
                    <div className="text-xl font-bold">{stats.monthlyCharLimit.toLocaleString('vi-VN')}</div>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: '#F9FAFB' }}>
                    <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Tong cache hit</div>
                    <div className="text-xl font-bold">{stats.totalHits}</div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </details>
    </div>
  );
}

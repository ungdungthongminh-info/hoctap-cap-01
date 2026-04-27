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
  type TtsCacheMode,
  type TtsInfo,
} from '../../../shared/utils/sounds';
import { buildVoiceAuditAssetKey } from '../../../shared/services/tts/ttsAssetKeys';
import { MascotCharacter } from '../../../shared/components';
import { isAdminUnlocked } from '../../../shared/utils/adminAccess';

type TestAction = 'static' | 'advanced' | 'native' | null;

const cacheModeOptions: Array<{ value: TtsCacheMode; label: string; desc: string }> = [
  { value: 'manual', label: 'Thu cong', desc: 'Chi tai cache khi bam nghe.' },
  { value: 'balanced', label: 'Can bang', desc: 'Uu tien audio tinh, lam nong cache vua du cho bai dang hoc.' },
  { value: 'aggressive', label: 'Chu dong', desc: 'Prefetch cac asset audio tinh cua bai hoc som hon.' },
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
  const [testing, setTesting] = useState<TestAction>(null);
  const [online, setOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  const pref = getVoicePreferenceOptions();
  const showAdmin = import.meta.env.DEV || isAdminUnlocked();
  const googleViVoices = getGoogleVoiceCatalog('vi');
  const googleEnVoices = getGoogleVoiceCatalog('en');
  const nativeViVoices = useMemo(() => filterVoices(ttsInfo, 'vi'), [ttsInfo]);
  const nativeEnVoices = useMemo(() => filterVoices(ttsInfo, 'en'), [ttsInfo]);

  const staticManifest = stats?.staticManifest;
  const staticViProfiles = (staticManifest?.voiceProfiles || []).filter((profile) => profile.lang === 'vi-VN');
  const defaultStaticProfile = staticViProfiles.find((profile) => profile.id === staticManifest?.defaultProfileId) || staticViProfiles[0];
  const defaultAuditSample = staticManifest?.auditSamples.find((sample) => sample.profileId === defaultStaticProfile?.id) || staticManifest?.auditSamples[0];

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

  const handleModeChange = (value: 'static' | 'advanced' | 'native') => {
    setModeState(value);
    setTtsMode(value);
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

  const testStaticVoice = async () => {
    if (!defaultStaticProfile || !defaultAuditSample) return;
    setTesting('static');
    try {
      await speakTextAsync('Kiem tra voice pack co dinh.', 'vi', {
        mode: 'static',
        policy: 'lesson-read-all',
        assetKey: buildVoiceAuditAssetKey(defaultStaticProfile.id, defaultAuditSample.sampleId),
      });
    } finally {
      setTesting(null);
    }
  };

  const testAdvancedVoice = async () => {
    setTesting('advanced');
    try {
      await speakTextAsync(
        'Xin chao. Day la cau thu de nghe giong generator tieng Viet.',
        'vi',
        {
          mode: 'advanced',
          policy: 'practice-on-demand',
        },
      );
    } finally {
      setTesting(null);
    }
  };

  const testNativeVoice = async () => {
    setTesting('native');
    try {
      await speakTextAsync(
        'Xin chao. Day la cau thu cua giong native tren may nay.',
        'vi',
        {
          mode: 'native',
          policy: 'fallback-native',
        },
      );
    } finally {
      setTesting(null);
    }
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
            App mac dinh uu tien audio tinh + manifest. Advanced mode chi dung cho generator/BYO API khi can.
          </p>
        </div>
      </div>

      <div className="grid gap-4 mb-4 md:grid-cols-2">
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
              Static audio van phat duoc neu file da tao san va da nam trong goi app/cache.
            </div>
          </div>
        </div>

        <div className="card flex items-start gap-3">
          <MonitorSpeaker size={20} style={{ color: ttsInfo?.hasVietnameseVoice ? 'var(--color-success)' : '#D97706' }} />
          <div>
            <div className="text-sm font-bold" style={{ color: ttsInfo?.hasVietnameseVoice ? 'var(--color-success)' : '#D97706' }}>
              {ttsInfo?.hasVietnameseVoice ? 'Co giong native TV du phong' : 'Chua thay giong native TV'}
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>
              Native la lop an toan cuoi cung khi asset tinh chua co hoac advanced backend khong san sang.
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Cloud size={18} style={{ color: 'var(--color-primary)' }} />
          <h3 className="font-bold">Che do phat</h3>
        </div>
        <div className="grid gap-2">
          {[
            {
              value: 'static' as const,
              label: 'Static mac dinh',
              desc: 'Phat audio tu manifest/asset da tao san. Neu chua co file thi fallback native.',
            },
            {
              value: 'advanced' as const,
              label: 'Advanced / Generator',
              desc: 'Van uu tien asset tinh, nhung duoc phep roi sang backend TTS khi can.',
            },
            {
              value: 'native' as const,
              label: 'Native',
              desc: 'Chi dung speech synthesis san co tren may.',
            },
          ].map((option) => (
            <button
              key={option.value}
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
      </div>

      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Headphones size={18} style={{ color: 'var(--color-primary)' }} />
          <h3 className="font-bold">Voice pack co dinh cua app</h3>
        </div>
        <div className="text-sm mb-3" style={{ color: 'var(--color-text-light)' }}>
          Audio cua bai hoc se duoc pre-generate theo 1 profile mac dinh. Cac ung vien duoi day la bo giong uu tien cho tieng Viet doc ro.
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {staticViProfiles.map((profile) => (
            <div
              key={profile.id}
              className="p-3 rounded-xl border"
              style={{
                borderColor: profile.id === staticManifest?.defaultProfileId ? 'var(--color-primary)' : '#E5E7EB',
                background: profile.id === staticManifest?.defaultProfileId ? '#EFF6FF' : '#FFFFFF',
              }}
            >
              <div className="text-sm font-bold mb-1">{profile.label}</div>
              <div className="text-xs font-mono mb-2" style={{ color: 'var(--color-primary-dark)' }}>
                {profile.voiceId}
              </div>
              <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                {profile.notes}
              </div>
              {profile.id === staticManifest?.defaultProfileId && (
                <div className="text-[11px] mt-2 font-bold" style={{ color: 'var(--color-primary-dark)' }}>
                  Dang la profile mac dinh trong manifest
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3 flex-wrap mt-4">
          <button
            className="btn btn-primary flex items-center gap-2"
            onClick={() => void testStaticVoice()}
            disabled={!defaultAuditSample?.available || testing !== null}
          >
            <Volume2 size={16} />
            {testing === 'static' ? 'Dang phat mau...' : 'Nghe voice chuan'}
          </button>
          <button
            className="btn flex items-center gap-2"
            style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}
            onClick={() => void testNativeVoice()}
            disabled={testing !== null}
          >
            <Volume2 size={16} />
            {testing === 'native' ? 'Dang phat native...' : 'Thu native du phong'}
          </button>
        </div>
        {!defaultAuditSample?.available && (
          <p className="text-xs mt-3" style={{ color: '#B45309' }}>
            Audit sample chua co file MP3. Sau khi generate audit pack, nut nghe voice chuan se phat dung file tinh.
          </p>
        )}
      </div>

      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Cloud size={18} style={{ color: 'var(--color-primary)' }} />
          <h3 className="font-bold">Advanced / generator mode</h3>
        </div>
        <div className="text-sm mb-4" style={{ color: 'var(--color-text-light)' }}>
          Muc nay chi dung khi can goi backend TTS de tao audio moi, hoac khi khach muon dung API rieng. Flow mac dinh cua app khong phu thuoc phan nay.
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-bold block mb-2">Voice tieng Viet cho advanced</label>
            <select
              className="w-full p-2 rounded-lg text-sm"
              value={voiceVi}
              onChange={(event) => handleVoiceChange('vi', event.target.value)}
            >
              <option value="">Tu dong theo generator</option>
              <optgroup label="Google Cloud">
                {googleViVoices.map((voice) => (
                  <option key={voice.id} value={voice.id}>{voice.label}</option>
                ))}
              </optgroup>
              <optgroup label="Native">
                <option value={pref.female}>Uu tien giong nu</option>
                <option value={pref.male}>Uu tien giong nam</option>
                {nativeViVoices.map((voice) => (
                  <option key={`${voice.lang}-${voice.name}`} value={voice.name}>{voice.name} ({voice.lang})</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="text-sm font-bold block mb-2">Voice tieng Anh cho advanced</label>
            <select
              className="w-full p-2 rounded-lg text-sm"
              value={voiceEn}
              onChange={(event) => handleVoiceChange('en', event.target.value)}
            >
              <option value="">Tu dong theo generator</option>
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
            className="btn btn-primary flex items-center gap-2"
            onClick={() => void testAdvancedVoice()}
            disabled={testing !== null}
          >
            <Volume2 size={16} />
            {testing === 'advanced' ? 'Dang goi advanced...' : 'Thu advanced'}
          </button>
          {!stats?.backendReachable && stats?.backendError && (
            <div className="text-xs px-3 py-2 rounded-lg" style={{ background: '#FEF2F2', color: '#B91C1C' }}>
              Backend advanced chua san sang: {stats.backendError}
            </div>
          )}
        </div>
      </div>

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
          Toc do nay ap dung cho phat static MP3, advanced MP3 va native fallback.
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
          className="btn flex items-center gap-2"
          style={{ background: '#FEF2F2', color: '#B91C1C' }}
          onClick={() => void handleClearCache()}
          disabled={clearing}
        >
          <Trash2 size={16} />
          {clearing ? 'Dang xoa cache...' : 'Xoa local cache + advanced cache'}
        </button>
        <p className="text-xs mt-2" style={{ color: 'var(--color-text-light)' }}>
          Nut nay khong xoa audio tinh dong goi san trong app. No chi xoa cache tren may va cache backend phat sinh them.
        </p>
      </div>

      <div className="card">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h3 className="font-bold">Thong ke va audit</h3>
          <button
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
                  <div className="text-sm font-bold">{defaultStaticProfile?.label || staticManifest.defaultProfileId}</div>
                </div>
              </div>
            )}

            {stats.localDeviceCache && (
              <div className="p-3 rounded-xl mb-4" style={{ background: '#EFF6FF' }}>
                <div className="text-sm font-bold mb-1">Cache luu tren may user</div>
                <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                  {stats.localDeviceCache.entries} file • {(stats.localDeviceCache.totalBytes / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            )}

            {showAdmin && (
              <>
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

                <div className="grid gap-2 mb-4">
                  {stats.byUsage.map((item) => (
                    <div key={item.usage} className="flex items-center justify-between text-sm p-2 rounded-lg" style={{ background: '#F9FAFB' }}>
                      <span>{item.usage}</span>
                      <span style={{ color: 'var(--color-text-light)' }}>
                        {item.files} file / {item.chars.toLocaleString('vi-VN')} ky tu / {item.hits} hit
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {staticManifest?.auditSamples?.length ? (
              <div>
                <div className="text-sm font-bold mb-2">Audit sample da khai bao</div>
                <div className="grid gap-2">
                  {staticManifest.auditSamples.map((sample) => (
                    <div key={sample.key} className="flex items-center justify-between text-sm p-2 rounded-lg" style={{ background: '#F9FAFB' }}>
                      <span>{sample.label} - {sample.profileId}</span>
                      <span style={{ color: sample.available ? 'var(--color-success)' : '#B45309' }}>
                        {sample.available ? 'Da co MP3' : 'Chua generate'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

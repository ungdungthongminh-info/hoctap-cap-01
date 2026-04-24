import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, BellOff, Clock, Flame, BookOpen, Gamepad2, X } from 'lucide-react';

const REMINDER_KEY = 'hhk_reminder_settings';
const LAST_DISMISS_KEY = 'hhk_reminder_dismiss';

interface ReminderSettings {
  enabled: boolean;
  hour: number;
  minute: number;
}

function getSettings(): ReminderSettings {
  try {
    const raw = localStorage.getItem(REMINDER_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { enabled: true, hour: 17, minute: 0 };
}

function saveSettings(s: ReminderSettings) {
  localStorage.setItem(REMINDER_KEY, JSON.stringify(s));
}

interface NotifItem {
  id: string;
  icon: React.ReactNode;
  text: string;
  action?: string;
  route?: string;
  color: string;
}

interface StudyReminderProps {
  streak: number;
  studiedToday: boolean;
  needsReviewCount: number;
}

export function StudyReminder({ streak, studiedToday, needsReviewCount }: StudyReminderProps) {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(getSettings);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [showSettings, setShowSettings] = useState(false);

  // Check dismissed today
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LAST_DISMISS_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        const today = new Date().toISOString().substring(0, 10);
        if (data.date === today && Array.isArray(data.ids)) {
          setDismissed(new Set(data.ids));
        }
      }
    } catch { /* ignore */ }
  }, []);

  const dismiss = (id: string) => {
    const newSet = new Set(dismissed);
    newSet.add(id);
    setDismissed(newSet);
    const today = new Date().toISOString().substring(0, 10);
    localStorage.setItem(LAST_DISMISS_KEY, JSON.stringify({ date: today, ids: [...newSet] }));
  };

  // Build notifications
  const notifs: NotifItem[] = [];
  const now = new Date();
  const currentHour = now.getHours();

  if (settings.enabled) {
    // Streak loss warning
    if (streak > 0 && !studiedToday) {
      notifs.push({
        id: 'streak',
        icon: <Flame size={18} />,
        text: `🔥 Chuỗi ${streak} ngày sắp mất! Học 1 bài để giữ streak!`,
        action: 'Học ngay',
        route: '/lessons',
        color: '#F59E0B',
      });
    }

    // Evening reminder
    if (!studiedToday && currentHour >= settings.hour) {
      notifs.push({
        id: 'evening',
        icon: <Clock size={18} />,
        text: 'Hôm nay bé chưa học! Dành 10 phút ôn bài nhé 📚',
        action: 'Bắt đầu',
        route: '/lessons',
        color: '#3B82F6',
      });
    }

    // Needs review
    if (needsReviewCount > 0) {
      notifs.push({
        id: 'review',
        icon: <BookOpen size={18} />,
        text: `${needsReviewCount} bài cần ôn lại. Ôn tập giúp nhớ lâu hơn!`,
        action: 'Ôn tập',
        route: '/progress',
        color: '#EF4444',
      });
    }

    // Daily challenge
    const dailyKey = 'hhk_daily_challenge';
    try {
      const raw = localStorage.getItem(dailyKey);
      const daily = raw ? JSON.parse(raw) : null;
      const today = now.toISOString().substring(0, 10);
      if (!daily || daily.date !== today || !daily.completed) {
        notifs.push({
          id: 'daily',
          icon: <Gamepad2 size={18} />,
          text: '🌟 Thử thách hàng ngày chưa hoàn thành!',
          action: 'Thử ngay',
          route: '/daily',
          color: '#8B5CF6',
        });
      }
    } catch { /* ignore */ }
  }

  const visible = notifs.filter(n => !dismissed.has(n.id));

  const toggleSettings = () => setShowSettings(!showSettings);

  const updateHour = (h: number) => {
    const s = { ...settings, hour: h };
    setSettings(s);
    saveSettings(s);
  };

  const toggleEnabled = () => {
    const s = { ...settings, enabled: !settings.enabled };
    setSettings(s);
    saveSettings(s);
  };

  if (visible.length === 0 && !showSettings) {
    return (
      <button onClick={toggleSettings} className="text-xs flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity"
        style={{ color: 'var(--color-text-light)' }}>
        <Bell size={14} /> Nhắc nhở
      </button>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto mb-4">
      {/* Notification cards */}
      {visible.map(n => (
        <div key={n.id} className="card mb-2 flex items-center gap-3 slide-in" style={{ borderLeft: `4px solid ${n.color}` }}>
          <div style={{ color: n.color }}>{n.icon}</div>
          <div className="flex-1 text-sm font-medium" style={{ color: 'var(--color-text)' }}>{n.text}</div>
          {n.route && (
            <button className="text-xs font-bold px-3 py-1.5 rounded-full" 
              style={{ background: n.color, color: 'white' }}
              onClick={() => navigate(n.route!)}>
              {n.action}
            </button>
          )}
          <button onClick={() => dismiss(n.id)} className="opacity-50 hover:opacity-100" style={{ color: 'var(--color-text-light)' }}>
            <X size={16} />
          </button>
        </div>
      ))}

      {/* Settings toggle */}
      <div className="flex items-center justify-between mt-1">
        <button onClick={toggleSettings} className="text-xs flex items-center gap-1 opacity-60 hover:opacity-100"
          style={{ color: 'var(--color-text-light)' }}>
          {settings.enabled ? <Bell size={12} /> : <BellOff size={12} />}
          {showSettings ? 'Ẩn cài đặt' : 'Cài đặt nhắc nhở'}
        </button>
      </div>

      {showSettings && (
        <div className="card mt-2 flex items-center gap-4 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={settings.enabled} onChange={toggleEnabled} className="w-4 h-4" />
            <span style={{ color: 'var(--color-text)' }}>Bật nhắc nhở</span>
          </label>
          <label className="flex items-center gap-2">
            <span style={{ color: 'var(--color-text-light)' }}>Nhắc từ:</span>
            <select value={settings.hour} onChange={e => updateHour(Number(e.target.value))}
              className="px-2 py-1 rounded border text-sm" style={{ borderColor: 'var(--color-primary-light)' }}>
              {Array.from({ length: 13 }, (_, i) => i + 8).map(h => (
                <option key={h} value={h}>{h}:00</option>
              ))}
            </select>
          </label>
        </div>
      )}
    </div>
  );
}

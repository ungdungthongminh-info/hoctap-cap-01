import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { getGradeLabel, getSubjectsForGrade } from '../../../data/subjects';
import { Clock, Lock, BarChart3, Save, RotateCcw, Eye, EyeOff, Check, TrendingUp, BookOpen, Users, Edit3 } from 'lucide-react';
import { MascotCharacter } from '../../../shared/components';
import { getAccessPlan, getUnlockedGrades } from '../../../shared/services/accessControl';

const PROFILES_KEY = 'hhk_profiles';

const AVATARS = ['🧒', '👦', '👧', '🐻', '🐰', '🦊', '🐱', '🐶', '🦁', '🐸', '🦄', '🐼'];

export function ParentPage() {
  const navigate = useNavigate();
  const { state, updateStudent, getCompletedCount, getAverageScore, resetProgress, getGradeLessons, getWeeklyActivity, getStreak } = useAppData();
  const unlockedGrades = getUnlockedGrades(state.student.grade, getAccessPlan());

  const gradeSubjects = getSubjectsForGrade(state.student.grade);

  // --- Profile editing ---
  const [editName, setEditName] = useState(state.student.fullName);
  const [editAvatar, setEditAvatar] = useState(state.student.avatar === 'default' ? '🧒' : state.student.avatar);
  const [editGrade, setEditGrade] = useState(state.student.grade);
  const [profileSaved, setProfileSaved] = useState(false);

  // --- PIN ---
  const storedPin = localStorage.getItem('hhk_parent_pin');
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pinMsg, setPinMsg] = useState('');

  // --- Time limit ---
  const [timeLimit, setTimeLimit] = useState(() => {
    const v = localStorage.getItem('hhk_time_limit');
    return v ? parseInt(v, 10) : 0;
  });

  // --- Confirm reset ---
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const saveProfile = () => {
    const trimmed = editName.trim();
    if (trimmed.length < 1) return;
    updateStudent({ fullName: trimmed, avatar: editAvatar, grade: editGrade, subjectCode: state.student.subjectCode });

    // Đồng bộ vào danh sách profiles (ProfileSwitcherPage dùng)
    try {
      const profiles = JSON.parse(localStorage.getItem(PROFILES_KEY) || '[]');
      const activeId = localStorage.getItem('hhk_active_profile') || 'default';
      const updated = profiles.map((p: any) =>
        p.id === activeId ? { ...p, name: trimmed, avatar: editAvatar, grade: editGrade } : p
      );
      localStorage.setItem(PROFILES_KEY, JSON.stringify(updated));
    } catch { /* ignore */ }

    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const savePin = () => {
    if (pinInput.length === 4 && /^\d{4}$/.test(pinInput)) {
      localStorage.setItem('hhk_parent_pin', pinInput);
      setPinMsg('✅ Đã lưu mã PIN!');
      setPinInput('');
    } else if (pinInput === '') {
      localStorage.removeItem('hhk_parent_pin');
      setPinMsg('🗑️ Đã xóa mã PIN');
    } else {
      setPinMsg('⚠️ PIN phải gồm 4 chữ số');
    }
    setTimeout(() => setPinMsg(''), 3000);
  };

  const saveTimeLimit = (mins: number) => {
    setTimeLimit(mins);
    if (mins > 0) {
      localStorage.setItem('hhk_time_limit', String(mins));
    } else {
      localStorage.removeItem('hhk_time_limit');
    }
  };

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
  };

  const completed = getCompletedCount();
  const avg = getAverageScore();

  return (
    <div className="fade-in max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <MascotCharacter size="sm" />
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
            👨‍👩‍👧 Phụ Huynh
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            Quản lý hồ sơ và cài đặt cho con
          </p>
        </div>
      </div>

      {/* === SECTION 1: Profile === */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Edit3 size={20} style={{ color: 'var(--color-primary)' }} />
            <h3 className="font-bold">Chỉnh sửa hồ sơ</h3>
          </div>
          <button
            onClick={() => navigate('/profiles')}
            className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--color-primary)', background: 'var(--color-primary-light)' }}
          >
            <Users size={14} /> Quản lý hồ sơ
          </button>
        </div>

        {/* Avatar picker */}
        <div className="mb-4">
          <label className="text-sm font-medium block mb-2" style={{ color: 'var(--color-text-light)' }}>Ảnh đại diện</label>
          <div className="flex gap-2 flex-wrap">
            {AVATARS.map((a) => (
              <button
                key={a}
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all"
                style={{
                  background: editAvatar === a ? 'var(--color-primary-light)' : 'var(--color-surface)',
                  border: editAvatar === a ? '2px solid var(--color-primary)' : '2px solid transparent',
                  transform: editAvatar === a ? 'scale(1.15)' : 'scale(1)',
                }}
                onClick={() => setEditAvatar(a)}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Name input */}
        <div className="mb-4">
          <label className="text-sm font-medium block mb-1" style={{ color: 'var(--color-text-light)' }}>Tên hiển thị</label>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            maxLength={30}
            className="w-full px-4 py-2 rounded-xl text-sm"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-primary-light)',
              color: 'var(--color-text)',
              outline: 'none',
            }}
          />
        </div>

        {/* Grade selector */}
        <div className="mb-4">
          <label className="text-sm font-medium block mb-2" style={{ color: 'var(--color-text-light)' }}>Lớp học</label>
          <div className="flex gap-2 flex-wrap">
            {[0, 1, 2, 3, 4, 5].map((g) => (
              <button
                key={g}
                onClick={() => unlockedGrades.includes(g) && setEditGrade(g)}
                className="px-5 py-2 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: editGrade === g ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: editGrade === g ? 'white' : unlockedGrades.includes(g) ? 'var(--color-text)' : 'var(--color-text-light)',
                  border: editGrade === g ? 'none' : '1px solid var(--color-primary-light)',
                  opacity: unlockedGrades.includes(g) ? 1 : 0.45,
                }}
                disabled={!unlockedGrades.includes(g)}
              >
                {getGradeLabel(g)}
              </button>
            ))}
          </div>
          <div className="text-xs mt-2" style={{ color: 'var(--color-text-light)' }}>
            Gói hiện tại đang mở khóa: {unlockedGrades.map((grade) => getGradeLabel(grade)).join(', ')}
          </div>
        </div>

        <button
          onClick={saveProfile}
          className="btn btn-primary flex items-center gap-2 text-sm"
          style={{ padding: '8px 20px' }}
        >
          {profileSaved ? <Check size={16} /> : <Save size={16} />}
          {profileSaved ? 'Đã lưu!' : 'Lưu hồ sơ'}
        </button>
      </div>

      {/* === SECTION 2: Quick stats === */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={20} style={{ color: '#059669' }} />
          <h3 className="font-bold">Tóm tắt học tập</h3>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="card-flat text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{completed}/{getGradeLessons().length}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Bài đã học</div>
          </div>
          <div className="card-flat text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--color-success)' }}>{avg}%</div>
            <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Điểm TB</div>
          </div>
          <div className="card-flat text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--color-star)' }}>{state.practiceSets.filter(p => p.finishedAt).length}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Buổi luyện</div>
          </div>
        </div>
        <button
          onClick={() => navigate('/progress')}
          className="btn btn-secondary text-sm w-full"
        >
          Xem chi tiết tiến bộ →
        </button>
      </div>

      {/* === SECTION 2b: Subject comparison === */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={20} style={{ color: '#7C3AED' }} />
          <h3 className="font-bold">So sánh theo môn học</h3>
        </div>
        <div className="grid gap-3">
          {gradeSubjects.filter((s) => s.hasContent).map((sub) => {
            const subLessons = state.lessons.filter((l) => l.grade === state.student.grade && l.subjectCode === sub.code);
            const subCompleted = state.progress.filter((p) => subLessons.some((l) => l.id === p.lessonId) && p.attemptCount > 0).length;
            const subAttempted = state.progress.filter((p) => subLessons.some((l) => l.id === p.lessonId) && p.attemptCount > 0);
            const subAvg = subAttempted.length > 0 ? Math.round(subAttempted.reduce((s, p) => s + p.bestScore, 0) / subAttempted.length) : 0;
            const subPct = subLessons.length > 0 ? Math.round((subCompleted / subLessons.length) * 100) : 0;
            const mastered = state.progress.filter((p) => subLessons.some((l) => l.id === p.lessonId) && p.masteryLevel === 'mastered').length;

            return (
              <div key={sub.code} className="p-3 rounded-xl" style={{ background: sub.bgColor }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm" style={{ color: sub.color }}>
                    {sub.emoji} {sub.name}
                  </span>
                  <span className="text-xs" style={{ color: sub.color }}>
                    {subCompleted}/{subLessons.length} bài · TB {subAvg}%
                  </span>
                </div>
                <div className="progress-bar" style={{ height: 8 }}>
                  <div className="progress-bar-fill" style={{ width: `${subPct}%`, background: sub.color }} />
                </div>
                <div className="flex gap-4 mt-2 text-xs" style={{ color: sub.color, opacity: 0.8 }}>
                  <span>⭐ Giỏi: {mastered}</span>
                  <span>📊 Hoàn thành: {subPct}%</span>
                </div>
              </div>
            );
          })}
          {gradeSubjects.filter((s) => !s.hasContent).length > 0 && (
            <p className="text-xs text-center" style={{ color: 'var(--color-text-light)' }}>
              {gradeSubjects.filter((s) => !s.hasContent).map((s) => `${s.emoji} ${s.name}`).join(', ')} — Sắp có!
            </p>
          )}
        </div>
      </div>

      {/* === SECTION 2c: Weekly activity overview === */}
      {(() => {
        const weekly = getWeeklyActivity();
        const totalSessions = weekly.reduce((s, d) => s + d.sessions, 0);
        const streak = getStreak();
        const studyDays = weekly.filter((d) => d.sessions > 0).length;
        const maxS = Math.max(...weekly.map((d) => d.sessions), 1);
        return (
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} style={{ color: '#059669' }} />
              <h3 className="font-bold">Hoạt động 7 ngày qua</h3>
            </div>
            <div className="grid grid-cols-4 gap-3 text-center mb-4">
              <div className="card-flat py-2">
                <div className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>{totalSessions}</div>
                <div className="text-[10px]" style={{ color: 'var(--color-text-light)' }}>Buổi luyện</div>
              </div>
              <div className="card-flat py-2">
                <div className="text-xl font-bold" style={{ color: '#059669' }}>{studyDays}/7</div>
                <div className="text-[10px]" style={{ color: 'var(--color-text-light)' }}>Ngày học</div>
              </div>
              <div className="card-flat py-2">
                <div className="text-xl font-bold" style={{ color: '#D97706' }}>🔥 {streak}</div>
                <div className="text-[10px]" style={{ color: 'var(--color-text-light)' }}>Streak</div>
              </div>
              <div className="card-flat py-2">
                <div className="text-xl font-bold" style={{ color: '#7C3AED' }}>
                  {totalSessions > 0 ? Math.round(weekly.filter((d) => d.sessions > 0).reduce((s, d) => s + d.correctRate, 0) / Math.max(studyDays, 1)) : 0}%
                </div>
                <div className="text-[10px]" style={{ color: 'var(--color-text-light)' }}>Đúng TB</div>
              </div>
            </div>
            <div className="flex items-end gap-1 justify-between" style={{ height: 80 }}>
              {weekly.map((day) => {
                const barH = day.sessions > 0 ? Math.max(12, (day.sessions / maxS) * 60) : 4;
                return (
                  <div key={day.date} className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className="w-full max-w-[24px] rounded-t"
                      style={{ height: barH, background: day.sessions > 0 ? 'var(--color-primary)' : '#E5E7EB' }}
                    />
                    <span className="text-[10px]" style={{ color: 'var(--color-text-light)' }}>{day.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* === SECTION 3: PIN === */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={20} style={{ color: '#7C3AED' }} />
          <h3 className="font-bold">Mã PIN bảo vệ</h3>
          {storedPin && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#D1FAE5', color: '#059669' }}>
              Đã bật
            </span>
          )}
        </div>
        <p className="text-sm mb-3" style={{ color: 'var(--color-text-light)' }}>
          Đặt mã PIN 4 số để bảo vệ cài đặt phụ huynh. Để trống và nhấn Lưu để xóa PIN.
        </p>
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <input
              type={showPin ? 'text' : 'password'}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength={4}
              placeholder={storedPin ? '••••' : 'Nhập 4 số'}
              className="w-full px-4 py-2 rounded-xl text-sm pr-10"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-primary-light)',
                color: 'var(--color-text)',
                outline: 'none',
                letterSpacing: '4px',
              }}
            />
            <button
              onClick={() => setShowPin(!showPin)}
              className="absolute right-2 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--color-text-light)' }}
            >
              {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <button onClick={savePin} className="btn btn-primary text-sm" style={{ padding: '8px 16px' }}>
            Lưu
          </button>
        </div>
        {pinMsg && (
          <p className="text-sm mt-2" style={{ color: pinMsg.includes('⚠️') ? 'var(--color-error)' : 'var(--color-success)' }}>
            {pinMsg}
          </p>
        )}
      </div>

      {/* === SECTION 4: Time limit === */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={20} style={{ color: '#D97706' }} />
          <h3 className="font-bold">Giới hạn thời gian</h3>
        </div>
        <p className="text-sm mb-3" style={{ color: 'var(--color-text-light)' }}>
          Giới hạn thời gian học mỗi ngày. Chọn "Tắt" nếu không cần giới hạn.
        </p>
        <div className="flex gap-2 flex-wrap">
          {[
            { label: 'Tắt', value: 0 },
            { label: '15 phút', value: 15 },
            { label: '30 phút', value: 30 },
            { label: '45 phút', value: 45 },
            { label: '60 phút', value: 60 },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => saveTimeLimit(opt.value)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: timeLimit === opt.value ? 'var(--color-primary)' : 'var(--color-surface)',
                color: timeLimit === opt.value ? 'white' : 'var(--color-text)',
                border: timeLimit === opt.value ? 'none' : '1px solid var(--color-primary-light)',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {timeLimit > 0 && (
          <p className="text-sm mt-2" style={{ color: 'var(--color-success)' }}>
            ✅ Giới hạn: {timeLimit} phút/ngày
          </p>
        )}
      </div>

      {/* === SECTION 5: Reset === */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <RotateCcw size={20} style={{ color: 'var(--color-error)' }} />
          <h3 className="font-bold">Đặt lại tiến trình</h3>
        </div>
        <p className="text-sm mb-3" style={{ color: 'var(--color-text-light)' }}>
          Xóa toàn bộ tiến trình học tập để bắt đầu lại từ đầu.
        </p>
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="btn text-sm"
            style={{ background: '#FEE2E2', color: '#DC2626', padding: '8px 20px' }}
          >
            Đặt lại tất cả
          </button>
        ) : (
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
            <span className="text-sm font-bold" style={{ color: '#DC2626' }}>⚠️ Chắc chắn xóa hết tiến trình?</span>
            <button onClick={handleReset} className="btn text-sm" style={{ background: '#DC2626', color: 'white', padding: '6px 16px' }}>
              Xác nhận
            </button>
            <button onClick={() => setShowResetConfirm(false)} className="btn btn-secondary text-sm" style={{ padding: '6px 16px' }}>
              Hủy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

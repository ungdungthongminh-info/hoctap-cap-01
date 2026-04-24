/**
 * ProfileSwitcherPage — Quản lý nhiều hồ sơ học sinh trên 1 thiết bị
 * Mỗi profile có progress, XP, achievements riêng
 */
import { useState, useEffect } from 'react';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { getGradeLabel } from '../../../data/subjects';
import { getXpData } from '../../../shared/utils/achievements';
import { UserPlus, Trash2, LogIn, Edit3, Check, X, Users, GraduationCap, Star } from 'lucide-react';
import { STORAGE_KEYS, PROFILE_KEYS } from '../../../shared/constants/storageKeys';
import { getAccessPlan, getMaxProfilesForCurrentPlan, getUnlockedGrades, isInternalBuild } from '../../../shared/services/accessControl';

interface UserProfile {
  id: string;
  name: string;
  grade: number;
  subjectCode: string;
  avatar: string;
  createdAt: string;
  xp: number;
}

const PROFILES_KEY = 'hhk_profiles';
const ACTIVE_KEY = 'hhk_active_profile';

function loadProfiles(): UserProfile[] {
  try {
    return JSON.parse(localStorage.getItem(PROFILES_KEY) || '[]');
  } catch { return []; }
}

function saveProfiles(profiles: UserProfile[]) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

function getActiveProfileId(): string {
  return localStorage.getItem(ACTIVE_KEY) || 'default';
}

function setActiveProfileId(id: string) {
  localStorage.setItem(ACTIVE_KEY, id);
}

// Save current state to profile-scoped storage
function saveCurrentToProfile(profileId: string) {
  const keys = PROFILE_KEYS.map((k) => STORAGE_KEYS[k]);
  for (const key of keys) {
    const val = localStorage.getItem(key);
    if (val !== null) {
      localStorage.setItem(`${key}_${profileId}`, val);
    }
  }
}

// Load profile-scoped storage into current
function loadProfileData(profileId: string) {
  const keys = PROFILE_KEYS.map((k) => STORAGE_KEYS[k]);
  for (const key of keys) {
    const val = localStorage.getItem(`${key}_${profileId}`);
    if (val !== null) {
      localStorage.setItem(key, val);
    } else {
      localStorage.removeItem(key);
    }
  }
}

const AVATARS = ['🧒', '👦', '👧', '🧒🏻', '👦🏻', '👧🏻', '🧒🏽', '👦🏽', '👧🏽', '🐱', '🐶', '🦊'];

export function ProfileSwitcherPage() {
  const { state, updateStudent } = useAppData();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeId] = useState(getActiveProfileId());
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState(1);
  const [newAvatar, setNewAvatar] = useState('🧒');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const currentPlan = getAccessPlan();
  const maxProfiles = getMaxProfilesForCurrentPlan();
  const unlockedGrades = getUnlockedGrades(state.student.grade, currentPlan);
  const isInternal = isInternalBuild();

  // Init: ensure default profile exists + sync current state
  useEffect(() => {
    let profs = loadProfiles();
    const currentAvatar = state.student.avatar === 'default' ? '🧒' : state.student.avatar;
    const defaultIdx = profs.findIndex(p => p.id === 'default');
    if (defaultIdx === -1) {
      profs = [{
        id: 'default',
        name: state.student.fullName,
        grade: state.student.grade,
        subjectCode: state.student.subjectCode,
        avatar: currentAvatar,
        createdAt: new Date().toISOString(),
        xp: parseInt(localStorage.getItem('hhk_xp') || '0', 10) || 0,
      }, ...profs];
    } else {
      // Đồng bộ từ state hiện tại (ParentPage có thể đã thay đổi)
      profs[defaultIdx] = {
        ...profs[defaultIdx],
        name: state.student.fullName,
        grade: state.student.grade,
        subjectCode: state.student.subjectCode,
        avatar: currentAvatar,
      };
    }
    // Đồng bộ profile đang active (không phải default)
    const activeId = getActiveProfileId();
    if (activeId !== 'default') {
      const activeIdx = profs.findIndex(p => p.id === activeId);
      if (activeIdx !== -1) {
        profs[activeIdx] = {
          ...profs[activeIdx],
          name: state.student.fullName,
          grade: state.student.grade,
          subjectCode: state.student.subjectCode,
          avatar: currentAvatar,
        };
      }
    }
    saveProfiles(profs);
    setProfiles(profs);
  }, [state.student.fullName, state.student.grade, state.student.avatar]);

  const createProfile = () => {
    if (!newName.trim() || (!isInternal && profiles.length >= maxProfiles)) return;
    const id = 'profile_' + Date.now();
    const profile: UserProfile = {
      id,
      name: newName.trim(),
      grade: newGrade,
      subjectCode: 'math',
      avatar: newAvatar,
      createdAt: new Date().toISOString(),
      xp: 0,
    };
    const updated = [...profiles, profile];
    saveProfiles(updated);
    setProfiles(updated);
    setIsCreating(false);
    setNewName('');
    setNewGrade(unlockedGrades[0] ?? 1);
    setNewAvatar('🧒');
  };

  const switchProfile = (profileId: string) => {
    if (profileId === activeId) return;

    // 1. Lưu state hiện tại của profile cũ trước
    saveCurrentToProfile(activeId);
    const currentXp = parseInt(localStorage.getItem('hhk_xp') || '0', 10) || 0;
    const updatedProfiles = profiles.map(p =>
      p.id === activeId ? { ...p, xp: currentXp, name: state.student.fullName, grade: state.student.grade } : p
    );

    // 2. Load dữ liệu profile mới
    loadProfileData(profileId);
    setActiveProfileId(profileId);

    // 3. Nếu profile mới chưa có hhk_app_state (profile vừa tạo), tạo state cơ bản
    const target = updatedProfiles.find(p => p.id === profileId);
    if (target && !localStorage.getItem('hhk_app_state')) {
      const basicState = {
        version: 2,
        savedAt: new Date().toISOString(),
        student: { fullName: target.name, grade: target.grade, subjectCode: target.subjectCode, avatar: target.avatar },
        progress: [],
        practiceSets: [],
        answers: [],
      };
      localStorage.setItem('hhk_app_state', JSON.stringify(basicState));
    }

    saveProfiles(updatedProfiles);

    // 4. Reload để áp dụng state mới (ko cần gọi updateStudent vì reload sẽ load từ localStorage)
    window.location.reload();
  };

  const deleteProfile = (profileId: string) => {
    if (profileId === 'default') return; // Can't delete default
    // Remove profile data
    const keys = ['hhk_app_state', 'hhk_xp', 'hhk_achievements', 'hhk_memory_cards', 'hhk_shop_purchased', 'hhk_shop_equipped', 'hhk_daily_challenge'];
    for (const key of keys) {
      localStorage.removeItem(`${key}_${profileId}`);
    }
    const updated = profiles.filter(p => p.id !== profileId);
    saveProfiles(updated);
    setProfiles(updated);
    setConfirmDelete(null);

    // If deleted active profile, switch to default
    if (profileId === activeId) {
      switchProfile('default');
    }
  };

  const saveEdit = (profileId: string) => {
    if (!newName.trim()) return;
    const updated = profiles.map(p =>
      p.id === profileId ? { ...p, name: newName.trim(), avatar: newAvatar } : p
    );
    saveProfiles(updated);
    setProfiles(updated);
    if (profileId === activeId) {
      updateStudent({ fullName: newName.trim(), avatar: newAvatar });
    }
    setEditingId(null);
    setNewName('');
  };

  return (
    <div className="fade-in flex flex-col items-center gap-6 p-4 max-w-2xl mx-auto">
      <div className="text-center">
        <span className="text-5xl">👨‍👩‍👧‍👦</span>
        <h1 className="text-2xl font-bold mt-2" style={{ color: 'var(--color-primary-dark)' }}>
          Hồ sơ học sinh
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-light)' }}>
          {isInternal ? 'Ban noi bo: dang bo qua gioi han goi cho tinh nang ho so.' : `Goi ${currentPlan === 'free' ? 'Free' : currentPlan === 'standard' ? 'Standard' : 'Premium'} duoc quan ly toi da ${maxProfiles} ho so tren cung thiet bi`}
        </p>
      </div>

      {!isInternal && profiles.length >= maxProfiles && (
        <div className="w-full p-4 rounded-2xl" style={{ background: '#FEF3C7', border: '1px solid #FCD34D', color: '#92400E' }}>
          <div className="font-bold text-sm">Da dat gioi han ho so cua goi hien tai</div>
          <div className="text-xs mt-1">
            Free: 1 ho so, Standard: 3 ho so, Premium: 5 ho so. Neu muon them ho so moi, hay nang cap goi trong muc Goi dich vu.
          </div>
        </div>
      )}

      {/* Profile list */}
      <div className="w-full flex flex-col gap-3">
        {profiles.map((profile) => {
          const xpData = getXpData(profile.id === activeId
            ? (parseInt(localStorage.getItem('hhk_xp') || '0', 10) || 0)
            : profile.xp);
          const isActive = profile.id === activeId;
          const isEditing = editingId === profile.id;

          return (
            <div
              key={profile.id}
              className="card p-4 flex items-center gap-4"
              style={isActive ? { borderColor: 'var(--color-primary)', borderWidth: '2px' } : {}}
            >
              {/* Avatar */}
              <div className="text-4xl flex-shrink-0">{profile.avatar}</div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      className="px-3 py-1.5 rounded-lg border text-sm"
                      style={{ borderColor: 'var(--color-primary)' }}
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      maxLength={20}
                      autoFocus
                    />
                    <div className="flex gap-1 flex-wrap">
                      {AVATARS.map(a => (
                        <button key={a} className="text-xl p-1 rounded" onClick={() => setNewAvatar(a)}
                          style={newAvatar === a ? { background: 'var(--color-primary-light)' } : {}}>
                          {a}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button className="btn-primary text-xs px-3 py-1" onClick={() => saveEdit(profile.id)}>
                        <Check size={12} /> Lưu
                      </button>
                      <button className="btn-outline text-xs px-3 py-1" onClick={() => setEditingId(null)}>
                        <X size={12} /> Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold truncate" style={{ color: 'var(--color-text)' }}>
                        {profile.name}
                      </span>
                      {isActive && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                          style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                          Đang dùng
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: 'var(--color-text-light)' }}>
                      <span><GraduationCap size={12} className="inline" /> {getGradeLabel(profile.grade)}</span>
                      <span><Star size={12} className="inline" /> {xpData.levelEmoji} Lv.{xpData.level}</span>
                      <span>{xpData.totalXp} XP</span>
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              {!isEditing && (
                <div className="flex gap-1 flex-shrink-0">
                  {!isActive && (
                    <button className="p-2 rounded-lg hover:bg-gray-100" onClick={() => switchProfile(profile.id)}
                      title="Chuyển sang hồ sơ này">
                      <LogIn size={16} style={{ color: 'var(--color-primary)' }} />
                    </button>
                  )}
                  <button className="p-2 rounded-lg hover:bg-gray-100" onClick={() => { setEditingId(profile.id); setNewName(profile.name); setNewAvatar(profile.avatar); }}
                    title="Sửa">
                    <Edit3 size={16} style={{ color: 'var(--color-text-light)' }} />
                  </button>
                  {profile.id !== 'default' && (
                    confirmDelete === profile.id ? (
                      <div className="flex gap-1 items-center">
                        <button className="p-2 rounded-lg bg-red-50" onClick={() => deleteProfile(profile.id)} title="Xác nhận xóa">
                          <Check size={16} style={{ color: '#DC2626' }} />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100" onClick={() => setConfirmDelete(null)} title="Hủy">
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button className="p-2 rounded-lg hover:bg-red-50" onClick={() => setConfirmDelete(profile.id)}
                        title="Xóa hồ sơ">
                        <Trash2 size={16} style={{ color: '#DC2626' }} />
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create new profile */}
      {isCreating ? (
        <div className="card w-full p-5">
          <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--color-primary)' }}>
            <UserPlus size={16} className="inline mr-1" /> Tạo hồ sơ mới
          </h3>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: 'var(--color-text-light)' }}>Tên bé</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border text-sm"
                placeholder="VD: Bé Ngọc"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                maxLength={20}
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: 'var(--color-text-light)' }}>Lớp</label>
              <div className="flex gap-2">
                {unlockedGrades.map(g => (
                  <button key={g} className="px-4 py-2 rounded-lg text-sm font-bold"
                    style={newGrade === g
                      ? { background: 'var(--color-primary)', color: 'white' }
                      : { background: 'var(--color-surface)' }}
                    onClick={() => setNewGrade(g)}>
                    {getGradeLabel(g)}
                  </button>
                ))}
              </div>
              <div className="text-xs mt-2" style={{ color: 'var(--color-text-light)' }}>
                Hồ sơ mới chỉ được chọn trong các lớp đã mở khóa: {unlockedGrades.map((grade) => getGradeLabel(grade)).join(', ')}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: 'var(--color-text-light)' }}>Avatar</label>
              <div className="flex gap-2 flex-wrap">
                {AVATARS.map(a => (
                  <button key={a} className="text-2xl p-1.5 rounded-lg" onClick={() => setNewAvatar(a)}
                    style={newAvatar === a ? { background: 'var(--color-primary-light)', outline: '2px solid var(--color-primary)' } : {}}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button className="btn-primary flex-1" onClick={createProfile} disabled={!newName.trim()}>
                <Check size={16} /> Tạo hồ sơ
              </button>
              <button className="btn-outline" onClick={() => setIsCreating(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <button
            className="btn-outline w-full"
            onClick={() => (isInternal || profiles.length < maxProfiles) && setIsCreating(true)}
            disabled={!isInternal && profiles.length >= maxProfiles}
            style={!isInternal && profiles.length >= maxProfiles ? { opacity: 0.55, cursor: 'not-allowed' } : undefined}
          >
            <UserPlus size={16} /> Thêm hồ sơ mới ({profiles.length}/{maxProfiles})
          </button>
          {!isInternal && profiles.length >= maxProfiles && (
            <div className="mt-2 text-center text-xs font-bold" style={{ color: '#92400E' }}>
              Gói hiện tại đã chạm trần số hồ sơ. Nâng cấp gói để thêm hồ sơ mới.
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="card-flat w-full p-4 text-center">
        <Users size={16} className="inline mr-1" style={{ color: 'var(--color-text-light)' }} />
        <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
          Mỗi hồ sơ có tiến bộ, XP, huy hiệu riêng biệt. Dữ liệu lưu trên thiết bị này.
        </span>
      </div>
    </div>
  );
}

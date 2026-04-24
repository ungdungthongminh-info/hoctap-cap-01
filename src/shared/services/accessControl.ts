export type AccessPlan = 'free' | 'standard' | 'premium';

export interface PlanLimits {
  subjects: number | 'all';
  grades: number | 'all';
  profiles: number;
  dailyChallenges: boolean;
  competition: boolean;
  avatarShop: boolean;
  smartReview: boolean;
  memoryRoom: boolean;
  parentDashboard: boolean;
  offlineMode: boolean;
  ttsVoice: boolean;
  exportData: boolean;
  noAds: boolean;
  prioritySupport: boolean;
}

const INTERNAL_BUILD = import.meta.env.VITE_INTERNAL_BUILD === 'true';
const LICENSE_KEY = 'hhk_license';
const PLAN_KEY = 'hhk_plan';
const SUB_EXPIRY_KEY = 'hhk_sub_expiry';
const SUB_STATUS_KEY = 'hhk_sub_status';
const ACTIVATION_SOURCE_KEY = 'hhk_activation_source';
const UNLOCKED_GRADES_KEY = 'hhk_unlocked_grades';
const APP_STATE_KEY = 'hhk_app_state';
const PAID_LICENSE_PATTERN = /^HHK-(STANDARD|PREMIUM)-[A-Z0-9]{8}$/;
const ALL_GRADES = [0, 1, 2, 3, 4, 5] as const;

const PLAN_LIMITS: Record<AccessPlan, PlanLimits> = {
  free: {
    subjects: 1,
    grades: 1,
    profiles: 1,
    dailyChallenges: false,
    competition: false,
    avatarShop: false,
    smartReview: false,
    memoryRoom: false,
    parentDashboard: false,
    offlineMode: false,
    ttsVoice: false,
    exportData: false,
    noAds: false,
    prioritySupport: false,
  },
  standard: {
    subjects: 'all',
    grades: 3,
    profiles: 3,
    dailyChallenges: true,
    competition: true,
    avatarShop: true,
    smartReview: true,
    memoryRoom: true,
    parentDashboard: true,
    offlineMode: true,
    ttsVoice: true,
    exportData: true,
    noAds: true,
    prioritySupport: false,
  },
  premium: {
    subjects: 'all',
    grades: 'all',
    profiles: 5,
    dailyChallenges: true,
    competition: true,
    avatarShop: true,
    smartReview: true,
    memoryRoom: true,
    parentDashboard: true,
    offlineMode: true,
    ttsVoice: true,
    exportData: true,
    noAds: true,
    prioritySupport: true,
  },
};

function hasKeyActivatedPaidPlan(planId: string, status: string | null, licenseKey: string | null, activationSource: string | null): boolean {
  if (planId === 'free') return true;
  if (status !== 'active') return false;
  if (activationSource === 'license_key') return true;
  return PAID_LICENSE_PATTERN.test((licenseKey || '').toUpperCase());
}

function normalizeAccessPlan(planId: string | null): AccessPlan {
  if (planId === 'premium') return 'premium';
  if (planId === 'standard' || planId === 'basic') return 'standard';
  return 'free';
}

export function isInternalBuild(): boolean {
  return INTERNAL_BUILD;
}

export function hasBridgeLogin(): boolean {
  return INTERNAL_BUILD;
}

export function getAccessPlan(): AccessPlan {
  if (INTERNAL_BUILD) return 'premium';

  const status = localStorage.getItem(SUB_STATUS_KEY);
  const expiry = localStorage.getItem(SUB_EXPIRY_KEY);
  const planId = localStorage.getItem(PLAN_KEY) || 'free';
  const licenseKey = localStorage.getItem(LICENSE_KEY);
  const activationSource = localStorage.getItem(ACTIVATION_SOURCE_KEY);

  if (!hasKeyActivatedPaidPlan(planId, status, licenseKey, activationSource)) {
    return 'free';
  }

  if (planId !== 'free' && status === 'active' && expiry && new Date(expiry).getTime() < Date.now()) {
    return 'free';
  }

  return normalizeAccessPlan(planId);
}

export function hasRequiredPlan(requiredPlan: AccessPlan): boolean {
  if (INTERNAL_BUILD) return true;

  const currentPlan = getAccessPlan();
  const rank: Record<AccessPlan, number> = {
    free: 0,
    standard: 1,
    premium: 2,
  };

  return rank[currentPlan] >= rank[requiredPlan];
}

function getCurrentStudentGradeFallback(): number {
  try {
    const raw = localStorage.getItem(APP_STATE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    const grade = Number(parsed?.student?.grade);
    return ALL_GRADES.includes(grade as (typeof ALL_GRADES)[number]) ? grade : 1;
  } catch {
    return 1;
  }
}

function normalizeUnlockedGrades(grades: number[], maxCount: number | 'all', fallbackGrade: number): number[] {
  const normalized = grades
    .map((grade) => Number(grade))
    .filter((grade, index, list) => list.indexOf(grade) === index)
    .filter((grade) => ALL_GRADES.includes(grade as (typeof ALL_GRADES)[number]));

  if (maxCount === 'all') {
    return [...ALL_GRADES];
  }

  const withFallback = normalized.length > 0 ? normalized : [fallbackGrade];
  return withFallback.slice(0, maxCount);
}

export function getGradeSlotsForPlan(plan: AccessPlan = getAccessPlan()): number | 'all' {
  if (INTERNAL_BUILD || plan === 'premium') return 'all';
  if (plan === 'standard') return 3;
  return 1;
}

export function getPlanLimits(plan: AccessPlan = getAccessPlan()): PlanLimits {
  if (INTERNAL_BUILD) return PLAN_LIMITS.premium;
  return PLAN_LIMITS[plan];
}

export function getUnlockedGrades(currentGrade = getCurrentStudentGradeFallback(), plan: AccessPlan = getAccessPlan()): number[] {
  const slots = getGradeSlotsForPlan(plan);
  if (slots === 'all') {
    return [...ALL_GRADES];
  }

  if (plan === 'free') {
    return normalizeUnlockedGrades([currentGrade], 1, currentGrade);
  }

  try {
    const raw = localStorage.getItem(UNLOCKED_GRADES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return normalizeUnlockedGrades(Array.isArray(parsed) ? parsed : [], slots, currentGrade);
  } catch {
    return normalizeUnlockedGrades([], slots, currentGrade);
  }
}

export function persistUnlockedGrades(grades: number[], plan: AccessPlan = getAccessPlan(), currentGrade = getCurrentStudentGradeFallback()): number[] {
  const slots = getGradeSlotsForPlan(plan);
  const normalized = normalizeUnlockedGrades(grades, slots, currentGrade);

  if (slots === 'all') {
    localStorage.removeItem(UNLOCKED_GRADES_KEY);
    return [...ALL_GRADES];
  }

  localStorage.setItem(UNLOCKED_GRADES_KEY, JSON.stringify(normalized));
  return normalized;
}

export function canAccessSubjectCode(subjectCode: string, plan: AccessPlan = getAccessPlan()): boolean {
  if (INTERNAL_BUILD || plan !== 'free') return true;
  return subjectCode === 'math';
}

export function canAccessStudentGrade(grade: number, studentGrade: number, plan: AccessPlan = getAccessPlan()): boolean {
  if (INTERNAL_BUILD) return true;
  return getUnlockedGrades(studentGrade, plan).includes(grade);
}

export function canAccessLesson(
  lesson: { grade: number; subjectCode: string },
  student: { grade: number },
  plan: AccessPlan = getAccessPlan(),
): boolean {
  if (INTERNAL_BUILD || plan !== 'free') return true;
  return canAccessSubjectCode(lesson.subjectCode, plan) && canAccessStudentGrade(lesson.grade, student.grade, plan);
}

export function getMaxProfilesForCurrentPlan(): number {
  return getPlanLimits().profiles;
}

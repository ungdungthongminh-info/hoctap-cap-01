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
const PAID_LICENSE_PATTERN = /^HHK-[A-Z0-9_]+-[A-Z0-9]{8}$/;
const ALL_GRADES = [0, 1, 2, 3, 4, 5] as const;
const STANDARD_YEAR_ONE_GRADE_PLAN_ALIASES = new Set([
  'standard_1year_1grade',
  'standard_1y_1grade',
  'standard_1nam_1lop',
  'standard_yearly_1grade',
  'standard_single_grade_yearly',
]);
const STANDARD_YEAR_THREE_GRADE_PLAN_ALIASES = new Set([
  'standard_1year_3grade',
  'standard_1y_3grade',
  'standard_1nam_3lop',
  'standard_yearly_3grade',
  'standard_three_grade_yearly',
  'prod_study_year',
]);

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

function normalizePlanToken(raw: string | null | undefined): string {
  return String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function isStandardYearOneGradePlanId(planId: string | null | undefined): boolean {
  const normalized = normalizePlanToken(planId);
  if (!normalized) return false;
  if (STANDARD_YEAR_ONE_GRADE_PLAN_ALIASES.has(normalized)) return true;

  const isStandardLike = normalized.includes('standard') || normalized.includes('basic');
  const hasOneGradeSignal = normalized.includes('1grade') || normalized.includes('single_grade') || normalized.includes('1lop') || normalized.includes('one_class');
  const hasYearSignal = normalized.includes('year') || normalized.includes('yearly') || normalized.includes('1y') || normalized.includes('12m') || normalized.includes('1nam');
  return isStandardLike && hasOneGradeSignal && hasYearSignal;
}

function isStandardYearThreeGradePlanId(planId: string | null | undefined): boolean {
  const normalized = normalizePlanToken(planId);
  if (!normalized) return false;
  if (STANDARD_YEAR_THREE_GRADE_PLAN_ALIASES.has(normalized)) return true;

  const isStandardLike = normalized.includes('standard') || normalized.includes('basic') || normalized.includes('study');
  const hasThreeGradeSignal = normalized.includes('3grade') || normalized.includes('three_grade') || normalized.includes('3lop') || normalized.includes('three_class');
  const hasYearSignal = normalized.includes('year') || normalized.includes('yearly') || normalized.includes('1y') || normalized.includes('12m') || normalized.includes('1nam');
  return isStandardLike && hasThreeGradeSignal && hasYearSignal;
}

function getStoredPlanId(): string {
  return localStorage.getItem(PLAN_KEY) || 'free';
}

function normalizeAccessPlan(planId: string | null): AccessPlan {
  if (planId === 'premium') return 'premium';
  if (isStandardYearOneGradePlanId(planId)) return 'standard';
  if (isStandardYearThreeGradePlanId(planId)) return 'standard';
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
  if (plan === 'standard' && isStandardYearOneGradePlanId(getStoredPlanId())) return 1;
  if (plan === 'standard') return 3;
  return 1;
}

export function getPlanLimits(plan: AccessPlan = getAccessPlan()): PlanLimits {
  if (INTERNAL_BUILD) return PLAN_LIMITS.premium;
  if (plan === 'standard' && isStandardYearOneGradePlanId(getStoredPlanId())) {
    return {
      ...PLAN_LIMITS.standard,
      grades: 1,
      profiles: 2,
    };
  }
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
    const savedArray = Array.isArray(parsed) ? parsed : [];
    
    // If the user has more grades saved than the default plan slots (e.g. leaf_grade1_12m grants [0,1]),
    // we should trust the saved array because it was set by persistUnlockedGrades from an entitlement.
    const actualSlots = savedArray.length > (slots as number) ? savedArray.length : slots;
    return normalizeUnlockedGrades(savedArray, actualSlots, currentGrade);
  } catch {
    return normalizeUnlockedGrades([], slots, currentGrade);
  }
}

export function persistUnlockedGrades(grades: number[], plan: AccessPlan = getAccessPlan(), currentGrade = getCurrentStudentGradeFallback()): number[] {
  const slots = getGradeSlotsForPlan(plan);
  // If entitlement explicitly grants multiple grades, unlock ALL of them — don't slice by slot limit
  // For example, leaf_grade1_12m bundle grants allowedGrades=[0,1] meaning Lớp Lá + Lớp 1
  // The slot limit should only restrict when user is selecting grades, not when product grants multiple
  const normalized = normalizeUnlockedGrades(grades, slots, currentGrade);

  if (slots === 'all') {
    localStorage.removeItem(UNLOCKED_GRADES_KEY);
    return [...ALL_GRADES];
  }

  // IMPORTANT FIX: When product grants multiple grades in allowedGrades (e.g. [0,1]),
  // unlock ALL of them even if plan type is "one-grade plan".
  // The one-grade plan slot limit applies to selection UI, not to product entitlements.
  if (grades.length > 1 && normalized.length === 1) {
    // Product grants multiple grades but slot limit sliced it - restore all entitlement grades
    const productGrades = grades
      .filter(g => ALL_GRADES.includes(g as (typeof ALL_GRADES)[number]))
      .sort((a, b) => a - b);
    if (productGrades.length > 0) {
      localStorage.setItem(UNLOCKED_GRADES_KEY, JSON.stringify(productGrades));
      return productGrades;
    }
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
  if (INTERNAL_BUILD) return true;
  if (plan === 'standard' && isStandardYearOneGradePlanId(getStoredPlanId())) {
    return canAccessSubjectCode(lesson.subjectCode, plan) && canAccessStudentGrade(lesson.grade, student.grade, plan);
  }
  if (plan !== 'free') return true;
  return canAccessSubjectCode(lesson.subjectCode, plan) && canAccessStudentGrade(lesson.grade, student.grade, plan);
}

export function getMaxProfilesForCurrentPlan(): number {
  return getPlanLimits().profiles;
}

/**
 * Định nghĩa tất cả routes của app.
 * Mỗi page được lazy-load riêng → giảm bundle size ban đầu.
 */
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { AppLayout, FeatureGuard, LessonAccessGuard } from '@shared/components';

// ── Admin ───────────────────────────────────────────────────
const AdminDashboardPage  = lazy(() => import('@student/pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const WelcomePage         = lazy(() => import('@student/pages/WelcomePage').then(m => ({ default: m.WelcomePage })));

// ── Student pages ────────────────────────────────────────────
const HomePage             = lazy(() => import('@student/pages/HomePage').then(m => ({ default: m.HomePage })));
const SubjectPage          = lazy(() => import('@student/pages/SubjectPage').then(m => ({ default: m.SubjectPage })));
const LessonsPage          = lazy(() => import('@student/pages/LessonsPage').then(m => ({ default: m.LessonsPage })));
const LessonDetailPage     = lazy(() => import('@student/pages/LessonDetailPage').then(m => ({ default: m.LessonDetailPage })));
const PracticePage         = lazy(() => import('@student/pages/PracticePage').then(m => ({ default: m.PracticePage })));
const ResultPage           = lazy(() => import('@student/pages/ResultPage').then(m => ({ default: m.ResultPage })));
const QuizPage             = lazy(() => import('@student/pages/QuizPage').then(m => ({ default: m.QuizPage })));
const ProgressPage         = lazy(() => import('@student/pages/ProgressPage').then(m => ({ default: m.ProgressPage })));
const BadgePage            = lazy(() => import('@student/pages/BadgePage').then(m => ({ default: m.BadgePage })));
const LeaderboardPage      = lazy(() => import('@student/pages/LeaderboardPage').then(m => ({ default: m.LeaderboardPage })));
const MatchGamePage        = lazy(() => import('@student/pages/MatchGamePage').then(m => ({ default: m.MatchGamePage })));
const MiniGameHubPage      = lazy(() => import('@student/pages/MiniGameHubPage').then(m => ({ default: m.MiniGameHubPage })));
const WordScramblePage     = lazy(() => import('@student/pages/WordScramblePage').then(m => ({ default: m.WordScramblePage })));
const SpeedQuizPage        = lazy(() => import('@student/pages/SpeedQuizPage').then(m => ({ default: m.SpeedQuizPage })));
const TrueFalseBlitzPage   = lazy(() => import('@student/pages/TrueFalseBlitzPage').then(m => ({ default: m.TrueFalseBlitzPage })));
const FillBlankPage        = lazy(() => import('@student/pages/FillBlankPage').then(m => ({ default: m.FillBlankPage })));
const QuickMathRushPage    = lazy(() => import('@student/pages/QuickMathRushPage').then(m => ({ default: m.QuickMathRushPage })));
const PreGradeMiniGamesPage = lazy(() => import('@student/pages/PreGradeMiniGamesPage').then(m => ({ default: m.PreGradeMiniGamesPage })));
const DailyChallengePage   = lazy(() => import('@student/pages/DailyChallengePage').then(m => ({ default: m.DailyChallengePage })));
const DrawingPage          = lazy(() => import('@student/pages/DrawingPage').then(m => ({ default: m.DrawingPage })));
const AchievementPage      = lazy(() => import('@student/pages/AchievementPage').then(m => ({ default: m.AchievementPage })));
const TtsSettingsPage      = lazy(() => import('@student/pages/TtsSettingsPage').then(m => ({ default: m.TtsSettingsPage })));
const DesktopAudioManagementPage = lazy(() => import('@student/pages/DesktopAudioManagementPage').then(m => ({ default: m.DesktopAudioManagementPage })));
const AISettingsPage       = lazy(() => import('@student/pages/AISettingsPage').then(m => ({ default: m.AISettingsPage })));
const MemoryRoomPage       = lazy(() => import('@student/pages/MemoryRoomPage').then(m => ({ default: m.MemoryRoomPage })));
const AvatarShopPage       = lazy(() => import('@student/pages/AvatarShopPage').then(m => ({ default: m.AvatarShopPage })));
const CompetitionPage      = lazy(() => import('@student/pages/CompetitionPage').then(m => ({ default: m.CompetitionPage })));
const PwaSettingsPage      = lazy(() => import('@student/pages/PwaSettingsPage').then(m => ({ default: m.PwaSettingsPage })));
const SmartReviewPage      = lazy(() => import('@student/pages/SmartReviewPage').then(m => ({ default: m.SmartReviewPage })));
const CurriculumPage       = lazy(() => import('@student/pages/CurriculumPage').then(m => ({ default: m.CurriculumPage })));
const LearningAssistantPage = lazy(() => import('@student/pages/LearningAssistantPage').then(m => ({ default: m.LearningAssistantPage })));
const MindMapPage          = lazy(() => import('@student/pages/MindMapPage').then(m => ({ default: m.MindMapPage })));
const ProfileSwitcherPage  = lazy(() => import('@student/pages/ProfileSwitcherPage').then(m => ({ default: m.ProfileSwitcherPage })));
const PricingPage          = lazy(() => import('@student/pages/PricingPage').then(m => ({ default: m.PricingPage })));
const LicenseStatusPage     = lazy(() => import('@student/pages/LicenseStatusPage').then(m => ({ default: m.LicenseStatusPage })));
const AnalyticsDashboardPage = lazy(() => import('@student/pages/AnalyticsDashboardPage').then(m => ({ default: m.AnalyticsDashboardPage })));
const ThemePage            = lazy(() => import('@student/pages/ThemePage').then(m => ({ default: m.ThemePage })));

// ── Parent / Content ─────────────────────────────────────────
const ParentPage           = lazy(() => import('@parent/pages/ParentPage').then(m => ({ default: m.ParentPage })));
const DataPage             = lazy(() => import('@content/pages/DataPage').then(m => ({ default: m.DataPage })));

// ── Fallback UI khi đang tải trang ───────────────────────────
function PageSkeleton() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '4px solid #E5E7EB', borderTopColor: '#6366F1', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
}

interface AppRoutesProps {
  AdminGate: React.ComponentType<{ children: React.ReactNode }>;
  AdminErrorBoundary: React.ComponentType<{ children: React.ReactNode }>;
}

function LessonDetailRouteElement() {
  const { lessonId } = useParams<{ lessonId: string }>();
  return (
    <LessonAccessGuard>
      <LessonDetailPage key={`lesson-detail-${lessonId || 'unknown'}`} />
    </LessonAccessGuard>
  );
}

function LessonPracticeRouteElement() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'practice_5';

  return (
    <LessonAccessGuard>
      <PracticePage key={`lesson-practice-${lessonId || 'unknown'}-${mode}`} />
    </LessonAccessGuard>
  );
}

function LessonResultRouteElement() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [searchParams] = useSearchParams();
  const setId = searchParams.get('setId') || 'none';

  return (
    <LessonAccessGuard>
      <ResultPage key={`lesson-result-${lessonId || 'unknown'}-${setId}`} />
    </LessonAccessGuard>
  );
}

export function AppRoutes({ AdminGate, AdminErrorBoundary }: AppRoutesProps) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route
          path="/admin"
          element={
            <AdminGate>
              <AdminErrorBoundary>
                <AdminDashboardPage />
              </AdminErrorBoundary>
            </AdminGate>
          }
        />
        <Route element={<AppLayout />}>
          <Route path="/home"                element={<HomePage />} />
          <Route path="/subjects"            element={<SubjectPage />} />
          <Route path="/lessons"             element={<LessonsPage />} />
          <Route path="/lessons/:lessonId"           element={<LessonDetailRouteElement />} />
          <Route path="/lessons/:lessonId/practice"  element={<LessonPracticeRouteElement />} />
          <Route path="/lessons/:lessonId/result"    element={<LessonResultRouteElement />} />
          <Route path="/quiz"                element={<QuizPage />} />
          <Route path="/progress"            element={<FeatureGuard requiredPlan="standard" title="Tien do hoc tap dang bi khoa" description="Bang tien do chi mo tu goi Standard tro len. Hay nang cap de xem thong ke hoc tap day du hon."><ProgressPage /></FeatureGuard>} />
          <Route path="/badges"              element={<FeatureGuard requiredPlan="standard" title="Huy hieu dang bi khoa" description="Kho huy hieu day du chi mo tu goi Standard tro len. Hay kich hoat key de mo them thanh tich."><BadgePage /></FeatureGuard>} />
          <Route path="/leaderboard"         element={<FeatureGuard requiredPlan="standard" title="Bang xep hang dang bi khoa" description="Bang xep hang chi mo tu goi Standard tro len. Hay nang cap de theo doi thanh tich va thi dua."><LeaderboardPage /></FeatureGuard>} />
          <Route path="/match-game"          element={<MatchGamePage />} />
          <Route path="/mini-games"          element={<MiniGameHubPage />} />
          <Route path="/mini/word-scramble"  element={<FeatureGuard requiredPlan="standard" title="Mini-game nay dang bi khoa" description="Goi Free chi giu mini-game ghep cap co ban. Nang cap Standard hoac Premium de mo them tro choi bo sung."><WordScramblePage /></FeatureGuard>} />
          <Route path="/mini/speed-quiz"     element={<FeatureGuard requiredPlan="standard" title="Mini-game nay dang bi khoa" description="Goi Free chi giu mini-game ghep cap co ban. Nang cap Standard hoac Premium de mo them tro choi bo sung."><SpeedQuizPage /></FeatureGuard>} />
          <Route path="/mini/true-false"     element={<FeatureGuard requiredPlan="standard" title="Mini-game nay dang bi khoa" description="Goi Free chi giu mini-game ghep cap co ban. Nang cap Standard hoac Premium de mo them tro choi bo sung."><TrueFalseBlitzPage /></FeatureGuard>} />
          <Route path="/mini/fill-blank"     element={<FeatureGuard requiredPlan="standard" title="Mini-game nay dang bi khoa" description="Goi Free chi giu mini-game ghep cap co ban. Nang cap Standard hoac Premium de mo them tro choi bo sung."><FillBlankPage /></FeatureGuard>} />
          <Route path="/mini/quick-math"     element={<FeatureGuard requiredPlan="standard" title="Mini-game nay dang bi khoa" description="Goi Free chi giu mini-game ghep cap co ban. Nang cap Standard hoac Premium de mo them tro choi bo sung."><QuickMathRushPage /></FeatureGuard>} />
          <Route path="/mini/pre-grade"      element={<FeatureGuard requiredPlan="standard" title="Mini-game nay dang bi khoa" description="Goi Free chi giu mini-game ghep cap co ban. Nang cap Standard hoac Premium de mo them tro choi bo sung."><PreGradeMiniGamesPage /></FeatureGuard>} />
          <Route path="/daily"               element={<FeatureGuard requiredPlan="standard" title="Thu thach hang ngay dang bi khoa" description="Tinh nang nay chi mo khi tai khoan da co key Standard hoac Premium hop le."><DailyChallengePage /></FeatureGuard>} />
          <Route path="/drawing"             element={<FeatureGuard requiredPlan="standard" title="Ve sang tao dang bi khoa" description="Tinh nang ve sang tao nam ngoai pham vi goi Free. Nang cap Standard hoac Premium de su dung."><DrawingPage /></FeatureGuard>} />
          <Route path="/achievements"        element={<FeatureGuard requiredPlan="standard" title="Thanh tich dang bi khoa" description="Trang thanh tich chi mo tu goi Standard tro len. Hay nang cap de xem toan bo ket qua va phan thuong."><AchievementPage /></FeatureGuard>} />
          <Route path="/tts-settings"        element={<FeatureGuard requiredPlan="standard" title="Cai dat giong doc dang bi khoa" description="Cai dat TTS tra phi chi mo khi goi da duoc nang cap bang key Standard hoac Premium."><TtsSettingsPage /></FeatureGuard>} />
          <Route path="/desktop-audio"       element={<DesktopAudioManagementPage />} />
          <Route path="/ai-settings"         element={<FeatureGuard requiredPlan="standard" title="Cai dat AI dang bi khoa" description="Free khong mo man hinh cai dat AI. Hay nang cap Standard hoac Premium de cau hinh nha cung cap AI."><AISettingsPage /></FeatureGuard>} />
          <Route path="/memory"              element={<FeatureGuard requiredPlan="standard" title="Phong tri nho dang bi khoa" description="Phong tri nho thuoc goi Standard/Premium. Hay mua key tren Web Tong va kich hoat de su dung."><MemoryRoomPage /></FeatureGuard>} />
          <Route path="/avatar-shop"         element={<FeatureGuard requiredPlan="standard" title="Cua hang Avatar dang bi khoa" description="Cua hang Avatar chi duoc mo cho tai khoan da kich hoat Standard hoac Premium."><AvatarShopPage /></FeatureGuard>} />
          <Route path="/competition"         element={<FeatureGuard requiredPlan="standard" title="Tinh nang thi dau dang bi khoa" description="Thi dau Bot va PvP chi mo tu goi Standard tro len."><CompetitionPage /></FeatureGuard>} />
          <Route path="/pwa"                 element={<FeatureGuard requiredPlan="standard" title="Che do ngoai tuyen dang bi khoa" description="Goi Free khong mo man hinh cai dat offline/PWA. Nang cap Standard hoac Premium de tai va dung ngoai tuyen."><PwaSettingsPage /></FeatureGuard>} />
          <Route path="/smart-review"        element={<FeatureGuard requiredPlan="standard" title="On tap thong minh dang bi khoa" description="On tap thong minh AI chi mo cho goi Standard/Premium da kich hoat key."><SmartReviewPage /></FeatureGuard>} />
          <Route path="/mind-map"            element={<MindMapPage />} />
          <Route path="/curriculum"          element={<FeatureGuard requiredPlan="standard" title="Giao trinh nang cao dang bi khoa" description="Trang giao trinh mo rong va tuy chinh chi mo cho goi Standard tro len."><CurriculumPage /></FeatureGuard>} />
          <Route path="/learning-assistant"  element={<FeatureGuard requiredPlan="standard" title="Tro ly hoc tap dang bi khoa" description="Tro ly hoc tap mo rong chi mo tu goi Standard tro len."><LearningAssistantPage /></FeatureGuard>} />
          <Route path="/profiles"            element={<ProfileSwitcherPage />} />
          <Route path="/analytics"           element={<FeatureGuard requiredPlan="premium" title="Bao cao tien bo chi tiet dang bi khoa" description="Bao cao tien bo chi tiet la quyen loi cua goi Premium. Hay nang cap de xem phan tich hoc tap day du."><AnalyticsDashboardPage /></FeatureGuard>} />
          <Route path="/parent"              element={<FeatureGuard requiredPlan="standard" title="Bang phu huynh dang bi khoa" description="Bang dieu khien phu huynh thuoc goi Standard/Premium va can key hop le."><ParentPage /></FeatureGuard>} />
          <Route path="/data"                element={<FeatureGuard requiredPlan="standard" title="Quan ly du lieu dang bi khoa" description="Xuat nhap du lieu va sao luu thuoc goi Standard/Premium. Free chi dung du lieu mac dinh san co trong app."><DataPage /></FeatureGuard>} />
          <Route path="/themes"              element={<ThemePage />} />
        </Route>
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/license/activate" element={<Navigate to="/pricing" replace />} />
        <Route path="/license/status" element={<LicenseStatusPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

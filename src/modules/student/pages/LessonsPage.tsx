import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../shared/themes';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { getGradeLabel, getSubjectByCode } from '../../../data/subjects';
import { CheckCircle, RefreshCw, ChevronRight, Play } from 'lucide-react';
import { EmptyState, MascotCharacter } from '../../../shared/components';
import { getAccessPlan } from '../../../shared/services/accessControl';
import { getStaticAudioPackStats, getStaticPackRecommendedLabel, getStaticPackSelectedGrade } from '../../../shared/services/tts/staticAudioPack';

type Tab = 'all' | 'review' | 'done';

const GRADE_COVERAGE_OPTIONS = [
  { grade: 0, label: 'Tien tieu hoc' },
  { grade: 1, label: 'Lop 1' },
  { grade: 2, label: 'Lop 2' },
  { grade: 3, label: 'Lop 3' },
  { grade: 4, label: 'Lop 4' },
  { grade: 5, label: 'Lop 5' },
];

interface GradeCoverage {
  available: number;
  total: number;
  missing: number;
  ratio: number;
  status: 'ready' | 'partial' | 'empty' | 'unknown';
}

function toCoverageMeta(coverage?: Partial<GradeCoverage>): GradeCoverage {
  const available = Number(coverage?.available || 0);
  const total = Number(coverage?.total || 0);
  const ratio = Number(coverage?.ratio || 0);
  const missing = total > 0 ? Math.max(0, total - available) : 0;

  if (total <= 0) {
    return { available, total, missing, ratio: 0, status: 'unknown' };
  }

  if (available <= 0) {
    return { available, total, missing, ratio, status: 'empty' };
  }

  if (available >= total) {
    return { available, total, missing: 0, ratio: 100, status: 'ready' };
  }

  return { available, total, missing, ratio, status: 'partial' };
}

function toCoverageChipColor(status: GradeCoverage['status']): { bg: string; color: string } {
  if (status === 'ready') return { bg: '#DCFCE7', color: '#166534' };
  if (status === 'partial') return { bg: '#FEF3C7', color: '#92400E' };
  if (status === 'empty') return { bg: '#FEE2E2', color: '#991B1B' };
  return { bg: '#F3F4F6', color: '#4B5563' };
}

function toCoverageText(coverage: GradeCoverage): string {
  if (coverage.status === 'ready') return `Du tieng doc (${coverage.available}/${coverage.total})`;
  if (coverage.status === 'partial') return `Con thieu ${coverage.missing} bai (${coverage.available}/${coverage.total})`;
  if (coverage.status === 'empty') return `Chua co tieng doc (${coverage.available}/${coverage.total})`;
  return 'Chua co du lieu';
}

export function LessonsPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { state, getLessonProgress, getLessonQuestions, getSubjectLessons } = useAppData();
  const [tab, setTab] = useState<Tab>('all');
  const [desktopCoverageByGrade, setDesktopCoverageByGrade] = useState<Record<number, GradeCoverage>>({});
  const [webCoverage, setWebCoverage] = useState<GradeCoverage | null>(null);
  const [coverageLoading, setCoverageLoading] = useState(true);
  const hasDesktopAudioStore = typeof window !== 'undefined' && Boolean(window.electronAPI?.audioPacks);
  const currentPlan = getAccessPlan();
  const subject = getSubjectByCode(state.student.subjectCode);

  useEffect(() => {
    if (currentPlan === 'free' && state.student.subjectCode !== 'math') {
      navigate('/subjects', { replace: true });
    }
  }, [currentPlan, navigate, state.student.subjectCode]);

  useEffect(() => {
    let alive = true;

    const loadCoverage = async () => {
      setCoverageLoading(true);
      if (hasDesktopAudioStore && window.electronAPI?.audioPacks) {
        try {
          const index = await window.electronAPI.audioPacks.list();
          if (!alive) return;
          const next: Record<number, GradeCoverage> = {};
          (index.packs || []).forEach((pack) => {
            next[pack.grade] = toCoverageMeta(pack.summary?.lessonCoverage || undefined);
          });
          setDesktopCoverageByGrade(next);
          setWebCoverage(null);
        } catch {
          if (!alive) return;
          setDesktopCoverageByGrade({});
        } finally {
          if (alive) setCoverageLoading(false);
        }
        return;
      }

      try {
        const stats = await getStaticAudioPackStats();
        if (!alive) return;
        setWebCoverage(toCoverageMeta({
          available: Number(stats.downloadedEntries || 0),
          total: Number(stats.availableEntries || 0),
          ratio: Number(stats.availableEntries || 0) > 0
            ? Math.round((Number(stats.downloadedEntries || 0) * 100) / Number(stats.availableEntries || 0))
            : 0,
        }));
      } catch {
        if (!alive) return;
        setWebCoverage(null);
      } finally {
        if (alive) setCoverageLoading(false);
      }
    };

    void loadCoverage();
    return () => {
      alive = false;
    };
  }, [hasDesktopAudioStore]);

  const lessons = getSubjectLessons().map((lesson) => {
    const progress = getLessonProgress(lesson.id);
    const questionCount = getLessonQuestions(lesson.id).length;
    return { ...lesson, progress, questionCount };
  });

  const filtered = lessons.filter((lesson) => {
    if (tab === 'review') return lesson.progress?.needsReview === 1;
    if (tab === 'done') return Boolean(lesson.progress && lesson.progress.attemptCount > 0 && !lesson.progress.needsReview);
    return true;
  });

  const getMasteryBadge = (mastery: string) => {
    switch (mastery) {
      case 'mastered':
        return { label: '⭐ Giỏi lắm!', cls: 'badge-mastered' };
      case 'good':
        return { label: '👍 Tốt', cls: 'badge-good' };
      case 'learning':
        return { label: '📖 Đang học', cls: 'badge-learning' };
      default:
        return { label: '🆕 Chưa học', cls: 'badge-new' };
    }
  };

  return (
    <div className="subpage-shell fade-in">
      <div className="subpage-hero subpage-hero--lesson">
        <div className="subpage-hero__avatar"><MascotCharacter size="sm" /></div>
        <div className="subpage-hero__content">
          <div className="subpage-hero__eyebrow">{getGradeLabel(state.student.grade)}</div>
          <h1 className="subpage-hero__title" style={{ color: 'var(--color-primary-dark)' }}>
            {subject?.emoji || '📚'} {subject?.name || 'Toán'} {getGradeLabel(state.student.grade)}
          </h1>
          <p className="subpage-hero__subtitle" style={{ color: 'var(--color-text-light)' }}>
            Cùng {theme.mascotName} chinh phục {lessons.length} bài học nào!
          </p>
        </div>
        <div className="subpage-hero__meta">
          <span className="subpage-hero__pill">{lessons.length} bài</span>
          <span className="subpage-hero__pill">{filtered.length} hiển thị</span>
        </div>
      </div>

      <div className="subpage-chip-bar">
        {([
          { key: 'all' as Tab, label: `Tất cả (${lessons.length})` },
          { key: 'review' as Tab, label: `Cần ôn lại (${lessons.filter((lesson) => lesson.progress?.needsReview).length})` },
          { key: 'done' as Tab, label: `Đã học (${lessons.filter((lesson) => lesson.progress && lesson.progress.attemptCount > 0).length})` },
        ]).map((item) => (
          <button
            key={item.key}
            className="chip-tab"
            data-active={tab === item.key}
            onClick={() => setTab(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="card mb-4">
        <div className="text-sm font-bold mb-2" style={{ color: 'var(--color-primary-dark)' }}>
          Tinh trang tieng doc theo lop
        </div>

        {hasDesktopAudioStore ? (
          <>
            <div className="text-xs mb-3" style={{ color: 'var(--color-text-light)' }}>
              Ban dang dung ung dung desktop. Moi lop co trang thai rieng de phu huynh va hoc sinh nhin vao la biet lop nao da du tieng doc.
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              {GRADE_COVERAGE_OPTIONS.map((item) => {
                const coverage = desktopCoverageByGrade[item.grade] || toCoverageMeta();
                const chip = toCoverageChipColor(coverage.status);
                return (
                  <div key={item.grade} className="p-3 rounded-xl" style={{ border: '1px solid #E5E7EB', background: '#FFFFFF' }}>
                    <div className="text-sm font-bold">{item.label}</div>
                    <div className="text-xs mt-1 px-2 py-1 inline-block rounded-full" style={{ background: chip.bg, color: chip.color }}>
                      {toCoverageText(coverage)}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="text-xs mb-3" style={{ color: 'var(--color-text-light)' }}>
              Ban dang hoc tren web. Tieng doc duoc luu theo trinh duyet hien tai, khong tach rieng tung lop tren may desktop.
            </div>
            <div className="p-3 rounded-xl" style={{ border: '1px solid #E5E7EB', background: '#FFFFFF' }}>
              <div className="text-sm font-bold">{getStaticPackRecommendedLabel(getStaticPackSelectedGrade())}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-text-light)' }}>
                {webCoverage ? toCoverageText(webCoverage) : 'Chua co du lieu tieng doc da luu tren trinh duyet.'}
              </div>
            </div>
          </>
        )}

        {coverageLoading && (
          <div className="text-xs mt-2" style={{ color: 'var(--color-text-light)' }}>
            Dang cap nhat tinh trang tieng doc...
          </div>
        )}
      </div>

      <div className="lesson-list-premium">
        {filtered.length === 0 ? (
          <EmptyState
            emoji="🎉"
            title={tab === 'review' ? 'Không có bài nào cần ôn lại!' : 'Chưa có bài nào hoàn thành.'}
            description="Hãy bắt đầu học để thấy tiến bộ nhé!"
          />
        ) : (
          filtered.map((lesson, index) => {
            const badge = getMasteryBadge(lesson.progress?.masteryLevel || 'new');

            return (
              <button
                key={lesson.id}
                className="lesson-card-premium"
                onClick={() => navigate(`/lessons/${lesson.id}`)}
              >
                <div
                  className="lesson-card-index"
                  style={{ background: lesson.progress?.masteryLevel === 'mastered' ? 'var(--color-success)' : 'var(--color-primary)' }}
                >
                  {lesson.progress?.masteryLevel === 'mastered' ? <CheckCircle size={24} /> : index + 1}
                </div>

                <div className="lesson-card-body">
                  <div className="lesson-card-title" style={{ color: 'var(--color-text)' }}>
                    {lesson.title}
                  </div>
                  <div className="lesson-card-meta">
                    <span className={`badge ${badge.cls}`}>{badge.label}</span>
                    <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                      ❓ {lesson.questionCount} câu hỏi
                    </span>
                    <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                      ⏱️ {lesson.estimatedMinutes} phút
                    </span>
                    {lesson.progress && lesson.progress.attemptCount > 0 && (
                      <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                        🏆 Cao nhất: {lesson.progress.bestScore}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="lesson-card-actions">
                  <button
                    className="lesson-card-quick-btn"
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`/lessons/${lesson.id}/practice?mode=practice_5`);
                    }}
                    title="Làm bài 5 câu nhanh"
                  >
                    <Play size={14} /> Làm bài
                  </button>
                  {lesson.progress?.needsReview ? (
                    <RefreshCw size={20} style={{ color: '#DC2626' }} />
                  ) : (
                    <ChevronRight size={20} style={{ color: 'var(--color-primary)' }} />
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

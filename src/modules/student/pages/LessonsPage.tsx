import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../shared/themes';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { getGradeLabel, getSubjectByCode } from '../../../data/subjects';
import { CheckCircle, RefreshCw, ChevronRight, Play } from 'lucide-react';
import { EmptyState, MascotCharacter } from '../../../shared/components';
import { getAccessPlan } from '../../../shared/services/accessControl';

type Tab = 'all' | 'review' | 'done';

export function LessonsPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { state, getLessonProgress, getLessonQuestions, getSubjectLessons } = useAppData();
  const [tab, setTab] = useState<Tab>('all');
  const currentPlan = getAccessPlan();
  const subject = getSubjectByCode(state.student.subjectCode);

  useEffect(() => {
    if (currentPlan === 'free' && state.student.subjectCode !== 'math') {
      navigate('/subjects', { replace: true });
    }
  }, [currentPlan, navigate, state.student.subjectCode]);

  const gradeLessons = getSubjectLessons();
  const lessons = gradeLessons.map((lesson) => {
    const progress = getLessonProgress(lesson.id);
    const qCount = getLessonQuestions(lesson.id).length;
    return { ...lesson, progress, questionCount: qCount };
  });

  const filtered = lessons.filter((l) => {
    if (tab === 'review') return l.progress?.needsReview === 1;
    if (tab === 'done') return l.progress && l.progress.attemptCount > 0 && !l.progress.needsReview;
    return true;
  });

  const getMasteryBadge = (mastery: string) => {
    switch (mastery) {
      case 'mastered': return { label: '⭐ Giỏi lắm!', cls: 'badge-mastered' };
      case 'good': return { label: '👍 Tốt', cls: 'badge-good' };
      case 'learning': return { label: '📖 Đang học', cls: 'badge-learning' };
      default: return { label: '🆕 Chưa học', cls: 'badge-new' };
    }
  };

  return (
    <div className="fade-in">
      <div className="flex items-center gap-3 mb-6">
        <MascotCharacter size="sm" />
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
            {subject?.emoji || '📚'} {subject?.name || 'Toán'} {getGradeLabel(state.student.grade)}
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            Cùng {theme.mascotName} chinh phục {lessons.length} bài học nào!
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {([
          { key: 'all' as Tab, label: `Tất cả (${lessons.length})` },
          { key: 'review' as Tab, label: `Cần ôn lại (${lessons.filter(l => l.progress?.needsReview).length})` },
          { key: 'done' as Tab, label: `Đã học (${lessons.filter(l => l.progress && l.progress.attemptCount > 0).length})` },
        ]).map((t) => (
          <button
            key={t.key}
            className="chip-tab"
            data-active={tab === t.key}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Lessons list */}
      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <EmptyState
            emoji="🎉"
            title={tab === 'review' ? 'Không có bài nào cần ôn lại!' : 'Chưa có bài nào hoàn thành.'}
            description="Hãy bắt đầu học để thấy tiến bộ nhé!"
          />
        ) : (
          filtered.map((lesson, i) => {
            const badge = getMasteryBadge(lesson.progress?.masteryLevel || 'new');
            return (
              <button
                key={lesson.id}
                className="card flex items-center gap-4 cursor-pointer hover:scale-[1.01] transition-transform text-left w-full"
                onClick={() => navigate(`/lessons/${lesson.id}`)}
              >
                {/* Number */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white shrink-0"
                  style={{ background: lesson.progress?.masteryLevel === 'mastered' ? 'var(--color-success)' : 'var(--color-primary)' }}
                >
                  {lesson.progress?.masteryLevel === 'mastered' ? <CheckCircle size={24} /> : i + 1}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-base truncate" style={{ color: 'var(--color-text)' }}>
                    {lesson.title}
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
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

                {/* Arrow / review icon + direct quiz button */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    className="btn btn-primary text-xs flex items-center gap-1"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                    onClick={(e) => {
                      e.stopPropagation();
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

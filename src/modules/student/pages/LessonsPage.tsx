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

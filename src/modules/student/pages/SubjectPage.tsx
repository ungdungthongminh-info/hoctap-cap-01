import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../shared/themes';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { getGradeLabel, getSubjectsForGrade } from '../../../data/subjects';
import { BookOpen, Lock } from 'lucide-react';
import { MascotCharacter } from '../../../shared/components';
import { getAccessPlan } from '../../../shared/services/accessControl';

export function SubjectPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { state, updateStudent, getGradeLessons } = useAppData();
  const currentPlan = getAccessPlan();
  const isFreePlan = currentPlan === 'free';

  const grade = state.student.grade;
  const subjects = getSubjectsForGrade(grade);
  const allGradeLessons = getGradeLessons();
  const lessonCountBySubject = (code: string) =>
    allGradeLessons.filter((lesson) => lesson.subjectCode === code).length;

  const handleSelectSubject = (code: string) => {
    if (isFreePlan && code !== 'math') {
      navigate('/pricing');
      return;
    }

    updateStudent({ subjectCode: code });
    navigate('/lessons');
  };

  const readySubjectCount = subjects.filter(
    (subject) => subject.hasContent && lessonCountBySubject(subject.code) > 0,
  ).length;

  return (
    <div className="subpage-shell subpage-shell--compact fade-in max-w-3xl mx-auto">
      <div className="subpage-hero subpage-hero--subject">
        <div className="subpage-hero__avatar"><MascotCharacter size="sm" /></div>
        <div className="subpage-hero__content">
          <div className="subpage-hero__eyebrow">{getGradeLabel(grade)}</div>
          <h1 className="subpage-hero__title" style={{ color: 'var(--color-primary-dark)' }}>
            📚 Chọn Môn Học
          </h1>
          <p className="subpage-hero__subtitle" style={{ color: 'var(--color-text-light)' }}>
            Cùng {theme.mascotName} chọn môn muốn học nhé!
          </p>
        </div>
        <div className="subpage-hero__meta">
          <span className="subpage-hero__pill">{subjects.length} môn</span>
          <span className="subpage-hero__pill">{readySubjectCount} sẵn sàng</span>
        </div>
      </div>

      <div className="subject-grid-premium">
        {subjects.map((subject) => {
          const count = lessonCountBySubject(subject.code);
          const unlockedByPlan = !isFreePlan || subject.code === 'math';
          const available = subject.hasContent && count > 0 && unlockedByPlan;

          return (
            <button
              key={subject.code}
              className="subject-card-premium"
              data-active={state.student.subjectCode === subject.code && available}
              data-disabled={!available}
              style={{
                border: state.student.subjectCode === subject.code && available
                  ? `2px solid ${subject.color}`
                  : '2px solid transparent',
              }}
              onClick={() => available && handleSelectSubject(subject.code)}
              disabled={!available}
            >
              {!available && (
                <div className="subject-card-badge" style={{ background: '#FEF3C7', color: '#92400E' }}>
                  <Lock size={10} /> {unlockedByPlan ? 'Sắp có' : 'Standard'}
                </div>
              )}

              <div className="subject-card-icon" style={{ background: subject.bgColor }}>
                {subject.emoji}
              </div>

              <span className="subject-card-title" style={{ color: subject.color }}>
                {subject.name}
              </span>

              {available ? (
                <span className="subject-card-meta" style={{ color: 'var(--color-text-light)' }}>
                  {count} bài học
                </span>
              ) : (
                <span className="subject-card-meta" style={{ color: 'var(--color-text-light)' }}>
                  {unlockedByPlan ? 'Đang phát triển...' : 'Gói Free chỉ mở Toán'}
                </span>
              )}

              {state.student.subjectCode === subject.code && available && (
                <div className="subject-card-current" style={{ color: subject.color }}>
                  <BookOpen size={12} /> Đang học
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="subpage-info-bar card-flat">
        <span className="text-sm" style={{ color: 'var(--color-text-light)' }}>
          🎒 {getGradeLabel(grade)} · {subjects.length} môn học · {readySubjectCount} môn sẵn sàng
        </span>
        {isFreePlan && (
          <div className="mt-2 text-xs font-bold" style={{ color: '#1D4ED8' }}>
            Gói Free chỉ mở môn Toán. Nâng cấp Standard hoặc Premium để học tất cả môn.
          </div>
        )}
      </div>
    </div>
  );
}

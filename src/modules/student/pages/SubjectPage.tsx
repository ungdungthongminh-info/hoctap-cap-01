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

  // Count lessons per subject for the current grade
  const allGradeLessons = getGradeLessons();
  const lessonCountBySubject = (code: string) =>
    allGradeLessons.filter((l) => l.subjectCode === code).length;

  const handleSelectSubject = (code: string) => {
    if (isFreePlan && code !== 'math') {
      navigate('/pricing');
      return;
    }

    updateStudent({ subjectCode: code });
    navigate('/lessons');
  };

  return (
    <div className="fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <MascotCharacter size="sm" />
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
            📚 Chọn Môn Học
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            Cùng {theme.mascotName} chọn môn muốn học nhé!
          </p>
        </div>
      </div>

      {/* Subject grid */}
      <div className="grid grid-cols-2 gap-4">
        {subjects.map((subject) => {
          const count = lessonCountBySubject(subject.code);
          const unlockedByPlan = !isFreePlan || subject.code === 'math';
          const available = subject.hasContent && count > 0 && unlockedByPlan;

          return (
            <button
              key={subject.code}
              className="card flex flex-col items-center gap-3 p-6 cursor-pointer transition-all relative"
              style={{
                opacity: available ? 1 : 0.55,
                border: state.student.subjectCode === subject.code && available
                  ? `2px solid ${subject.color}`
                  : '2px solid transparent',
              }}
              onClick={() => available && handleSelectSubject(subject.code)}
              disabled={!available}
            >
              {/* Badge */}
              {!available && (
                <div
                  className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: '#FEF3C7', color: '#92400E' }}
                >
                  <Lock size={10} /> {unlockedByPlan ? 'Sắp có' : 'Standard'}
                </div>
              )}

              {/* Icon */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: subject.bgColor }}
              >
                {subject.emoji}
              </div>

              {/* Name */}
              <span className="font-bold text-lg" style={{ color: subject.color }}>
                {subject.name}
              </span>

              {/* Lesson count */}
              {available ? (
                <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                  {count} bài học
                </span>
              ) : (
                <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                  {unlockedByPlan ? 'Đang phát triển...' : 'Gói Free chỉ mở Toán'}
                </span>
              )}

              {/* Current subject indicator */}
              {state.student.subjectCode === subject.code && available && (
                <div
                  className="flex items-center gap-1 text-xs font-bold"
                  style={{ color: subject.color }}
                >
                  <BookOpen size={12} /> Đang học
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Info footer */}
      <div className="card-flat text-center mt-6">
        <span className="text-sm" style={{ color: 'var(--color-text-light)' }}>
          🎒 {getGradeLabel(grade)} · {subjects.length} môn học ·{' '}
          {subjects.filter((s) => s.hasContent && lessonCountBySubject(s.code) > 0).length} môn sẵn sàng
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

import { GraduationCap } from 'lucide-react';
import { useAppData } from '../providers/AppDataProvider';
import { getSubjectsForGrade, getGradeLabel } from '../../data/subjects';
import { getAccessPlan, getUnlockedGrades } from '../services/accessControl';

export function GlobalGradeSelector() {
  const { state, updateStudent } = useAppData();
  const grade = state.student.grade;
  const currentGradeLabel = getGradeLabel(grade);
  const unlockedGrades = getUnlockedGrades(state.student.grade, getAccessPlan());

  const lessonCountByGrade = (g: number) => state.lessons.filter((l) => l.grade === g).length;

  const handleGradeChange = (g: number) => {
    const subjectsOfGrade = getSubjectsForGrade(g);
    const firstReadySubject = subjectsOfGrade.find((s) =>
      state.lessons.some((l) => l.grade === g && l.subjectCode === s.code),
    );

    updateStudent({
      grade: g,
      subjectCode: firstReadySubject?.code || subjectsOfGrade[0]?.code || 'math',
    });
  };

  return (
    <section className="global-grade-panel mb-4">
      <div className="global-grade-panel__header">
        <h3 className="global-grade-panel__title">
          <GraduationCap size={16} /> Chọn lớp học
        </h3>
        <span className="global-grade-panel__current">Đang chọn: {currentGradeLabel}</span>
      </div>

      <div className="global-grade-panel__zones">
        <div className="global-grade-zone global-grade-zone--pre">
          <div className="global-grade-zone__label">Nhánh Tiền Tiểu Học</div>
          <button
            onClick={() => unlockedGrades.includes(0) && handleGradeChange(0)}
            className="global-grade-pill global-grade-pill--pre"
            data-active={grade === 0}
            disabled={!unlockedGrades.includes(0)}
            title={unlockedGrades.includes(0) ? 'Chuyển sang Tiền Tiểu Học (Lớp Lá)' : 'Lớp này chưa được mở khóa trong gói hiện tại'}
          >
            <span className="global-grade-pill__name">🌱 Tiền Tiểu Học (Lớp Lá)</span>
            <span className="global-grade-pill__meta">{unlockedGrades.includes(0) ? 'Làm quen chữ, số, nề nếp học tập' : 'Cần mở khóa lớp này'}</span>
          </button>
        </div>

        <div className="global-grade-zone global-grade-zone--primary">
          <div className="global-grade-zone__label">Nhánh tiểu học</div>
          <div className="global-grade-grid">
            {[1, 2, 3, 4, 5].map((g) => {
              const gradeReady = lessonCountByGrade(g) > 0;
              const unlocked = unlockedGrades.includes(g);
              const lessonCount = lessonCountByGrade(g);
              return (
                <button
                  key={g}
                  onClick={() => gradeReady && unlocked && handleGradeChange(g)}
                  className="global-grade-pill global-grade-pill--primary"
                  data-active={grade === g}
                  data-ready={gradeReady && unlocked}
                  disabled={!gradeReady || !unlocked}
                  title={!unlocked ? `${getGradeLabel(g)} chưa được mở khóa` : gradeReady ? `Chuyển sang ${getGradeLabel(g)}` : `${getGradeLabel(g)} chưa có nội dung`}
                >
                  <span className="global-grade-pill__name">{getGradeLabel(g)}</span>
                  <span className="global-grade-pill__meta">
                    {!unlocked ? 'Chưa mở khóa' : gradeReady ? `${lessonCount} bài` : 'Đang cập nhật'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

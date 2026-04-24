import { useMemo, useState } from 'react';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { getGradeLabel, getSubjectByCode } from '../../../data/subjects';
import { Lightbulb, CalendarDays, FileText, Download, Clock3, Sparkles } from 'lucide-react';

function downloadJson(fileName: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export function LearningAssistantPage() {
  const {
    state,
    getRecommendations,
    getWeaknesses,
    getWeeklyActivity,
    getAverageScore,
    getCompletedCount,
  } = useAppData();

  const [examSize, setExamSize] = useState(20);

  const currentSubject = getSubjectByCode(state.student.subjectCode);
  const subjectQuestions = useMemo(() => {
    return state.questions.filter(
      (q) => q.grade === state.student.grade && q.subjectCode === state.student.subjectCode && q.isActive,
    );
  }, [state.questions, state.student.grade, state.student.subjectCode]);

  const weeklyPlan = useMemo(() => {
    const rec = getRecommendations(state.student.grade, state.student.subjectCode, 7);
    return rec.map((r, index) => ({
      day: index + 1,
      lessonId: r.lessonId,
      reason: r.reason,
      priority: r.priority,
      message: r.message,
    }));
  }, [getRecommendations, state.student.grade, state.student.subjectCode]);

  const smartSlots = useMemo(() => {
    const hourCount = new Map<number, number>();
    for (const ps of state.practiceSets) {
      if (!ps.finishedAt) continue;
      const hour = new Date(ps.finishedAt).getHours();
      hourCount.set(hour, (hourCount.get(hour) || 0) + 1);
    }
    return [...hourCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([h, count]) => ({ hour: h, sessions: count }));
  }, [state.practiceSets]);

  const miniExam = useMemo(() => {
    const pool = [...subjectQuestions];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, examSize).map((q) => ({
      id: q.id,
      lessonId: q.lessonId,
      type: q.questionType,
      questionText: q.questionText,
      difficulty: q.difficulty,
      skillTag: q.skillTag,
    }));
  }, [subjectQuestions, examSize]);

  const weeklyReport = useMemo(() => {
    const weekly = getWeeklyActivity();
    const done = getCompletedCount();
    const avg = getAverageScore();
    const weaknesses = getWeaknesses(14);
    return {
      generatedAt: new Date().toISOString(),
      student: {
        fullName: state.student.fullName,
        grade: state.student.grade,
        subjectCode: state.student.subjectCode,
      },
      weekly,
      summary: {
        completedLessons: done,
        averageScore: avg,
        totalSessions: weekly.reduce((sum, d) => sum + d.sessions, 0),
      },
      weaknesses: weaknesses.slice(0, 8),
      topRecommendations: weeklyPlan.slice(0, 5),
    };
  }, [getAverageScore, getCompletedCount, getWeaknesses, getWeeklyActivity, state.student, weeklyPlan]);

  return (
    <div className="fade-in max-w-5xl mx-auto">
      <div className="mb-5 rounded-2xl p-4" style={{ background: 'linear-gradient(135deg,#FEF3C7,#DBEAFE)' }}>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={20} style={{ color: '#B45309' }} />
          <h1 className="text-2xl font-bold" style={{ color: '#1F2937' }}>Trợ Lý Học Tập Thông Minh</h1>
        </div>
        <p className="text-sm" style={{ color: '#374151' }}>
          Lập kế hoạch tuần, tạo bộ đề ôn và xuất báo cáo phụ huynh cho {getGradeLabel(state.student.grade).toLowerCase()} · {currentSubject?.name || 'Môn hiện tại'}.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <section className="rounded-xl border p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays size={18} />
            <h2 className="font-bold">Kế hoạch học tuần (Auto-plan)</h2>
          </div>
          <div className="space-y-2 text-sm">
            {weeklyPlan.length === 0 && <div className="text-gray-500">Chưa có đủ dữ liệu để đề xuất.</div>}
            {weeklyPlan.slice(0, 7).map((x) => (
              <div key={`${x.day}-${x.lessonId}`} className="rounded-lg px-3 py-2" style={{ background: '#F9FAFB' }}>
                Ngày {x.day}: Bài {x.lessonId} · {x.message}
              </div>
            ))}
          </div>
          <button
            className="btn btn-icon-slide assistant-action-btn assistant-action-btn--plan mt-3"
            onClick={() => downloadJson(`weekly_plan_grade_${state.student.grade}.json`, weeklyPlan)}
          >
            <Download size={14} /> Xuất kế hoạch JSON
          </button>
        </section>

        <section className="rounded-xl border p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <Clock3 size={18} />
            <h2 className="font-bold">Nhắc học thông minh</h2>
          </div>
          <p className="text-sm text-gray-600 mb-2">Khung giờ học hiệu quả dựa trên lịch sử làm bài gần đây.</p>
          <div className="space-y-2 text-sm">
            {smartSlots.length === 0 && <div className="text-gray-500">Chưa đủ dữ liệu phiên học để gợi ý khung giờ.</div>}
            {smartSlots.map((x) => (
              <div key={x.hour} className="rounded-lg px-3 py-2" style={{ background: '#ECFDF5' }}>
                {x.hour}:00 - {x.hour + 1}:00 · {x.sessions} phiên học
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <section className="rounded-xl border p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={18} />
            <h2 className="font-bold">Bộ đề ôn tự động</h2>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <label className="text-sm">Số câu:</label>
            <select
              value={examSize}
              onChange={(e) => setExamSize(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
            </select>
            <span className="text-xs text-gray-500">Kho câu hiện có: {subjectQuestions.length}</span>
          </div>
          <button
            className="btn btn-icon-slide assistant-action-btn assistant-action-btn--exam"
            onClick={() => downloadJson(`exam_grade_${state.student.grade}_${state.student.subjectCode}_${examSize}.json`, miniExam)}
          >
            <Download size={14} /> Xuất đề ôn JSON
          </button>
        </section>

        <section className="rounded-xl border p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={18} />
            <h2 className="font-bold">Báo cáo tuần cho phụ huynh</h2>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Tổng hợp tiến độ, điểm trung bình, phiên học và điểm yếu trong 14 ngày gần nhất.
          </p>
          <button
            className="btn btn-icon-slide assistant-action-btn assistant-action-btn--report"
            onClick={() => downloadJson(`weekly_report_${state.student.fullName.replace(/\s+/g, '_')}.json`, weeklyReport)}
          >
            <Download size={14} /> Xuất báo cáo JSON
          </button>
        </section>
      </div>
    </div>
  );
}

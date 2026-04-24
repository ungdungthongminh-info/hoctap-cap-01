/**
 * CurriculumPage — Học theo giáo trình
 * Hiển thị lộ trình học theo chương → bài → tiến độ
 * Tích hợp Rule Engine (gợi ý bài) + Mascot Chat (lời chào)
 */
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../shared/themes';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { getGradeLabel, getSubjectsForGrade, getSubjectByCode, type Subject } from '../../../data/subjects';
import { recommendNextLessons } from '../../../shared/services/ruleEngine';
import { getMascotGreeting } from '../../../shared/services/mascotChat';
import {
  BookOpen, Lock, CheckCircle2, AlertTriangle, Clock, ChevronRight,
  Star, RotateCcw, Sparkles, GraduationCap,
} from 'lucide-react';
import type { Lesson, StudentProgress } from '../../../data/seedData';

// ==================== HELPERS ====================

/** Nhóm bài học theo chapter (dùng sortOrder / 100 hoặc chapterIndex) */
function groupByChapter(lessons: Lesson[]): { chapter: number; title: string; lessons: Lesson[] }[] {
  const sorted = [...lessons].sort((a, b) => a.sortOrder - b.sortOrder);

  // Nhóm theo unitCode thực tế (nếu có), fallback chia mỗi 5 bài
  const groups = new Map<string, Lesson[]>();
  const unitOrder: string[] = [];

  for (const l of sorted) {
    const key = l.unitCode || `auto_${Math.floor((l.sortOrder - 1) / 5)}`;
    if (!groups.has(key)) {
      groups.set(key, []);
      unitOrder.push(key);
    }
    groups.get(key)!.push(l);
  }

  return unitOrder.map((key, idx) => {
    const lsns = groups.get(key)!;
    // Tạo tên chương từ unitCode
    const unitName = formatUnitName(key, idx + 1);
    return { chapter: idx + 1, title: unitName, lessons: lsns };
  });
}

/** Tạo tên chương hiển thị đẹp từ unitCode */
function formatUnitName(unitCode: string, chapterNum: number): string {
  if (unitCode.startsWith('auto_')) return `Chương ${chapterNum}`;
  // Chuyển snake_case/dash thành tên đọc được
  const cleaned = unitCode
    .replace(/^(C\d+_?|M\d+C\d+_?|EN\d+C\d+_?|u\d+_?)/, '') // bỏ prefix code
    .replace(/[_-]/g, ' ')
    .trim();
  if (!cleaned) return `Chương ${chapterNum}`;
  // Viết hoa chữ đầu
  return `Chương ${chapterNum}: ${cleaned.charAt(0).toUpperCase()}${cleaned.slice(1)}`;
}

/** Tính tiến độ 1 chương */
function chapterProgress(lessons: Lesson[], progress: StudentProgress[]) {
  if (lessons.length === 0) return { completed: 0, total: 0, avgScore: 0, pct: 0 };
  let completed = 0;
  let totalScore = 0;
  for (const l of lessons) {
    const p = progress.find((pr) => pr.lessonId === l.id);
    if (p && p.attemptCount > 0) {
      completed++;
      totalScore += p.bestScore;
    }
  }
  return {
    completed,
    total: lessons.length,
    avgScore: completed > 0 ? Math.round(totalScore / completed) : 0,
    pct: Math.round((completed / lessons.length) * 100),
  };
}

/** Kiểm tra bài có mở khóa không (bài trước >= 60% hoặc bài đầu) */
function isLessonUnlocked(
  lesson: Lesson,
  sortedLessons: Lesson[],
  progress: StudentProgress[],
): boolean {
  const idx = sortedLessons.findIndex((l) => l.id === lesson.id);
  if (idx <= 0) return true; // bài đầu tiên luôn mở
  const prev = sortedLessons[idx - 1];
  const prevProg = progress.find((p) => p.lessonId === prev.id);
  return !!(prevProg && (prevProg.bestScore >= 60 || prevProg.attemptCount > 0));
}

// ==================== MASTERY BADGE ====================

function MasteryBadge({ mastery, score }: { mastery: string; score: number }) {
  if (mastery === 'mastered') {
    return (
      <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
        style={{ background: '#D1FAE5', color: '#065F46' }}>
        <CheckCircle2 size={12} /> Giỏi
      </span>
    );
  }
  if (mastery === 'good') {
    return (
      <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
        style={{ background: '#DBEAFE', color: '#1E40AF' }}>
        <Star size={12} /> Tốt
      </span>
    );
  }
  if (mastery === 'learning') {
    return (
      <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
        style={{ background: score < 50 ? '#FEE2E2' : '#FEF3C7', color: score < 50 ? '#991B1B' : '#92400E' }}>
        {score < 50 ? <AlertTriangle size={12} /> : <RotateCcw size={12} />}
        {score < 50 ? 'Cần ôn' : 'Đang học'}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
      style={{ background: 'var(--color-surface)', color: 'var(--color-text-light)' }}>
      <Clock size={12} /> Chưa học
    </span>
  );
}

// ==================== MAIN COMPONENT ====================

export function CurriculumPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { state, getLessonProgress } = useAppData();

  const grade = state.student.grade;
  const subjects = getSubjectsForGrade(grade);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState(state.student.subjectCode);
  const selectedSubject = getSubjectByCode(selectedSubjectCode);

  // Bộ SGK filter
  type TextbookFilter = 'all' | 'canh_dieu' | 'ket_noi' | 'chan_troi' | 'chung';
  const [selectedTextbook, setSelectedTextbook] = useState<TextbookFilter>('all');

  const textbookOptions: { key: TextbookFilter; label: string; emoji: string }[] = [
    { key: 'all', label: 'Tất cả', emoji: '📚' },
    { key: 'canh_dieu', label: 'Cánh Diều', emoji: '🪁' },
    { key: 'ket_noi', label: 'Kết Nối Tri Thức', emoji: '🔗' },
    { key: 'chan_troi', label: 'Chân Trời Sáng Tạo', emoji: '🌅' },
    { key: 'chung', label: 'Dùng chung', emoji: '📖' },
  ];

  // Lấy bài học theo grade + subject + textbook
  const subjectLessons = useMemo(
    () => state.lessons
      .filter((l) => l.grade === grade && l.subjectCode === selectedSubjectCode && l.isActive
        && (selectedTextbook === 'all' || l.textbook === selectedTextbook || (selectedTextbook === 'chung' && (!l.textbook || l.textbook === 'chung'))))
      .sort((a, b) => a.sortOrder - b.sortOrder),
    [state.lessons, grade, selectedSubjectCode, selectedTextbook],
  );

  // Nhóm theo chương
  const chapters = useMemo(() => groupByChapter(subjectLessons), [subjectLessons]);

  // Gợi ý bài tiếp theo (rule engine)
  const recommendations = useMemo(
    () => recommendNextLessons(state.lessons, state.progress, grade, selectedSubjectCode, 3),
    [state.lessons, state.progress, grade, selectedSubjectCode],
  );
  const recommendedIds = new Set(recommendations.map((r) => r.lessonId));

  // Mascot greeting
  const greeting = useMemo(
    () => getMascotGreeting(theme.id, state.student.fullName),
    [theme.id, state.student.fullName],
  );

  // Tổng tiến độ
  const totalProgress = useMemo(() => {
    const attempted = state.progress.filter(
      (p) => subjectLessons.some((l) => l.id === p.lessonId) && p.attemptCount > 0,
    );
    return {
      completed: attempted.length,
      total: subjectLessons.length,
      pct: subjectLessons.length > 0 ? Math.round((attempted.length / subjectLessons.length) * 100) : 0,
    };
  }, [state.progress, subjectLessons]);

  const handleGoLesson = (lessonId: number) => {
    navigate(`/lessons/${lessonId}`);
  };

  // Subject tabs
  const handleSubjectChange = (sub: Subject) => {
    setSelectedSubjectCode(sub.code);
  };

  return (
    <div className="fade-in max-w-4xl mx-auto">
      {/* Header + Mascot Greeting */}
      <div className="flex items-start gap-3 mb-6">
        <span className={`mascot mascot-sm mascot-${greeting.animation || 'wave'}`}>
          {greeting.emoji}
        </span>
        <div className="flex-1">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
            📖 Giáo Trình Học Tập
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-light)' }}>
            {greeting.text}
          </p>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="flex gap-2 flex-wrap mb-4">
        {subjects.map((sub) => {
          const isSelected = sub.code === selectedSubjectCode;
          const lessonCount = state.lessons.filter(
            (l) => l.grade === grade && l.subjectCode === sub.code,
          ).length;
          if (lessonCount === 0) return null;

          return (
            <button
              key={sub.code}
              onClick={() => handleSubjectChange(sub)}
              className="chip-tab"
              data-active={isSelected}
              style={{
                background: isSelected ? sub.color : 'var(--color-surface)',
                color: isSelected ? 'white' : sub.color,
                borderColor: isSelected ? sub.color : 'transparent',
              }}
            >
              <span>{sub.emoji}</span>
              <span>{sub.name}</span>
              <span className="text-xs opacity-80">({lessonCount})</span>
            </button>
          );
        })}
      </div>

      {/* Textbook Filter (SGK) */}
      <div className="card mb-4">
        <h3 className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: 'var(--color-text-light)' }}>
          <BookOpen size={14} /> Bộ sách giáo khoa
        </h3>
        <div className="flex gap-2 flex-wrap">
          {textbookOptions.map((tb) => {
            const isActive = selectedTextbook === tb.key;
            return (
              <button
                key={tb.key}
                onClick={() => setSelectedTextbook(tb.key)}
                className="chip-tab chip-tab-sm"
                data-active={isActive}
                style={{
                  background: isActive ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: isActive ? '#FFF' : 'var(--color-text)',
                  borderColor: isActive ? 'var(--color-primary)' : 'transparent',
                }}
              >
                {tb.emoji} {tb.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--color-primary-dark)' }}>
            <GraduationCap size={16} />
            {getGradeLabel(grade)} · {selectedSubject?.emoji} {selectedSubject?.name}
          </span>
          <span className="text-sm font-bold" style={{ color: selectedSubject?.color || 'var(--color-primary)' }}>
            {totalProgress.completed}/{totalProgress.total} bài ({totalProgress.pct}%)
          </span>
        </div>
        <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'var(--color-surface)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${totalProgress.pct}%`,
              background: selectedSubject?.color || 'var(--color-primary)',
            }}
          />
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="card mb-6" style={{ borderLeft: `4px solid ${selectedSubject?.color || 'var(--color-primary)'}` }}>
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-primary-dark)' }}>
            <Sparkles size={16} /> Gợi ý cho con
          </h3>
          <div className="flex flex-col gap-2">
            {recommendations.map((rec) => (
              <button
                key={rec.lessonId}
                onClick={() => handleGoLesson(rec.lessonId)}
                className="flex items-center gap-3 p-2 rounded-lg text-left transition-all hover:opacity-80"
                style={{ background: 'var(--color-surface)' }}
              >
                <span className="text-lg">
                  {rec.reason === 'needs_review' ? '🔄' : rec.reason === 'spaced_review' ? '📅' : '✨'}
                </span>
                <span className="flex-1 text-sm" style={{ color: 'var(--color-text)' }}>
                  {rec.message}
                </span>
                <ChevronRight size={16} style={{ color: 'var(--color-text-light)' }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No lessons state */}
      {subjectLessons.length === 0 && (
        <div className="card text-center py-12">
          <span className="text-4xl block mb-3">📭</span>
          <p className="font-bold" style={{ color: 'var(--color-text)' }}>Chưa có bài học</p>
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            Nội dung {getGradeLabel(grade).toLowerCase()} · {selectedSubject?.name} đang được phát triển
          </p>
        </div>
      )}

      {/* Chapters */}
      {chapters.map((chapter) => {
        const cp = chapterProgress(chapter.lessons, state.progress);

        return (
          <div key={chapter.chapter} className="mb-6">
            {/* Chapter Header */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--color-primary-dark)' }}>
                <BookOpen size={18} style={{ color: selectedSubject?.color }} />
                {chapter.title}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                  {cp.completed}/{cp.total} bài
                </span>
                <div className="w-20 h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-surface)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${cp.pct}%`, background: selectedSubject?.color || 'var(--color-primary)' }}
                  />
                </div>
              </div>
            </div>

            {/* Lesson Cards */}
            <div className="flex flex-col gap-2">
              {chapter.lessons.map((lesson, idx) => {
                const prog = getLessonProgress(lesson.id);
                const unlocked = isLessonUnlocked(lesson, subjectLessons, state.progress);
                const isRecommended = recommendedIds.has(lesson.id);
                const mastery = prog?.masteryLevel || 'new';
                const score = prog?.bestScore || 0;
                const attempted = (prog?.attemptCount || 0) > 0;

                return (
                  <button
                    key={lesson.id}
                    onClick={() => unlocked && handleGoLesson(lesson.id)}
                    disabled={!unlocked}
                    className="card flex items-center gap-3 p-4 transition-all text-left relative"
                    style={{
                      opacity: unlocked ? 1 : 0.5,
                      border: isRecommended
                        ? `2px solid ${selectedSubject?.color || 'var(--color-primary)'}`
                        : '2px solid transparent',
                    }}
                  >
                    {/* Step number */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                      style={{
                        background: attempted
                          ? (mastery === 'mastered' ? '#D1FAE5' : mastery === 'good' ? '#DBEAFE' : '#FEF3C7')
                          : 'var(--color-surface)',
                        color: attempted
                          ? (mastery === 'mastered' ? '#065F46' : mastery === 'good' ? '#1E40AF' : '#92400E')
                          : 'var(--color-text-light)',
                      }}
                    >
                      {!unlocked ? <Lock size={16} /> : attempted ? (
                        mastery === 'mastered' ? <CheckCircle2 size={18} /> : `${idx + 1}`
                      ) : `${idx + 1}`}
                    </div>

                    {/* Lesson info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm truncate" style={{ color: 'var(--color-text)' }}>
                          {lesson.title}
                        </span>
                        {isRecommended && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full font-bold shrink-0"
                            style={{ background: selectedSubject?.bgColor, color: selectedSubject?.color }}>
                            ✨ Gợi ý
                          </span>
                        )}
                        {lesson.textbook && lesson.textbook !== 'chung' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0"
                            style={{ background: 'var(--color-surface)', color: 'var(--color-text-light)' }}>
                            {lesson.textbook === 'canh_dieu' ? '🪁 CĐ' : lesson.textbook === 'ket_noi' ? '🔗 KN' : '🌅 CT'}
                          </span>
                        )}
                      </div>
                      {attempted && (
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                            Điểm cao nhất: {score}%
                          </span>
                          <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                            · {prog?.attemptCount} lần
                          </span>
                        </div>
                      )}
                      {!unlocked && (
                        <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                          🔒 Hoàn thành bài trước để mở khóa
                        </span>
                      )}
                    </div>

                    {/* Mastery badge + arrow */}
                    <div className="flex items-center gap-2 shrink-0">
                      <MasteryBadge mastery={mastery} score={score} />
                      {unlocked && <ChevronRight size={16} style={{ color: 'var(--color-text-light)' }} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Footer info */}
      {subjectLessons.length > 0 && (
        <div className="card-flat text-center mt-4 mb-8">
          <span className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            🎒 {getGradeLabel(grade)} · {selectedSubject?.emoji} {selectedSubject?.name} · {subjectLessons.length} bài ·{' '}
            {totalProgress.completed} đã học
          </span>
        </div>
      )}
    </div>
  );
}

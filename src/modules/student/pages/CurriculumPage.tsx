import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../shared/themes';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { getGradeLabel, getSubjectsForGrade, getSubjectByCode, type Subject } from '../../../data/subjects';
import { recommendNextLessons } from '../../../shared/services/ruleEngine';
import { getMascotGreeting } from '../../../shared/services/mascotChat';
import {
  BookOpen,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  Star,
  RotateCcw,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import type { Lesson, StudentProgress } from '../../../data/seedData';

function groupByChapter(lessons: Lesson[]): { chapter: number; title: string; lessons: Lesson[] }[] {
  const sorted = [...lessons].sort((a, b) => a.sortOrder - b.sortOrder);
  const groups = new Map<string, Lesson[]>();
  const unitOrder: string[] = [];

  for (const lesson of sorted) {
    const key = lesson.unitCode || `auto_${Math.floor((lesson.sortOrder - 1) / 5)}`;
    if (!groups.has(key)) {
      groups.set(key, []);
      unitOrder.push(key);
    }
    groups.get(key)?.push(lesson);
  }

  return unitOrder.map((key, idx) => {
    const groupedLessons = groups.get(key) || [];
    return {
      chapter: idx + 1,
      title: formatUnitName(key, idx + 1),
      lessons: groupedLessons,
    };
  });
}

function formatUnitName(unitCode: string, chapterNum: number): string {
  if (unitCode.startsWith('auto_')) return `Chương ${chapterNum}`;

  const cleaned = unitCode
    .replace(/^(C\d+_?|M\d+C\d+_?|EN\d+C\d+_?|u\d+_?)/, '')
    .replace(/[_-]/g, ' ')
    .trim();

  if (!cleaned) return `Chương ${chapterNum}`;
  return `Chương ${chapterNum}: ${cleaned.charAt(0).toUpperCase()}${cleaned.slice(1)}`;
}

function chapterProgress(lessons: Lesson[], progress: StudentProgress[]) {
  if (lessons.length === 0) return { completed: 0, total: 0, avgScore: 0, pct: 0 };

  let completed = 0;
  let totalScore = 0;
  for (const lesson of lessons) {
    const current = progress.find((pr) => pr.lessonId === lesson.id);
    if (current && current.attemptCount > 0) {
      completed++;
      totalScore += current.bestScore;
    }
  }

  return {
    completed,
    total: lessons.length,
    avgScore: completed > 0 ? Math.round(totalScore / completed) : 0,
    pct: Math.round((completed / lessons.length) * 100),
  };
}

function isLessonUnlocked(
  lesson: Lesson,
  sortedLessons: Lesson[],
  progress: StudentProgress[],
): boolean {
  const idx = sortedLessons.findIndex((l) => l.id === lesson.id);
  if (idx <= 0) return true;

  const previousLesson = sortedLessons[idx - 1];
  const previousProgress = progress.find((p) => p.lessonId === previousLesson.id);
  return !!(previousProgress && (previousProgress.bestScore >= 60 || previousProgress.attemptCount > 0));
}

function MasteryBadge({ mastery, score }: { mastery: string; score: number }) {
  if (mastery === 'mastered') {
    return (
      <span
        className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
        style={{ background: '#D1FAE5', color: '#065F46' }}
      >
        <CheckCircle2 size={12} /> Giỏi
      </span>
    );
  }

  if (mastery === 'good') {
    return (
      <span
        className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
        style={{ background: '#DBEAFE', color: '#1E40AF' }}
      >
        <Star size={12} /> Tốt
      </span>
    );
  }

  if (mastery === 'learning') {
    return (
      <span
        className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
        style={{ background: score < 50 ? '#FEE2E2' : '#FEF3C7', color: score < 50 ? '#991B1B' : '#92400E' }}
      >
        {score < 50 ? <AlertTriangle size={12} /> : <RotateCcw size={12} />}
        {score < 50 ? 'Cần ôn' : 'Đang học'}
      </span>
    );
  }

  return (
    <span
      className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
      style={{ background: 'var(--color-surface)', color: 'var(--color-text-light)' }}
    >
      <Clock size={12} /> Chưa học
    </span>
  );
}

export function CurriculumPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { state, getLessonProgress } = useAppData();

  const grade = state.student.grade;
  const subjects = getSubjectsForGrade(grade);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState(state.student.subjectCode);
  const selectedSubject = getSubjectByCode(selectedSubjectCode);

  type TextbookFilter = 'all' | 'canh_dieu' | 'ket_noi' | 'chan_troi' | 'chung';
  const [selectedTextbook, setSelectedTextbook] = useState<TextbookFilter>('all');

  const textbookOptions: { key: TextbookFilter; label: string; emoji: string }[] = [
    { key: 'all', label: 'Tất cả', emoji: '📚' },
    { key: 'canh_dieu', label: 'Cánh Diều', emoji: '🪁' },
    { key: 'ket_noi', label: 'Kết Nối Tri Thức', emoji: '🔗' },
    { key: 'chan_troi', label: 'Chân Trời Sáng Tạo', emoji: '🌅' },
    { key: 'chung', label: 'Dùng chung', emoji: '📖' },
  ];

  const subjectLessons = useMemo(
    () => state.lessons
      .filter((lesson) => (
        lesson.grade === grade
        && lesson.subjectCode === selectedSubjectCode
        && lesson.isActive
        && (
          selectedTextbook === 'all'
          || lesson.textbook === selectedTextbook
          || (selectedTextbook === 'chung' && (!lesson.textbook || lesson.textbook === 'chung'))
        )
      ))
      .sort((a, b) => a.sortOrder - b.sortOrder),
    [state.lessons, grade, selectedSubjectCode, selectedTextbook],
  );

  const chapters = useMemo(() => groupByChapter(subjectLessons), [subjectLessons]);

  const recommendations = useMemo(
    () => recommendNextLessons(state.lessons, state.progress, grade, selectedSubjectCode, 3),
    [state.lessons, state.progress, grade, selectedSubjectCode],
  );
  const recommendedIds = new Set(recommendations.map((r) => r.lessonId));

  const greeting = useMemo(
    () => getMascotGreeting(theme.id, state.student.fullName),
    [theme.id, state.student.fullName],
  );

  const totalProgress = useMemo(() => {
    const attempted = state.progress.filter(
      (progress) => subjectLessons.some((lesson) => lesson.id === progress.lessonId) && progress.attemptCount > 0,
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

  const handleSubjectChange = (subject: Subject) => {
    setSelectedSubjectCode(subject.code);
  };

  return (
    <div className="subpage-shell subpage-shell--wide fade-in max-w-4xl mx-auto">
      <div className="subpage-hero subpage-hero--curriculum">
        <div className="subpage-hero__avatar curriculum-hero-avatar">
          <span className={`mascot mascot-sm mascot-${greeting.animation || 'wave'}`}>
            {greeting.emoji}
          </span>
        </div>
        <div className="subpage-hero__content">
          <div className="subpage-hero__eyebrow">
            {getGradeLabel(grade)} · {selectedSubject?.emoji} {selectedSubject?.name}
          </div>
          <h1 className="subpage-hero__title" style={{ color: 'var(--color-primary-dark)' }}>
            📖 Giáo Trình Học Tập
          </h1>
          <p className="subpage-hero__subtitle" style={{ color: 'var(--color-text-light)' }}>
            {greeting.text}
          </p>
        </div>
        <div className="subpage-hero__meta">
          <span className="subpage-hero__pill">{chapters.length} chương</span>
          <span className="subpage-hero__pill">{totalProgress.completed}/{totalProgress.total} bài</span>
        </div>
      </div>

      <div className="subpage-chip-bar">
        {subjects.map((subject) => {
          const isSelected = subject.code === selectedSubjectCode;
          const lessonCount = state.lessons.filter(
            (lesson) => lesson.grade === grade && lesson.subjectCode === subject.code,
          ).length;
          if (lessonCount === 0) return null;

          return (
            <button
              key={subject.code}
              onClick={() => handleSubjectChange(subject)}
              className="chip-tab"
              data-active={isSelected}
              style={{
                background: isSelected ? subject.color : 'var(--color-surface)',
                color: isSelected ? '#FFFFFF' : subject.color,
                borderColor: isSelected ? subject.color : 'transparent',
              }}
            >
              <span>{subject.emoji}</span>
              <span>{subject.name}</span>
              <span className="text-xs opacity-80">({lessonCount})</span>
            </button>
          );
        })}
      </div>

      <div className="curriculum-filter-panel subpage-panel">
        <h3 className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: 'var(--color-text-light)' }}>
          <BookOpen size={14} /> Bộ sách giáo khoa
        </h3>
        <div className="curriculum-filter-group">
          {textbookOptions.map((textbook) => {
            const isActive = selectedTextbook === textbook.key;

            return (
              <button
                key={textbook.key}
                onClick={() => setSelectedTextbook(textbook.key)}
                className="chip-tab chip-tab-sm"
                data-active={isActive}
                style={{
                  background: isActive ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: isActive ? '#FFF' : 'var(--color-text)',
                  borderColor: isActive ? 'var(--color-primary)' : 'transparent',
                }}
              >
                {textbook.emoji} {textbook.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="curriculum-progress-panel subpage-panel">
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

      {recommendations.length > 0 && (
        <div className="subpage-panel" style={{ borderLeft: `4px solid ${selectedSubject?.color || 'var(--color-primary)'}` }}>
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-primary-dark)' }}>
            <Sparkles size={16} /> Gợi ý cho con
          </h3>
          <div className="curriculum-recommend-list">
            {recommendations.map((rec) => (
              <button
                key={rec.lessonId}
                onClick={() => handleGoLesson(rec.lessonId)}
                className="curriculum-recommend-btn"
                style={{ background: 'var(--color-surface)' }}
              >
                <span className="text-lg">
                  {rec.reason === 'needs_review' ? '🔄' : rec.reason === 'spaced_review' ? '🕒' : '✨'}
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

      {subjectLessons.length === 0 && (
        <div className="curriculum-empty-state subpage-panel">
          <span className="text-4xl block mb-3">📭</span>
          <p className="font-bold" style={{ color: 'var(--color-text)' }}>Chưa có bài học</p>
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            Nội dung {getGradeLabel(grade).toLowerCase()} · {selectedSubject?.name} đang được phát triển
          </p>
        </div>
      )}

      {chapters.map((chapter) => {
        const progress = chapterProgress(chapter.lessons, state.progress);

        return (
          <section key={chapter.chapter} className="curriculum-chapter-panel subpage-panel">
            <div className="curriculum-chapter-header">
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--color-primary-dark)' }}>
                <BookOpen size={18} style={{ color: selectedSubject?.color }} />
                {chapter.title}
              </h2>
              <div className="curriculum-chapter-track">
                <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                  {progress.completed}/{progress.total} bài
                </span>
                <div className="w-20 h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-surface)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${progress.pct}%`,
                      background: selectedSubject?.color || 'var(--color-primary)',
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="curriculum-lesson-list">
              {chapter.lessons.map((lesson, idx) => {
                const lessonProgress = getLessonProgress(lesson.id);
                const unlocked = isLessonUnlocked(lesson, subjectLessons, state.progress);
                const isRecommended = recommendedIds.has(lesson.id);
                const mastery = lessonProgress?.masteryLevel || 'new';
                const score = lessonProgress?.bestScore || 0;
                const attempted = (lessonProgress?.attemptCount || 0) > 0;

                return (
                  <button
                    key={lesson.id}
                    onClick={() => unlocked && handleGoLesson(lesson.id)}
                    disabled={!unlocked}
                    className="curriculum-lesson-card"
                    data-locked={!unlocked}
                    style={{
                      opacity: unlocked ? 1 : 0.5,
                      border: isRecommended
                        ? `2px solid ${selectedSubject?.color || 'var(--color-primary)'}`
                        : '2px solid transparent',
                    }}
                  >
                    <div
                      className="curriculum-lesson-index"
                      style={{
                        background: attempted
                          ? (mastery === 'mastered' ? '#D1FAE5' : mastery === 'good' ? '#DBEAFE' : '#FEF3C7')
                          : 'var(--color-surface)',
                        color: attempted
                          ? (mastery === 'mastered' ? '#065F46' : mastery === 'good' ? '#1E40AF' : '#92400E')
                          : 'var(--color-text-light)',
                      }}
                    >
                      {!unlocked ? <Lock size={16} /> : attempted && mastery === 'mastered' ? <CheckCircle2 size={18} /> : `${idx + 1}`}
                    </div>

                    <div className="curriculum-lesson-body">
                      <div className="curriculum-lesson-title-row">
                        <span className="font-bold text-sm truncate" style={{ color: 'var(--color-text)' }}>
                          {lesson.title}
                        </span>
                        {isRecommended && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded-full font-bold shrink-0"
                            style={{ background: selectedSubject?.bgColor, color: selectedSubject?.color }}
                          >
                            ✨ Gợi ý
                          </span>
                        )}
                        {lesson.textbook && lesson.textbook !== 'chung' && (
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0"
                            style={{ background: 'var(--color-surface)', color: 'var(--color-text-light)' }}
                          >
                            {lesson.textbook === 'canh_dieu' ? '🪁 CĐ' : lesson.textbook === 'ket_noi' ? '🔗 KN' : '🌅 CT'}
                          </span>
                        )}
                      </div>

                      {attempted && (
                        <div className="curriculum-lesson-meta">
                          <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                            Điểm cao nhất: {score}%
                          </span>
                          <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                            · {lessonProgress?.attemptCount} lần
                          </span>
                        </div>
                      )}

                      {!unlocked && (
                        <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                          🔒 Hoàn thành bài trước để mở khóa
                        </span>
                      )}
                    </div>

                    <div className="curriculum-lesson-actions">
                      <MasteryBadge mastery={mastery} score={score} />
                      {unlocked && <ChevronRight size={16} style={{ color: 'var(--color-text-light)' }} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      {subjectLessons.length > 0 && (
        <div className="subpage-info-bar card-flat mb-8">
          <span className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            🎒 {getGradeLabel(grade)} · {selectedSubject?.emoji} {selectedSubject?.name} · {subjectLessons.length} bài · {totalProgress.completed} đã học
          </span>
        </div>
      )}
    </div>
  );
}

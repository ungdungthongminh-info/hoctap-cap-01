import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { Play, Zap, BookOpen, Trophy, Shuffle } from 'lucide-react';
import { MascotCharacter } from '../../../shared/components';
import { canAccessLesson, getAccessPlan } from '../../../shared/services/accessControl';

type Mode = 'practice_5' | 'practice_10' | 'practice_15' | 'practice_20' | 'practice_25';

const modes: { key: Mode; label: string; desc: string; icon: string; count: number }[] = [
  { key: 'practice_5', label: '5 câu', desc: 'Nhanh gọn', icon: '⚡', count: 5 },
  { key: 'practice_10', label: '10 câu', desc: 'Vừa phải', icon: '📝', count: 10 },
  { key: 'practice_15', label: '15 câu', desc: 'Thử thách', icon: '🔥', count: 15 },
  { key: 'practice_20', label: '20 câu', desc: 'Nâng cao', icon: '⭐', count: 20 },
  { key: 'practice_25', label: '25 câu', desc: 'Tất cả', icon: '🏆', count: 25 },
];

export function QuizPage() {
  const navigate = useNavigate();
  const { state, getLessonProgress, getLessonQuestions, getSubjectLessons } = useAppData();
  const currentPlan = getAccessPlan();

  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [selectedMode, setSelectedMode] = useState<Mode>('practice_5');

  const gradeLessons = getSubjectLessons().filter((lesson) => canAccessLesson(lesson, state.student, currentPlan));
  const lessons = gradeLessons.map((l) => {
    const progress = getLessonProgress(l.id);
    const qCount = getLessonQuestions(l.id).length;
    return { ...l, progress, questionCount: qCount };
  });

  const totalQuestions = lessons.reduce((sum, l) => sum + l.questionCount, 0);

  const handleStart = () => {
    if (!selectedLesson) return;
    navigate(`/lessons/${selectedLesson}/practice?mode=${selectedMode}`);
  };

  const handleQuickRandom = () => {
    // Chọn ngẫu nhiên 1 bài có câu hỏi
    const available = lessons.filter((l) => l.questionCount > 0);
    if (available.length === 0) return;
    const random = available[Math.floor(Math.random() * available.length)];
    navigate(`/lessons/${random.id}/practice?mode=practice_5`);
  };

  return (
    <div className="fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <MascotCharacter size="sm" />
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
            🎯 Luyện Tập
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            {totalQuestions} câu hỏi đang chờ con chinh phục!
          </p>
        </div>
      </div>

      {/* Quick start - random quiz */}
      <button
        className="card w-full flex items-center gap-4 cursor-pointer hover:scale-[1.01] transition-transform mb-6"
        style={{ background: 'var(--color-gradient-start)', borderLeft: '4px solid var(--color-primary)' }}
        onClick={handleQuickRandom}
      >
        <div className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: 'var(--color-primary)', color: 'white' }}>
          <Shuffle size={28} />
        </div>
        <div className="flex-1">
          <div className="font-bold text-lg" style={{ color: 'var(--color-primary-dark)' }}>
            ⚡ Luyện tập ngẫu nhiên
          </div>
          <div className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            Hệ thống chọn ngẫu nhiên 1 bài — 5 câu nhanh!
          </div>
        </div>
        <Play size={24} style={{ color: 'var(--color-primary)' }} />
      </button>

      {/* Step 1: Chọn bài */}
      <div className="card mb-4">
        <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-primary-dark)' }}>
          <BookOpen size={18} /> Bước 1: Chọn bài học
        </h3>
        <div className="grid gap-2">
          {lessons.map((lesson) => {
            const isSelected = selectedLesson === lesson.id;
            const mastery = lesson.progress?.masteryLevel || 'new';
            const masteryEmoji: Record<string, string> = {
              mastered: '⭐', good: '👍', learning: '📖', new: '🆕',
            };

            return (
              <button
                key={lesson.id}
                className="flex items-center gap-3 p-3 rounded-xl text-left w-full transition-all"
                style={{
                  background: isSelected ? 'var(--color-surface)' : 'white',
                  border: isSelected ? '2px solid var(--color-primary)' : '2px solid transparent',
                  boxShadow: isSelected ? '0 0 0 2px var(--color-primary-light)' : 'none',
                }}
                onClick={() => setSelectedLesson(lesson.id)}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold text-white shrink-0"
                  style={{ background: isSelected ? 'var(--color-primary)' : 'var(--color-primary-light)' }}
                >
                  {lesson.sortOrder}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate" style={{ color: 'var(--color-text)' }}>
                    {lesson.title}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs" style={{ color: 'var(--color-text-light)' }}>
                    <span>{masteryEmoji[mastery]} {mastery === 'new' ? 'Chưa học' : mastery === 'learning' ? 'Đang học' : mastery === 'good' ? 'Tốt' : 'Giỏi'}</span>
                    <span>• {lesson.questionCount} câu</span>
                    {lesson.progress && lesson.progress.bestScore > 0 && (
                      <span>• 🏆 {lesson.progress.bestScore}%</span>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--color-primary)', color: 'white' }}>
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Chọn số câu */}
      <div className="card mb-6">
        <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-primary-dark)' }}>
          <Zap size={18} /> Bước 2: Chọn số câu
        </h3>
        <div className="flex gap-3">
          {modes.map((m) => {
            const isSelected = selectedMode === m.key;
            return (
              <button
                key={m.key}
                className="chip-card flex-1 p-4 rounded-xl text-center font-bold"
                style={{
                  background: isSelected ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: isSelected ? 'white' : 'var(--color-text)',
                  border: isSelected ? '2px solid var(--color-primary-dark)' : '2px solid transparent',
                }}
                data-active={isSelected}
                onClick={() => setSelectedMode(m.key)}
              >
                <div className="text-2xl mb-1">{m.icon}</div>
                <div className="text-lg">{m.label}</div>
                <div className="text-xs opacity-80">{m.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Start button */}
      <div className="text-center">
        <button
          className="btn btn-primary text-lg flex items-center gap-3 mx-auto"
          style={{
            padding: '16px 48px',
            fontSize: '18px',
            opacity: selectedLesson ? 1 : 0.5,
          }}
          disabled={!selectedLesson}
          onClick={handleStart}
        >
          <Play size={22} />
          {selectedLesson ? 'Bắt đầu luyện tập!' : 'Chọn bài học trước nhé'}
        </button>
      </div>

      {/* Stats footer */}
      {state.practiceSets.length > 0 && (
        <div className="card-flat mt-6 text-center">
          <div className="flex justify-center gap-6">
            <div>
              <div className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                {state.practiceSets.filter((ps) => ps.finishedAt).length}
              </div>
              <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Lần đã làm</div>
            </div>
            <div>
              <div className="text-xl font-bold" style={{ color: 'var(--color-success)' }}>
                <Trophy size={16} className="inline mr-1" />
                {Math.max(...state.practiceSets.filter((ps) => ps.score != null).map((ps) => ps.score!), 0)}%
              </div>
              <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Điểm cao nhất</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

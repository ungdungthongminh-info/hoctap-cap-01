import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { ArrowLeft, Play, BookOpen, Lightbulb, HelpCircle, Star, Volume2, VolumeX } from 'lucide-react';
import { speakText, stopSpeaking, isSpeaking } from '../../../shared/utils/sounds';
import { MascotCharacter } from '../../../shared/components';
import { canAccessLesson, getAccessPlan } from '../../../shared/services/accessControl';

const cardTypeIcon: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  intro: { icon: <BookOpen size={20} />, color: '#2563EB', bg: '#DBEAFE' },
  explain: { icon: <Lightbulb size={20} />, color: '#D97706', bg: '#FEF3C7' },
  example: { icon: <Star size={20} />, color: '#059669', bg: '#D1FAE5' },
  tip: { icon: <Lightbulb size={20} />, color: '#7C3AED', bg: '#EDE9FE' },
  mini_check: { icon: <HelpCircle size={20} />, color: '#DC2626', bg: '#FEE2E2' },
};

const cardTypeLabel: Record<string, string> = {
  intro: 'Giới thiệu',
  explain: 'Giải thích',
  example: 'Ví dụ',
  tip: 'Mẹo hay',
  mini_check: 'Kiểm tra nhanh',
};

export function LessonDetailPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { state, getLessonCards, getLessonQuestions, getLessonProgress } = useAppData();
  const [speakingCardId, setSpeakingCardId] = useState<number | null>(null);

  // Stop speaking when leaving page
  useEffect(() => () => stopSpeaking(), []);

  // Poll speaking state to update button
  useEffect(() => {
    if (speakingCardId === null) return;
    const interval = setInterval(() => {
      if (!isSpeaking()) setSpeakingCardId(null);
    }, 300);
    return () => clearInterval(interval);
  }, [speakingCardId]);

  const handleSpeak = (cardId: number, text: string) => {
    if (speakingCardId === cardId) {
      stopSpeaking();
      setSpeakingCardId(null);
    } else {
      const lang = state.student.subjectCode === 'english' ? 'en' : 'vi';
      speakText(text, lang);
      setSpeakingCardId(cardId);
    }
  };

  const id = Number(lessonId);
  const isHydrating = state.lessons.length === 0;
  const lesson = state.lessons.find((l) => l.id === id);
  const currentPlan = getAccessPlan();
  const lessonAccessible = lesson ? canAccessLesson(lesson, state.student, currentPlan) : false;
  const cards = getLessonCards(id);
  const questionCount = getLessonQuestions(id).length;
  const progress = getLessonProgress(id);

  useEffect(() => {
    if (isHydrating) return;
    if (!lesson) return;
    if (lessonAccessible) return;
    navigate('/subjects', { replace: true });
  }, [isHydrating, lesson, lessonAccessible, navigate]);

  if (isHydrating) {
    return (
      <div className="fade-in text-center py-20">
        <span className="text-4xl block mb-4">⏳</span>
        <p style={{ color: 'var(--color-text-light)' }}>Đang nạp dữ liệu bài học...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="fade-in text-center py-20">
        <span className="text-6xl block mb-4">😵</span>
        <p style={{ color: 'var(--color-text-light)' }}>Không tìm thấy bài học này.</p>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/lessons')}>
          Quay lại danh sách
        </button>
      </div>
    );
  }

  if (!lessonAccessible) {
    return (
      <div className="fade-in text-center py-20">
        <span className="text-4xl block mb-4">⏳</span>
        <p style={{ color: 'var(--color-text-light)' }}>Đang chuyển về danh sách môn học...</p>
      </div>
    );
  }

  return (
    <div className="fade-in max-w-3xl mx-auto">
      {/* Header */}
      <button
        className="flex items-center gap-2 mb-4 text-sm hover:underline"
        style={{ color: 'var(--color-primary)' }}
        onClick={() => navigate('/lessons')}
      >
        <ArrowLeft size={16} /> Quay lại danh sách
      </button>

      <div className="card mb-6">
        <div className="flex items-start gap-4">
          <MascotCharacter size="sm" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
              {lesson.title}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-light)' }}>
              {lesson.objective}
            </p>
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                📋 {cards.length} thẻ nội dung
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                ❓ {questionCount} câu hỏi
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                ⏱️ {lesson.estimatedMinutes} phút
              </span>
              {progress && progress.attemptCount > 0 && (
                <span className="text-xs font-bold" style={{ color: 'var(--color-success)' }}>
                  🏆 Cao nhất: {progress.bestScore}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lesson cards */}
      <div className="grid gap-4 mb-6">
        {cards.map((card, i) => {
          const ct = cardTypeIcon[card.cardType] || cardTypeIcon.intro;
          return (
            <div key={card.id} className="card" style={{ borderLeft: `4px solid ${ct.color}` }}>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: ct.bg, color: ct.color }}
                >
                  {ct.icon}
                </div>
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: ct.color }}>
                  {cardTypeLabel[card.cardType] || card.cardType}
                </span>
                <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                  ({i + 1}/{cards.length})
                </span>
                <span className="flex-1" />
                <button
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg hover:opacity-80 transition-colors"
                  style={{
                    background: speakingCardId === card.id ? 'var(--color-primary)' : ct.bg,
                    color: speakingCardId === card.id ? 'white' : ct.color,
                  }}
                  onClick={() => handleSpeak(card.id, `${card.title}. ${card.content}`)}
                  title={speakingCardId === card.id ? 'Dừng đọc' : 'Đọc bài'}
                >
                  {speakingCardId === card.id ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  {speakingCardId === card.id ? 'Dừng' : 'Đọc'}
                </button>
              </div>
              <div
                className="text-base leading-relaxed whitespace-pre-line"
                style={{ color: 'var(--color-text)' }}
              >
                {card.content}
              </div>
            </div>
          );
        })}
      </div>

      {/* Practice buttons */}
      <div className="card text-center">
        <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--color-primary-dark)' }}>
          🎯 Sẵn sàng luyện tập?
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-light)' }}>
          Chọn số câu hỏi rồi bắt đầu nào!
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          {[
            { mode: 'practice_5', label: '5 câu', desc: 'Thử nhanh', icon: '⚡' },
            { mode: 'practice_10', label: '10 câu', desc: 'Vừa phải', icon: '📝' },
            { mode: 'practice_15', label: '15 câu', desc: 'Thử thách', icon: '🔥' },
            { mode: 'practice_20', label: '20 câu', desc: 'Nâng cao', icon: '⭐' },
            { mode: 'practice_25', label: '25 câu', desc: 'Tất cả', icon: '🏆' },
          ].map((opt) => (
            <button
              key={opt.mode}
              className="btn btn-primary flex items-center gap-2 text-base"
              style={{ padding: '12px 24px' }}
              onClick={() => navigate(`/lessons/${id}/practice?mode=${opt.mode}`)}
              disabled={questionCount === 0}
            >
              <Play size={18} />
              <span>{opt.icon} {opt.label}</span>
            </button>
          ))}
        </div>
        {questionCount === 0 && (
          <p className="text-sm mt-3" style={{ color: '#DC2626' }}>
            Bài này chưa có câu hỏi.
          </p>
        )}
      </div>
    </div>
  );
}

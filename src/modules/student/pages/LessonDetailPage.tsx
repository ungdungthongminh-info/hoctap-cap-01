import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Download, HelpCircle, Lightbulb, Play, Star, Volume2, VolumeX } from 'lucide-react';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { getTtsCacheMode, prefetchText, speakTextAsync, stopSpeaking } from '../../../shared/utils/sounds';
import { MascotCharacter } from '../../../shared/components';
import { canAccessLesson, getAccessPlan } from '../../../shared/services/accessControl';
import { buildLessonCardAssetKey } from '../../../shared/services/tts/ttsAssetKeys';
import { buildLessonCardNarrationText } from '../../../shared/services/tts/ttsNarration';

type LessonCardAudioState = 'idle' | 'loading' | 'ready' | 'playing';

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

const audioStateMeta: Record<LessonCardAudioState, { label: string; bg: string; color: string }> = {
  idle: { label: 'Chưa có audio', bg: '#F3F4F6', color: '#6B7280' },
  loading: { label: 'Đang tạo', bg: '#FEF3C7', color: '#B45309' },
  ready: { label: 'Đã sẵn sàng', bg: '#D1FAE5', color: '#047857' },
  playing: { label: 'Đang phát', bg: '#DBEAFE', color: '#1D4ED8' },
};

export function LessonDetailPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { state, getLessonCards, getLessonQuestions, getLessonProgress } = useAppData();
  const [speakingCardId, setSpeakingCardId] = useState<number | null>(null);
  const [cardStatuses, setCardStatuses] = useState<Record<number, LessonCardAudioState>>({});
  const [isReadingAll, setIsReadingAll] = useState(false);
  const [isPrefetching, setIsPrefetching] = useState(false);
  const runRef = useRef(0);

  const id = Number(lessonId);
  const isHydrating = state.lessons.length === 0;
  const lesson = state.lessons.find((item) => item.id === id);
  const currentPlan = getAccessPlan();
  const lessonAccessible = lesson ? canAccessLesson(lesson, state.student, currentPlan) : false;
  const cards = getLessonCards(id);
  const cardsKey = cards.map((card) => `${card.id}:${card.title}`).join('|');
  const questionCount = getLessonQuestions(id).length;
  const progress = getLessonProgress(id);
  const lang = state.student.subjectCode === 'english' ? 'en' : 'vi';

  const setCardStatus = useCallback((cardId: number, status: LessonCardAudioState) => {
    setCardStatuses((prev) => (prev[cardId] === status ? prev : { ...prev, [cardId]: status }));
  }, []);

  const resetPlaybackState = useCallback(() => {
    runRef.current += 1;
    stopSpeaking();
    setSpeakingCardId(null);
    setIsReadingAll(false);
    setCardStatuses((prev) => {
      const next: Record<number, LessonCardAudioState> = { ...prev };
      Object.keys(next).forEach((rawId) => {
        if (next[Number(rawId)] === 'playing') {
          next[Number(rawId)] = 'ready';
        }
      });
      return next;
    });
  }, []);

  const prefetchCard = useCallback(async (card: { id: number; title: string; content: string }) => {
    setCardStatus(card.id, 'loading');
    const result = await prefetchText(buildLessonCardNarrationText(card), lang, {
      policy: 'lesson-prefetch',
      assetKey: buildLessonCardAssetKey(card.id),
    });
    setCardStatus(card.id, result.status === 'prefetched' ? 'ready' : 'idle');
    return result;
  }, [lang, setCardStatus]);

  const prefetchAll = useCallback(async () => {
    if (isPrefetching || cards.length === 0) return;
    setIsPrefetching(true);
    try {
      for (const card of cards) {
        await prefetchCard(card);
      }
    } finally {
      setIsPrefetching(false);
    }
  }, [cards, isPrefetching, prefetchCard]);

  useEffect(() => {
    return () => {
      runRef.current += 1;
      stopSpeaking();
    };
  }, []);

  useEffect(() => {
    setSpeakingCardId(null);
    setIsReadingAll(false);
    setIsPrefetching(false);
    setCardStatuses((prev) => {
      const next: Record<number, LessonCardAudioState> = {};
      cards.forEach((card) => {
        next[card.id] = prev[card.id] === 'ready' ? 'ready' : 'idle';
      });
      return next;
    });
  }, [cardsKey]);

  useEffect(() => {
    if (getTtsCacheMode() !== 'aggressive' || cards.length === 0) return;

    let cancelled = false;
    setIsPrefetching(true);

    void (async () => {
      for (const card of cards) {
        if (cancelled) return;
        setCardStatus(card.id, 'loading');
        const result = await prefetchText(buildLessonCardNarrationText(card), lang, {
          policy: 'lesson-prefetch',
          assetKey: buildLessonCardAssetKey(card.id),
        });
        if (cancelled) return;
        setCardStatus(card.id, result.status === 'prefetched' ? 'ready' : 'idle');
      }
      if (!cancelled) {
        setIsPrefetching(false);
      }
    })();

    return () => {
      cancelled = true;
      setIsPrefetching(false);
    };
  }, [cardsKey, lang, setCardStatus]);

  useEffect(() => {
    if (isHydrating) return;
    if (!lesson) return;
    if (lessonAccessible) return;
    navigate('/subjects', { replace: true });
  }, [isHydrating, lesson, lessonAccessible, navigate]);

  const playCard = useCallback(async (card: { id: number; title: string; content: string }) => {
    if (speakingCardId === card.id && !isReadingAll) {
      resetPlaybackState();
      setCardStatus(card.id, cardStatuses[card.id] === 'ready' ? 'ready' : 'idle');
      return;
    }

    resetPlaybackState();
    runRef.current += 1;
    const currentRun = runRef.current;
    setSpeakingCardId(card.id);

    const result = await speakTextAsync(buildLessonCardNarrationText(card), lang, {
      policy: 'lesson-read-all',
      assetKey: buildLessonCardAssetKey(card.id),
      onStatusChange: (status) => {
        if (currentRun !== runRef.current) return;
        if (status === 'loading' || status === 'fallback-native') {
          setCardStatus(card.id, 'loading');
        } else if (status === 'playing') {
          setCardStatus(card.id, 'playing');
        } else if (status === 'error') {
          setCardStatus(card.id, 'idle');
        }
      },
    });

    if (currentRun !== runRef.current) return;
    setSpeakingCardId(null);
    setCardStatus(card.id, result.provider === 'static-manifest' || result.provider === 'google-cloud' ? 'ready' : 'idle');
  }, [cardStatuses, isReadingAll, lang, resetPlaybackState, setCardStatus, speakingCardId]);

  const readAllCards = useCallback(async () => {
    if (isReadingAll) {
      resetPlaybackState();
      return;
    }

    if (cards.length === 0) return;

    resetPlaybackState();
    runRef.current += 1;
    const currentRun = runRef.current;
    setIsReadingAll(true);

    for (const card of cards) {
      if (currentRun !== runRef.current) break;

      setSpeakingCardId(card.id);
      const result = await speakTextAsync(buildLessonCardNarrationText(card), lang, {
        policy: 'lesson-read-all',
        assetKey: buildLessonCardAssetKey(card.id),
        onStatusChange: (status) => {
          if (currentRun !== runRef.current) return;
          if (status === 'loading' || status === 'fallback-native') {
            setCardStatus(card.id, 'loading');
          } else if (status === 'playing') {
            setCardStatus(card.id, 'playing');
          } else if (status === 'error') {
            setCardStatus(card.id, 'idle');
          }
        },
      });

      if (currentRun !== runRef.current || result.status === 'stopped') {
        break;
      }

      setCardStatus(card.id, result.provider === 'static-manifest' || result.provider === 'google-cloud' ? 'ready' : 'idle');
    }

    if (currentRun === runRef.current) {
      setIsReadingAll(false);
      setSpeakingCardId(null);
    }
  }, [cards, isReadingAll, lang, resetPlaybackState, setCardStatus]);

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
            <div className="flex gap-2 flex-wrap mt-4">
              <button
                className="btn btn-primary flex items-center gap-2"
                onClick={() => void readAllCards()}
                disabled={cards.length === 0}
              >
                {isReadingAll ? <VolumeX size={16} /> : <Volume2 size={16} />}
                {isReadingAll ? 'Dừng đọc cả bài' : 'Đọc cả bài'}
              </button>
              <button
                className="btn flex items-center gap-2"
                style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}
                onClick={() => void prefetchAll()}
                disabled={cards.length === 0 || isPrefetching}
              >
                <Download size={16} />
                {isPrefetching ? 'Đang tạo audio...' : 'Tạo sẵn audio'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 mb-6">
        {cards.map((card, index) => {
          const cardType = cardTypeIcon[card.cardType] || cardTypeIcon.intro;
          const audioState = audioStateMeta[cardStatuses[card.id] || 'idle'];
          const isCardPlaying = speakingCardId === card.id;

          return (
            <div key={card.id} className="card" style={{ borderLeft: `4px solid ${cardType.color}` }}>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: cardType.bg, color: cardType.color }}
                >
                  {cardType.icon}
                </div>
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: cardType.color }}>
                  {cardTypeLabel[card.cardType] || card.cardType}
                </span>
                <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                  ({index + 1}/{cards.length})
                </span>
                <span
                  className="text-[11px] px-2 py-1 rounded-full"
                  style={{ background: audioState.bg, color: audioState.color }}
                >
                  {audioState.label}
                </span>
                <span className="flex-1" />
                <button
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg hover:opacity-80 transition-colors"
                  style={{
                    background: isCardPlaying ? 'var(--color-primary)' : cardType.bg,
                    color: isCardPlaying ? 'white' : cardType.color,
                  }}
                  onClick={() => void playCard(card)}
                  title={isCardPlaying ? 'Dừng đọc' : 'Đọc thẻ này'}
                >
                  {isCardPlaying ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  {isCardPlaying ? 'Dừng' : 'Đọc'}
                </button>
              </div>
              <div className="font-bold text-lg mb-2" style={{ color: 'var(--color-primary-dark)' }}>
                {card.title}
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

      <div className="card text-center">
        <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--color-primary-dark)' }}>
          🎯 Sẵn sàng luyện tập?
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-light)' }}>
          Chọn số câu hỏi rồi bắt đầu nào!
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          {[
            { mode: 'practice_5', label: '5 câu', icon: '⚡' },
            { mode: 'practice_10', label: '10 câu', icon: '📝' },
            { mode: 'practice_15', label: '15 câu', icon: '🔥' },
            { mode: 'practice_20', label: '20 câu', icon: '⭐' },
            { mode: 'practice_25', label: '25 câu', icon: '🏆' },
          ].map((option) => (
            <button
              key={option.mode}
              className="btn btn-primary flex items-center gap-2 text-base"
              style={{ padding: '12px 24px' }}
              onClick={() => navigate(`/lessons/${id}/practice?mode=${option.mode}`)}
              disabled={questionCount === 0}
            >
              <Play size={18} />
              <span>{option.icon} {option.label}</span>
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

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Clock, AlertTriangle, Lightbulb, ArrowUp, ArrowDown, Volume2 } from 'lucide-react';
import { playCorrect, playWrong, playWarning, playFinish, playClick, speakTextAsync, getPreferredVoice } from '../../../shared/utils/sounds';
import { MascotCharacter } from '../../../shared/components';
import { canAccessLesson, getAccessPlan } from '../../../shared/services/accessControl';
import '../styles/premiumButtons.css';

// ---------------------------------------------------------------------------
// Direct R2 question audio – bypasses ttsRuntime chain (which did HEAD inspect
// before play, causing CORS block that silently stopped all playback).
// ---------------------------------------------------------------------------
const QUESTION_R2_BASE =
  'https://pub-e3dfe5c479f44fbc906aae6c475603db.r2.dev/audio/tts/assets';

function buildQuestionAudioUrl(profile: string, questionId: number | string): string {
  return `${QUESTION_R2_BASE}/${profile}/question/${questionId}.mp3`;
}

let _directQuestionAudio: HTMLAudioElement | null = null;

function stopDirectQuestionAudio() {
  if (_directQuestionAudio) {
    _directQuestionAudio.pause();
    _directQuestionAudio.src = '';
    _directQuestionAudio = null;
  }
}

function playQuestionAudioDirect(
  questionId: number | string,
  lang: 'vi' | 'en',
): Promise<{ ok: boolean; url: string; error?: string }> {
  const profile = lang === 'en' ? 'en-v1' : 'vi-v1';
  const url = buildQuestionAudioUrl(profile, questionId);
  console.info('[question-tts] play direct', { questionId, url });

  stopDirectQuestionAudio();

  return new Promise((resolve) => {
    const audio = new Audio(url);
    _directQuestionAudio = audio;

    audio.onended = () => { _directQuestionAudio = null; };
    audio.onerror = () => {
      console.error('[question-tts] play error', { questionId, url, error: audio.error });
      _directQuestionAudio = null;
      resolve({ ok: false, url, error: 'audio-load-error' });
    };

    audio.play()
      .then(() => resolve({ ok: true, url }))
      .catch((err) => {
        console.error('[question-tts] play() rejected', { questionId, url, err });
        _directQuestionAudio = null;
        resolve({ ok: false, url, error: String(err) });
      });
  });
}
// ---------------------------------------------------------------------------

type AnswerState = 'unanswered' | 'correct' | 'wrong';

export function PracticePage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { state, startPractice, submitAnswer, finishPractice, getLessonQuestions } = useAppData();

  const id = Number(lessonId);
  const isHydrating = state.lessons.length === 0;
  const mode = searchParams.get('mode') || 'practice_5';
  const lesson = state.lessons.find((l) => l.id === id);
  const currentPlan = getAccessPlan();
  const lessonAccessible = lesson ? canAccessLesson(lesson, state.student, currentPlan) : false;
  const questionLang = lesson?.subjectCode === 'english' ? 'en' : 'vi';

  // Time limit from parent settings (minutes → seconds, 0 = unlimited)
  const timeLimitSec = useMemo(() => {
    const raw = localStorage.getItem('hhk_time_limit');
    return raw ? parseInt(raw, 10) * 60 : 0;
  }, []);

  // Initialize practice set and questions once
  const [practiceSet, setPracticeSet] = useState<ReturnType<typeof startPractice> | null>(null);
  const [questions, setQuestions] = useState<ReturnType<typeof getLessonQuestions>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [timeWarning, setTimeWarning] = useState<string | null>(null);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [questionAudioPending, setQuestionAudioPending] = useState(false);
  const [questionAudioError, setQuestionAudioError] = useState<string | null>(null);
  const [answerAnim, setAnswerAnim] = useState<'shake' | 'bounce' | null>(null);
  const [answeredStates, setAnsweredStates] = useState<AnswerState[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const initKeyRef = useRef<string | null>(null);
  const autoReadCancelRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-read setting: stored in localStorage
  // Default: ON for grade-0 (pre-grade), OFF for grades 1-5
  const [autoReadEnabled, setAutoReadEnabled] = useState<boolean>(
    () => localStorage.getItem('hhk_practice_auto_read_question') === '1',
  );
  const toggleAutoRead = useCallback((val: boolean) => {
    localStorage.setItem('hhk_practice_auto_read_question', val ? '1' : '0');
    setAutoReadEnabled(val);
  }, []);

  // Reset local practice state when URL changes to avoid showing stale questions from previous lesson.
  useEffect(() => {
    initKeyRef.current = null;
    setIsInitializing(true);
    setPracticeSet(null);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswerState('unanswered');
    setAnsweredStates([]);
    setAutoSubmitted(false);
    setShowHint(false);
    setQuestionAudioPending(false);
    setQuestionAudioError(null);
  }, [id, mode]);

  useEffect(() => {
    if (isHydrating) return;
    if (!lesson) return;
    if (lessonAccessible) return;
    navigate('/subjects', { replace: true });
  }, [isHydrating, lesson, lessonAccessible, navigate]);

  // Init once
  useEffect(() => {
    if (!lesson) return;
    if (!lessonAccessible) return;

    const initKey = `${id}:${mode}`;
    if (initKeyRef.current === initKey) {
      return;
    }
    initKeyRef.current = initKey;

    const count = mode === 'practice_5' ? 5 : mode === 'practice_10' ? 10 : mode === 'practice_20' ? 20 : mode === 'practice_25' ? 25 : 15;
    const qs = getLessonQuestions(id, count);
    setQuestions(qs);

    const questionIds = qs.map((q) => q.id);
    if (questionIds.length === 0) {
      setPracticeSet(null);
      setIsInitializing(false);
      return;
    }

    try {
      const ps = startPractice(id, mode, questionIds);
      setPracticeSet(ps);
      setIsInitializing(false);
    } catch {
      navigate('/subjects', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getLessonQuestions, id, lesson, lessonAccessible, mode, navigate, startPractice]);

  // Auto-finish when time runs out
  const handleAutoFinish = useCallback(() => {
    if (!practiceSet || autoSubmitted) return;
    setAutoSubmitted(true);
    finishPractice(practiceSet.id);
    navigate(`/lessons/${id}/result?setId=${practiceSet.id}`, { replace: true });
  }, [practiceSet, autoSubmitted, finishPractice, id, navigate]);

  // Timer + time limit enforcement
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Math.floor((Date.now() - startTime) / 1000);
      setElapsed(now);
      if (timeLimitSec > 0) {
        const remaining = timeLimitSec - now;
        if (remaining <= 0) {
          clearInterval(timer);
          handleAutoFinish();
        } else if (remaining === 60) {
          setTimeWarning('⏰ Còn 1 phút!');
          playWarning();
          setTimeout(() => setTimeWarning(null), 3000);
        } else if (remaining === 30) {
          setTimeWarning('⚠️ Còn 30 giây!');
          playWarning();
          setTimeout(() => setTimeWarning(null), 3000);
        } else if (remaining === 10) {
          setTimeWarning('🔴 Còn 10 giây!');
          playWarning();
          setTimeout(() => setTimeWarning(null), 3000);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime, timeLimitSec, handleAutoFinish]);

  const remaining = timeLimitSec > 0 ? Math.max(0, timeLimitSec - elapsed) : 0;
  const isUrgent = timeLimitSec > 0 && remaining <= 30;

  const currentQuestion = questions[currentIndex];
  const total = questions.length;
  const progress = total > 0 ? ((currentIndex + (answerState !== 'unanswered' ? 1 : 0)) / total) * 100 : 0;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // Parse options for choice questions
  const options: { key: string; label: string }[] = useMemo(() => {
    if (!currentQuestion) return [];
    if (currentQuestion.questionType === 'true_false') {
      return [
        { key: 'Đúng', label: '✅ Đúng' },
        { key: 'Sai', label: '❌ Sai' },
      ];
    }
    if ((currentQuestion.questionType === 'single_choice' || currentQuestion.questionType === 'multi_choice') && currentQuestion.optionsJson) {
      try {
        const parsed = JSON.parse(currentQuestion.optionsJson);
        return parsed.map((opt: string, i: number) => ({
          key: String(opt),
          label: `${String.fromCharCode(65 + i)}. ${opt}`,
        }));
      } catch {
        return [];
      }
    }
    return [];
  }, [currentQuestion]);

  // State for ordering (sắp xếp)
  const [orderItems, setOrderItems] = useState<string[]>([]);
  // State for matching (nối cặp)
  const [matchSelected, setMatchSelected] = useState<number | null>(null);
  const [matchPairs, setMatchPairs] = useState<Record<number, number>>({});
  // State for multi_choice (chọn nhiều)
  const [multiSelected, setMultiSelected] = useState<string[]>([]);

  // Pre-grade helpers (TTS + visual)
  const isPreGrade = lesson?.grade === 0;

  const speakQuestion = useCallback(async () => {
    if (!currentQuestion) return;
    const qid = currentQuestion.id;
    const preferredEnVoice = String(getPreferredVoice('en') || '').trim();

    if (questionLang === 'en') {
      const text = String(currentQuestion.questionText || '').trim();
      if (!text) {
        setQuestionAudioError('Chưa tải được audio luyện tập');
        return;
      }

      setQuestionAudioPending(true);
      setQuestionAudioError(null);
      try {
        const playback = await speakTextAsync(text, 'en', {
          policy: 'practice-on-demand',
          mode: 'advanced',
          voiceId: preferredEnVoice || 'en-US-Neural2-F',
          allowNativeFallback: true,
          currentGrade: lesson?.grade,
        });
        if (playback.status === 'error') {
          setQuestionAudioError('Chưa tải được audio luyện tập');
          return;
        }
        setQuestionAudioError(null);
      } catch {
        setQuestionAudioError('Chưa tải được audio luyện tập');
      } finally {
        setQuestionAudioPending(false);
      }
      return;
    }

    if (!qid) {
      setQuestionAudioError('Không tìm thấy mã audio luyện tập cho câu này');
      return;
    }
    setQuestionAudioPending(true);
    setQuestionAudioError(null);
    const result = await playQuestionAudioDirect(qid, questionLang);
    setQuestionAudioPending(false);
    if (!result.ok) {
      const text = String(currentQuestion.questionText || '').trim();
      if (!text) {
        setQuestionAudioError('Chưa tải được audio luyện tập');
        return;
      }

      try {
        const fallback = await speakTextAsync(text, questionLang, {
          policy: 'practice-on-demand',
          mode: questionLang === 'en' ? 'advanced' : 'static',
          allowNativeFallback: questionLang === 'en',
          currentGrade: lesson?.grade,
        });
        if (fallback.status === 'error') {
          setQuestionAudioError('Chưa tải được audio luyện tập');
          return;
        }
        setQuestionAudioError(null);
      } catch {
        setQuestionAudioError('Chưa tải được audio luyện tập');
      }
      return;
    }
    setQuestionAudioError(null);
  }, [currentQuestion, lesson?.grade, questionLang]);

  // Set default based on grade when lesson loads OR when navigating to a new lesson
  // (hash-routing keeps component mounted, so we must react to lesson?.id changes)
  useEffect(() => {
    if (!lesson) return;
    if (localStorage.getItem('hhk_practice_auto_read_question') === null) {
      // No explicit user preference — default ON for grade 0 only
      setAutoReadEnabled(lesson.grade === 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id]);

  // Auto-read: fire when setting is ON and question changes
  useEffect(() => {
    if (!currentQuestion) return;
    if (!autoReadEnabled) return;
    if (autoReadCancelRef.current) clearTimeout(autoReadCancelRef.current);
    stopDirectQuestionAudio();
    autoReadCancelRef.current = setTimeout(() => { void speakQuestion(); }, 400);
    return () => {
      if (autoReadCancelRef.current) clearTimeout(autoReadCancelRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion?.id]);

  useEffect(() => {
    return () => {
      stopDirectQuestionAudio();
      if (autoReadCancelRef.current) clearTimeout(autoReadCancelRef.current);
    };
  }, []);

  const subjectEmoji = (code: string): string => {
    const m: Record<string, string> = {
      math: '🔢', vietnamese: '📝', ethics: '🌈',
      arts: '🎨', music: '🎵', nature: '🌿',
      pe: '⚽', science: '🔬', english: '🔤', informatics: '💻',
    };
    return m[code] || '📚';
  };

  const extractEmoji = (text: string): string => {
    const matches = text.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}★⭐]/gu);
    return matches ? matches.slice(0, 6).join(' ') : '';
  };

  // Reset extra states on question change
  useEffect(() => {
    if (!currentQuestion) return;
    if (currentQuestion.questionType === 'ordering' && currentQuestion.optionsJson) {
      try {
        const items = JSON.parse(currentQuestion.optionsJson);
        // Shuffle the items
        const shuffled = [...items].sort(() => Math.random() - 0.5);
        setOrderItems(shuffled);
      } catch { setOrderItems([]); }
    }
    setMatchSelected(null);
    setMatchPairs({});
    setMultiSelected([]);
  }, [currentQuestion?.id]);

  // Ordering: move item
  const moveOrderItem = (idx: number, dir: -1 | 1) => {
    if (answerState !== 'unanswered') return;
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= orderItems.length) return;
    playClick();
    const next = [...orderItems];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    setOrderItems(next);
  };

  // Submit ordering answer
  const handleSubmitOrder = () => {
    if (answerState !== 'unanswered') return;
    const answer = orderItems.join(',');
    const correct = submitAnswer(practiceSet!.id, currentQuestion!.id, answer);
    const result = correct ? 'correct' : 'wrong';
    setAnswerState(result);
    setAnswerAnim(correct ? 'bounce' : 'shake');
    setAnsweredStates((prev) => { const next = [...prev]; next[currentIndex] = result; return next; });
    setTimeout(() => setAnswerAnim(null), 600);
    correct ? playCorrect() : playWrong();
  };

  // Submit matching answer
  const handleSubmitMatch = () => {
    if (answerState !== 'unanswered') return;
    // Build answer string: "0-1,1-0,2-2" (left_idx-right_idx)
    const answer = Object.entries(matchPairs).sort(([a], [b]) => +a - +b).map(([l, r]) => `${l}-${r}`).join(',');
    const correct = submitAnswer(practiceSet!.id, currentQuestion!.id, answer);
    const result = correct ? 'correct' : 'wrong';
    setAnswerState(result);
    setAnswerAnim(correct ? 'bounce' : 'shake');
    setAnsweredStates((prev) => { const next = [...prev]; next[currentIndex] = result; return next; });
    setTimeout(() => setAnswerAnim(null), 600);
    correct ? playCorrect() : playWrong();
  };

  // Submit multi_choice answer
  const handleSubmitMulti = () => {
    if (answerState !== 'unanswered' || multiSelected.length === 0) return;
    const answer = [...multiSelected].sort().join(',');
    const correct = submitAnswer(practiceSet!.id, currentQuestion!.id, answer);
    const result = correct ? 'correct' : 'wrong';
    setAnswerState(result);
    setAnswerAnim(correct ? 'bounce' : 'shake');
    setAnsweredStates((prev) => { const next = [...prev]; next[currentIndex] = result; return next; });
    setTimeout(() => setAnswerAnim(null), 600);
    correct ? playCorrect() : playWrong();
  };

  // Parse matching data
  const matchData = useMemo(() => {
    if (!currentQuestion || currentQuestion.questionType !== 'matching' || !currentQuestion.optionsJson) return null;
    try {
      const data = JSON.parse(currentQuestion.optionsJson);
      return data as { left: string[]; right: string[] };
    } catch { return null; }
  }, [currentQuestion]);

  if (isHydrating) {
    return (
      <div className="fade-in text-center py-20">
        <span className="text-4xl block mb-4">⏳</span>
        <p>Đang nạp dữ liệu bài học...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="fade-in text-center py-20">
        <span className="text-6xl block mb-4">😵</span>
        <p>Không tìm thấy bài học.</p>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/lessons')}>Quay lại</button>
      </div>
    );
  }

  if (!lessonAccessible) {
    return (
      <div className="fade-in text-center py-20">
        <span className="text-4xl block mb-4">⏳</span>
        <p>Đang chuyển về danh sách môn học...</p>
      </div>
    );
  }

  if (isInitializing || (questions.length > 0 && (!practiceSet || practiceSet.lessonId !== id))) {
    return (
      <div className="fade-in text-center py-20">
        <span className="text-4xl block mb-4">⏳</span>
        <p>Đang tải câu hỏi...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="fade-in text-center py-20">
        <span className="text-6xl block mb-4">📭</span>
        <p>Bài này chưa có câu hỏi luyện tập.</p>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/lessons')}>Quay lại</button>
      </div>
    );
  }

  if (!currentQuestion || !practiceSet) {
    return (
      <div className="fade-in text-center py-20">
        <span className="text-4xl block mb-4">⏳</span>
        <p>Đang tải câu hỏi...</p>
      </div>
    );
  }

  const questionPrompt = (currentQuestion.questionText || '').trim();

  const handleSelect = (answer: string) => {
    if (answerState !== 'unanswered') return;
    setSelectedAnswer(answer);
    const correct = submitAnswer(practiceSet.id, currentQuestion.id, answer);
    const result = correct ? 'correct' : 'wrong';
    setAnswerState(result);
    setAnswerAnim(correct ? 'bounce' : 'shake');
    setAnsweredStates((prev) => { const next = [...prev]; next[currentIndex] = result; return next; });
    setTimeout(() => setAnswerAnim(null), 600);
    correct ? playCorrect() : playWrong();
  };

  const handleFillAnswer = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleSubmitFill = () => {
    if (!selectedAnswer || answerState !== 'unanswered') return;
    const correct = submitAnswer(practiceSet.id, currentQuestion.id, selectedAnswer);
    const result = correct ? 'correct' : 'wrong';
    setAnswerState(result);
    setAnswerAnim(correct ? 'bounce' : 'shake');
    setAnsweredStates((prev) => { const next = [...prev]; next[currentIndex] = result; return next; });
    setTimeout(() => setAnswerAnim(null), 600);
    correct ? playCorrect() : playWrong();
  };

  const handleNext = () => {
    if (currentIndex + 1 >= total) {
      // Finish
      finishPractice(practiceSet.id);
      playFinish();
      navigate(`/lessons/${id}/result?setId=${practiceSet.id}`, { replace: true });
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedAnswer(null);
    setAnswerState('unanswered');
    setShowHint(false);
    setAnswerAnim(null);
  };

  const handleQuit = () => {
    if (confirm('Bạn có chắc muốn thoát? Tiến trình sẽ bị mất.')) {
      navigate(`/lessons/${id}`);
    }
  };

  return (
    <div className="fade-in max-w-2xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <button className="flex items-center gap-1 text-sm hover:underline"
          style={{ color: 'var(--color-primary)' }} onClick={handleQuit}>
          <ArrowLeft size={16} /> Thoát
        </button>
        <div className="flex items-center gap-4">
          {timeLimitSec > 0 ? (
            <span
              className={`text-sm font-bold ${isUrgent ? 'time-warning-pulse' : ''}`}
              style={{ color: isUrgent ? '#DC2626' : 'var(--color-text-light)' }}
            >
              <Clock size={14} className="inline mr-1" />{formatTime(remaining)}
            </span>
          ) : (
            <span className="text-sm font-bold" style={{ color: 'var(--color-text-light)' }}>
              <Clock size={14} className="inline mr-1" />{formatTime(elapsed)}
            </span>
          )}
          <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
            {currentIndex + 1}/{total}
          </span>
        </div>
      </div>

      {/* Time warning toast */}
      {timeWarning && (
        <div className="toast-warning slide-in mb-4">
          <AlertTriangle size={16} />
          <span className="font-bold">{timeWarning}</span>
        </div>
      )}

      {/* Progress bar */}
      <div className="progress-bar mb-6">
        <div className="progress-bar-fill" style={{ width: `${progress}%`, transition: 'width 0.3s ease' }} />
      </div>

      {/* Question card */}
      <div className={`card mb-6 slide-in ${answerAnim === 'shake' ? 'animate-shake' : answerAnim === 'bounce' ? 'animate-bounce-once' : ''}`}>
        {/* Card header row */}
        <div className="flex items-center gap-2 mb-3">
          <MascotCharacter size="xs" />
          <span className="text-xs font-bold uppercase tracking-wide"
            style={{ color: 'var(--color-primary)' }}>
            Câu {currentIndex + 1}
          </span>
          <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
            • {({'single_choice':'Chọn 1 đáp án','true_false':'Đúng/Sai','fill_number':'Điền số','fill_text':'Điền chữ','ordering':'Sắp xếp','matching':'Nối cặp','multi_choice':'Chọn nhiều'} as Record<string,string>)[currentQuestion.questionType] || 'Trắc nghiệm'}
          </span>
          <span className="flex-1" />
          {answerState === 'unanswered' && currentQuestion.explanationSimple && (
            <button
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg hover:opacity-80"
              style={{ background: showHint ? '#FEF3C7' : 'transparent', color: '#D97706' }}
              onClick={() => { playClick(); setShowHint((h) => !h); }}
              title="Xem gợi ý"
            >
              <Lightbulb size={14} /> Gợi ý
            </button>
          )}
          {/* Speak button + auto-read toggle — top-right of card header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '4px' }}>
            <button
              onClick={() => void speakQuestion()}
              disabled={questionAudioPending}
              title="Nghe câu hỏi"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                height: '32px',
                padding: '0 12px',
                borderRadius: '999px',
                fontWeight: 600,
                fontSize: '13px',
                border: 'none',
                cursor: questionAudioPending ? 'default' : 'pointer',
                background: questionAudioPending
                  ? 'color-mix(in srgb, var(--color-primary-light) 30%, white)'
                  : 'var(--color-primary)',
                color: questionAudioPending ? 'var(--color-primary-dark)' : 'white',
                opacity: questionAudioPending ? 0.7 : 1,
                boxShadow: questionAudioPending ? 'none' : '0 1px 4px rgba(0,0,0,0.15)',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <Volume2 size={14} />
              {questionAudioPending ? 'Đang đọc...' : 'Nghe câu hỏi'}
            </button>
            <label
              title="Tự đọc khi sang câu mới"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                color: 'var(--color-text-light)',
                cursor: 'pointer',
                userSelect: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              <input
                type="checkbox"
                checked={autoReadEnabled}
                onChange={(e) => toggleAutoRead(e.target.checked)}
                style={{ accentColor: 'var(--color-primary)', width: '14px', height: '14px' }}
              />
              Tự đọc
            </label>
          </div>
        </div>

        {showHint && answerState === 'unanswered' && currentQuestion.explanationSimple && (
          <div className="mb-3 p-2 rounded-lg text-sm" style={{ background: '#FEF3C7', color: '#92400E' }}>
            💡 {currentQuestion.explanationSimple}
          </div>
        )}

        {/* Question text */}
        <div className="mb-4">
          <p
            className="text-lg font-semibold leading-relaxed"
            style={{ color: 'var(--color-text)' }}
          >
            {questionPrompt || 'Câu hỏi đang được cập nhật...'}
          </p>
        </div>

        {questionAudioError && (
          <div className="mb-3 p-2 rounded-lg text-sm" style={{ background: '#FEF2F2', color: '#B91C1C' }}>
            {questionAudioError}
          </div>
        )}

        {/* Grade-0: emoji visual */}
        {isPreGrade && (
          <div className="pregrade-question-visual">
            <span className="pregrade-question-emoji">
              {extractEmoji(currentQuestion.questionText) || subjectEmoji(lesson?.subjectCode || '')}
            </span>
          </div>
        )}

        {(currentQuestion.questionType === 'fill_number' || currentQuestion.questionType === 'fill_text') ? (
          <div className="flex flex-col items-center gap-4">
            <input
              type={currentQuestion.questionType === 'fill_number' ? 'text' : 'text'}
              className="premium-input text-center text-3xl font-bold px-6 py-3 w-64"
              style={{
                borderColor: answerState === 'unanswered'
                  ? 'var(--color-primary)'
                  : answerState === 'correct'
                    ? 'var(--color-success)'
                    : '#DC2626',
                color: 'var(--color-text)',
                background: answerState !== 'unanswered'
                  ? (answerState === 'correct' ? '#D1FAE5' : '#FEE2E2')
                  : 'white',
              }}
              placeholder={currentQuestion.questionType === 'fill_number' ? '?' : 'Nhap cau tra loi...'}
              value={selectedAnswer || ''}
              onChange={(event) => handleFillAnswer(event.target.value)}
              disabled={answerState !== 'unanswered'}
              autoFocus
              onKeyDown={(event) => event.key === 'Enter' && handleSubmitFill()}
            />
            {answerState === 'unanswered' && (
              <button className="btn btn-primary" onClick={handleSubmitFill} disabled={!selectedAnswer}>
                Tra loi
              </button>
            )}
          </div>
        ) : currentQuestion.questionType === 'ordering' ? (
          <div className="flex flex-col items-center gap-3">
            {orderItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 w-full max-w-md">
                <span className="text-sm font-bold w-6 text-center" style={{ color: 'var(--color-primary)' }}>{idx + 1}</span>
                <div className={`flex-1 card-flat p-3 rounded-xl text-center font-medium ${
                  answerState !== 'unanswered' ? (
                    orderItems.join(',') === currentQuestion.correctAnswer
                      ? 'answer-correct' : 'answer-wrong'
                  ) : ''
                }`} style={{ background: 'var(--color-surface)' }}>
                  {item}
                </div>
                {answerState === 'unanswered' && (
                  <div className="flex flex-col gap-1">
                    <button className="btn-icon-soft p-1.5" onClick={() => moveOrderItem(idx, -1)} disabled={idx === 0}><ArrowUp size={15} /></button>
                    <button className="btn-icon-soft p-1.5" onClick={() => moveOrderItem(idx, 1)} disabled={idx === orderItems.length - 1}><ArrowDown size={15} /></button>
                  </div>
                )}
              </div>
            ))}
            {answerState === 'unanswered' && (
              <button className="btn btn-primary mt-2" onClick={handleSubmitOrder}>Xác nhận thứ tự</button>
            )}
          </div>
        ) : currentQuestion.questionType === 'matching' && matchData ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                {matchData.left.map((item, i) => (
                  <button key={i}
                    className={`p-3 rounded-xl text-sm font-medium border-2 text-center transition-all ${
                      matchSelected === i ? 'border-blue-500 bg-blue-50' :
                      i in matchPairs ? 'border-green-400 bg-green-50 opacity-70' : 'border-gray-200'
                    }`}
                    onClick={() => { if (answerState !== 'unanswered' || i in matchPairs) return; playClick(); setMatchSelected(i); }}
                    disabled={answerState !== 'unanswered' || i in matchPairs}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {matchData.right.map((item, j) => {
                  const paired = Object.values(matchPairs).includes(j);
                  return (
                    <button key={j}
                      className={`p-3 rounded-xl text-sm font-medium border-2 text-center transition-all ${
                        paired ? 'border-green-400 bg-green-50 opacity-70' : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => {
                        if (answerState !== 'unanswered' || matchSelected === null || paired) return;
                        playClick();
                        setMatchPairs(prev => ({ ...prev, [matchSelected]: j }));
                        setMatchSelected(null);
                      }}
                      disabled={answerState !== 'unanswered' || paired}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
            {answerState === 'unanswered' && (
              <div className="flex gap-2 justify-center">
                {Object.keys(matchPairs).length > 0 && (
                  <button className="btn btn-secondary text-sm" onClick={() => { setMatchPairs({}); setMatchSelected(null); }}>Làm lại</button>
                )}
                <button className="btn btn-primary" onClick={handleSubmitMatch}
                  disabled={Object.keys(matchPairs).length < matchData.left.length}>
                  Xác nhận
                </button>
              </div>
            )}
          </div>
        ) : currentQuestion.questionType === 'multi_choice' ? (
          <div className="flex flex-col gap-3">
            <div className="grid gap-3">
              {options.map((opt) => {
                const isSelected = multiSelected.includes(opt.key);
                const correctAnswers = answerState !== 'unanswered' ? currentQuestion.correctAnswer.split(',').map(s => s.trim()) : [];
                let optClass = 'answer-option';
                if (answerState !== 'unanswered') {
                  if (correctAnswers.includes(opt.key)) optClass += ' answer-correct';
                  else if (isSelected) optClass += ' answer-wrong';
                } else if (isSelected) {
                  optClass += ' answer-selected';
                }
                return (
                  <button key={opt.key} className={optClass}
                    onClick={() => {
                      if (answerState !== 'unanswered') return;
                      playClick();
                      setMultiSelected(prev => prev.includes(opt.key) ? prev.filter(k => k !== opt.key) : [...prev, opt.key]);
                    }}
                    disabled={answerState !== 'unanswered'}
                  >
                    <span className="w-5 h-5 rounded border-2 flex items-center justify-center mr-2 shrink-0"
                      style={{ borderColor: isSelected ? 'var(--color-primary)' : '#D1D5DB', background: isSelected ? 'var(--color-primary)' : 'transparent' }}>
                      {isSelected && <CheckCircle size={14} className="text-white" />}
                    </span>
                    <span className="flex-1 text-left">{opt.label}</span>
                  </button>
                );
              })}
            </div>
            {answerState === 'unanswered' && (
              <button className="btn btn-primary self-center mt-2" onClick={handleSubmitMulti}
                disabled={multiSelected.length === 0}>
                Xác nhận ({multiSelected.length} đã chọn)
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-3">
            {options.map((opt) => {
              let optClass = 'answer-option';
              if (answerState !== 'unanswered') {
                if (opt.key === currentQuestion.correctAnswer) {
                  optClass += ' answer-correct';
                } else if (opt.key === selectedAnswer && answerState === 'wrong') {
                  optClass += ' answer-wrong';
                }
              } else if (opt.key === selectedAnswer) {
                optClass += ' answer-selected';
              }

              return (
                <button
                  key={opt.key}
                  className={optClass}
                  onClick={() => handleSelect(opt.key)}
                  disabled={answerState !== 'unanswered'}
                >
                  <span className="flex-1 text-left">{opt.label}</span>
                  {answerState !== 'unanswered' && opt.key === currentQuestion.correctAnswer && (
                    <CheckCircle size={20} style={{ color: 'var(--color-success)' }} />
                  )}
                  {answerState === 'wrong' && opt.key === selectedAnswer && (
                    <XCircle size={20} style={{ color: '#DC2626' }} />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Feedback */}
      {answerState !== 'unanswered' && (
        <div
          className="card mb-4 slide-in"
          style={{
            borderLeft: `4px solid ${answerState === 'correct' ? 'var(--color-success)' : '#DC2626'}`,
            background: answerState === 'correct' ? '#F0FDF4' : '#FEF2F2',
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            {answerState === 'correct' ? (
              <>
                <CheckCircle size={20} style={{ color: 'var(--color-success)' }} />
                <span className="font-bold" style={{ color: 'var(--color-success)' }}>Chính xác! 🎉</span>
              </>
            ) : (
              <>
                <XCircle size={20} style={{ color: '#DC2626' }} />
                <span className="font-bold" style={{ color: '#DC2626' }}>Chưa đúng rồi 😅</span>
              </>
            )}
          </div>
          {answerState === 'wrong' && (
            <p className="text-sm" style={{ color: 'var(--color-text)' }}>
              Đáp án đúng: <strong>{currentQuestion.correctAnswer}</strong>
            </p>
          )}
          {currentQuestion.explanationSimple && (
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-light)' }}>
              💡 {currentQuestion.explanationSimple}
            </p>
          )}
        </div>
      )}

      {/* Next button */}
      {answerState !== 'unanswered' && (
        <div className="text-center">
          <button className="btn btn-primary text-lg" style={{ padding: '14px 40px' }}
            onClick={handleNext}>
            {currentIndex + 1 >= total ? '🎊 Xem kết quả' : (
              <>Câu tiếp <ArrowRight size={18} className="inline ml-1" /></>
            )}
          </button>
        </div>
      )}

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mt-6 flex-wrap">
        {questions.map((_, i) => {
          const st = answeredStates[i];
          const isCurrent = i === currentIndex;
          const bg = st === 'correct' ? 'var(--color-success)' : st === 'wrong' ? '#DC2626' : isCurrent ? 'var(--color-primary)' : '#D1D5DB';
          return (
            <div
              key={i}
              className="transition-all duration-300"
              style={{
                width: isCurrent ? 12 : 8,
                height: isCurrent ? 12 : 8,
                borderRadius: '50%',
                background: bg,
                opacity: st || isCurrent ? 1 : 0.5,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}


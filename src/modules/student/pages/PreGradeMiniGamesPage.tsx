import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, PencilLine, Shapes, Sparkles, Volume2 } from 'lucide-react';
import { playCorrect, playWrong, speakText, stopSpeaking } from '../../../shared/utils/sounds';
import { countRounds, letterRounds, PRE_GRADE_FEEDBACK_TEXT, traceRounds } from '../content/preGradeMiniGameRounds';
import { buildPreGradeFeedbackAssetKey, buildPreGradePromptAssetKey, type PreGradeMode } from '../../../shared/services/tts/ttsAssetKeys';

type Mode = PreGradeMode;

export function PreGradeMiniGamesPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('letters');
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState('');
  const [done, setDone] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const rounds = useMemo(() => {
    if (mode === 'letters') return letterRounds.length;
    if (mode === 'counting') return countRounds.length;
    return traceRounds.length;
  }, [mode]);

  const resetMode = (nextMode?: Mode) => {
    if (nextMode) setMode(nextMode);
    setIdx(0);
    setScore(0);
    setSelected('');
    setDone(false);
    setIsCorrect(null);
  };

  const speakFeedback = useCallback((tone: keyof typeof PRE_GRADE_FEEDBACK_TEXT) => {
    speakText(PRE_GRADE_FEEDBACK_TEXT[tone], 'vi', {
      policy: 'feedback-short',
      assetKey: buildPreGradeFeedbackAssetKey(tone),
    });
  }, []);

  const nextRound = () => {
    if (idx + 1 >= rounds) {
      setDone(true);
      speakFeedback('completed');
      return;
    }
    setIdx((value) => value + 1);
    setSelected('');
    setIsCorrect(null);
  };

  const getPromptSpeech = useCallback(() => {
    if (done) return '';
    if (mode === 'letters') return letterRounds[idx]?.promptSpeech || '';
    if (mode === 'counting') return countRounds[idx]?.promptSpeech || '';
    return traceRounds[idx]?.promptSpeech || '';
  }, [done, idx, mode]);

  const speakCurrentPrompt = useCallback(() => {
    const text = getPromptSpeech();
    if (!text) return;
    speakText(text, 'vi', {
      policy: 'pre-grade-auto',
      assetKey: buildPreGradePromptAssetKey(mode, idx),
    });
  }, [getPromptSpeech, idx, mode]);

  useEffect(() => {
    if (done) return undefined;
    const timer = setTimeout(() => {
      speakCurrentPrompt();
    }, 220);
    return () => clearTimeout(timer);
  }, [done, mode, idx, speakCurrentPrompt]);

  useEffect(() => () => {
    stopSpeaking();
  }, []);

  const answerLetter = (value: string) => {
    if (selected || done) return;
    setSelected(value);
    const correct = value === letterRounds[idx].answer;
    setIsCorrect(correct);
    if (correct) {
      setScore((current) => current + 1);
      playCorrect();
      speakFeedback('correct');
    } else {
      playWrong();
      speakFeedback('wrong');
    }
  };

  const answerCount = (value: number) => {
    if (selected || done) return;
    setSelected(String(value));
    const correct = value === countRounds[idx].answer;
    setIsCorrect(correct);
    if (correct) {
      setScore((current) => current + 1);
      playCorrect();
      speakFeedback('correct');
    } else {
      playWrong();
      speakFeedback('wrong');
    }
  };

  const answerTrace = (value: string) => {
    if (selected || done) return;
    setSelected(value);
    const correct = value === traceRounds[idx].answer;
    setIsCorrect(correct);
    if (correct) {
      setScore((current) => current + 1);
      playCorrect();
      speakFeedback('correct');
    } else {
      playWrong();
      speakFeedback('wrong');
    }
  };

  return (
    <div className="fade-in max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <button className="btn btn-secondary p-2" onClick={() => navigate('/mini-games')}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--color-primary-dark)' }}>
            Vui Học Tiền Tiểu Học
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            Bộ game riêng cho bé lớp lá: ghép chữ, đếm nhanh, tô nét.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button className="btn btn-secondary" onClick={() => resetMode('letters')}>
          <Shapes size={14} /> Ghép chữ
        </button>
        <button className="btn btn-secondary" onClick={() => resetMode('counting')}>
          <Sparkles size={14} /> Đếm nhanh
        </button>
        <button className="btn btn-secondary" onClick={() => resetMode('tracing')}>
          <PencilLine size={14} /> Tô nét
        </button>
      </div>

      <div className="card">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-sm font-bold" style={{ color: 'var(--color-primary-dark)' }}>
            Câu {Math.min(idx + 1, rounds)}/{rounds}
          </span>
          <div className="flex items-center gap-2">
            <button className="btn btn-primary" style={{ padding: '8px 12px', fontSize: 13 }} onClick={speakCurrentPrompt}>
              <Volume2 size={14} /> Nghe lại
            </button>
            <span className="text-sm">⭐ {score}</span>
          </div>
        </div>

        {!done && mode === 'letters' && (
          <div className="pregrade-touch-area">
            <div className="pregrade-hero-image">{letterRounds[idx].image}</div>
            <p className="pregrade-hint-text">{letterRounds[idx].hint}</p>
            <div className="pregrade-options-grid">
              {letterRounds[idx].options.map((option) => (
                <button key={option.key} className="pregrade-option-card" onClick={() => answerLetter(option.key)}>
                  <span className="pregrade-option-card__icon">{option.icon}</span>
                  <span className="pregrade-option-card__label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {!done && mode === 'counting' && (
          <div className="pregrade-touch-area">
            <div className="pregrade-hero-image">{countRounds[idx].image}</div>
            <p className="pregrade-hint-text">Chạm số đúng</p>
            <div className="pregrade-options-grid">
              {countRounds[idx].options.map((option) => (
                <button key={option.key} className="pregrade-option-card" onClick={() => answerCount(option.key)}>
                  <span className="pregrade-option-card__icon">{option.icon}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {!done && mode === 'tracing' && (
          <div className="pregrade-touch-area">
            <div className="pregrade-hero-image">{traceRounds[idx].image}</div>
            <p className="pregrade-hint-text">{traceRounds[idx].pattern}</p>
            <div className="pregrade-options-grid">
              {traceRounds[idx].points.map((point) => (
                <button key={point.key} className="pregrade-option-card" onClick={() => answerTrace(point.key)}>
                  <span className="pregrade-option-card__icon">{point.icon}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {!done && selected && (
          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="text-sm font-bold" style={{ color: isCorrect ? 'var(--color-success)' : 'var(--color-error)' }}>
              {isCorrect ? 'Chính xác, giỏi lắm!' : 'Chưa đúng, mình thử tiếp nhé!'}
            </span>
            <button className="btn btn-primary" onClick={nextRound}>Tiếp theo</button>
          </div>
        )}

        {done && (
          <div className="text-center py-4">
            <CheckCircle2 size={32} style={{ color: 'var(--color-success)' }} className="mx-auto mb-2" />
            <p className="font-bold text-lg">Hoàn thành mini-game!</p>
            <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
              Bé đạt {score}/{rounds} sao.
            </p>
            <div className="flex gap-2 justify-center mt-3">
              <button className="btn btn-secondary" onClick={() => resetMode(mode)}>Chơi lại</button>
              <button className="btn btn-primary" onClick={() => navigate('/mini-games')}>Về kho game</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

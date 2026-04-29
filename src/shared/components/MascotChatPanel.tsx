import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, Settings, Sparkles, Zap, MessageCircle, BellRing, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../themes';
import { useAppData } from '../providers/AppDataProvider';
import { MascotCharacter } from './MascotCharacter';
import {
  getMascotGreeting,
  getMascotMessage,
  getMascotReviewReminder,
  getMascotWeakSkillAlert,
  type MascotMessage,
  type ChatContext,
} from '../services/mascotChat';
import {
  sendToAI,
  isAIEnabled,
  getAISettings,
} from '../services/aiChat';

interface ChatBubble {
  id: number;
  from: 'mascot' | 'user';
  text: string;
  emoji?: string;
  animation?: MascotMessage['animation'];
  isLoading?: boolean;
  suggestions?: Array<{ lessonId: number; label: string; weakPriority?: boolean }>;
}

const quickActions: { label: string; context: ChatContext; emoji: string; color: string }[] = [
  { label: 'Chào bạn!', context: 'greeting', emoji: '👋', color: '#FF9F43' },
  { label: 'Động viên mình', context: 'encourage', emoji: '💪', color: '#EE5A24' },
  { label: 'Gợi ý bài học', context: 'hint', emoji: '💡', color: '#0984E3' },
  { label: 'Nhắc ôn bài', context: 'review_remind', emoji: '📖', color: '#6C5CE7' },
  { label: 'Thử thách', context: 'daily_challenge', emoji: '🎯', color: '#00B894' },
  { label: 'Tạm biệt', context: 'goodbye', emoji: '👋', color: '#FDA7DF' },
];

// ==================== TYPING INDICATOR ====================
function TypingDots() {
  return (
    <div className="chat-typing-dots">
      <span />
      <span />
      <span />
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export function MascotChatPanel() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { state, getWeaknesses, getRecommendations, getSubjectLessons } = useAppData();
  const [open, setOpen] = useState(false);
  const [systemMessages, setSystemMessages] = useState<ChatBubble[]>([]);
  const [aiMessages, setAiMessages] = useState<ChatBubble[]>([]);
  const [activeTab, setActiveTab] = useState<'system' | 'ai'>('system');
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(isAIEnabled());
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mountedRef = useRef(true);
  const timeoutIdsRef = useRef<number[]>([]);

  const trackTimeout = useCallback((callback: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timeoutIdsRef.current = timeoutIdsRef.current.filter(t => t !== id);
      if (!mountedRef.current) return;
      callback();
    }, ms);
    timeoutIdsRef.current.push(id);
    return id;
  }, []);

  const nextId = useCallback(() => Date.now() + Math.random(), []);

  useEffect(() => {
    mountedRef.current = true; // Reset trên mỗi mount (React 18 StrictMode safe)
    return () => {
      mountedRef.current = false;
      for (const id of timeoutIdsRef.current) clearTimeout(id);
      timeoutIdsRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (open) setAiEnabled(isAIEnabled());
  }, [open]);

  // Auto-greet on first open (system tab)
  useEffect(() => {
    if (open && systemMessages.length === 0) {
      const greeting = getMascotGreeting(theme.id, state.student.fullName);
      setSystemMessages([{
        id: nextId(),
        from: 'mascot',
        text: greeting.text,
        emoji: greeting.emoji,
        animation: greeting.animation,
      }]);
    }
    if (open) trackTimeout(() => inputRef.current?.focus(), 300);
  }, [open, systemMessages.length, theme.id, state.student.fullName, nextId, trackTimeout]);

  // Auto scroll (depends on active tab)
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [systemMessages, aiMessages, activeTab]);

  const addSystemReply = (msg: MascotMessage) => {
    setSystemMessages(prev => [...prev, {
      id: nextId(),
      from: 'mascot',
      text: msg.text,
      emoji: msg.emoji,
      animation: msg.animation,
    }]);
  };

  const getPrioritizedRecommendations = (limit = 3) => {
    const recPool = getRecommendations(undefined, undefined, Math.max(limit * 3, 10));
    if (recPool.length === 0) return [];

    // Ưu tiên điểm yếu trong 7 ngày gần đây.
    const weakTags = getWeaknesses(7)
      .sort((a, b) => (b.wrongCount - a.wrongCount) || (a.accuracy - b.accuracy))
      .slice(0, 4)
      .map(w => w.skillTag);

    const lessonSkillMap = new Map<number, Set<string>>();
    for (const q of state.questions) {
      if (!q.isActive || !q.skillTag) continue;
      const set = lessonSkillMap.get(q.lessonId) ?? new Set<string>();
      set.add(q.skillTag);
      lessonSkillMap.set(q.lessonId, set);
    }

    const scored = recPool.map((r, idx) => {
      const lessonTags = lessonSkillMap.get(r.lessonId) ?? new Set<string>();
      const weakHits = weakTags.filter(tag => lessonTags.has(tag)).length;
      return {
        ...r,
        weakHits,
        // giữ thứ tự cũ làm tie-break để ổn định UI
        baseRank: idx,
      };
    });

    return scored
      .sort((a, b) => (b.weakHits - a.weakHits) || (a.baseRank - b.baseRank))
      .slice(0, limit)
      .map(r => ({
        lessonId: r.lessonId,
        label: r.message,
        weakPriority: r.weakHits > 0,
      }));
  };

  const addRecommendationBubble = (max = 3) => {
    const recs = getPrioritizedRecommendations(max);
    if (recs.length === 0) return;
    setSystemMessages(prev => [...prev, {
      id: nextId(),
      from: 'mascot',
      text: `${theme.emoji} Chọn 1 bài để học ngay nhé:`,
      suggestions: recs,
    }]);
  };

  // ========== AI CHAT ==========
  const sendAiMessage = async (text: string) => {
    if (!text.trim() || sending) return;

    const userText = text.trim();
    setInputText('');
    setSending(true);

    setAiMessages(prev => [...prev, { id: nextId(), from: 'user', text: userText }]);

    const loadingId = nextId();
    setAiMessages(prev => [...prev, {
      id: loadingId,
      from: 'mascot',
      text: '',
      isLoading: true,
    }]);

    const provider = getAISettings().provider.toUpperCase();
    try {
      const resp = await sendToAI(userText, theme.id, state.student.fullName);

      if (!mountedRef.current) return;

      setAiMessages(prev => prev.map(m =>
        m.id === loadingId
          ? {
            ...m,
            text: resp.success ? resp.text : `😅 ${resp.error || 'Lỗi rồi, bạn thử lại nhé!'}\n\n💡 Bạn có thể vào Cài đặt AI để kiểm tra API key/endpoint.`,
            isLoading: false,
            emoji: '🤖',
          }
          : m
      ));

      if (!resp.success) {
        setAiMessages(prev => [...prev, {
          id: nextId(),
          from: 'mascot',
          text: `Hiện đang dùng ${provider}. Nếu bạn chưa có key, vào Cài đặt AI để gắn key từ website bán API của bạn.`,
        }]);
      }
    } catch (err: any) {
      if (!mountedRef.current) return;
      setAiMessages(prev => prev.map(m =>
        m.id === loadingId
          ? { ...m, text: `😅 Lỗi kết nối: ${err?.message || 'Vui lòng thử lại.'}`, isLoading: false }
          : m
      ));
    } finally {
      if (mountedRef.current) {
        setSending(false);
        trackTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  };

  // ========== QUICK ACTIONS ==========
  const handleQuickAction = (action: typeof quickActions[0]) => {
    setSystemMessages(prev => [...prev, {
      id: nextId(),
      from: 'user',
      text: `${action.emoji} ${action.label}`,
    }]);

    // Generate mascot reply based on context
    trackTimeout(() => {
      if (action.context === 'review_remind') {
        const recs = getPrioritizedRecommendations(5);
        const msg = getMascotReviewReminder(theme.id, state.student.fullName, recs.length);
        addSystemReply(msg);
        if (recs.length > 0) {
          setSystemMessages(prev => [...prev, {
            id: nextId(),
            from: 'mascot',
            text: `${theme.emoji} Bài nên ôn (ưu tiên bài yếu 7 ngày gần đây):`,
            suggestions: recs.slice(0, 3),
          }]);
        }
      } else if (action.context === 'hint') {
        // FIX: provide actual hint instead of raw {hint} template
        const weaknesses = getWeaknesses();
        if (weaknesses.length > 0) {
          const msg = getMascotWeakSkillAlert(theme.id, state.student.fullName, weaknesses[0].skillTag);
          addSystemReply(msg);
        } else {
          // Get recommendations or suggest a random lesson
          const recs = getRecommendations();
          if (recs.length > 0) {
            const hint = recs[0].message;
            const msg = getMascotMessage(theme.id, 'hint', { name: state.student.fullName, hint });
            addSystemReply(msg);
          } else {
            // Suggest from available lessons
            const lessons = getSubjectLessons();
            if (lessons.length > 0) {
              const randomLesson = lessons[Math.floor(Math.random() * lessons.length)];
              const hint = `Thử học bài "${randomLesson.title}" nhé!`;
              const msg = getMascotMessage(theme.id, 'hint', { name: state.student.fullName, hint });
              addSystemReply(msg);
            } else {
              // Fallback to encourage instead of broken hint template
              const msg = getMascotMessage(theme.id, 'encourage', { name: state.student.fullName });
              addSystemReply(msg);
            }
          }
        }
        // Always show concrete lesson suggestions so this action feels actionable.
        addRecommendationBubble(3);
      } else if (action.context === 'daily_challenge') {
        const msg = getMascotMessage(theme.id, 'daily_challenge', { name: state.student.fullName });
        addSystemReply(msg);
        setSystemMessages(prev => [...prev, {
          id: nextId(),
          from: 'mascot',
          text: `${theme.emoji} Mở thử thách hôm nay cho bạn nhé!`,
        }]);
        trackTimeout(() => {
          navigate('/daily');
          setOpen(false);
        }, 520);
      } else {
        const msg = getMascotMessage(theme.id, action.context, { name: state.student.fullName });
        addSystemReply(msg);
      }
    }, 400);
  };

  // ========== NON-AI TEXT REPLY (smart template matching) ==========
  const handleLocalMessage = (text: string) => {
    if (!text.trim() || sending) return;
    const userText = text.trim();
    setInputText('');

    setSystemMessages(prev => [...prev, { id: nextId(), from: 'user', text: userText }]);

    const lower = userText.toLowerCase();

    // Keyword → context mapping
    type ContextHint = { context: ChatContext; keywords: string[] };
    const contextMap: ContextHint[] = [
      { context: 'greeting', keywords: ['xin chào', 'chào', 'hello', 'hi ', 'hey', 'ê ', 'ơi'] },
      { context: 'encourage', keywords: ['buồn', 'chán', 'mệt', 'khó', 'không được', 'hok dc', 'nản', 'sợ', 'lo', 'động viên', 'cổ vũ'] },
      { context: 'hint', keywords: ['gợi ý', 'học gì', 'bài gì', 'nên học', 'làm gì', 'giúp'] },
      { context: 'review_remind', keywords: ['ôn bài', 'ôn tập', 'nhắc', 'ôn lại', 'review'] },
      { context: 'daily_challenge', keywords: ['thử thách', 'đố', 'quiz', 'câu hỏi', 'challenge', 'test'] },
      { context: 'goodbye', keywords: ['tạm biệt', 'bye', 'bái', 'đi ngủ', 'tắt', 'nghỉ'] },
      { context: 'streak_answer', keywords: ['streak', 'liên tiếp', 'ngày'] },
      { context: 'lesson_start', keywords: ['bắt đầu', 'mới', 'lần đầu', 'start'] },
    ];

    let matchedContext: ChatContext = 'greeting';
    let bestScore = 0;
    for (const { context, keywords } of contextMap) {
      for (const kw of keywords) {
        if (lower.includes(kw) && kw.length > bestScore) {
          matchedContext = context;
          bestScore = kw.length;
        }
      }
    }

    // If no keyword matched AND text is a question → use hint context
    if (bestScore === 0 && (lower.includes('?') || lower.startsWith('sao') || lower.startsWith('tại') || lower.startsWith('vì'))) {
      matchedContext = 'encourage';
    }

    trackTimeout(() => {
      if (matchedContext === 'review_remind') {
        const recs = getPrioritizedRecommendations(3);
        const msg = getMascotReviewReminder(theme.id, state.student.fullName, recs.length);
        addSystemReply(msg);
        if (recs.length > 0) {
          setSystemMessages(prev => [...prev, {
            id: nextId(), from: 'mascot',
            text: `${theme.emoji} Bài nên ôn (ưu tiên bài yếu 7 ngày gần đây):`,
            suggestions: recs,
          }]);
        }
      } else if (matchedContext === 'hint') {
        const weaknesses = getWeaknesses();
        if (weaknesses.length > 0) {
          addSystemReply(getMascotWeakSkillAlert(theme.id, state.student.fullName, weaknesses[0].skillTag));
        } else {
          const recs = getRecommendations();
          if (recs.length > 0) {
            addSystemReply(getMascotMessage(theme.id, 'hint', { name: state.student.fullName, hint: recs[0].message }));
          } else {
            addSystemReply(getMascotMessage(theme.id, 'encourage', { name: state.student.fullName }));
          }
        }
        addRecommendationBubble(3);
      } else if (matchedContext === 'daily_challenge') {
        addSystemReply(getMascotMessage(theme.id, 'daily_challenge', { name: state.student.fullName }));
        addRecommendationBubble(2);
      } else {
        addSystemReply(getMascotMessage(theme.id, matchedContext, { name: state.student.fullName }));
      }
    }, 400 + Math.random() * 300);
  };

  // ========== UNIFIED SEND ==========
  const handleSend = () => {
    if (!inputText.trim()) return;
    if (activeTab === 'ai') {
      if (!aiEnabled) return;
      sendAiMessage(inputText);
    } else {
      handleLocalMessage(inputText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ========== ROTATING SPEECH BUBBLE ==========
  const idlePhrases = useMemo(() => {
    const name = state.student.fullName.split(' ').pop() || '';
    const base = [
      `Bơi cùng ${theme.mascotName} nào! 🌊`,
      `${name} ơi, hôm nay học gì nè? 📚`,
      `Click vào ${theme.mascotName} đi~`,
      'Học 1 bài thôi nào! 💪',
      `${theme.mascotName} nhớ bạn quá! 🥺`,
      'Hôm nay bạn giỏi lắm rồi! ⭐',
      'Thử thách mới nè, sẵn sàng chưa? 🎯',
      `${theme.mascotName} có gợi ý hay cho bạn! 💡`,
      'Ô! Bạn đây rồi! 👋',
      'Cùng ôn bài 5 phút nhé! ⏰',
    ];
    // Shuffle via seed-free Fisher-Yates-like sort
    return base.sort(() => Math.random() - 0.5);
  }, [theme.mascotName, state.student.fullName]);

  const [bubbleIdx, setBubbleIdx] = useState(0);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const ENABLE_IDLE_BUBBLE = false;

  useEffect(() => {
    if (!ENABLE_IDLE_BUBBLE || open) { setBubbleVisible(false); return; }
    // Show bubble after 2s, rotate every 6s
    const showTimer = window.setTimeout(() => setBubbleVisible(true), 2000);
    const rotateTimer = setInterval(() => {
      setBubbleVisible(false);
      trackTimeout(() => {
        setBubbleIdx(i => (i + 1) % idlePhrases.length);
        setBubbleVisible(true);
      }, 400);
    }, 6000);
    return () => { clearTimeout(showTimer); clearInterval(rotateTimer); };
  }, [ENABLE_IDLE_BUBBLE, open, idlePhrases.length, trackTimeout]);

  const portalContent = (
    <>
      <div className="chat-launcher" aria-label="Nút chat mascot">
        {/* ====== Speech bubble (khi panel đóng) ====== */}
        {ENABLE_IDLE_BUBBLE && !open && bubbleVisible && (
          <div
            className="chat-idle-bubble"
            onClick={() => setOpen(true)}
          >
            <span>{idlePhrases[bubbleIdx]}</span>
            <div className="chat-idle-bubble-tail" />
          </div>
        )}

        {/* ====== Floating Button — fun bounce + glow ====== */}
        <button
          onClick={() => setOpen(o => !o)}
          className="chat-fab"
          data-open={open}
          style={{ '--fab-color': 'var(--color-primary)' } as React.CSSProperties}
          title={`Chat với ${theme.mascotName}`}
        >
          {open ? (
            <X size={26} strokeWidth={3} />
          ) : (
            <>
              <MascotCharacter size="sm" />
              <span className="chat-fab-badge">
                <MessageCircle size={10} />
              </span>
            </>
          )}
        </button>
      </div>

      {/* ====== Chat Panel ====== */}
      {open && (
        <div className="chat-panel">
          {/* ---- Header ---- */}
          <div className="chat-header">
            <div className="chat-header-avatar">
              <MascotCharacter size="sm" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-sm flex items-center gap-1.5 text-white">
                {theme.mascotName}
                {activeTab === 'ai' && aiEnabled && (
                  <span className="chat-ai-badge">
                    <Sparkles size={10} /> AI
                  </span>
                )}
              </div>
              <div className="text-[11px] text-white/70 font-medium">
                {activeTab === 'system' ? '🔔 Hệ thống nhắc học theo kế hoạch' : '🤖 Chat với AI đã cấu hình trong Cài đặt'}
              </div>
            </div>
            <button
              onClick={() => {
                navigate('/ai-settings');
                setOpen(false);
              }}
              className="chat-settings-btn"
              title="Cài đặt AI"
            >
              <Settings size={18} />
            </button>
          </div>

          {/* ---- Tabs ---- */}
          <div className="chat-tabs">
            <button
              className={`chat-tab-btn chat-tab-system ${activeTab === 'system' ? 'active' : ''}`}
              onClick={() => setActiveTab('system')}
            >
              <BellRing size={15} /> Nhắc học
            </button>
            <button
              className={`chat-tab-btn chat-tab-ai ${activeTab === 'ai' ? 'active' : ''}`}
              onClick={() => setActiveTab('ai')}
            >
              <Bot size={15} /> Chat AI
            </button>
          </div>

          {/* ---- Messages ---- */}
          <>
              <div ref={scrollRef} className="chat-messages">
                {(activeTab === 'system' ? systemMessages : aiMessages).map(msg => (
                  <div
                    key={msg.id}
                    className={`chat-row ${msg.from === 'user' ? 'chat-row-user' : 'chat-row-mascot'}`}
                  >
                    {msg.from === 'mascot' && (
                      <div className="chat-avatar-mini">
                        <MascotCharacter size="xs" />
                      </div>
                    )}
                    <div
                      className={`chat-bubble ${msg.from === 'user' ? 'chat-bubble-user' : 'chat-bubble-mascot'} ${
                        msg.isLoading ? '' :
                        msg.animation === 'bounce' ? 'animate-bounce-once' :
                        msg.animation === 'shake' ? 'animate-shake' : ''
                      }`}
                    >
                      {msg.isLoading ? <TypingDots /> : msg.text}

                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="chat-lesson-suggests">
                          {msg.suggestions.map(item => (
                            <div key={`${msg.id}-${item.lessonId}`} className="chat-lesson-suggest-item">
                              <div className="chat-lesson-suggest-title">
                                📌 {item.label}
                                {item.weakPriority && <span className="chat-lesson-weak-tag">Yếu gần đây</span>}
                              </div>
                              <div className="chat-lesson-suggest-actions">
                                <button
                                  className="chat-lesson-action chat-lesson-action-primary"
                                  onClick={() => {
                                    navigate(`/lessons/${item.lessonId}`);
                                    setOpen(false);
                                  }}
                                >
                                  Vào bài học
                                </button>
                                <button
                                  className="chat-lesson-action chat-lesson-action-secondary"
                                  onClick={() => {
                                    navigate(`/lessons/${item.lessonId}/practice`);
                                    setOpen(false);
                                  }}
                                >
                                  Làm bài luyện tập
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {activeTab === 'system' ? (
                <>
                  <div className="chat-actions">
                    {quickActions.map(action => (
                      <button
                        key={action.context}
                        className="chat-action-btn"
                        style={{ '--action-color': action.color } as React.CSSProperties}
                        onClick={() => handleQuickAction(action)}
                        disabled={sending}
                      >
                        <span className="chat-action-emoji">{action.emoji}</span>
                        {action.label}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                !aiEnabled && (
                  <div className="chat-ai-cta" onClick={() => {
                    navigate('/ai-settings');
                    setOpen(false);
                  }}>
                    <Zap size={12} />
                    <span>Bật và cấu hình <b>AI</b> trong trang Cài đặt AI</span>
                    <span className="chat-ai-cta-arrow">→</span>
                  </div>
                )
              )}

              {activeTab === 'system' && (
                <div className="px-3 pb-2 text-[11px]" style={{ color: '#475569' }}>
                  Hệ thống nhắc học dựa trên tiến độ, điểm yếu gần đây và kế hoạch ôn tập.
                </div>
              )}

              {/* ---- Text input (ALWAYS visible) ---- */}
              <div className="chat-input-bar">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    sending
                      ? `${theme.mascotName} đang nghĩ...`
                      : activeTab === 'ai'
                        ? (aiEnabled ? `💬 Hỏi AI bất kỳ điều gì...` : '⚙️ Hãy cấu hình AI trong Cài đặt trước')
                        : `💬 Nhắn tin để nhận nhắc học từ hệ thống...`
                  }
                  disabled={sending || (activeTab === 'ai' && !aiEnabled)}
                  className="chat-input"
                  maxLength={500}
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !inputText.trim() || (activeTab === 'ai' && !aiEnabled)}
                  className="chat-send-btn"
                  style={{ background: inputText.trim() ? 'var(--color-primary)' : 'var(--color-surface)' }}
                >
                  <Send size={16} />
                </button>
              </div>
          </>
        </div>
      )}
    </>
  );
  return createPortal(portalContent, document.body);
}

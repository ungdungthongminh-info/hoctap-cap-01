import { useRef, useState, useEffect, useCallback } from 'react';
import { Eraser, Trash2, Download, Undo2, Paintbrush, Circle } from 'lucide-react';
import { MascotCharacter } from '../../../shared/components';

const COLORS = [
  '#EF4444', '#F97316', '#FBBF24', '#22C55E', '#3B82F6',
  '#8B5CF6', '#EC4899', '#0EA5E9', '#14B8A6', '#000000',
  '#6B7280', '#FFFFFF',
];
const SIZES = [3, 6, 12, 20];

// Mẫu tô màu đơn giản (SVG path data)
const TEMPLATES = [
  {
    name: '⭐ Ngôi sao',
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.3;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const method = i === 0 ? 'moveTo' : 'lineTo';
        ctx[method](cx + r * Math.cos(angle), cy + r * Math.sin(angle));
      }
      ctx.closePath();
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2;
      ctx.stroke();
    },
  },
  {
    name: '🏠 Ngôi nhà',
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const cx = w / 2, base = h * 0.7, top = h * 0.2;
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2;
      // Walls
      ctx.strokeRect(cx - 100, h * 0.4, 200, base - h * 0.4);
      // Roof
      ctx.beginPath();
      ctx.moveTo(cx - 120, h * 0.4);
      ctx.lineTo(cx, top);
      ctx.lineTo(cx + 120, h * 0.4);
      ctx.closePath();
      ctx.stroke();
      // Door
      ctx.strokeRect(cx - 25, base - 70, 50, 70);
      // Window
      ctx.strokeRect(cx + 40, h * 0.47, 40, 40);
      ctx.moveTo(cx + 60, h * 0.47);
      ctx.lineTo(cx + 60, h * 0.47 + 40);
      ctx.stroke();
    },
  },
  {
    name: '🌸 Bông hoa',
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const cx = w / 2, cy = h * 0.4, r = 35;
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2;
      // Petals
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        ctx.beginPath();
        ctx.arc(cx + r * Math.cos(angle), cy + r * Math.sin(angle), r * 0.7, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Center
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
      ctx.stroke();
      // Stem
      ctx.beginPath();
      ctx.moveTo(cx, cy + r + 10);
      ctx.lineTo(cx, h * 0.85);
      ctx.stroke();
      // Leaf
      ctx.beginPath();
      ctx.ellipse(cx + 30, h * 0.65, 25, 12, Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();
    },
  },
  {
    name: '🦋 Con bướm',
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const cx = w / 2, cy = h / 2;
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2;
      // Body
      ctx.beginPath();
      ctx.ellipse(cx, cy, 8, 50, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Upper wings
      ctx.beginPath();
      ctx.ellipse(cx - 55, cy - 20, 50, 35, -0.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx + 55, cy - 20, 50, 35, 0.3, 0, Math.PI * 2);
      ctx.stroke();
      // Lower wings
      ctx.beginPath();
      ctx.ellipse(cx - 40, cy + 25, 35, 25, -0.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx + 40, cy + 25, 35, 25, 0.5, 0, Math.PI * 2);
      ctx.stroke();
      // Antennae
      ctx.beginPath();
      ctx.moveTo(cx - 5, cy - 48);
      ctx.quadraticCurveTo(cx - 25, cy - 80, cx - 35, cy - 75);
      ctx.moveTo(cx + 5, cy - 48);
      ctx.quadraticCurveTo(cx + 25, cy - 80, cx + 35, cy - 75);
      ctx.stroke();
    },
  },
];

export function DrawingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#EF4444');
  const [brushSize, setBrushSize] = useState(6);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [history, setHistory] = useState<ImageData[]>([]);
  const [template, setTemplate] = useState<number | null>(null);

  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setHistory((prev) => [...prev.slice(-20), ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  }, []);

  const initCanvas = useCallback((templateIdx?: number | null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Size to container
    const rect = canvas.parentElement!.getBoundingClientRect();
    canvas.width = Math.floor(rect.width);
    canvas.height = Math.floor(rect.height);

    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw template if selected
    if (templateIdx !== null && templateIdx !== undefined && TEMPLATES[templateIdx]) {
      TEMPLATES[templateIdx].draw(ctx, canvas.width, canvas.height);
    }
    setHistory([]);
  }, []);

  useEffect(() => {
    initCanvas(template);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => initCanvas(template);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas, template]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    saveState();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
    ctx.lineWidth = tool === 'eraser' ? brushSize * 3 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const endDraw = () => setIsDrawing(false);

  const undo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || history.length === 0) return;
    const prev = history[history.length - 1];
    ctx.putImageData(prev, 0, 0);
    setHistory((h) => h.slice(0, -1));
  };

  const clearCanvas = () => {
    initCanvas(template);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `ban-ve-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <MascotCharacter size="sm" />
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
            🎨 Góc Sáng Tạo
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            Vẽ tự do hoặc tô màu mẫu có sẵn!
          </p>
        </div>
      </div>

      {/* Template selector */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <button
          className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
          style={{
            background: template === null ? 'var(--color-primary)' : 'var(--color-surface)',
            color: template === null ? '#FFF' : 'var(--color-text)',
          }}
          onClick={() => setTemplate(null)}
        >
          ✏️ Vẽ tự do
        </button>
        {TEMPLATES.map((t, i) => (
          <button
            key={i}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{
              background: template === i ? 'var(--color-primary)' : 'var(--color-surface)',
              color: template === i ? '#FFF' : 'var(--color-text)',
            }}
            onClick={() => setTemplate(i)}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        {/* Tool buttons */}
        <div className="flex gap-1">
          <button
            className="p-2 rounded-lg transition-all"
            style={{
              background: tool === 'brush' ? 'var(--color-primary)' : 'var(--color-surface)',
              color: tool === 'brush' ? '#FFF' : 'var(--color-text)',
            }}
            onClick={() => setTool('brush')}
            title="Bút vẽ"
          >
            <Paintbrush size={18} />
          </button>
          <button
            className="p-2 rounded-lg transition-all"
            style={{
              background: tool === 'eraser' ? 'var(--color-primary)' : 'var(--color-surface)',
              color: tool === 'eraser' ? '#FFF' : 'var(--color-text)',
            }}
            onClick={() => setTool('eraser')}
            title="Tẩy"
          >
            <Eraser size={18} />
          </button>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 28, background: '#E5E7EB' }} />

        {/* Colors */}
        <div className="flex gap-1 flex-wrap">
          {COLORS.map((c) => (
            <button
              key={c}
              className="rounded-full transition-transform"
              style={{
                width: 24, height: 24,
                background: c,
                border: color === c ? '3px solid var(--color-primary-dark)' : '2px solid #D1D5DB',
                transform: color === c ? 'scale(1.2)' : 'scale(1)',
              }}
              onClick={() => { setColor(c); setTool('brush'); }}
            />
          ))}
        </div>

        <div style={{ width: 1, height: 28, background: '#E5E7EB' }} />

        {/* Brush sizes */}
        <div className="flex items-center gap-1">
          {SIZES.map((s) => (
            <button
              key={s}
              className="flex items-center justify-center rounded-lg transition-all"
              style={{
                width: 32, height: 32,
                background: brushSize === s ? 'var(--color-primary)' : 'var(--color-surface)',
                color: brushSize === s ? '#FFF' : 'var(--color-text)',
              }}
              onClick={() => setBrushSize(s)}
              title={`${s}px`}
            >
              <Circle size={Math.max(6, s)} fill="currentColor" />
            </button>
          ))}
        </div>

        <div style={{ width: 1, height: 28, background: '#E5E7EB' }} />

        {/* Actions */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-all" onClick={undo} title="Hoàn tác">
          <Undo2 size={18} style={{ color: 'var(--color-text-light)' }} />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-all" onClick={clearCanvas} title="Xoá hết">
          <Trash2 size={18} style={{ color: '#EF4444' }} />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-all" onClick={downloadCanvas} title="Tải xuống">
          <Download size={18} style={{ color: 'var(--color-success)' }} />
        </button>
      </div>

      {/* Canvas */}
      <div
        className="flex-1 rounded-2xl overflow-hidden"
        style={{
          border: '3px solid var(--color-primary-light)',
          background: '#FFFFFF',
          cursor: tool === 'eraser' ? 'cell' : 'crosshair',
          touchAction: 'none',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
      </div>
    </div>
  );
}

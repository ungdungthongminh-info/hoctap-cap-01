import { useRef, useState } from 'react';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { Activity, AlertTriangle, CheckCircle, Database, Download, Upload } from 'lucide-react';
import { MascotCharacter } from '../../../shared/components';

export function DataPage() {
  const { getDataHealth, state, exportBackup, importBackup } = useAppData();
  const health = getDataHealth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMsg, setImportMsg] = useState<string | null>(null);

  const hasWarnings = health.lessonsWithoutCards.length > 0 || health.lessonsWithoutQuestions.length > 0;
  const healthScore = Math.round(
    ((health.totalLessons > 0 ? 1 : 0) +
      (health.lessonsWithoutCards.length === 0 ? 1 : 0) +
      (health.lessonsWithoutQuestions.length === 0 ? 1 : 0) +
      (health.avgQuestionsPerLesson >= 10 ? 1 : 0)) * 25
  );

  return (
    <div className="fade-in max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <MascotCharacter size="sm" />
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
            🗄️ Quản Lý Dữ Liệu
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            Kiểm tra tình trạng nội dung học tập
          </p>
        </div>
      </div>

      {/* Health Score */}
      <div className="card mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Database size={20} style={{ color: 'var(--color-primary)' }} />
          <h3 className="font-bold">Điểm sức khỏe dữ liệu</h3>
        </div>
        <div
          className="text-5xl font-bold mb-1"
          style={{
            color: healthScore === 100 ? 'var(--color-success)' : healthScore >= 75 ? 'var(--color-primary)' : 'var(--color-warning)',
          }}
        >
          {healthScore}%
        </div>
        <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
          {healthScore === 100 ? '✅ Tuyệt vời! Dữ liệu đầy đủ' : '⚠️ Cần bổ sung nội dung'}
        </p>
      </div>

      {/* Stats grid */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={18} style={{ color: 'var(--color-success)' }} />
          <h3 className="font-bold">Thống kê nội dung</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="card-flat">
            <div className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{health.totalLessons}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Bài học</div>
          </div>
          <div className="card-flat">
            <div className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{health.totalCards}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Thẻ nội dung</div>
          </div>
          <div className="card-flat">
            <div className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{health.totalQuestions}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Câu hỏi</div>
          </div>
          <div className="card-flat">
            <div className="text-2xl font-bold" style={{ color: 'var(--color-success)' }}>{health.avgQuestionsPerLesson.toFixed(1)}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>TB câu/bài</div>
          </div>
        </div>
      </div>

      {/* Per-lesson health */}
      <div className="card mb-6">
        <h3 className="font-bold mb-3">📋 Chi tiết từng bài</h3>
        <div className="grid gap-2">
          {state.lessons.map((l) => {
            const cards = state.lessonCards.filter((c) => c.lessonId === l.id).length;
            const qs = state.questions.filter((q) => q.lessonId === l.id).length;
            const ok = cards > 0 && qs >= 10;
            return (
              <div
                key={l.id}
                className="flex items-center gap-3 p-3 rounded-xl text-sm"
                style={{ background: ok ? '#F0FDF4' : '#FFFBEB' }}
              >
                {ok ? (
                  <CheckCircle size={16} style={{ color: '#059669' }} />
                ) : (
                  <AlertTriangle size={16} style={{ color: '#D97706' }} />
                )}
                <span className="flex-1 font-medium truncate">{l.title}</span>
                <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                  {cards} thẻ · {qs} câu
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Warnings */}
      {hasWarnings && (
        <div className="card mb-6" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <AlertTriangle size={18} style={{ color: '#D97706' }} />
            Cảnh báo
          </h3>
          {health.lessonsWithoutCards.length > 0 && (
            <div className="mb-2">
              <span className="text-sm font-medium" style={{ color: '#92400E' }}>
                Bài chưa có thẻ nội dung ({health.lessonsWithoutCards.length}):
              </span>
              <ul className="text-sm ml-4 mt-1" style={{ color: '#B45309' }}>
                {health.lessonsWithoutCards.map((id) => {
                  const l = state.lessons.find((x) => x.id === id);
                  return <li key={id}>• {l?.title || id}</li>;
                })}
              </ul>
            </div>
          )}
          {health.lessonsWithoutQuestions.length > 0 && (
            <div>
              <span className="text-sm font-medium" style={{ color: '#92400E' }}>
                Bài chưa có câu hỏi ({health.lessonsWithoutQuestions.length}):
              </span>
              <ul className="text-sm ml-4 mt-1" style={{ color: '#B45309' }}>
                {health.lessonsWithoutQuestions.map((id) => {
                  const l = state.lessons.find((x) => x.id === id);
                  return <li key={id}>• {l?.title || id}</li>;
                })}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="card-flat text-center">
        <span className="text-sm" style={{ color: 'var(--color-text-light)' }}>
          📌 Dữ liệu được nhúng sẵn trong ứng dụng (seed data)
        </span>
      </div>

      {/* Backup / Restore */}
      <div className="card mt-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Database size={18} style={{ color: 'var(--color-primary)' }} />
          Sao lưu & Khôi phục
        </h3>
        <div className="flex gap-3 flex-wrap">
          <button
            className="btn btn-primary flex items-center gap-2"
            onClick={() => {
              const json = exportBackup();
              const blob = new Blob([json], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `hhk_backup_${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download size={16} /> Xuất bản sao lưu
          </button>
          <button
            className="btn btn-secondary flex items-center gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={16} /> Nhập bản sao lưu
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => {
                const text = ev.target?.result as string;
                const ok = importBackup(text);
                setImportMsg(ok ? '✅ Khôi phục thành công!' : '❌ File không hợp lệ.');
                setTimeout(() => setImportMsg(null), 3000);
              };
              reader.readAsText(file);
              e.target.value = '';
            }}
          />
        </div>
        {importMsg && (
          <p className="text-sm mt-3 font-medium" style={{ color: importMsg.startsWith('✅') ? '#059669' : '#DC2626' }}>
            {importMsg}
          </p>
        )}
        <p className="text-xs mt-3" style={{ color: 'var(--color-text-light)' }}>
          Xuất: tải file JSON chứa tiến trình học tập. Nhập: khôi phục từ file đã xuất.
        </p>
      </div>
    </div>
  );
}

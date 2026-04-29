import { useNavigate } from 'react-router-dom';
import { Sparkles, Network, Clock3, Rocket } from 'lucide-react';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { getGradeLabel, getSubjectByCode } from '../../../data/subjects';

export function MindMapPage() {
  const navigate = useNavigate();
  const { state } = useAppData();
  const subject = getSubjectByCode(state.student.subjectCode);

  return (
    <div className="subpage-shell fade-in max-w-3xl mx-auto">
      <section className="subpage-hero">
        <div className="subpage-hero__avatar" style={{ background: 'linear-gradient(135deg, #DBEAFE, #E0E7FF)' }}>
          <Network size={32} style={{ color: '#2563EB' }} />
        </div>
        <div className="subpage-hero__content">
          <div className="subpage-hero__eyebrow">
            {getGradeLabel(state.student.grade)} · {subject?.emoji} {subject?.name || 'Toán'}
          </div>
          <h1 className="subpage-hero__title" style={{ color: 'var(--color-primary-dark)' }}>
            Mind-map · Sắp ra mắt
          </h1>
          <p className="subpage-hero__subtitle" style={{ color: 'var(--color-text-light)' }}>
            Tính năng sơ đồ tư duy đang hoàn thiện để hỗ trợ học nhanh, nhớ lâu và ôn tập theo mạch kiến thức.
          </p>
        </div>
        <div className="subpage-hero__meta">
          <span className="subpage-hero__pill">Coming soon</span>
        </div>
      </section>

      <section className="subpage-panel">
        <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--color-primary-dark)' }}>
          <Sparkles size={16} />
          Bản đầu tiên sẽ có
        </h2>
        <div className="mt-3 flex flex-col gap-2 text-sm" style={{ color: 'var(--color-text)' }}>
          <p>1. Sơ đồ tư duy theo từng bài học với từ khóa tiếng Việt rõ ràng.</p>
          <p>2. Nút nghe audio tĩnh theo từng nhánh kiến thức.</p>
          <p>3. Chế độ ôn nhanh bằng mind-map trước khi vào luyện tập.</p>
        </div>
      </section>

      <section className="subpage-panel" style={{ display: 'grid', gap: 10 }}>
        <div className="flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--color-primary-dark)' }}>
          <Clock3 size={15} />
          Trạng thái triển khai
        </div>
        <div className="card-flat" style={{ display: 'grid', gap: 6 }}>
          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#0F172A' }}>
            <Rocket size={15} />
            Đang chuẩn bị nội dung cho các lớp
          </div>
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            Anh có thể bấm vào card Mind-map ở Home để vào trang này bất kỳ lúc nào.
          </p>
        </div>
      </section>

      <button className="btn btn-primary btn-icon-slide w-fit" onClick={() => navigate('/home')}>
        Quay lại Trang chủ
      </button>
    </div>
  );
}

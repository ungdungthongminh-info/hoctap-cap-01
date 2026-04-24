/**
 * EmptyState — Component hiển thị khi không có dữ liệu
 * Dùng cho: danh sách bài trống, chưa làm bài, chưa có thành tích, v.v.
 */
import { type ReactNode } from 'react';

interface EmptyStateProps {
  emoji?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ emoji = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state fade-in">
      <div className="empty-state__emoji">{emoji}</div>
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__desc">{description}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}

/**
 * Skeleton — Loading placeholder components
 * Dùng khi trang đang load dữ liệu
 */

/** Skeleton line/block — giả lập text hoặc khối nội dung */
export function Skeleton({ width, height = 16, rounded = false, className = '' }: {
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`skeleton ${rounded ? 'skeleton--rounded' : ''} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
}

/** Card skeleton — một card placeholder hoàn chỉnh */
export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="skeleton-card">
      <Skeleton height={20} width="60%" />
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} height={14} width={i === lines - 1 ? '40%' : '100%'} />
      ))}
    </div>
  );
}

/** Grid skeleton — lưới card placeholders */
export function SkeletonGrid({ count = 6, lines = 3 }: { count?: number; lines?: number }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} lines={lines} />
      ))}
    </div>
  );
}

/** Stat skeleton — placeholder cho stat card */
export function SkeletonStat() {
  return (
    <div className="skeleton-card" style={{ textAlign: 'center' }}>
      <Skeleton height={36} width={60} className="skeleton--centered" />
      <Skeleton height={12} width="70%" className="skeleton--centered" />
    </div>
  );
}

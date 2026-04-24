/**
 * AdminDashboardPage — Trang quản trị nội bộ
 * - Xem danh sách khách hàng theo gói / trạng thái
 * - Xem tổng doanh thu + số lượng theo gói
 * - Xem hàng đợi thông báo (license key chờ gửi)
 * - Đánh dấu đã gửi / thất bại thủ công (thay Zalo OA)
 */
import { useState, useEffect, useCallback } from 'react';
import {
  Users, BarChart2, Bell, CheckCircle, XCircle, RefreshCw,
  Copy, ChevronDown, ChevronUp, AlertTriangle, Key, MessageCircle, Phone, Search, Clock3
} from 'lucide-react';
import { BACKEND_API_BASE } from '@shared/services/webTotalBridge';

const API_BASE = BACKEND_API_BASE;

// ── Types ──────────────────────────────────────────────────────────────────

interface SubscriptionRow {
  id: number;
  userId: string;
  planId: string;
  billingCycle: string;
  status: string;
  amount: number;
  licenseKey: string | null;
  customerPhone: string | null;
  orderCode?: string;
  providerTxnId?: string | null;
  activatedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  email?: string;
}

interface PlanSummaryRow {
  plan_id: string;
  billing_cycle?: string;
  count?: number;
  total_subscriptions?: number;
  total_revenue: number;
}

interface NotificationJob {
  id: string;
  userId: string;
  channel: string;
  payloadJson: string;
  status: 'pending' | 'sent' | 'failed';
  errorMessage: string | null;
  lastAttemptAt: string | null;
  createdAt: string;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function fmtMoney(n: number) {
  const safe = Number(n || 0);
  return safe.toLocaleString('vi-VN') + 'đ';
}

function fmtDate(s: string | null) {
  if (!s) return '—';
  return new Date(s).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    expired: 'bg-gray-100 text-gray-500',
    cancelled: 'bg-red-100 text-red-600',
    failed: 'bg-red-100 text-red-600',
    sent: 'bg-blue-100 text-blue-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button onClick={handleCopy} className="ml-1 text-gray-400 hover:text-gray-600 transition-colors" title="Sao chép">
      {copied ? <CheckCircle size={13} className="text-green-500" /> : <Copy size={13} />}
    </button>
  );
}

function AutoRefreshControl({
  enabled,
  onToggle,
  seconds,
  onSecondsChange,
}: {
  enabled: boolean;
  onToggle: (v: boolean) => void;
  seconds: number;
  onSecondsChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <button
        onClick={() => onToggle(!enabled)}
        className={`px-2.5 py-1 rounded-full border transition-colors ${
          enabled
            ? 'bg-blue-50 text-blue-700 border-blue-200'
            : 'bg-gray-50 text-gray-500 border-gray-200'
        }`}
      >
        <span className="inline-flex items-center gap-1">
          <Clock3 size={12} />
          {enabled ? 'Tự động bật' : 'Tự động tắt'}
        </span>
      </button>
      <select
        value={seconds}
        onChange={(e) => onSecondsChange(Number(e.target.value) || 15)}
        className="border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-700"
      >
        <option value={10}>10s</option>
        <option value={15}>15s</option>
        <option value={30}>30s</option>
        <option value={60}>60s</option>
      </select>
    </div>
  );
}

// ── Tab: Tổng quan ──────────────────────────────────────────────────────────

function SummaryTab() {
  const [rows, setRows] = useState<PlanSummaryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshSec, setRefreshSec] = useState(15);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/summary`);
      const json = await res.json();
      if (json.success) {
        if (Array.isArray(json.data)) setRows(json.data);
        else {
          setRows([]);
          setError('Du lieu tong quan khong hop le');
        }
      }
      else setError(json.error ?? 'Lỗi không xác định');
    } catch {
      setError('Không kết nối được backend (localhost:5000)');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => {
      load();
    }, refreshSec * 1000);
    return () => clearInterval(id);
  }, [autoRefresh, refreshSec, load]);

  const totalRevenue = rows.reduce((s, r) => s + Number(r.total_revenue || 0), 0);
  const totalSubs = rows.reduce((s, r) => s + Number(r.count ?? r.total_subscriptions ?? 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Tổng doanh thu theo gói</h2>
        <div className="flex items-center gap-3">
          <AutoRefreshControl
            enabled={autoRefresh}
            onToggle={setAutoRefresh}
            seconds={refreshSec}
            onSecondsChange={setRefreshSec}
          />
          <button onClick={load} className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
            <RefreshCw size={14} /> Tải lại
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{fmtMoney(totalRevenue)}</div>
          <div className="text-xs text-green-600 mt-1">Tổng doanh thu</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{totalSubs}</div>
          <div className="text-xs text-blue-600 mt-1">Tổng đơn thanh toán</div>
        </div>
      </div>

      {loading && <div className="text-center text-gray-400 py-8">Đang tải...</div>}
      {error && <div className="text-red-500 text-sm text-center py-4">{error}</div>}
      {!loading && !error && rows.length === 0 && (
        <div className="text-center text-gray-400 py-8">Chưa có dữ liệu</div>
      )}

      {rows.length > 0 && (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
              <th className="px-3 py-2 text-left rounded-l">Gói</th>
              <th className="px-3 py-2 text-left">Chu kỳ</th>
              <th className="px-3 py-2 text-right">Số đơn</th>
              <th className="px-3 py-2 text-right rounded-r">Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">{r.plan_id}</td>
                <td className="px-3 py-2 text-gray-500">{r.billing_cycle || 'all'}</td>
                <td className="px-3 py-2 text-right">{r.count ?? r.total_subscriptions ?? 0}</td>
                <td className="px-3 py-2 text-right font-semibold text-green-600">{fmtMoney(r.total_revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ── Tab: Khách hàng ─────────────────────────────────────────────────────────

function CustomersTab() {
  const [rows, setRows] = useState<SubscriptionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterPlan, setFilterPlan] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [query, setQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshSec, setRefreshSec] = useState(15);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    const params = new URLSearchParams();
    if (filterPlan) params.set('planId', filterPlan);
    if (filterStatus) params.set('status', filterStatus);
    try {
      const res = await fetch(`${API_BASE}/admin/subscriptions?${params}`);
      const json = await res.json();
      if (json.success) {
        if (Array.isArray(json.data)) setRows(json.data);
        else {
          setRows([]);
          setError('Du lieu khach hang khong hop le');
        }
      }
      else setError(json.error ?? 'Lỗi không xác định');
    } catch {
      setError('Không kết nối được backend (localhost:5000)');
    } finally { setLoading(false); }
  }, [filterPlan, filterStatus]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => {
      load();
    }, refreshSec * 1000);
    return () => clearInterval(id);
  }, [autoRefresh, refreshSec, load]);

  const keyword = query.trim().toLowerCase();
  const visibleRows = keyword
    ? rows.filter((r) => {
        const haystack = [
          r.customerPhone || '',
          r.userId || '',
          r.planId || '',
          r.billingCycle || '',
          r.status || '',
          r.licenseKey || '',
          r.orderCode || '',
          r.providerTxnId || '',
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(keyword);
      })
    : rows;

  const totalRows = visibleRows.length;
  const pendingRows = visibleRows.filter((r) => r.status === 'pending').length;
  const paidRows = visibleRows.filter((r) => r.status === 'paid' || r.status === 'active').length;
  const noLicenseRows = visibleRows.filter((r) => !r.licenseKey).length;

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <select
          value={filterPlan}
          onChange={e => setFilterPlan(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">Tất cả gói</option>
          <option value="free">Miễn phí</option>
          <option value="standard">Tiêu chuẩn</option>
          <option value="premium">Nâng cao</option>
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <div className="relative min-w-[220px] flex-1">
          <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo SĐT, mã đơn, mã giao dịch, license..."
            className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <AutoRefreshControl
          enabled={autoRefresh}
          onToggle={setAutoRefresh}
          seconds={refreshSec}
          onSecondsChange={setRefreshSec}
        />
        <button onClick={load} className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
          <RefreshCw size={14} /> Tải lại
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
          <div className="text-xs text-gray-500">Đơn hiển thị</div>
          <div className="text-lg font-bold text-gray-800">{totalRows}</div>
        </div>
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2">
          <div className="text-xs text-yellow-700">Đang chờ xử lý</div>
          <div className="text-lg font-bold text-yellow-700">{pendingRows}</div>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2">
          <div className="text-xs text-green-700">Đã thanh toán/kích hoạt</div>
          <div className="text-lg font-bold text-green-700">{paidRows}</div>
        </div>
        <div className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2">
          <div className="text-xs text-orange-700">Thiếu license</div>
          <div className="text-lg font-bold text-orange-700">{noLicenseRows}</div>
        </div>
      </div>

      {loading && <div className="text-center text-gray-400 py-8">Đang tải...</div>}
      {error && <div className="text-red-500 text-sm text-center py-4">{error}</div>}
      {!loading && !error && visibleRows.length === 0 && (
        <div className="text-center text-gray-400 py-8">Không có đơn nào</div>
      )}

      <div className="space-y-2">
        {visibleRows.map(row => (
          <div key={row.id} className="border border-gray-200 rounded-xl overflow-hidden">
            {/* Row header */}
            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedId(expandedId === row.id ? null : row.id)}
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                {(row.customerPhone || row.userId)?.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate flex items-center gap-1.5">
                  {row.customerPhone ? (
                    <>
                      <Phone size={12} className="text-green-500 shrink-0" />
                      <span>{row.customerPhone}</span>
                    </>
                  ) : (
                    <span className="text-gray-400 text-xs">{row.userId}</span>
                  )}
                </div>
                <div className="text-xs text-gray-400">{fmtDate(row.createdAt)}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{row.planId}</span>
                <StatusBadge status={row.status} />
                <span className="font-semibold text-green-600 text-sm">{fmtMoney(row.amount || 0)}</span>
                {expandedId === row.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </button>

            {/* Expanded detail */}
            {expandedId === row.id && (
              <div className="px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-600 space-y-1.5">
                {row.customerPhone && (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <Phone size={13} className="text-green-500 shrink-0" />
                    <span className="font-semibold text-green-700 text-sm">{row.customerPhone}</span>
                    <CopyBtn text={row.customerPhone} />
                    <a
                      href={`https://zalo.me/${row.customerPhone.replace(/^0/, '84')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-blue-500 hover:underline font-medium"
                    >
                      Nhắn Zalo →
                    </a>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div><span className="text-gray-400">ID đơn:</span> <span className="font-mono">{row.id}</span></div>
                  <div><span className="text-gray-400">Mã tham chiếu:</span> <span className="font-mono">{row.orderCode || '—'}</span></div>
                  <div><span className="text-gray-400">Chu kỳ:</span> {row.billingCycle}</div>
                  <div><span className="text-gray-400">Mã giao dịch:</span> <span className="font-mono">{row.providerTxnId || '—'}</span></div>
                  <div><span className="text-gray-400">Kích hoạt:</span> {fmtDate(row.activatedAt)}</div>
                  <div><span className="text-gray-400">Hết hạn:</span> {fmtDate(row.expiresAt)}</div>
                </div>

                {row.licenseKey && (
                  <div className="flex items-center gap-1 bg-white border border-dashed border-gray-300 rounded-lg px-3 py-2 mt-2">
                    <Key size={13} className="text-purple-500 shrink-0" />
                    <span className="font-mono text-purple-700 font-medium">{row.licenseKey}</span>
                    <CopyBtn text={row.licenseKey} />
                  </div>
                )}
                {!row.licenseKey && (
                  <div className="text-orange-500 text-xs flex items-center gap-1 mt-1">
                    <AlertTriangle size={12} /> Chưa có license key
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab: Hàng đợi thông báo ─────────────────────────────────────────────────

function NotificationsTab() {
  const [jobs, setJobs] = useState<NotificationJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [working, setWorking] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshSec, setRefreshSec] = useState(15);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/notifications/pending`);
      const json = await res.json();
      if (json.success) {
        if (Array.isArray(json.data)) setJobs(json.data);
        else {
          setJobs([]);
          setError('Du lieu thong bao khong hop le');
        }
      }
      else setError(json.error ?? 'Lỗi không xác định');
    } catch {
      setError('Không kết nối được backend (localhost:5000)');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => {
      load();
    }, refreshSec * 1000);
    return () => clearInterval(id);
  }, [autoRefresh, refreshSec, load]);

  async function markSent(jobId: string) {
    setWorking(jobId);
    try {
      await fetch(`${API_BASE}/admin/notifications/${jobId}/sent`, { method: 'POST' });
      setJobs(prev => prev.filter(j => j.id !== jobId));
    } catch {
      // ignore
    } finally { setWorking(null); }
  }

  async function markFailed(jobId: string) {
    setWorking(jobId);
    try {
      await fetch(`${API_BASE}/admin/notifications/${jobId}/failed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errorMessage: 'Gửi thủ công thất bại' }),
      });
      load();
    } catch {
      // ignore
    } finally { setWorking(null); }
  }

  async function markAllSent() {
    if (jobs.length === 0) return;
    setWorking('ALL');
    try {
      await Promise.all(jobs.map((j) => fetch(`${API_BASE}/admin/notifications/${j.id}/sent`, { method: 'POST' })));
      setJobs([]);
    } finally {
      setWorking(null);
    }
  }

  // Parse payload to get license key
  function getLicenseFromPayload(payloadJson: string): string | null {
    try {
      const obj = JSON.parse(payloadJson);
      return obj.licenseKey ?? null;
    } catch { return null; }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Thông báo chờ gửi</h2>
        <div className="flex items-center gap-3">
          <AutoRefreshControl
            enabled={autoRefresh}
            onToggle={setAutoRefresh}
            seconds={refreshSec}
            onSecondsChange={setRefreshSec}
          />
          <button
            onClick={markAllSent}
            disabled={working === 'ALL' || jobs.length === 0}
            className="text-xs px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {working === 'ALL' ? 'Đang xử lý...' : 'Đánh dấu gửi tất cả'}
          </button>
          <button onClick={load} className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
            <RefreshCw size={14} /> Tải lại
          </button>
        </div>
      </div>

      <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-xs text-yellow-700 flex items-start gap-2">
        <MessageCircle size={14} className="shrink-0 mt-0.5" />
        <span>
          Đây là danh sách license key chờ gửi cho khách hàng. Vì chưa có Zalo OA, bạn có thể sao chép license key
          và gửi thủ công qua SMS/Zalo cá nhân, rồi bấm <strong>Đánh dấu đã gửi</strong>.
        </span>
      </div>

      {loading && <div className="text-center text-gray-400 py-8">Đang tải...</div>}
      {error && <div className="text-red-500 text-sm text-center py-4">{error}</div>}
      {!loading && !error && jobs.length === 0 && (
        <div className="text-center text-gray-400 py-8">✅ Không có job nào đang chờ</div>
      )}

      <div className="space-y-3">
        {jobs.map(job => {
          const license = getLicenseFromPayload(job.payloadJson);
          const isWorking = working === job.id;
          return (
            <div key={job.id} className="border border-gray-200 rounded-xl p-4 bg-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-400">{job.id.slice(0, 8)}…</span>
                  <StatusBadge status={job.status} />
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{job.channel}</span>
                </div>
                <span className="text-xs text-gray-400">{fmtDate(job.createdAt)}</span>
              </div>

              <div className="text-xs text-gray-500 mb-2">
                Khách hàng: <span className="font-medium text-gray-700">{job.userId}</span>
              </div>

              {license && (
                <div className="flex items-center gap-2 bg-purple-50 border border-dashed border-purple-200 rounded-lg px-3 py-2 mb-3">
                  <Key size={13} className="text-purple-500 shrink-0" />
                  <span className="font-mono text-purple-700 font-bold text-sm tracking-wider">{license}</span>
                  <CopyBtn text={license} />
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => markSent(job.id)}
                  disabled={isWorking}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 px-3 transition-colors disabled:opacity-50"
                >
                  <CheckCircle size={13} /> Đánh dấu đã gửi
                </button>
                <button
                  onClick={() => markFailed(job.id)}
                  disabled={isWorking}
                  className="flex items-center justify-center gap-1.5 text-xs font-medium bg-white border border-red-300 text-red-600 hover:bg-red-50 rounded-lg py-2 px-3 transition-colors disabled:opacity-50"
                >
                  <XCircle size={13} /> Thất bại
                </button>
              </div>

              {job.errorMessage && (
                <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
                  <AlertTriangle size={11} /> {job.errorMessage}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

type Tab = 'summary' | 'customers' | 'notifications';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'summary',       label: 'Tổng quan',    icon: <BarChart2 size={16} /> },
  { id: 'customers',     label: 'Khách hàng',   icon: <Users size={16} /> },
  { id: 'notifications', label: 'Thông báo',    icon: <Bell size={16} /> },
];

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('summary');

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          🛡️ Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">Quản lý khách hàng, license key và thông báo</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.id === 'notifications' && activeTab !== 'notifications' && (
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        {activeTab === 'summary'       && <SummaryTab />}
        {activeTab === 'customers'     && <CustomersTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
      </div>
    </div>
  );
}

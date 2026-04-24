/**
 * Device fingerprint for one-machine-one-id policy.
 * The value is deterministic from hardware/browser rendering signals,
 * so different browsers on the same machine tend to produce the same ID.
 */

const DEVICE_FP_CACHE_KEY = 'hhk_device_fp';

function hash32(str: string, seed: number): number {
  let h = seed;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 0x9e3779b9);
    h ^= h >>> 17;
  }
  h = Math.imul(h, 0xbf58476d);
  h ^= h >>> 31;
  return h >>> 0;
}

function toHex8(n: number): string {
  return n.toString(16).padStart(8, '0');
}

function getCanvasSignal(): string {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 60;

    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-canvas';

    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#ff6200';
    ctx.fillRect(100, 1, 80, 26);

    ctx.fillStyle = '#006699';
    ctx.font = '12px Arial,sans-serif';
    ctx.fillText('HHK2026', 2, 18);

    ctx.fillStyle = 'rgba(66,204,0,0.75)';
    ctx.font = '20px Arial Black,sans-serif';
    ctx.fillText('HOC HUNG KHOI', 4, 52);

    return canvas.toDataURL().slice(-96);
  } catch {
    return 'canvas-err';
  }
}

function getWebGLSignal(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return 'no-webgl';

    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (ext) {
      const vendor = String(gl.getParameter(ext.UNMASKED_VENDOR_WEBGL));
      const renderer = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL));
      return `${vendor}|${renderer}`;
    }

    const vendor = String(gl.getParameter(gl.VENDOR));
    const renderer = String(gl.getParameter(gl.RENDERER));
    return `${vendor}|${renderer}`;
  } catch {
    return 'webgl-err';
  }
}

function buildSignals(): string {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return [
    navigator.platform,
    String(navigator.hardwareConcurrency ?? 0),
    String(nav.deviceMemory ?? 0),
    `${screen.width}x${screen.height}x${screen.colorDepth}`,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    getWebGLSignal(),
    getCanvasSignal(),
  ].join('||');
}

export function computeDeviceId(): string {
  const sig = buildSignals();
  const a = toHex8(hash32(sig, 0xdeadbeef));
  const b = toHex8(hash32(sig, 0x41c6ce57));
  const c = toHex8(hash32(sig, 0x9e3779b1));
  const d = toHex8(hash32(sig, 0xbf58476d));

  return `${a}-${b.slice(0, 4)}-4${b.slice(5, 8)}-${c.slice(0, 4)}-${c.slice(4)}${d}`;
}

export function getDeviceId(): string {
  const cached = localStorage.getItem(DEVICE_FP_CACHE_KEY);
  if (cached) return cached;

  const id = computeDeviceId();
  try {
    localStorage.setItem(DEVICE_FP_CACHE_KEY, id);
  } catch {
    // Ignore storage quota errors.
  }
  return id;
}

import { useTheme, themes } from '../../../shared/themes';
import type { ThemeConfig } from '../../../shared/themes';
import { Check } from 'lucide-react';

export function ThemePage() {
  const { theme, setThemeById } = useTheme();

  return (
    <div className="fade-in max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary-dark)' }}>
        🎨 Chọn Giao Diện
      </h1>
      <p className="mb-6" style={{ color: 'var(--color-text-light)' }}>
        Chọn theme yêu thích để học thêm vui nhé!
      </p>

      <div className="grid grid-cols-2 gap-5">
        {themes.map((t: ThemeConfig) => {
          const isActive = t.id === theme.id;
          return (
            <button
              key={t.id}
              onClick={() => setThemeById(t.id)}
              className="card relative text-left transition-all"
              style={{
                border: isActive ? `3px solid ${t.colors.primary}` : '3px solid transparent',
                background: t.colors.backgroundCard,
              }}
            >
              {/* Active check */}
              {isActive && (
                <div
                  className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: t.colors.primary }}
                >
                  <Check size={16} color="white" />
                </div>
              )}

              {/* Theme preview */}
              <div className="flex items-center gap-4 mb-3">
                <span className="text-4xl">{t.emoji}</span>
                <div>
                  <div className="font-bold text-lg" style={{ color: t.colors.text }}>
                    {t.name}
                  </div>
                  <div className="text-sm" style={{ color: t.colors.textLight }}>
                    Bạn {t.mascotName}
                  </div>
                </div>
              </div>

              {/* Color swatches */}
              <div className="flex gap-2 mt-2">
                {[t.colors.primary, t.colors.primaryLight, t.colors.secondary, t.colors.accent, t.colors.surface].map(
                  (color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white"
                      style={{ background: color, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    />
                  ),
                )}
              </div>

              {/* Preview gradient */}
              <div
                className="mt-3 h-12 rounded-lg"
                style={{ background: t.gradientBg }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

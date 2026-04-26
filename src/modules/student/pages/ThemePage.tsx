import { Check } from 'lucide-react';
import { MascotCharacter } from '../../../shared/components';
import { themes, useTheme } from '../../../shared/themes';
import type { ThemeConfig } from '../../../shared/themes';

export function ThemePage() {
  const { theme, setThemeById } = useTheme();

  return (
    <div className="fade-in max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary-dark)' }}>
        Chọn giao diện
      </h1>
      <p className="mb-6" style={{ color: 'var(--color-text-light)' }}>
        Chọn theme yêu thích để học vui hơn mỗi ngày.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {themes.map((themeOption: ThemeConfig) => {
          const isActive = themeOption.id === theme.id;

          return (
            <button
              key={themeOption.id}
              onClick={() => setThemeById(themeOption.id)}
              className="card relative text-left transition-all"
              style={{
                border: isActive ? `3px solid ${themeOption.colors.primary}` : '3px solid transparent',
                background: themeOption.colors.backgroundCard,
              }}
            >
              {isActive && (
                <div
                  className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: themeOption.colors.primary }}
                >
                  <Check size={16} color="white" />
                </div>
              )}

              <div className="flex items-center gap-4 mb-3">
                <span
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl shrink-0"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.78))',
                    border: `1px solid ${themeOption.colors.primary}22`,
                    boxShadow: `0 10px 20px ${themeOption.colors.primary}1A`,
                  }}
                >
                  <MascotCharacter size="sm" themeId={themeOption.id} />
                </span>
                <div>
                  <div className="font-bold text-lg" style={{ color: themeOption.colors.text }}>
                    {themeOption.name}
                  </div>
                  <div className="text-sm" style={{ color: themeOption.colors.textLight }}>
                    Bạn {themeOption.mascotName}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                {[
                  themeOption.colors.primary,
                  themeOption.colors.primaryLight,
                  themeOption.colors.secondary,
                  themeOption.colors.accent,
                  themeOption.colors.surface,
                ].map((color, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full border-2 border-white"
                    style={{ background: color, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                  />
                ))}
              </div>

              <div className="mt-3 h-12 rounded-lg" style={{ background: themeOption.gradientBg }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

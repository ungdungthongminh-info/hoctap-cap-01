import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ThemeConfig, defaultTheme, getThemeById } from './themeConfig';
import { STORAGE_KEYS } from '../constants/storageKeys';

interface ThemeContextType {
  theme: ThemeConfig;
  setThemeById: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  setThemeById: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);

  // Load saved theme from localStorage
  useEffect(() => {
    const savedThemeId = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedThemeId) {
      setTheme(getThemeById(savedThemeId));
    }
  }, []);

  // Apply CSS variables whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    const c = theme.colors;
    root.style.setProperty('--color-primary', c.primary);
    root.style.setProperty('--color-primary-light', c.primaryLight);
    root.style.setProperty('--color-primary-dark', c.primaryDark);
    root.style.setProperty('--color-secondary', c.secondary);
    root.style.setProperty('--color-accent', c.accent);
    root.style.setProperty('--color-background', c.background);
    root.style.setProperty('--color-background-card', c.backgroundCard);
    root.style.setProperty('--color-surface', c.surface);
    root.style.setProperty('--color-text', c.text);
    root.style.setProperty('--color-text-light', c.textLight);
    root.style.setProperty('--color-success', c.success);
    root.style.setProperty('--color-error', c.error);
    root.style.setProperty('--color-warning', c.warning);
    root.style.setProperty('--color-star', c.star);
    root.style.setProperty('--gradient-bg', theme.gradientBg);

    // Set pattern class on body
    document.body.className = `theme-${theme.id} ${theme.patternClass}`;
  }, [theme]);

  const setThemeById = useCallback((id: string) => {
    const newTheme = getThemeById(id);
    setTheme(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, id);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setThemeById }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

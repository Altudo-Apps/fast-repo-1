import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
  isHydrated: boolean;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  toggleTheme: () => {},
  isHydrated: false,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  defaultTheme?: Theme;
}> = ({ children, defaultTheme = 'light' }) => {
  // Always start with defaultTheme on both server and client to avoid hydration mismatch
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize theme from localStorage after mount (client-side only)
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
    setIsHydrated(true);
  }, []);

  // Apply theme class to document and persist to localStorage
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('light', 'dark');
    html.classList.add(theme);

    // Only persist to localStorage after hydration to avoid overwriting user preference
    if (isHydrated) {
      localStorage.setItem('theme', theme);
    }
  }, [theme, isHydrated]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (event: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        setTheme(event.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isHydrated }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

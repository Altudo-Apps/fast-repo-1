import { JSX } from 'react';
import { ComponentParams, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { useTheme } from 'src/core/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeSelectorProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  className?: string;
}

export const Default = ({ className = '' }: ThemeSelectorProps): JSX.Element => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className={`p-2 rounded-full cursor-pointer hover:shadow-[0_0_6px_2px_rgba(107,182,0,0.3)] dark:hover:shadow-[0_0_6px_2px_rgba(107,182,0,0.2)] transition-all duration-200 ease-in-out ${className}`}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-primary rounded-full" />
      ) : (
        <Sun className="h-5 w-5 text-chart-3 rounded-full" />
      )}
    </button>
  );
};

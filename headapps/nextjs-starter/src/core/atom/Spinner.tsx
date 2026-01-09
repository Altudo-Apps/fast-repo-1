// Spinner component
import React from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg';

type SpinnerProps = {
  loading?: boolean;
  size?: SpinnerSize;
  label?: string;
  className?: string;
};

const sizeClasses = {
  sm: 'h-5 w-5',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

const Spinner = ({
  loading = false,
  size = 'md',
  label = 'Loading…',
  className = '',
}: SpinnerProps) => {
  // Return null if not loading
  if (!loading) {
    return null;
  }

  return (
    <div
      className={`flex justify-center items-center ${className}`}
      role="status"
      aria-live="polite"
    >
      {/* Screen reader only text */}
      <span className="sr-only">{label}</span>

      {/* Visual spinner */}
      <div
        className={`animate-spin rounded-full border-2 border-transparent border-t-gray-900 dark:border-t-gray-100 ${sizeClasses[size]}`}
        aria-hidden="true"
      ></div>
    </div>
  );
};

export default Spinner;

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface DropdownButtonProps {
  ariaControls?: string;
  onClick?: () => void;
  disabled?: boolean;
  title: string;
  isOpen?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

const DropdownButton = React.forwardRef<HTMLButtonElement, DropdownButtonProps>(
  ({ ariaControls, onClick, disabled, title, isOpen, className, icon }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-controls={ariaControls}
        aria-expanded={isOpen}
        className={cn(
          'group inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          'focus:outline-none focus-visible:outline-none',
          'disabled:pointer-events-none disabled:opacity-50',
          className
        )}
      >
        {icon && (
          <span className="flex items-center [&>*]:text-primary [&>*]:opacity-80 group-hover:[&>*]:opacity-70">
            {icon}
          </span>
        )}
        <span className="text-primary opacity-80 group-hover:opacity-70 transition-opacity">
          {title}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-primary opacity-80 transition-all duration-200 group-hover:opacity-70',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>
    );
  }
);

DropdownButton.displayName = 'DropdownButton';

export default DropdownButton;

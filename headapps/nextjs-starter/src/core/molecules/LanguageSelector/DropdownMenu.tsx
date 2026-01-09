import React from 'react';
import LanguageFlagIcon from 'src/core/atom/LanguageFlagIcon';
import { cn } from 'src/core/lib/utils';
import { DropdownMenuProps } from './LanguageSelector.type';

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  selectedItem,
  onSelectItem,
  className,
}) => {
  return (
    <div className="absolute top-full left-0 mt-1 z-[9999]">
      <div
        id="Language-selector-dropdown"
        className={cn(
          'w-fit max-w-[200px] rounded-md border border-border bg-popover text-popover-foreground shadow-md',
          'animate-in fade-in-0 zoom-in-95',
          className
        )}
        role="menu"
        aria-labelledby="language-selector-label"
      >
        {/* Language options */}
        <div className="px-0.5">
          {items.map((item) => {
            const isSelected = item.code === selectedItem?.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() =>
                  onSelectItem({
                    ...item,
                    languageLabel: selectedItem?.languageLabel || '',
                  })
                }
                className={cn(
                  'flex w-full items-center gap-2 rounded-sm px-3 py-1.5 text-sm whitespace-nowrap',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus:bg-accent focus:text-accent-foreground focus:outline-none',
                  'transition-colors cursor-pointer',
                  isSelected && 'bg-accent text-accent-foreground'
                )}
                role="menuitemradio"
                aria-checked={isSelected}
              >
                <LanguageFlagIcon src={item.icon} alt="" />
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;

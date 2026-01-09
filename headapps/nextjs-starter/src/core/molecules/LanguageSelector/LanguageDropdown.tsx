import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/core/ui/dropdown-menu';
import DropdownButton from 'src/core/atom/DropdownButton';
import LanguageFlagIcon from 'src/core/atom/LanguageFlagIcon';
import { LanguageDropdownProps } from './LanguageSelector.type';

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  selectedLanguage,
  availableLanguages,
  onLanguageSelect,
  disabled = false,
  isOpen,
  onOpenChange,
  languageLabel,
}) => {
  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <DropdownButton
          ariaControls="language-selector-dropdown"
          disabled={disabled}
          title={selectedLanguage.title}
          isOpen={isOpen}
          className="align-middle"
          icon={<LanguageFlagIcon src={selectedLanguage.icon} alt={selectedLanguage.alt} />}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {availableLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() =>
              onLanguageSelect({
                ...lang,
                languageLabel: languageLabel || '',
              })
            }
            className="cursor-pointer"
          >
            <LanguageFlagIcon src={lang.icon} alt={lang.alt} className="mr-2" />
            <span>{lang.title}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;

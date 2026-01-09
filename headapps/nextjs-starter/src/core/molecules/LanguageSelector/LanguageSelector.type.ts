export interface LanguageOption {
  title: string;
  code: string;
  icon: string;
  alt: string;
  url: string;
}

export interface LanguageOptionWithId extends LanguageOption {
  id: string;
}

export interface SelectedLanguage extends LanguageOption {
  languageLabel?: string;
}

export interface LanguageDropdownProps {
  selectedLanguage: LanguageOption & { languageLabel?: string };
  availableLanguages: LanguageOption[];
  onLanguageSelect: (language: LanguageOption & { languageLabel: string }) => void;
  disabled?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  languageLabel?: string;
}

export interface DropdownMenuProps {
  items: LanguageOptionWithId[];
  selectedItem: LanguageOptionWithId & {
    languageLabel?: string;
  };
  onSelectItem: (item: LanguageOptionWithId & { languageLabel: string }) => void;
  className?: string;
}

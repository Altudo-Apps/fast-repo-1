import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Globe } from 'lucide-react';
import { TextField } from '@sitecore-content-sdk/nextjs';
import DropdownMenu from 'src/core/molecules/LanguageSelector/DropdownMenu';
import DropdownButton from 'src/core/atom/DropdownButton';
import LanguageFlagIcon from 'src/core/atom/LanguageFlagIcon';

// GraphQL response types
interface LanguageItemFromGraphQL {
  id: string;
  url: string;
  name: string;
  displayName: string;
  fields: {
    LanguageTitle: { value: string };
    Alias: { value: string };
    IconImageUrl?: { value?: { src?: string; alt?: string } };
  };
}

interface LanguageSelectorFieldsProps {
  fields: {
    data: {
      language: {
        languageLabel: TextField;
        siteLanguages: {
          jsonValue: LanguageItemFromGraphQL[];
        };
      };
    };
  };
  params?: { [key: string]: string };
}

// Transformed language item for component use
interface TransformedLanguageItem {
  id: string;
  title: string;
  code: string;
  icon: string;
  alt: string;
  url: string;
}

interface LanguageSelectorProps {
  languages: TransformedLanguageItem[];
  languageLabel: string | undefined;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ languages, languageLabel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Helper function to find matching language based on locale
  const findLanguageByLocale = (
    languagesList: TransformedLanguageItem[],
    locale: string | undefined
  ): TransformedLanguageItem | null => {
    if (!languagesList || languagesList.length === 0 || !locale) {
      return languagesList?.[0] || null;
    }

    const localeLower = locale.toLowerCase();

    // First, try to find exact match with full locale (e.g., 'ar-AE', 'fr-CA')
    let matchedLanguage = languagesList.find((lang) => lang?.code?.toLowerCase() === localeLower);

    // If no exact match, try to find by locale prefix (e.g., 'ar' from 'ar-AE', 'fr' from 'fr-CA')
    if (!matchedLanguage) {
      const localePrefix = localeLower.split('-')[0];
      matchedLanguage = languagesList.find((lang) => lang?.code?.toLowerCase() === localePrefix);
    }

    // If still no match, try to find by checking if locale starts with language code
    if (!matchedLanguage) {
      matchedLanguage = languagesList.find((lang) =>
        localeLower.startsWith(lang?.code?.toLowerCase() + '-')
      );
    }

    // Fallback to first language if no match found
    return matchedLanguage || languagesList[0] || null;
  };

  // Initialize selectedLanguage based on current locale
  const [selectedLanguage, setSelectedLanguage] = useState<TransformedLanguageItem | null>(() => {
    return findLanguageByLocale(languages, router.locale);
  });

  const isDropDownDisabled = !languages || languages.length <= 1;

  // Set HTML dir attribute based on locale
  // This handles initial page load and route changes
  useEffect(() => {
    const updateDir = () => {
      if (router.locale) {
        const dir = router.locale.toLowerCase() === 'ar-ae' ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('dir', dir);
      }
    };

    // Set dir on initial load
    updateDir();

    // Set dir after route change completes
    router.events.on('routeChangeComplete', updateDir);

    return () => {
      router.events.off('routeChangeComplete', updateDir);
    };
  }, [router.locale, router.events]);

  useEffect(() => {
    if (languages && languages.length > 0 && router.locale) {
      const matchedLanguage = findLanguageByLocale(languages, router.locale);
      if (matchedLanguage) {
        setSelectedLanguage(matchedLanguage);
      }
    }
  }, [languages, router.locale]);

  const handleLanguageSelect = (language: TransformedLanguageItem & { languageLabel: string }) => {
    setSelectedLanguage(language);
    setIsOpen(false);

    // Find matching locale from Next.js locales dynamically
    const languageCode = language.code.toLowerCase();
    const matchingLocale =
      router.locales?.find(
        (locale) =>
          locale.toLowerCase() === languageCode ||
          locale.toLowerCase().startsWith(`${languageCode}-`)
      ) || languageCode;

    // Navigate to the same page path in the new locale
    // Use asPath to get the clean URL without internal route tokens
    // The dir attribute will be set after navigation completes via the useEffect
    const currentPath = router.asPath.split('?')[0].split('#')[0];
    router.push(currentPath, undefined, { locale: matchingLocale });
  };

  const handleClick = () => {
    if (isDropDownDisabled) return;
    setIsOpen(!isOpen);
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event?.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleFocus = (event: FocusEvent) => {
      const target = event.target as Node;
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('focus', handleFocus, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('focus', handleFocus, true);
    };
  }, [isOpen]);

  // Don't render if no languages or selected language
  if (!languages || languages.length === 0 || !selectedLanguage) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-1.5" ref={dropdownRef}>
        <div className="relative inline-block" id="language-selector">
          {/* Dropdown Button with onClick */}
          <DropdownButton
            ariaControls="Language-selector-dropdown"
            onClick={handleClick}
            disabled={isDropDownDisabled}
            title={selectedLanguage.title}
            isOpen={isOpen}
            className="align-middle"
            icon={
              <>
                <Globe className="h-4 w-4 text-primary" aria-hidden="true" />
                <LanguageFlagIcon src={selectedLanguage.icon} alt={selectedLanguage.alt} />
              </>
            }
          />

          {isOpen && (
            <DropdownMenu
              items={languages}
              selectedItem={{ ...selectedLanguage, languageLabel }}
              onSelectItem={handleLanguageSelect}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Sitecore Default export - receives data from GraphQL and transforms it
export const Default = (props: LanguageSelectorFieldsProps) => {
  const datasource = props.fields?.data;

  if (!datasource) {
    return null;
  }

  // Extract languageLabel
  const languageLabelValue = datasource.language?.languageLabel?.value;
  const languageLabel =
    typeof languageLabelValue === 'string' ? languageLabelValue : languageLabelValue?.toString();

  // Transform GraphQL language items to component format
  const languages: TransformedLanguageItem[] =
    datasource.language?.siteLanguages?.jsonValue?.map((item: LanguageItemFromGraphQL) => ({
      id: item.id,
      title: item.fields.LanguageTitle?.value || item.displayName,
      code: item.fields.Alias?.value || '',
      icon: item.fields.IconImageUrl?.value?.src || '',
      alt: item.fields.IconImageUrl?.value?.alt || item.displayName,
      url: item.url,
    })) || [];

  return <LanguageSelector languages={languages} languageLabel={languageLabel} />;
};

// Make Default the default export so Sitecore uses the wrapper
export default Default;

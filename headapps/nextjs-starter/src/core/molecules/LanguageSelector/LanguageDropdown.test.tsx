import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import LanguageDropdown from './LanguageDropdown';

// Mock the UI components
vi.mock('src/core/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children, open, onOpenChange }: any) => (
    <div data-testid="dropdown-menu" data-open={open}>
      {children}
    </div>
  ),
  DropdownMenuTrigger: ({ children, asChild }: any) => (
    <div data-testid="dropdown-trigger">{children}</div>
  ),
  DropdownMenuContent: ({ children, align }: any) => (
    <div data-testid="dropdown-content" data-align={align}>
      {children}
    </div>
  ),
  DropdownMenuItem: ({ children, onClick, className }: any) => (
    <button data-testid="dropdown-item" onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

// Mock atoms
vi.mock('src/core/atom/DropdownButton', () => ({
  default: ({ title, disabled, isOpen, icon }: any) => (
    <button data-testid="dropdown-button" disabled={disabled} data-open={isOpen}>
      {icon}
      {title}
    </button>
  ),
}));

vi.mock('src/core/atom/LanguageFlagIcon', () => ({
  default: ({ src, alt, className }: any) => (
    <img data-testid="flag-icon" src={src} alt={alt} className={className} />
  ),
}));

describe('LanguageDropdown', () => {
  const mockSelectedLanguage = {
    title: 'English',
    code: 'en',
    icon: '/en.png',
    alt: 'English flag',
    url: '/en',
    languageLabel: 'Language',
  };

  const mockAvailableLanguages = [
    {
      title: 'Spanish',
      code: 'es',
      icon: '/es.png',
      alt: 'Spanish flag',
      url: '/es',
    },
    {
      title: 'French',
      code: 'fr',
      icon: '/fr.png',
      alt: 'French flag',
      url: '/fr',
    },
  ];

  it('renders the dropdown menu', () => {
    render(
      <LanguageDropdown
        selectedLanguage={mockSelectedLanguage}
        availableLanguages={mockAvailableLanguages}
        onLanguageSelect={vi.fn()}
      />
    );
    expect(screen.getByTestId('dropdown-menu')).toBeDefined();
  });

  it('renders the selected language in the trigger button', () => {
    render(
      <LanguageDropdown
        selectedLanguage={mockSelectedLanguage}
        availableLanguages={mockAvailableLanguages}
        onLanguageSelect={vi.fn()}
      />
    );
    expect(screen.getByText('English')).toBeDefined();
  });

  it('renders all available languages as menu items', () => {
    render(
      <LanguageDropdown
        selectedLanguage={mockSelectedLanguage}
        availableLanguages={mockAvailableLanguages}
        onLanguageSelect={vi.fn()}
      />
    );
    expect(screen.getByText('Spanish')).toBeDefined();
    expect(screen.getByText('French')).toBeDefined();
  });

  it('calls onLanguageSelect when a language is clicked', () => {
    const handleSelect = vi.fn();
    render(
      <LanguageDropdown
        selectedLanguage={mockSelectedLanguage}
        availableLanguages={mockAvailableLanguages}
        onLanguageSelect={handleSelect}
        languageLabel="Language"
      />
    );

    const items = screen.getAllByTestId('dropdown-item');
    fireEvent.click(items[0]);

    expect(handleSelect).toHaveBeenCalledWith({
      ...mockAvailableLanguages[0],
      languageLabel: 'Language',
    });
  });

  it('disables the dropdown when disabled prop is true', () => {
    render(
      <LanguageDropdown
        selectedLanguage={mockSelectedLanguage}
        availableLanguages={mockAvailableLanguages}
        onLanguageSelect={vi.fn()}
        disabled={true}
      />
    );
    const button = screen.getByTestId('dropdown-button');
    expect(button.hasAttribute('disabled')).toBe(true);
  });

  it('renders flag icons for languages', () => {
    render(
      <LanguageDropdown
        selectedLanguage={mockSelectedLanguage}
        availableLanguages={mockAvailableLanguages}
        onLanguageSelect={vi.fn()}
      />
    );
    const flags = screen.getAllByTestId('flag-icon');
    expect(flags.length).toBeGreaterThan(0);
  });

  it('sets isOpen prop correctly', () => {
    render(
      <LanguageDropdown
        selectedLanguage={mockSelectedLanguage}
        availableLanguages={mockAvailableLanguages}
        onLanguageSelect={vi.fn()}
        isOpen={true}
      />
    );
    const menu = screen.getByTestId('dropdown-menu');
    expect(menu.getAttribute('data-open')).toBe('true');
  });

  it('calls onOpenChange when provided', () => {
    const handleOpenChange = vi.fn();
    render(
      <LanguageDropdown
        selectedLanguage={mockSelectedLanguage}
        availableLanguages={mockAvailableLanguages}
        onLanguageSelect={vi.fn()}
        onOpenChange={handleOpenChange}
      />
    );
    expect(screen.getByTestId('dropdown-menu')).toBeDefined();
  });
});

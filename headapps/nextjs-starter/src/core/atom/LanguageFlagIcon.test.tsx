import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import LanguageFlagIcon from './LanguageFlagIcon';

describe('LanguageFlagIcon', () => {
  it('renders image with correct src and alt', () => {
    render(<LanguageFlagIcon src="/flag.png" alt="Test Flag" />);
    const image = screen.getByRole('img');
    expect(image).toBeDefined();
    expect(image.getAttribute('alt')).toBe('Test Flag');
  });

  it('applies custom className', () => {
    render(<LanguageFlagIcon src="/flag.png" alt="Test Flag" className="custom-class" />);
    const image = screen.getByRole('img');
    expect(image.className).toContain('custom-class');
  });

  it('returns null when src is empty', () => {
    const { container } = render(<LanguageFlagIcon src="" alt="Test Flag" />);
    expect(container.querySelector('img')).toBeNull();
  });

  it('applies inline-block class by default', () => {
    render(<LanguageFlagIcon src="/flag.png" alt="Test Flag" />);
    const image = screen.getByRole('img');
    expect(image.className).toContain('inline-block');
  });
});

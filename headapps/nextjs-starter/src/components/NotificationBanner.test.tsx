import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockCn } from 'src/test-utils';
import type { NotificationBannerProps } from 'src/types/NotificationBanner.types';
import { Default, Error } from './NotificationBanner';

// Mock Sitecore JSS RichText, SitecoreImage, and useSitecore
vi.mock('@sitecore-content-sdk/nextjs', () => ({
  RichText: vi.fn(({ field, tag }: any) => (
    <div data-testid="rich-text" data-tag={tag}>
      {field?.value || ''}
    </div>
  )),
  useSitecore: vi.fn(() => ({
    page: {
      siteName: 'defaultSite',
    },
  })),
}));

vi.mock('src/core/atom/Images', () => ({
  SitecoreImage: vi.fn(({ field, className }: any) => (
    <img
      data-testid="sitecore-image"
      src={field?.value?.src}
      alt={field?.value?.alt}
      className={className}
    />
  )),
}));

// Mock Alert and Button UI components
vi.mock('src/core/ui/alert', () => ({
  Alert: vi.fn(({ children, ...props }: any) => (
    <div data-testid="alert" {...props}>
      {children}
    </div>
  )),
}));

vi.mock('src/core/ui/button', () => ({
  Button: vi.fn(({ children, ...props }: any) => (
    <button data-testid="button" {...props}>
      {children}
    </button>
  )),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  X: () => <svg data-testid="icon-x" />,
  AlertCircle: () => <svg data-testid="icon-alert-circle" />,
}));

const mockFields: NotificationBannerProps['fields'] = {
  BannerIcon: { value: { src: '/test-icon.png', alt: 'Test Icon' } } as any,
  BannerTitle: { value: 'Test Banner Title' } as any,
  BannerText: { value: 'Test banner text.' } as any,
};

const mockParams = {
  RenderingIdentifier: 'notif-123',
  styles: 'test-banner-styles',
  style: 'test-error-style',
};

const mockRendering = {
  componentName: 'NotificationBanner',
  params: mockParams,
} as any;

const getDefaultProps = (
  fields = mockFields,
  params = mockParams,
  rendering = mockRendering
): NotificationBannerProps => ({
  fields,
  params,
  rendering,
});

describe('NotificationBanner', () => {
  let localStorageStore: Record<string, string> = {};

  beforeEach(() => {
    mockCn();
    localStorageStore = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => localStorageStore[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageStore[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageStore[key];
      }),
      clear: vi.fn(() => {
        localStorageStore = {};
      }),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  describe('Default variant', () => {
    it('renders with required props', () => {
      render(<Default {...getDefaultProps()} />);
      expect(screen.getByTestId('alert')).toBeInTheDocument();
      const richTexts = screen.getAllByTestId('rich-text');
      expect(richTexts[0]).toHaveTextContent('Test Banner Title');
      expect(richTexts[1]).toHaveTextContent('Test banner text.');
      expect(screen.getByTestId('sitecore-image')).toHaveAttribute('src', '/test-icon.png');
      expect(screen.getByTestId('sitecore-image')).toHaveAttribute('alt', 'Test Icon');
      expect(screen.getByTestId('button')).toBeInTheDocument();
      expect(screen.getByTestId('icon-x')).toBeInTheDocument();
    });

    it('applies styles and id from params', () => {
      render(<Default {...getDefaultProps()} />);
      const wrapper = screen.getByTestId('alert').parentElement;
      expect(wrapper).toHaveAttribute('id', 'notif-123');
      expect(wrapper).toHaveClass('test-banner-styles');
    });

    it('hides banner if localStorage indicates closed', () => {
      localStorageStore['notification-defaultSite-notif-123-closed'] = 'true';
      render(<Default {...getDefaultProps()} />);
      // Should not render anything
      expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
    });

    it('closes banner and sets localStorage on close button click', async () => {
      render(<Default {...getDefaultProps()} />);
      await userEvent.click(screen.getByTestId('button'));
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'notification-defaultSite-notif-123-closed',
        'true'
      );
      await waitFor(() => {
        expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
      });
    });

    it('handles missing optional fields gracefully', () => {
      const fields = { ...mockFields, BannerIcon: undefined } as any;
      render(<Default {...getDefaultProps(fields)} />);
      expect(screen.queryByTestId('sitecore-image')).not.toBeInTheDocument();
      expect(screen.getByTestId('alert')).toBeInTheDocument();
      const richTexts = screen.getAllByTestId('rich-text');
      expect(richTexts[0]).toHaveTextContent('Test Banner Title');
      expect(richTexts[1]).toHaveTextContent('Test banner text.');
    });

    it('handles missing params gracefully', () => {
      const props = getDefaultProps(mockFields, {} as any, mockRendering);
      render(<Default {...props} />);
      expect(screen.getByTestId('alert')).toBeInTheDocument();
    });

    it('handles missing fields gracefully', () => {
      const props = getDefaultProps({} as any, mockParams, mockRendering);
      render(<Default {...props} />);
      expect(screen.getByTestId('alert')).toBeInTheDocument();
    });

    it('uses default id when RenderingIdentifier is missing', () => {
      const { RenderingIdentifier, ...paramsWithoutId } = mockParams;
      const props = getDefaultProps(mockFields, paramsWithoutId as any, mockRendering);
      render(<Default {...props} />);
      expect(screen.getByTestId('alert')).toBeInTheDocument();
    });
  });

  describe('Error variant', () => {
    it('renders with required props', () => {
      render(<Error {...getDefaultProps()} />);
      expect(screen.getByTestId('alert')).toBeInTheDocument();
      expect(screen.getByTestId('icon-alert-circle')).toBeInTheDocument();
      const richTexts = screen.getAllByTestId('rich-text');
      expect(richTexts[0]).toHaveTextContent('Test Banner Title');
      expect(richTexts[1]).toHaveTextContent('Test banner text.');
      expect(screen.getByTestId('button')).toBeInTheDocument();
      expect(screen.getByTestId('icon-x')).toBeInTheDocument();
    });

    it('applies style and id from params', () => {
      render(<Error {...getDefaultProps()} />);
      // The outermost wrapper (from NotificationBanner.tsx)
      const alert = screen.getByTestId('alert');
      const outerWrapper = alert.parentElement?.parentElement;
      expect(outerWrapper).toHaveAttribute('id', 'notif-123');
      expect(outerWrapper).toHaveClass('test-error-style');
      // The inner wrapper (from ErrorBanner.tsx)
      const innerWrapper = alert.parentElement;
      expect(innerWrapper).toHaveClass('test-banner-styles', 'w-full');
    });

    it('hides banner if localStorage indicates closed', () => {
      localStorageStore['notification-defaultSite-notif-123-closed'] = 'true';
      render(<Error {...getDefaultProps()} />);
      expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
    });

    it('closes banner and sets localStorage on close button click', async () => {
      render(<Error {...getDefaultProps()} />);
      await userEvent.click(screen.getByTestId('button'));
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'notification-defaultSite-notif-123-closed',
        'true'
      );
      await waitFor(() => {
        expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
      });
    });

    it('handles missing optional fields gracefully', () => {
      const fields = { ...mockFields, BannerIcon: undefined } as any;
      render(<Error {...getDefaultProps(fields)} />);
      expect(screen.getByTestId('alert')).toBeInTheDocument();
      const richTexts = screen.getAllByTestId('rich-text');
      expect(richTexts[0]).toHaveTextContent('Test Banner Title');
      expect(richTexts[1]).toHaveTextContent('Test banner text.');
    });

    it('handles missing params gracefully', () => {
      const props = getDefaultProps(mockFields, {} as any, mockRendering);
      render(<Error {...props} />);
      expect(screen.getByTestId('alert')).toBeInTheDocument();
    });

    it('handles missing fields gracefully', () => {
      const props = getDefaultProps({} as any, mockParams, mockRendering);
      render(<Error {...props} />);
      expect(screen.getByTestId('alert')).toBeInTheDocument();
    });
  });
});

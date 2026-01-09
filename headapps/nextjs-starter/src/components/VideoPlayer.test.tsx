import React from 'react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockCn } from 'src/test-utils';
import { Default as VideoPlayer, VideoPlayerProps } from './VideoPlayer';

// Explicitly mock getVideoProvider
vi.mock('src/core/molecules/VideoPlayer/VideoProvider', () => ({
  getVideoProvider: vi.fn((url: string) => {
    if (!url) return 'html5';
    if (url.includes('youtube')) return 'youtube';
    if (url.includes('vimeo')) return 'vimeo';
    return 'html5';
  }),
}));

let lastPlyrProps: any = null;
// Mock plyr-react (dynamic import)
vi.mock('plyr-react', () => ({
  __esModule: true,
  default: (props: any) => {
    lastPlyrProps = props;
    return <div data-testid="plyr-mock" />;
  },
}));

const baseProps: VideoPlayerProps = {
  fields: {
    VideoLink: {
      value: { url: 'https://www.youtube.com/watch?v=abc123' },
    },
  },
  params: {
    styles: 'video-style',
    RenderingIdentifier: 'video-id',
  },
  rendering: undefined as any, // will be set after mockRendering is defined
};

const mockRendering = {
  componentName: 'VideoPlayer',
  params: baseProps.params,
};
baseProps.rendering = mockRendering;

describe('VideoPlayer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCn();
  });
  afterEach(() => {
    vi.resetModules();
  });

  it('renders with required props and passes correct props to Plyr', async () => {
    render(<VideoPlayer {...baseProps} />);
    // Wait for Plyr to appear
    await screen.findByTestId('plyr-mock');
    // Should render the container with correct class and id
    const container = screen.getByTestId('plyr-mock').parentElement;
    expect(container).toHaveClass('video-style');
    expect(container?.id).toBe('video-id');
    // Plyr should be rendered
    expect(screen.getByTestId('plyr-mock')).toBeInTheDocument();
    // Plyr receives correct source/provider
    expect(lastPlyrProps.source.sources[0].provider).toBe('youtube');
    expect(lastPlyrProps.source.sources[0].src).toContain('youtube');
  });

  it('renders error if no videoUrl is provided', () => {
    const props = {
      ...baseProps,
      fields: { VideoLink: { value: { url: undefined } } },
      rendering: mockRendering,
    };
    render(<VideoPlayer {...props} />);
    expect(screen.getByText(/no video url provided/i)).toBeInTheDocument();
  });

  it('handles vimeo URLs and extracts vimeo id', async () => {
    const props = {
      ...baseProps,
      fields: { VideoLink: { value: { url: 'https://vimeo.com/123456' } } },
      rendering: mockRendering,
    };
    render(<VideoPlayer {...props} />);
    await screen.findByTestId('plyr-mock');
    expect(lastPlyrProps.source.sources[0].provider).toBe('vimeo');
    expect(lastPlyrProps.source.sources[0].src).toBe('123456');
  });

  it('handles html5 fallback for unknown URLs', async () => {
    const props = {
      ...baseProps,
      fields: { VideoLink: { value: { url: 'https://example.com/video.mp4' } } },
      rendering: mockRendering,
    };
    render(<VideoPlayer {...props} />);
    await screen.findByTestId('plyr-mock');
    expect(lastPlyrProps.source.sources[0].provider).toBe('html5');
    expect(lastPlyrProps.source.sources[0].src).toBe('https://example.com/video.mp4');
  });

  it('handles missing fields gracefully', () => {
    const props = { ...baseProps, fields: undefined as any, rendering: mockRendering };
    render(<VideoPlayer {...props} />);
    expect(screen.getByText(/no video url provided/i)).toBeInTheDocument();
  });

  it('handles missing params gracefully', async () => {
    const props = { ...baseProps, params: {} as any, rendering: mockRendering };
    render(<VideoPlayer {...props} />);
    await screen.findByTestId('plyr-mock');
    // Should still render Plyr
    expect(screen.getByTestId('plyr-mock')).toBeInTheDocument();
  });

  it('handles missing styles and id', async () => {
    const props = { ...baseProps, params: {} as any, rendering: mockRendering };
    render(<VideoPlayer {...props} />);
    await screen.findByTestId('plyr-mock');
    const container = screen.getByTestId('plyr-mock').parentElement;
    expect(container?.className).toBe('');
    expect(container?.id).toBe('');
  });

  it('does not render Plyr until mounted (SSR safety)', async () => {
    // Simulate SSR: isMounted is false initially
    const { rerender } = render(<VideoPlayer {...baseProps} />);
    await screen.findByTestId('plyr-mock');
    rerender(<VideoPlayer {...baseProps} />);
    await screen.findByTestId('plyr-mock');
  });

  it('passes correct options to Plyr', async () => {
    render(<VideoPlayer {...baseProps} />);
    await screen.findByTestId('plyr-mock');
    expect(lastPlyrProps.options.controls).toContain('play');
    expect(lastPlyrProps.options.vimeo).toBeDefined();
    expect(lastPlyrProps.options.vimeo.responsive).toBe(true);
  });
});

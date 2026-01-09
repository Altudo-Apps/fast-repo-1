import { describe, it, expect, beforeEach } from 'vitest';
import { getVideoProvider, VideoProvider } from './VideoProvider';
import { mockCn } from 'src/test-utils';

// Use shared mockCn utility for consistency with codebase
beforeEach(() => {
  mockCn();
});

describe('getVideoProvider', () => {
  it('returns "youtube" for youtube.com URLs', () => {
    const urls = [
      'https://www.youtube.com/watch?v=abc123',
      'http://youtube.com/watch?v=xyz',
      'https://www.youtube.com/embed/abc123',
      'https://youtube.com/shorts/abc123',
      'https://m.youtube.com/watch?v=abc123',
      'https://www.youtube.com/v/abc123',
      'https://youtu.be/abc123',
      'http://youtu.be/xyz',
      'https://www.youtu.be/abc123',
    ];
    urls.forEach((url) => {
      expect(getVideoProvider(url)).toBe('youtube');
    });
  });

  it('returns "vimeo" for vimeo.com URLs', () => {
    const urls = [
      'https://vimeo.com/123456',
      'http://vimeo.com/654321',
      'https://www.vimeo.com/987654',
      'https://player.vimeo.com/video/123456',
    ];
    urls.forEach((url) => {
      expect(getVideoProvider(url)).toBe('vimeo');
    });
  });

  it('returns "html5" for non-YouTube/Vimeo URLs', () => {
    const urls = [
      'https://example.com/video.mp4',
      'https://mydomain.com/video.ogg',
      'https://videoservice.com/watch/123',
      'ftp://example.com/video.avi',
      'file:///C:/videos/movie.mov',
      'blob:https://example.com/1234',
    ];
    urls.forEach((url) => {
      expect(getVideoProvider(url)).toBe('html5');
    });
  });

  it('returns "html5" for empty, null, or undefined input', () => {
    expect(getVideoProvider('')).toBe('html5');
    expect(getVideoProvider(undefined as unknown as string)).toBe('html5');
    expect(getVideoProvider(null as unknown as string)).toBe('html5');
  });

  it('is case-insensitive for provider detection', () => {
    expect(getVideoProvider('https://YOUTUBE.com/watch?v=abc')).toBe('youtube');
    expect(getVideoProvider('https://VIMEO.com/123')).toBe('vimeo');
    expect(getVideoProvider('https://YOUTU.BE/abc')).toBe('youtube');
  });

  it('type VideoProvider only allows valid providers', () => {
    // TypeScript type test (compile-time only)
    const valid: VideoProvider[] = ['youtube', 'vimeo', 'html5'];
    expect(valid).toBeDefined();
    // @ts-expect-error 'dailymotion' is not a valid VideoProvider value
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const invalid: VideoProvider = 'dailymotion';
  });
});

export type VideoProvider = 'youtube' | 'vimeo' | 'html5';

export const getVideoProvider = (url: string): VideoProvider => {
  if (!url) return 'html5';

  const youtubeRegex = /(?:youtube\.com|youtu\.be)/i;
  const vimeoRegex = /vimeo\.com/i;

  if (youtubeRegex.test(url)) return 'youtube';
  if (vimeoRegex.test(url)) return 'vimeo';

  // fallback to html5
  return 'html5';
};

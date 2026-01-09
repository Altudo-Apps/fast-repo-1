import { JSX, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'plyr-react/plyr.css';
import { getVideoProvider } from 'src/core/molecules/VideoPlayer/VideoProvider';
import { ComponentProps } from 'lib/component-props';

const Plyr = dynamic(() => import('plyr-react'), { ssr: false });

export type VideoPlayerProps = ComponentProps & {
  fields: {
    VideoLink: {
      value?: { url?: string };
    };
  };
};

export const Default = (props: VideoPlayerProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const videoUrl = props.fields?.VideoLink?.value?.url;
  const provider = getVideoProvider(videoUrl || '');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!videoUrl) {
    return <div>Error: No video URL provided</div>;
  }

  const getVimeoId = (url: string) => {
    const match = url.match(/(?:vimeo\.com\/(?:video\/)?)(\d+)/);
    return match ? match[1] : null;
  };

  const videoSrc = provider === 'vimeo' ? getVimeoId(videoUrl) || videoUrl : videoUrl;

  return (
    <div className={props.params.styles} id={id ? id : undefined}>
      {isMounted && (
        <Plyr
          source={{
            type: 'video',
            sources: [
              {
                src: videoSrc,
                provider: provider,
              },
            ],
          }}
          options={{
            controls: [
              'play-large',
              'play',
              'progress',
              'current-time',
              'mute',
              'volume',
              'fullscreen',
            ],
            clickToPlay: true,
            vimeo: {
              responsive: true,
              byline: false,
              portrait: false,
              title: false,
              speed: true,
              transparent: false,
              dnt: false,
            },
          }}
        />
      )}
    </div>
  );
};

export default Default;

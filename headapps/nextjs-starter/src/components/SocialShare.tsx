import { JSX, useEffect, useState } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  EmailShareButton,
} from 'react-share';
import { SocialShareProps } from 'src/types/SocialShare.types';
import { SitecoreImage } from 'src/core/atom/Images';

export const Default = (props: SocialShareProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, []);

  const imageStyle = {
    maxWidth: '48px',
    width: '100%',
    height: 'auto',
    borderRadius: '50%',
  };

  const iconClassName =
    'max-w-12 h-auto rounded-full dark:bg-secondary-foreground hover:opacity-80 transition-opacity';

  return (
    <div className={props.params.styles} id={id}>
      <div className="flex gap-2.5 my-2.5">
        {shareUrl &&
          props.fields.items.map((item) => (
            <div key={item.id} className="social-share-item">
              {item?.name === 'Facebook' && (
                <FacebookShareButton
                  url={shareUrl}
                  title={String(item.fields.Title.value)}
                  aria-label="Share on Facebook"
                >
                  <SitecoreImage
                    field={item.fields.SocialIcon}
                    className={iconClassName}
                    style={imageStyle}
                    alt="Facebook"
                  />
                </FacebookShareButton>
              )}
              {item?.name === 'LinkedIn' && (
                <LinkedinShareButton
                  url={shareUrl}
                  title={String(item.fields.Title.value)}
                  aria-label="Share on LinkedIn"
                >
                  <SitecoreImage
                    field={item.fields.SocialIcon}
                    className={iconClassName}
                    style={imageStyle}
                    alt="LinkedIn"
                  />
                </LinkedinShareButton>
              )}
              {item?.name === 'X' && (
                <TwitterShareButton
                  url={shareUrl}
                  title={String(item.fields.Title.value)}
                  aria-label="Share on X"
                >
                  <SitecoreImage
                    field={item.fields.SocialIcon}
                    className={iconClassName}
                    style={imageStyle}
                    alt="X (Twitter)"
                  />
                </TwitterShareButton>
              )}
              {item?.name === 'Pinterest' && item?.fields?.Media && (
                <PinterestShareButton
                  url={shareUrl}
                  title={String(item?.fields?.Title?.value)}
                  media={item?.fields?.Media}
                  aria-label="Share on Pinterest"
                >
                  <SitecoreImage
                    field={item.fields.SocialIcon}
                    className={iconClassName}
                    style={imageStyle}
                    alt="Pinterest"
                  />
                </PinterestShareButton>
              )}
              {item?.name === 'Email' && (
                <EmailShareButton
                  url={shareUrl}
                  title={String(item.fields.Title.value)}
                  aria-label="Share via Email"
                >
                  <SitecoreImage
                    field={item.fields.SocialIcon}
                    className={iconClassName}
                    style={imageStyle}
                    alt="Email"
                  />
                </EmailShareButton>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

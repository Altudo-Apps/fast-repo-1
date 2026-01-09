import { JSX } from 'react';
import { SocialLink, SocialLinksProps } from 'src/types/SocialLinks.types';
import { SitecoreLink } from 'src/core/atom/Link';
import { SitecoreImage } from 'src/core/atom/Images';

export const Default = (props: SocialLinksProps): JSX.Element => {
  const items = props.fields?.items || [];
  const id = props.params?.RenderingIdentifier;

  return (
    <div className={`${props.params?.styles || ''}`} id={id}>
      <div className="flex gap-2.5 my-4">
        {items.map((socialLink: SocialLink, socialIndex: number) => (
          <SitecoreLink
            key={socialIndex}
            field={socialLink.fields.SocialLink}
            className="block hover:opacity-80 transition-opacity"
          >
            <SitecoreImage
              field={socialLink.fields.SocialIcon}
              className="max-w-12 h-auto rounded-full dark:bg-secondary-foreground"
              editable={true}
              width={48}
              height={48}
            />
          </SitecoreLink>
        ))}
      </div>
    </div>
  );
};

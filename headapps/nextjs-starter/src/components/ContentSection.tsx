import { JSX } from 'react';
import { PageTitleBannerProps } from 'src/core/molecules/PageTitleBanner/PageTitleBanner.type';
import PlaceholderBanner from 'src/core/molecules/PageTitleBanner/PlaceholderBanner';

const ContentBanner = (props: PageTitleBannerProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;

  return (
    <div className={props.params.styles} id={id}>
      <PlaceholderBanner
        fields={props.fields}
        params={props.params}
        rendering={props.rendering}
        headerTag={props.params.HeaderTag || 'h2'}
      />
    </div>
  );
};

export const Default = ContentBanner;
export const ImageorVideo = ContentBanner;

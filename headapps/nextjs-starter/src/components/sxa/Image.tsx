import { Field, ImageField, LinkField, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import React, { CSSProperties } from 'react';
import { ComponentProps } from 'lib/component-props';
import { SitecoreLink } from 'src/core/atom/Link';
import { SitecoreImage } from 'src/core/atom/Images';

interface ImageFields {
  Image: ImageField;
  ImageCaption: Field<string>;
  TargetUrl: LinkField;
}

export interface ImageProps extends ComponentProps {
  fields: ImageFields;
}

const ImageWrapper: React.FC<{ className: string; id?: string; children: React.ReactNode }> = ({
  className,
  id,
  children,
}) => (
  <div className={className.trim()} id={id}>
    <div className="component-content">{children}</div>
  </div>
);

const ImageDefault: React.FC<ImageProps> = ({ params }) => (
  <ImageWrapper className={`component image ${params.styles}`}>
    <span className="is-empty-hint">Image</span>
  </ImageWrapper>
);

export const Banner: React.FC<ImageProps> = ({ params, fields }) => {
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = params;
  const classHeroBannerEmpty =
    page.mode.isEditing && fields?.Image?.value?.class === 'scEmptyImage'
      ? 'hero-banner-empty'
      : '';
  const backgroundStyle = fields?.Image?.value?.src
    ? ({ backgroundImage: `url('${fields.Image.value.src}')` } as CSSProperties)
    : {};

  const imageField = fields.Image && {
    ...fields.Image,
    value: {
      ...fields.Image.value,
      style: { width: '100%', height: '100%' },
    },
  };

  return (
    <div className={`component hero-banner rounded-lg ${styles} ${classHeroBannerEmpty}`} id={id}>
      <div className="component-content sc-sxa-image-hero-banner" style={backgroundStyle}>
        {page.mode.isEditing && <SitecoreImage field={imageField} />}
      </div>
    </div>
  );
};

export const Default: React.FC<ImageProps> = (props) => {
  const { page } = useSitecore();
  const { fields, params } = props;
  const { styles, RenderingIdentifier: id } = params;

  if (!fields) {
    return <ImageDefault {...props} />;
  }

  const Image = () => <SitecoreImage field={fields.Image} />;
  const shouldWrapWithLink = !page.mode.isEditing && fields.TargetUrl?.value?.href;

  return (
    <ImageWrapper className={`component image ${styles}`} id={id}>
      {shouldWrapWithLink ? (
        <SitecoreLink field={fields.TargetUrl}>
          <Image />
        </SitecoreLink>
      ) : (
        <Image />
      )}
      <Text tag="span" className="image-caption field-imagecaption" field={fields.ImageCaption} />
    </ImageWrapper>
  );
};

import React from 'react';
import { PageTitleBannerProps } from './PageTitleBanner.type';
import { SitecoreImage } from 'src/core/atom/Images';
import { cn } from 'src/core/lib/utils';
import PageTitleContent from './PageTitleContent';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import type { ImageField } from '@sitecore-content-sdk/nextjs';

interface PlaceholderBannerProps extends PageTitleBannerProps {
  headerTag: string;
}

type BackgroundColor = 'bg-primary' | 'bg-secondary' | 'bg-tertiary';

const getBgColor = (styles?: string): BackgroundColor | undefined => {
  return styles?.match(/\bbg-[^\s]+/g)?.[0] as BackgroundColor | undefined;
};

const hasValidImage = (imageField: ImageField): boolean => {
  if (!imageField) return false;

  const hasValue = imageField?.value;
  const hasSrc = imageField?.value?.src;
  const hasMediaId = imageField?.value?.id;
  const hasAlt = imageField?.value?.alt;
  const srcIsValid = hasSrc && hasSrc !== '' && !hasSrc.includes('/-/media/');

  return !!(hasValue && (srcIsValid || hasMediaId || hasAlt));
};

const PlaceholderBanner: React.FC<PlaceholderBannerProps> = ({
  fields,
  params,
  rendering,
  headerTag,
}) => {
  const { Image } = fields;
  const VerticalAlignment = params?.VerticalTextAlignment || 'center';
  const BackgroundColor = getBgColor(params?.styles);
  const ImageOrder = params?.ImageOrder || 'left';
  const CardOrientation = params?.CardOrientation || 'horizontal';
  const bannerKey = `bannercontent-${params?.DynamicPlaceholderId || ''}`;
  const hasPlaceholder = params?.FieldNames === 'ImageorVideo';
  const imageExists = Image ? hasValidImage(Image) : false;
  const isCentered = params?.styles?.includes('position-center');
  const isLeft = params?.styles?.includes('position-left');
  const isRight = params?.styles?.includes('position-right');
  const isFullWidth = !hasPlaceholder || params?.FieldNames === 'Default';

  return (
    <section
      className={cn('w-full relative flex justify-center items-center overflow-hidden', {
        'lg:min-h-96': imageExists || BackgroundColor,
      })}
    >
      {imageExists && (
        <div className="absolute inset-0 z-0">
          <SitecoreImage
            field={Image}
            className="w-full h-full object-cover"
            priority
            fill
            alt={Image?.value?.alt || ''}
          />
        </div>
      )}

      <div
        className={cn('absolute inset-0 z-5', {
          'bg-primary': BackgroundColor === 'bg-primary',
          'bg-secondary': BackgroundColor === 'bg-secondary',
          'bg-tertiary': BackgroundColor === 'bg-tertiary',
        })}
        style={{
          opacity: imageExists ? 0.7 : 1,
          backgroundColor: imageExists ? 'var(--accent-foreground)' : undefined,
        }}
      />

      <div
        className={cn('relative z-10 flex w-full h-full gap-8 container mx-auto', {
          'py-12 lg:px-12 px-4': imageExists || BackgroundColor,
          'py-6': !imageExists && !BackgroundColor,
          'flex-col items-center justify-center': isFullWidth,
          'flex-col items-center lg:flex-row max-md:flex-col': !isFullWidth,
          'text-center justify-center': isCentered,
          'text-left justify-start': isLeft && !isCentered,
          'text-right justify-end': isRight && !isCentered,
        })}
      >
        <div
          className={cn('flex flex-col z-20 max-w-full', {
            'w-full': isFullWidth,
            'w-full lg:w-1/2': !isFullWidth,
            'text-primary-foreground': BackgroundColor === 'bg-primary',
            'text-secondary-foreground': BackgroundColor === 'bg-secondary',
            'text-tertiary-foreground': BackgroundColor === 'bg-tertiary',
            'text-background': imageExists,
            'text-card-foreground': !imageExists && !BackgroundColor,
            'justify-center': VerticalAlignment === 'center',
            'justify-end pb-7': VerticalAlignment === 'bottom',
            'justify-start pt-7': VerticalAlignment === 'top',
            'basis-1/2': CardOrientation === 'horizontalflex' && !isFullWidth,
            'order-last': ImageOrder === 'left' && !isFullWidth,
            'order-first': ImageOrder !== 'left' && !isFullWidth,
          })}
        >
          <PageTitleContent
            fields={fields}
            params={params}
            rendering={rendering}
            headerTag={headerTag}
            isCentered={isCentered}
            isLeft={isLeft}
            isRight={isRight}
          />
        </div>

        {hasPlaceholder && !isFullWidth && (
          <div
            className={cn(
              'w-full lg:h-full lg:w-1/2 relative flex items-center justify-center z-10',
              {
                'basis-1/2': CardOrientation === 'horizontalflex',
                'w-full': CardOrientation === 'vertical',
              }
            )}
          >
            <div
              className={cn('w-full rounded-sm overflow-hidden [&_img]:w-full [&_video]:w-full', {
                'basis-1/2': CardOrientation === 'horizontalflex',
                'w-full': CardOrientation === 'vertical',
              })}
            >
              <Placeholder name={bannerKey} rendering={rendering} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PlaceholderBanner;

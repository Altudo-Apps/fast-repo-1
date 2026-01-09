// components/atoms/SitecoreImage.tsx
import { Image as ContentSdkImage, ImageField, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'react';
import Image from 'next/image';

interface SitecoreImageProps extends ComponentProps<typeof ContentSdkImage> {
  field?: ImageField;
  className?: string;
  fill?: boolean;
  priority?: boolean;
}

// Check if we're running in Storybook - this runs at module load time
const isStorybookEnv = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    window.location.href.includes('localhost:6006') || window.location.href.includes('storybook')
  );
};

export const SitecoreImage = ({
  field,
  className,
  fill,
  priority,
  ...rest
}: SitecoreImageProps) => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;

  // In Storybook, always use a regular img tag to avoid Next.js Image loader issues
  // This check happens synchronously at render time
  const isStorybook = isStorybookEnv();

  if (isStorybook && field?.value?.src) {
    // In Storybook, use a plain img tag
    // The className from PlaceholderBanner already includes "w-full h-full object-cover"
    // Just pass it through without additional fill-related styling
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={field.value.src as string}
        alt={(field.value.alt as string) || ''}
        className={className || ''}
        width={fill ? undefined : (field.value.width as string | number | undefined)}
        height={fill ? undefined : (field.value.height as string | number | undefined)}
      />
    );
  }

  if (isEditing) {
    return (
      <ContentSdkImage
        field={field}
        className={className}
        fill={fill}
        priority={priority}
        {...rest}
      />
    );
  }
  const imageProps = fill
    ? {
        fill: true,
      }
    : {
        width: field?.value?.width ? parseFloat(field.value.width.toString()) : 300,
        height: field?.value?.height ? parseFloat(field.value.height.toString()) : 300,
      };
  return (
    <Image
      src={field?.value?.src as string}
      alt={field?.value?.alt as string}
      {...imageProps}
      className={className}
      priority={priority}
    />
  );
};

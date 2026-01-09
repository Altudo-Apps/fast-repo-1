import { RichText, Text } from '@sitecore-content-sdk/nextjs';
import React from 'react';
import { PageTitleBannerProps } from './PageTitleBanner.type';
import { cn } from 'src/core/lib/utils';
import { CustomButtonLink } from 'src/core/atom/CustomButtonLink';

interface PageTitleContentProps extends PageTitleBannerProps {
  headerTag?: string;
  isCentered?: boolean;
  isLeft?: boolean;
  isRight?: boolean;
}

const PageTitleContent: React.FC<PageTitleContentProps> = ({
  fields,
  headerTag = 'h1',
  isCentered,
  isLeft,
  isRight,
}) => {
  const { Title, Category, IntroText, CalltoActionLinkMain, CalltoActionLinkSecondary } =
    fields || {};
  const isPageTitle = headerTag === 'h1';

  const alignmentClass = cn({
    'items-center': isCentered,
    'items-end': !isCentered && isRight,
    'items-left': !isCentered && !isRight && isLeft,
  });
  const textAlignmentClass = cn({
    'text-center': isCentered,
    'text-right': isRight && !isCentered,
    'text-left': isLeft && !isCentered && !isRight,
  });
  return (
    <div className={cn('w-full gap-4 flex flex-col', alignmentClass)}>
      {Category && <Text tag="p" field={Category} className="text-sm font-medium" />}
      <div className={textAlignmentClass}>
        {Title && (
          <Text
            tag={headerTag}
            field={Title}
            className={cn('leading-tight', {
              'text-h1': headerTag === 'h1',
              'text-h2': headerTag === 'h2',
              'text-h3': headerTag === 'h3',
              'text-h4': headerTag === 'h4',
              'text-h5': headerTag === 'h5',
              'text-h6': headerTag === 'h6',
            })}
          />
        )}
        {!isPageTitle && <hr className="mt-2 border-t border-t-border" />}
      </div>

      {IntroText && (
        <div className="text-p [&_*]:font-satoshi leading-relaxed prose dark:prose-invert">
          <RichText field={IntroText} />
        </div>
      )}

      {(CalltoActionLinkMain?.value?.href || CalltoActionLinkSecondary?.value?.href) && (
        <div className={cn('flex flex-wrap gap-4')}>
          {CalltoActionLinkMain?.value?.href && (
            <CustomButtonLink
              variant="default"
              className="bg-primary text-primary-foreground hover:no-underline px-3 py-2 h-9 rounded-md flex items-center gap-2"
              field={CalltoActionLinkMain}
            />
          )}

          {CalltoActionLinkSecondary?.value?.href && (
            <CustomButtonLink
              variant="secondary"
              className="bg-secondary rounded-md text-accent-foreground px-3 py-2 h-9 flex items-center gap-2 hover:no-underline"
              field={CalltoActionLinkSecondary}
            >
              {CalltoActionLinkSecondary.value.text || 'Learn More'}
            </CustomButtonLink>
          )}
        </div>
      )}
    </div>
  );
};

export default PageTitleContent;

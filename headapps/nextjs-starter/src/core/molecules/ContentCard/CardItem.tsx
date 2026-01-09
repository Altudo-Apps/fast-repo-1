import { RichText, Text } from '@sitecore-content-sdk/nextjs';
import { JSX } from 'react';
import { cn } from 'src/core/lib/utils';
import { Card } from 'src/core/ui/card';
import { CardItemProps } from './ContentCard.type';
import { SitecoreImage } from 'src/core/atom/Images';
import ContentCardBtn from './ContentCardBtn';

const CardItem = ({
  fields,
  CardOrientation,
  ImageOrder,
  headingTag,
  LinkType,
}: CardItemProps): JSX.Element => {
  const isVertical = CardOrientation === 'vertical';
  const isHorizontal = CardOrientation === 'horizontalequal';
  const isHorizontalFlex = CardOrientation === 'horizontalflex';
  const shouldRenderButton = LinkType !== 'Card';
  const buttonComponent = shouldRenderButton ? (
    <ContentCardBtn CalltoActionLinkMain={fields.CalltoActionLinkMain} LinkType={LinkType} />
  ) : null;
  return (
    <Card className="font-satoshi overflow-hidden p-6 bg-base-card rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-border gap-6">
      {fields?.Icon?.value?.src?.trim() && (
        <SitecoreImage field={fields.Icon} className="object-cover w-8 h-8 mb-1" />
      )}
      <div
        className={cn('flex w-full gap-6', {
          'flex-col md:items-start items-center': isVertical,
          'md:flex-row max-md:flex-col item-start': isHorizontal || isHorizontalFlex,
        })}
      >
        {fields?.Image?.value && (
          <div
            className={cn('relative', {
              'w-full order-2': isVertical,
              'flex-1 basis-1/2': isHorizontal,
              'flex-1 basis-3/12': isHorizontalFlex,
              'order-1': ImageOrder === 'right',
            })}
          >
            <SitecoreImage
              field={fields?.Image}
              className="object-contain rounded-lg w-full h-auto flex"
            />
          </div>
        )}

        <div
          className={cn('flex flex-col w-full', {
            'flex-1 order-1': isVertical,
            'basis-1/2 gap-4': isHorizontal,
            'basis-3/4 gap-4': isHorizontalFlex,
          })}
        >
          <div>
            {fields.Category?.value && (
              <Text
                tag="div"
                field={fields.Category}
                className="gap-2 inline-flex h-6 items-center rounded-lg leading-7 text-foreground text-sm font-medium"
              />
            )}

            <Text
              tag={headingTag || 'h3'}
              field={fields.Title}
              className="font-bold tracking-tight font-zodiak group-hover:no-underline flex gap-2"
            />

            {fields.IntroText?.value && (
              <RichText field={fields.IntroText} className="mt-3 text-muted-foreground text-sm" />
            )}
          </div>
          {(isHorizontal || isHorizontalFlex || !isVertical) && shouldRenderButton && (
            <div className="flex w-max">{buttonComponent}</div>
          )}
        </div>

        {isVertical && shouldRenderButton && (
          <div className="flex order-3 w-full">{buttonComponent}</div>
        )}
      </div>
    </Card>
  );
};

export default CardItem;

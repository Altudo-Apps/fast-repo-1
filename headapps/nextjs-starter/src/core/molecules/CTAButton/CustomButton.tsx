import { Link } from '@sitecore-content-sdk/nextjs';
import React from 'react';
import { Button } from 'src/core/ui/button';
import { CTAButtonProps } from './CTAButton.type';
import { cn } from 'src/core/lib/utils';
import { SitecoreImage } from 'src/core/atom/Images';

const allowedVariants = ['link', 'primary', 'outline', 'secondary'] as const;
type ButtonVariant = (typeof allowedVariants)[number];

const CustomButton = (props: CTAButtonProps) => {
  const btnVariant = allowedVariants.includes(props.params.ButtonStyle as ButtonVariant)
    ? (props.params.ButtonStyle as ButtonVariant)
    : 'default';
  const btnDirection = props.params.Styles;

  return (
    <Link field={props.fields.ButtonLink}>
      <Button
        asChild
        size="lg"
        variant={btnVariant}
        className={cn('my-2 w-fit min-w-fit whitespace-normal h-auto py-2')}
      >
        <div
          className={cn('flex items-center', {
            'flex-row-reverse gap-4': btnDirection == 'position-right',
            'flex-col py-4 h-auto gap-3': btnDirection == 'position-center',
            'gap-4': btnDirection !== 'position-right' && btnDirection !== 'position-center',
          })}
        >
          {props?.fields?.ButtonImage && (
            <div
              className={cn(
                'flex items-center justify-center flex-shrink-0 rounded-md overflow-hidden',
                {
                  'w-4 h-4': btnDirection !== 'position-center',
                  'w-6 h-6': btnDirection === 'position-center',
                }
              )}
            >
              <SitecoreImage
                field={props?.fields?.ButtonImage}
                className="w-full h-full aspect-square object-cover"
                alt="" // Empty alt for decorative images
                aria-hidden="true" // Hide from screen readers
              />
            </div>
          )}
          <span>
            {props.fields.ButtonLink.value.title?.trim()
              ? props.fields.ButtonLink.value.title
              : props.fields.ButtonLink.value.text}
          </span>
        </div>
      </Button>
    </Link>
  );
};

export default CustomButton;

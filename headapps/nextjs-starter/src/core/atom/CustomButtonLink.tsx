import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { SitecoreLink } from '../atom/Link';
import { LinkField } from '@sitecore-content-sdk/nextjs';
import { buttonVariants } from '../ui/button';

export interface ButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  field: LinkField;
}

const CustomButtonLink = React.forwardRef<HTMLAnchorElement, ButtonProps>(
  ({ className, variant, size, asChild = false, field, ...props }, ref) => {
    const Comp = asChild ? Slot : SitecoreLink;
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        field={field}
      />
    );
  }
);
CustomButtonLink.displayName = 'CustomButtonLink';

export { CustomButtonLink };

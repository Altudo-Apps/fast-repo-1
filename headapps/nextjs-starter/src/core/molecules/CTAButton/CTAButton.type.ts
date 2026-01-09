import { ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

export type CTAButtonProps = ComponentProps & {
  fields: {
    ButtonImage: ImageField;
    ButtonLink: LinkField;
  };
  params: {
    ButtonStyle: string;
    Styles: string;
  };
};

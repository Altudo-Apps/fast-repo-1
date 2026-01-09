import {
  ImageField,
  LinkField,
  RichTextField,
  TextField,
  ComponentRendering,
  ComponentParams,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

export type CarouselItemProp = {
  fields: {
    id: string;
    Title: TextField;
    Description: RichTextField;
    Image: ImageField;
    CTAMainLink: LinkField;
    CTASecondaryLink: LinkField;
  };
};

export type HeroCarouselProps = ComponentProps & {
  fields: {
    items: CarouselItemProp[];
  };
  params: {
    textAlignment: string;
    styles: string;
    HeaderTag?: string;
  };
  rendering: ComponentRendering & { params: ComponentParams };
};

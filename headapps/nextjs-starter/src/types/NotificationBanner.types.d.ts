import {
  ImageField,
  RichTextField,
  ComponentParams,
  ComponentRendering,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

export type NotificationBannerProps = ComponentProps & {
  fields: {
    BannerIcon: ImageField;
    BannerTitle: RichTextField;
    BannerText: RichTextField;
  };
};

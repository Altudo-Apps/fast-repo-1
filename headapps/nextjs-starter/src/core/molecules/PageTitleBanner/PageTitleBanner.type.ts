import type { ImageField, TextField, LinkField, RichTextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

export interface PageTitleBannerFields {
  Image?: ImageField;
  Category?: TextField;
  Title: TextField;
  IntroText: RichTextField;
  CalltoActionLinkMain: LinkField;
  CalltoActionLinkSecondary: LinkField;
}

export interface PageTitleBannerParams {
  HeaderTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  BackgroundColor?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  VerticalAlignment?: 'top' | 'center' | 'bottom';
  VerticalTextAlignment?: 'top' | 'center' | 'bottom';
  DynamicPlaceholderId?: string;
  ComponentType?: string;
  ImageOrder?: 'left' | 'right';
  CardOrientation?: 'horizontal' | 'horizontalflex' | 'vertical';
  GridParameters?: string;
  Styles?: string;
}

export type PageTitleBannerProps = ComponentProps & {
  fields: PageTitleBannerFields;
  params: PageTitleBannerParams;
};

import { ImageField, LinkField, RichTextField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

export interface BooleanField {
  value: boolean;
}
export interface CardItemProps {
  fields: ContentCardFields['fields'];
  CardOrientation: string;
  GridParameters: string;
  ImageOrder?: string;
  headingTag?: string;
  LinkType?: string;
}

export type ContentCardFields = ComponentProps & {
  fields: {
    Title: TextField;
    CalltoActionLinkMain: LinkField;
    IntroText?: RichTextField;
    Image: ImageField;
    Category: TextField;
    Icon?: ImageField;
  };
  params: {
    CardOrientation: string;
    ImageOrder?: string;
    headingTag?: string;
    LinkType?: string;
  };
};

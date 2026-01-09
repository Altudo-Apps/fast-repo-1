import {
  ComponentParams,
  ComponentRendering,
  ImageField,
  TextField,
} from '@sitecore-content-sdk/nextjs';

export interface SocialShareProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: {
    items: {
      id: string;
      url: string;
      name: string;
      displayName: string;
      fields: {
        Title: TextField;
        SocialIcon: ImageField;
        Media?: string;
      };
    }[];
  };
}

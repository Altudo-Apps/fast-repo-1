import { ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { CommonComponentProps } from 'src/types/common.types';

export type SocialLink = {
  fields: {
    SocialIcon: ImageField;
    SocialLink: LinkField;
  };
};

export type SocialLinksProps = CommonComponentProps & {
  fields: {
    items: SocialLink[];
  };
};

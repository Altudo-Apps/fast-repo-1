import { ComponentProps, Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';

export type ModalProps = ComponentProps & {
  fields: {
    Title: Field<string>;
    ButtonText?: Field<string>;
    ButtonImage?: ImageField;
    CTAMainLink?: LinkField;
  };
  params: {
    DynamicPlaceholderId: string;
    ButtonStyle?: string;
    Styles?: string;
  };
};

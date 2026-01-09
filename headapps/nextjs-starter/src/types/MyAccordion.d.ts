import { Field, RichTextField, TextField } from '@sitecore-content-sdk/nextjs';
import { CommonComponentProps } from 'src/types/common.types';

export type AccordionItemProps = {
  id: string;
  url: string;
  name: string;
  displayName: string;
  fields: {
    Header: TextField;
    Content: RichTextField;
  };
};

export type AccordionProps = CommonComponentProps & {
  fields: {
    id: string;
    items: AccordionItemProps[];
  };
};

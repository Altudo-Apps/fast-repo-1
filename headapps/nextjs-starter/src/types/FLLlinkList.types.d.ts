import { LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

export interface FLLinkListDataSource {
  children: {
    results: Array<{
      field: {
        link: LinkField;
      };
    }>;
  };
  field: {
    title: TextField;
  };
}

export interface FLLinkListFields {
  data: {
    datasource: FLLinkListDataSource;
  };
}

export interface FLLinkListProps extends ComponentProps {
  fields: FLLinkListFields;
  level?: 'one' | 'two';
}

export interface FLLinkListItemProps {
  index: number;
  total: number;
  field: LinkField;
}

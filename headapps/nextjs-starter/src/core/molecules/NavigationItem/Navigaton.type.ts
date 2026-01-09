import type { TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

export interface Fields {
  Id: string;
  DisplayName: string;
  Title: TextField;
  NavigationTitle: TextField;
  Href: string;
  Querystring: string;
  Children: Array<Fields>;
  Styles: string[];
}

// Props for the main navigation component (receives multiple navigation items)
export type NavigationProps = ComponentProps & {
  fields: { [key: string]: Fields };
};

// Props for individual navigation list items
export type NavigationListProps = {
  fields: Fields;
  handleClick?: (event?: React.MouseEvent<HTMLElement>) => void;
  relativeLevel?: number;
};

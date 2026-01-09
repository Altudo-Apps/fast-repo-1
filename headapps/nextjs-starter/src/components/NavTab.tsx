import { JSX } from 'react';
import {
  ComponentParams,
  ComponentRendering,
  Field,
  Placeholder,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';

import { TabsContent } from 'src/core/ui/tabs';

interface Fields {
  id: string;
  NavTabTitle: Field<string>;
}

type NavTabProps = {
  params: { [key: string]: string };
  fields: Fields;
  rendering: ComponentRendering & { params: ComponentParams };
};

export const NavTab = (props: NavTabProps): JSX.Element => {
  const tabPhKey = `navtabcontent-${props.params.DynamicPlaceholderId}`;

  return (
    <TabsContent
      value={props.rendering.uid || ''}
      className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Placeholder name={tabPhKey} rendering={props.rendering} />
    </TabsContent>
  );
};

export default withDatasourceCheck()<NavTabProps>(NavTab);

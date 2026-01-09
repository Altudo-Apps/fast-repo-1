import { JSX } from 'react';
import {
  ComponentParams,
  ComponentRendering,
  Field,
  Placeholder,
  Text,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';

import { AccordionContent, AccordionItem, AccordionTrigger } from 'src/core/ui/accordion';

interface Fields {
  id: string;
  AccordionPanelTitle: Field<string>;
}

type AccordionPanelProps = {
  params: { [key: string]: string };
  fields: Fields;
  rendering: ComponentRendering & { params: ComponentParams };
};

export const AccordionPanel = (props: AccordionPanelProps): JSX.Element => {
  const tabPhKey = `accordcontent-${props.params.DynamicPlaceholderId}`;

  return (
    <AccordionItem value={`item-${tabPhKey}`} className="border-b border-muted">
      <AccordionTrigger className="px-4 text-p font-medium hover:no-underline !font-satoshi">
        <Text field={props.fields.AccordionPanelTitle} />
      </AccordionTrigger>
      <AccordionContent className="px-4">
        <Placeholder name={tabPhKey} rendering={props.rendering} />
      </AccordionContent>
    </AccordionItem>
  );
};

export default withDatasourceCheck()<AccordionPanelProps>(AccordionPanel);

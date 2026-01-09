import { JSX, useMemo } from 'react';

import {
  ComponentParams,
  ComponentRendering,
  Placeholder,
  useSitecore,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import { Accordion as UIAccordion } from 'src/core/ui/accordion';

interface Fields {
  id: string;
}

type AccordionProps = {
  params: { [key: string]: string };
  fields: Fields;
  rendering: ComponentRendering & { params: ComponentParams };
};

export const Accordion = (props: AccordionProps): JSX.Element => {
  const tabsPhKey = `accord-${props.params.DynamicPlaceholderId}`;
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;

  const openAllValues = useMemo(() => {
    const items = props?.rendering?.placeholders?.['accord-{*}'] || [];
    return (items as Array<{ params?: { DynamicPlaceholderId?: string } }>)
      .map((i) => i?.params?.DynamicPlaceholderId)
      .filter(Boolean)
      .map((id) => `item-accordcontent-${id}` as string);
  }, [props?.rendering?.placeholders]);

  return (
    <div className={props.params.styles}>
      {isEditing ? (
        <UIAccordion type="multiple" className="w-full font-satoshi" defaultValue={openAllValues}>
          <Placeholder name={tabsPhKey} rendering={props.rendering} />
        </UIAccordion>
      ) : (
        <UIAccordion type="single" collapsible className="w-full font-satoshi">
          <Placeholder name={tabsPhKey} rendering={props.rendering} />
        </UIAccordion>
      )}
    </div>
  );
};

export default withDatasourceCheck()<AccordionProps>(Accordion);

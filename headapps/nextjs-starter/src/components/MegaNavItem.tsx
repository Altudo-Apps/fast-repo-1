import {
  ComponentParams,
  ComponentRendering,
  Field,
  Placeholder,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import { JSX, useEffect, useMemo, useState } from 'react';
import { cn } from 'src/core/lib/utils';

interface Fields {
  id: string;
  NavTabTitle: Field<string>;
}

type NavTabProps = {
  params: { [key: string]: string };
  fields: Fields;
  rendering: ComponentRendering & { params: ComponentParams };
};
type RenderingWithUid = ComponentRendering & { uid: string };

const MegaNavItem = (props: NavTabProps): JSX.Element => {
  const { rendering } = props;
  const uid = (rendering as RenderingWithUid).uid;
  const placeholderKey = useMemo(
    () => `meganavcontent-${props.params.DynamicPlaceholderId}`,
    [props.params.DynamicPlaceholderId]
  );

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const updateActiveState = () => {
      const storedUid = localStorage.getItem('active-menu-item');
      setIsActive(storedUid === uid);
    };

    updateActiveState();

    const interval = setInterval(updateActiveState, 300);
    return () => clearInterval(interval);
  }, [uid]);

  if (!isActive) return <></>;
  return (
    <div
      className={cn(
        'meganav-item max-md:[&_.row]:flex-col relative w-full p-6 md:shadow-lg z-50 md:bg-primary-foreground [&_.linklist_ul]:flex-col [&_.linklist_ul_a]:text-foreground [&_.row]:!justify-start [&_.row]:!items-start [&_.column-splitter-column]:!gap-0 [&_.column-splitter-column]:px-3 [&_.row]:!-mx-3 [&_.column-splitter-column]:flex [&_.column-splitter-column]:justify-center md:[&_.rich-text]:bg-secondary [&_.rich-text]:text-foreground [&_.rich-text]:p-4 [&_.rich-text]:rounded-md mx-auto [&_.linklist>ul>li>div>a]:font-normal [&_.linklist>ul>li>div>a]:text-sm md:rounded-md [&_.rich-text_img]:w-max [&_.rich-text_img]:h-auto max-md:hidden max-md:[&_.rich-text]:p-0'
      )}
    >
      <Placeholder name={placeholderKey} rendering={rendering} />
    </div>
  );
};

export default withDatasourceCheck()<NavTabProps>(MegaNavItem);

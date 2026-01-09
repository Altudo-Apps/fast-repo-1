import { JSX, useCallback, useEffect, useMemo, useState } from 'react';

import {
  ComponentParams,
  ComponentRendering,
  ComponentFields,
  Field,
  Placeholder,
  Text,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import { Tabs, TabsList, TabsTrigger } from 'src/core/ui/tabs';

interface Fields {
  id: string;
}

type NavTabsProps = {
  params: { [key: string]: string };
  fields: Fields;
  rendering: ComponentRendering & { params: ComponentParams };
};

export const NavTabs = (props: NavTabsProps): JSX.Element => {
  const tabPhKey = `navtab-${props.params.DynamicPlaceholderId}`;
  const tabItems = useMemo(
    () => props?.rendering?.placeholders?.['navtab-{*}'] || [],
    [props?.rendering?.placeholders]
  );

  const DEFAULT_TAB_VALUE = '0';

  const getDefaultTabUid = useCallback(() => DEFAULT_TAB_VALUE, []);

  const sanitizeStoredValue = useCallback(
    (value?: string | null) => {
      if (!value) {
        return getDefaultTabUid();
      }

      const isValid = tabItems.some((tab) => tab?.uid === value);

      return isValid ? value : getDefaultTabUid();
    },
    [getDefaultTabUid, tabItems]
  );

  const getInitialTab = () => {
    return getDefaultTabUid();
  };

  const [selectedTab, setSelectedTab] = useState<string>(getInitialTab);
  const [isMounted, setIsMounted] = useState(false);

  // Mark as mounted after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle localStorage after hydration using your sanitizeStoredValue logic
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') {
      return;
    }

    const storedValue = localStorage.getItem('active-tab');
    const nextValue = sanitizeStoredValue(storedValue);

    if (!storedValue) {
      localStorage.setItem('active-tab', nextValue);
    }

    setSelectedTab(nextValue);
  }, [isMounted, sanitizeStoredValue]);

  const handleTabChange = (value: string) => {
    setSelectedTab(value);

    if (typeof window !== 'undefined') {
      localStorage.setItem('active-tab', value);
    }
  };

  // Don't render if no tabs available
  if (tabItems.length === 0) {
    return <></>;
  }

  return (
    <div className={`border-2 bg-background border-muted rounded-sm ${props.params?.styles || ''}`}>
      {isMounted && (
        <Tabs
          value={selectedTab}
          defaultValue={selectedTab}
          className="w-full"
          onValueChange={handleTabChange}
        >
          <TabsList className="flex w-full bg-muted py-2">
            {tabItems.map((tab: ComponentRendering<ComponentFields>, index) => {
              if (!tab) return null;
              return (
                <TabsTrigger
                  key={index}
                  value={tab.uid || ''}
                  className="flex-1 data-[state=active]:bg-background data-[state=active]:rounded-sm data-[state=active]:text-foreground data-[state=inactive]:bg-muted data-[state=inactive]:text-foreground/70 rounded-sm border-none"
                >
                  <Text className="font-bold" field={tab?.fields?.NavTabTitle as Field<string>} />
                </TabsTrigger>
              );
            })}
          </TabsList>
          <div className="rounded-b-md border-muted p-2">
            <Placeholder name={tabPhKey} rendering={props.rendering} />
          </div>
        </Tabs>
      )}
    </div>
  );
};

export default withDatasourceCheck()<NavTabsProps>(NavTabs);

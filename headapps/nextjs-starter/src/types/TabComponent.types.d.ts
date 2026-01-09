import {
  ComponentParams,
  ComponentRendering,
  Field,
  TextField,
} from '@sitecore-content-sdk/nextjs';

export interface DynamicPlaceholder<T> {
  jsonValue: T;
}

export interface TabItem {
  dynamicPlaceholderId: DynamicPlaceholder<Field<string>>;
  tabName: DynamicPlaceholder<TextField>;
}

export interface DataSource {
  selectedTabs: { targetItems: TabItem[] };
  tabsChild: { results: TabItem[] };
}

export interface Fields {
  data: { dataSource: DataSource };
}

export interface ComponentProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: Fields;
}

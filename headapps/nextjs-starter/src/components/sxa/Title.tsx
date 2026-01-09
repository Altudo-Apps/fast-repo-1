import { LinkField, Text, TextField, useSitecore } from '@sitecore-content-sdk/nextjs';
import { JSX } from 'react';
import { SitecoreLink } from 'src/core/atom/Link';
import { ComponentProps } from 'lib/component-props';

interface Item {
  url: {
    path: string;
    siteName: string;
  };
  field: {
    jsonValue: {
      value: string;
    };
  };
}

interface TitleProps extends ComponentProps {
  fields: {
    /**
     * The Integrated graphQL query result. This illustrates the way to access the context item datasource information.
     */
    data?: {
      datasource?: Item;
      contextItem?: Item;
    };
  };
}

interface ComponentContentProps {
  id?: string;
  styles?: string;
  children: React.ReactNode;
}

const ComponentContent = ({ id, styles = '', children }: ComponentContentProps): JSX.Element => (
  <div className={`component title ${styles.trim()}`} id={id}>
    <div className="component-content">
      <div className="field-title">{children}</div>
    </div>
  </div>
);

export const Default = ({ params, fields }: TitleProps): JSX.Element => {
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = params;
  const datasource = fields?.data?.datasource || fields?.data?.contextItem;
  const text: TextField = datasource?.field?.jsonValue || {};
  const link: LinkField = {
    value: {
      href: datasource?.url?.path,
      title: datasource?.field?.jsonValue?.value,
    },
  };

  return (
    <ComponentContent styles={styles} id={id}>
      {page.mode.isEditing ? (
        <Text field={text} />
      ) : (
        <SitecoreLink field={link}>
          <Text field={text} />
        </SitecoreLink>
      )}
    </ComponentContent>
  );
};

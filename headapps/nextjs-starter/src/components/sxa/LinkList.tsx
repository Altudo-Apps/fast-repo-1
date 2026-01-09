import React from 'react';
import { Text, LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { SitecoreLink } from 'src/core/atom/Link';
import { ComponentProps } from 'lib/component-props';

interface LinkListProps extends ComponentProps {
  fields: {
    /**
     * The Integrated graphQL query result. This illustrates the way to access the datasource children.
     */
    data: {
      datasource: {
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
      };
    };
  };
  level?: 'one' | 'two';
}

const LinkListItem = ({
  index,
  total,
  field,
}: {
  index: number;
  total: number;
  field: LinkField;
}) => {
  const classNames = [
    `item${index}`,
    index % 2 === 0 ? 'odd' : 'even',
    index === 0 ? 'first' : '',
    index === total - 1 ? 'last' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li className={`${classNames} first:list-none`}>
      <div className="field-link">
        <SitecoreLink field={field} className="mr-2" />
      </div>
    </li>
  );
};

export const Default = ({ params, fields }: LinkListProps) => {
  const datasource = fields?.data?.datasource;
  const styles = `component link-list ${params.styles || ''}`.trim();
  const id = params.RenderingIdentifier;

  if (datasource) {
    const links = datasource.children.results
      .filter((element) => element?.field?.link)
      .map((element, index) => (
        <LinkListItem
          key={`${index}-${element.field?.link}`}
          index={index}
          total={datasource.children.results.length}
          field={element.field.link}
        />
      ));

    return (
      <div className={`${styles} linklist`} id={id}>
        {/* <div className="component-content"> */}
        <Text tag="h3" field={datasource.field?.title} />
        <ul className={'flex gap-5'}>{links}</ul>
        {/* </div> */}
      </div>
    );
  }

  return (
    <div className={styles} id={id}>
      <div className="component-content">
        <h3>Link List</h3>
      </div>
    </div>
  );
};

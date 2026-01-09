import React from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import { SitecoreLink } from 'src/core/atom/Link';
import { FLLinkListProps, FLLinkListItemProps } from 'src/types/FLLlinkList.types';

const FLLinkListItem = ({ index, total, field }: FLLinkListItemProps) => {
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

export const Default = ({ params, fields }: FLLinkListProps) => {
  // // Console logging for debugging
  // console.log('Fields:', fields);
  // console.log('Children:', fields?.data?.datasource?.children);

  const datasource = fields?.data?.datasource;
  const styles = `component fl-link-list ${params.styles || ''}`.trim();
  const id = params.RenderingIdentifier;

  if (datasource) {
    const links = datasource.children.results
      .filter((element) => element?.field?.link)
      .map((element, index) => (
        <FLLinkListItem
          key={`${index}-${element.field?.link}`}
          index={index}
          total={datasource.children.results.length}
          field={element.field.link}
        />
      ));

    return (
      <div className={`${styles} fl-linklist`} id={id}>
        <Text tag="h3" field={datasource.field?.title} />
        <ul className={'flex gap-5'}>{links}</ul>
      </div>
    );
  }

  return (
    <div className={styles} id={id}>
      <div className="component-content">
        <h3>FL Link List</h3>
      </div>
    </div>
  );
};

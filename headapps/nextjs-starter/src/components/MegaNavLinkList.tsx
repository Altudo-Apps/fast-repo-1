import { JSX, useEffect, useState } from 'react';
import { LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { SitecoreLink } from 'src/core/atom/Link';

// Define the structure of the Link field with target item fields
type ResultsFieldLink = {
  field: {
    link: LinkField & {
      target?: {
        linkTitle: TextField;
        linkDescription: TextField;
      };
    };
  };
};

// Define the fields structure based on the GraphQL query
interface Fields {
  data: {
    datasource: {
      children: {
        results: ResultsFieldLink[];
      };
      field: {
        title: TextField;
      };
    };
  };
}

type MegaNavLinkListProps = {
  params: { [key: string]: string };
  fields: Fields;
  level?: 'one' | 'two';
};

type MegaNavLinkItemProps = {
  index: number;
  total: number;
  field: {
    link: LinkField;
    target?: {
      linkTitle: TextField;
      linkDescription: TextField;
    };
  };
};

// Individual link item component
const MegaNavLinkItem = (props: MegaNavLinkItemProps) => {
  const [descriptionText, setDescriptionText] = useState('');
  const [titleText, setTitleText] = useState('');
  let className = `item${props.index}`;
  className += (props.index + 1) % 2 === 0 ? ' even' : ' odd';
  if (props.index === 0) {
    className += ' first';
  }
  if (props.index + 1 === props.total) {
    className += ' last';
  }

  // const linkTitle =
  //   props.field.link?.value?.title || props.field.target?.linkTitle?.value || 'Link';

  useEffect(() => {
    const isExternal = props.field.link?.value?.linktype === 'external';

    const safeToString = (val: string | number | undefined): string => {
      return typeof val === 'number' ? val.toString() : val || '';
    };

    if (isExternal) {
      const text = safeToString(props.field.link?.value?.text);
      const title = safeToString(props.field.link?.value?.title);
      setTitleText(text);
      setDescriptionText(title);
    } else {
      setTitleText(safeToString(props.field.target?.linkTitle?.value));
      setDescriptionText(safeToString(props.field.target?.linkDescription?.value));
    }
  }, [props.field]);

  return (
    <li className={`${className} first:list-none`}>
      <div className="field-link flex flex-col">
        <SitecoreLink
          field={props.field.link}
          className="mr-2 text-sm font-medium !text-popover-foreground"
        >
          {titleText}
        </SitecoreLink>
        {descriptionText && (
          <div className="text-muted-foreground text-sm font-normal leading-tight">
            {descriptionText}
          </div>
        )}
      </div>
    </li>
  );
};

// Main component
export const Default = (props: MegaNavLinkListProps): JSX.Element => {
  const datasource = props.fields?.data?.datasource;
  const { params } = props;
  const { id, styles } = params;

  if (datasource) {
    const list = datasource.children.results
      .filter((element: ResultsFieldLink) => element?.field?.link)
      .map((element: ResultsFieldLink, key: number) => (
        <MegaNavLinkItem
          index={key}
          key={`${key}${element.field.link || ''}`}
          total={datasource.children.results.length}
          field={element.field}
        />
      ));

    return (
      <div className={`${styles} mega-nav-link-list`} id={id}>
        <ul className="flex gap-5 flex-col">{list}</ul>
      </div>
    );
  }

  return (
    <div className={styles} id={id}>
      <div className="component-content">
        <h3>Mega Nav Link List</h3>
      </div>
    </div>
  );
};

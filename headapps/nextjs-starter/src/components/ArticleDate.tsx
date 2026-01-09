import { JSX } from 'react';
import { DateFieldProps } from '@sitecore-content-sdk/react';
import { useSitecore, DateField } from '@sitecore-content-sdk/nextjs';

export interface ArticleDateFields {
  PublishedDate: DateFieldProps;
}

export type ArticleDateProps = {
  params: { [key: string]: string };
  fields: ArticleDateFields;
};

type ComponentContentProps = {
  id: string;
  styles: string;
  children: JSX.Element;
};

const formatSitecoreDate = (sitecoreDateString: string) => {
  // Extract just the date portion: "2024-07-03" from "2024-07-03T00:00:00Z"
  const dateOnly = sitecoreDateString.slice(0, 10);

  // Create date object in local time (not UTC)
  const date = new Date(dateOnly + 'T00:00:00');

  // Guard against invalid date
  if (isNaN(date.getTime())) return '';

  // Format for display
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const ComponentContent = (props: ComponentContentProps) => {
  const id = props.id;
  return (
    <p className={`text-sm text-foreground font-medium ${props.styles}`} id={id ? id : undefined}>
      {props.children}
    </p>
  );
};

export const Default = (props: ArticleDateProps): JSX.Element => {
  const { page } = useSitecore();
  const id = props.params.RenderingIdentifier;

  if (
    !(props.fields && props.fields.PublishedDate && props.fields.PublishedDate.value) &&
    !page.layout.sitecore?.route?.fields?.PublishedDate
  ) {
    return (
      <p
        className={`text-sm text-foreground font-medium ${props.params.styles}`}
        id={id ? id : undefined}
      >
        [Article Date]
      </p>
    );
  }

  const field =
    props.fields && props.fields.PublishedDate && props.fields.PublishedDate.value
      ? props.fields.PublishedDate
      : page.layout.sitecore?.route?.fields?.PublishedDate;

  return (
    <ComponentContent styles={props.params.styles} id={id}>
      <DateField
        field={field as { value?: string; editable?: string }}
        render={(date) => {
          return formatSitecoreDate(date?.toISOString() ?? '');
        }}
      />
    </ComponentContent>
  );
};

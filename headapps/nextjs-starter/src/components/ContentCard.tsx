import { LinkField, useSitecore } from '@sitecore-content-sdk/nextjs';
import NextLink from 'next/link';
import { JSX } from 'react';
import CardItem from 'src/core/molecules/ContentCard/CardItem';
import { ContentCardFields } from 'src/core/molecules/ContentCard/ContentCard.type';
import { getBlogCustomRoute } from 'src/lib/utils/blog-url-helper';

export const Default = (props: ContentCardFields): JSX.Element => {
  const {
    fields,
    params: {
      RenderingIdentifier: id,
      CardOrientation,
      ImageOrder,
      LinkType,
      HeaderTag: headingTag,
      GridParameters,
      styles,
    },
  } = props;

  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;

  const card = (
    <CardItem
      fields={fields}
      CardOrientation={CardOrientation}
      GridParameters={GridParameters}
      ImageOrder={ImageOrder}
      headingTag={headingTag}
      LinkType={LinkType}
    />
  );

  const linkField = fields?.CalltoActionLinkMain as LinkField | undefined;
  const href = getBlogCustomRoute(linkField);

  return (
    <div className={styles} id={id}>
      {LinkType === 'Card' && href && !isEditing ? <NextLink href={href}>{card}</NextLink> : card}
    </div>
  );
};

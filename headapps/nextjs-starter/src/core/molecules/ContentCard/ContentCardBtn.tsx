import { ArrowRight } from 'lucide-react';
import React from 'react';
import { CardFooter } from 'src/core/ui/card';
import { LinkField } from '@sitecore-content-sdk/nextjs';
import { CustomButtonLink } from 'src/core/atom/CustomButtonLink';
import { getBlogCustomRoute } from 'src/lib/utils/blog-url-helper';

type ContentCardBtnProps = {
  CalltoActionLinkMain: LinkField;
  LinkType?: string;
};

const ContentCardBtn = ({ CalltoActionLinkMain, LinkType }: ContentCardBtnProps) => {
  const customHref = getBlogCustomRoute(CalltoActionLinkMain);
  const href = customHref || CalltoActionLinkMain?.value?.href;

  if (!href || href === '/' || !LinkType) return null;

  // Create updated link field with custom route
  const linkField: LinkField = {
    ...CalltoActionLinkMain,
    value: {
      ...CalltoActionLinkMain.value,
      href,
    },
  };

  const defaultLink = (
    <CustomButtonLink variant="link" field={linkField} className="underline text-foreground" />
  );

  return (
    <CardFooter className="w-full">
      {LinkType === 'Button' ? (
        <div className="flex items-center gap-2 w-full">
          <CustomButtonLink
            variant="outline"
            field={linkField}
            className="w-full px-3 bg-transparent"
          >
            {linkField.value.title || linkField.value.text || 'Learn more'}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </CustomButtonLink>
        </div>
      ) : (
        defaultLink
      )}
    </CardFooter>
  );
};

export default ContentCardBtn;

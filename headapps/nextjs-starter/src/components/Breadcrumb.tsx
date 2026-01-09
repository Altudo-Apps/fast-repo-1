import { JSX } from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from 'src/core/ui/breadcrumb';
import type { Breadcrumb as BreadcrumbType } from 'src/types/Breadcrumb.types';
import React from 'react';
import { ComponentProps } from 'lib/component-props';

const BreadCrumb = (props: ComponentProps): JSX.Element => {
  const styles = props?.params?.styles;
  const { page } = useSitecore();

  let breadcrumbData = page.layout.sitecore?.context?.breadCrumbsContext as BreadcrumbType[];

  if (
    page.mode.isDesignLibrary ||
    (page.mode.isEditing && page.layout.sitecore.route?.templateName === 'Partial Design')
  ) {
    breadcrumbData = [
      { Url: '/', PageTitle: 'Home', HideInBreadcrumb: false },
      { Url: '/fake-page', PageTitle: 'Fake', HideInBreadcrumb: false },
    ];
  }
  // Filter out items that should be hidden in breadcrumb
  const visibleBreadcrumbs = (breadcrumbData || []).filter(
    (crumb: BreadcrumbType) => !crumb.HideInBreadcrumb && crumb.PageTitle
  );

  if (!visibleBreadcrumbs.length) {
    return <></>;
  }
  return (
    <div className={styles}>
      <Breadcrumb className="mb-5">
        <BreadcrumbList>
          {visibleBreadcrumbs.map((crumb: BreadcrumbType, index: number) => (
            <React.Fragment key={`${crumb.Url}-${index}`}>
              <BreadcrumbItem>
                {index === visibleBreadcrumbs.length - 1 ? (
                  <BreadcrumbPage>{crumb.PageTitle}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={crumb.Url.toLowerCase() || '#'}>
                    {crumb.PageTitle}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < visibleBreadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadCrumb;

import { JSX } from 'react';
import { PageTitleBannerProps } from 'src/core/molecules/PageTitleBanner/PageTitleBanner.type';
import PlaceholderBanner from 'src/core/molecules/PageTitleBanner/PlaceholderBanner';
import { useSitecore } from '@sitecore-content-sdk/nextjs';

const PageTitleBanner = (props: PageTitleBannerProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { page } = useSitecore();
  const routeFields = page?.layout?.sitecore?.route?.fields;
  // Use route fields only if they contain meaningful data, otherwise use props.fields
  const fields = (
    routeFields && Object.keys(routeFields).length > 0 ? routeFields : props.fields
  ) as PageTitleBannerProps['fields'];
  const updatedParams: PageTitleBannerProps['params'] = { ...props.params };

  return (
    <div className={props.params.styles} id={id}>
      <PlaceholderBanner
        fields={fields}
        params={updatedParams}
        rendering={props.rendering}
        headerTag="h1"
      />
    </div>
  );
};

export const Default = PageTitleBanner;
export const ImageorVideo = PageTitleBanner;

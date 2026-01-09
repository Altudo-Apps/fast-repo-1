import { Link as ContentSdkLink, LinkField, useSitecore } from '@sitecore-content-sdk/nextjs';
import NextLink from 'next/link';
import { getBlogCustomRoute } from 'src/lib/utils/blog-url-helper';

interface SitecoreLinkProps extends Omit<React.ComponentProps<typeof ContentSdkLink>, 'field'> {
  field: LinkField;
  className?: string;
  children?: React.ReactNode;
}

export const SitecoreLink = ({ field, className, children }: SitecoreLinkProps) => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;

  if (isEditing) {
    const linkText = children || (field.value.text ?? '').toLowerCase();
    return (
      <ContentSdkLink field={field} className={className}>
        {linkText}
      </ContentSdkLink>
    );
  }

  // Convert blog article links to custom routes
  const customHref = getBlogCustomRoute(field);
  const effectiveHref = (customHref || field?.value?.href || '#').toLowerCase();
  const linkText = children || field?.value?.text || effectiveHref;

  return (
    <NextLink href={effectiveHref} className={className} prefetch={false}>
      {linkText}
    </NextLink>
  );
};

import { LinkField } from '@sitecore-content-sdk/nextjs';
import { SitecoreLink } from './Link';

interface NavLinkProps {
  field: LinkField;
  className?: string;
}

export const NavLink = ({ field, className }: NavLinkProps) => (
  <SitecoreLink field={field} className={className} />
);

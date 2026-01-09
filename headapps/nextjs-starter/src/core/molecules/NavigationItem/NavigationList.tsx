import { JSX, useState } from 'react';
import { Fields, NavigationListProps } from './Navigaton.type';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { SitecoreLink as Link } from 'src/core/atom/Link';
import { getLinkField, getLinkTitle, getNavigationText } from './NavigationUtils';
import { ChevronDown } from 'lucide-react';
import { cn } from 'src/core/lib/utils';

export const NavigationList = (props: NavigationListProps) => {
  const { page } = useSitecore();
  const hasChildren = props.fields.Children && props.fields.Children.length > 0;
  const [active, setActive] = useState(hasChildren);

  const relativeLevel = props.relativeLevel || 1;
  const classNameList = `${
    props.fields.Styles?.concat('rel-level' + relativeLevel).join(' ') || ''
  }`;

  const normalizePath = (path: string) => {
    try {
      const url = path.startsWith('/')
        ? new URL(path, window.location.origin)
        : new URL(path, window.location.href);
      return url.pathname.replace(/\/+$/, '').toLowerCase();
    } catch {
      return path.replace(/\/+$/, '').toLowerCase();
    }
  };

  // Check if this item is the current page (exact match only)
  const currentPath = typeof window !== 'undefined' ? normalizePath(window.location.pathname) : '';
  const linkPath = props.fields.Href ? normalizePath(props.fields.Href) : '';
  const isCurrentPage = linkPath && currentPath === linkPath;

  let children: JSX.Element[] = [];
  if (hasChildren) {
    children = props.fields.Children.map((element: Fields, index: number) => (
      <NavigationList
        key={`${index}${element.Id}`}
        fields={element}
        handleClick={props.handleClick}
        relativeLevel={(props.relativeLevel || 1) + 1}
      />
    ));
  }

  // Level 2+ items styling
  if (relativeLevel > 1) {
    return (
      <li role="menuitem" className={`${classNameList}`}>
        {hasChildren ? (
          <>
            <div
              className={cn(
                'flex justify-between items-center w-full gap-x-2 group',
                isCurrentPage
                  ? 'text-secondary-foreground'
                  : 'text-sidebar-foreground hover:!bg-secondary hover:text-secondary-foreground'
              )}
              onClick={() => setActive(!active)}
            >
              <Link
                field={getLinkField(props)}
                editable={page.mode.isEditing}
                onClick={(e) => {
                  if (page.mode.isEditing) {
                    e.preventDefault();
                  }
                  if (hasChildren) {
                    setActive(!active);
                    if (props.fields.Href && !page.mode.isEditing) {
                      window.location.href = props.fields.Href;
                    }
                  } else if (props.handleClick) {
                    props.handleClick(e);
                  }
                }}
                className={cn(
                  'py-3 px-3 block w-[calc(100%-2rem)] text-sm font-medium transition-colors rounded-sm',
                  isCurrentPage
                    ? 'text-secondary-foreground'
                    : 'text-inherit hover:!bg-secondary hover:text-secondary-foreground'
                )}
              >
                {getNavigationText(props)}
              </Link>
              {hasChildren && (
                <button
                  className="p-2 focus:outline-none text-inherit cursor-pointer hover:bg-secondary/50 rounded-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setActive(!active);
                  }}
                  aria-label={`${active ? 'Collapse' : 'Expand'} ${getLinkTitle(props)} submenu`}
                  aria-expanded={active}
                  aria-controls={`submenu-${props.fields.Id}`}
                >
                  <ChevronDown
                    className={`h-4 w-4 text-inherit transition-transform ${
                      active ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
              )}
            </div>
            {hasChildren && (
              <ul
                className={cn('[&_li]:pl-4', active ? 'block' : 'hidden')}
                id={`submenu-${props.fields.Id}`}
                role="menu"
              >
                {children}
              </ul>
            )}
          </>
        ) : (
          <Link
            field={getLinkField(props)}
            editable={page.mode.isEditing}
            onClick={props.handleClick}
            className={cn(
              'p-3 block w-[calc(100%-2rem)] text-sm font-medium text-sidebar-foreground transition-colors rounded-sm',
              isCurrentPage
                ? '!bg-secondary text-secondary-foreground'
                : 'hover:!bg-secondary hover:text-secondary-foreground'
            )}
          >
            {getNavigationText(props)}
          </Link>
        )}
      </li>
    );
  }

  // Level 1 items
  return (
    <li className={cn(classNameList, 'w-full')} key={props.fields.Id}>
      <div className={`navigation-title ${hasChildren ? 'child' : ''}`}>
        <div
          className={cn(
            'flex items-center justify-between w-full gap-x-2 group',
            isCurrentPage
              ? 'text-sidebar-foreground'
              : 'text-sidebar-foreground hover:!bg-secondary hover:text-sidebar-accent-foreground'
          )}
        >
          <Link
            field={getLinkField(props)}
            editable={page.mode.isEditing}
            onClick={(e) => {
              if (page.mode.isEditing) {
                e.preventDefault();
              }
              if (hasChildren) {
                setActive(!active);
                if (props.fields.Href && !page.mode.isEditing) {
                  window.location.href = props.fields.Href;
                }
              } else if (props.handleClick) {
                props.handleClick(e);
              }
            }}
            className={cn(
              'font-semibold transition-colors w-full text-inherit py-3 px-4 text-lg rounded-sm'
            )}
            aria-haspopup={hasChildren ? 'true' : 'false'}
            aria-expanded={hasChildren ? active : undefined}
          >
            <h2 className="text-h3 text-inherit [&_span]:font-Zodiak">
              {getNavigationText(props)}
            </h2>
          </Link>
          {hasChildren && (
            <button
              className="p-2 focus:outline-none text-inherit cursor-pointer hover:bg-secondary/50 rounded-sm"
              onClick={(e) => {
                e.preventDefault();
                setActive(!active);
              }}
              aria-label={`${active ? 'Collapse' : 'Expand'} ${getLinkTitle(props)} submenu`}
              aria-expanded={active}
              aria-controls={`submenu-${props.fields.Id}`}
            >
              <ChevronDown
                className={`h-4 w-4 text-inherit transition-transform ${
                  active ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </div>

      {hasChildren && (
        <ul
          className={cn(
            'w-full transition-all duration-300 ease-in-out [&_li]:pl-4',
            active ? 'block opacity-100' : 'hidden opacity-0'
          )}
          id={`submenu-${props.fields.Id}`}
          role="menu"
        >
          {children}
        </ul>
      )}
    </li>
  );
};

import { Menu, ChevronLeft, ChevronDown } from 'lucide-react';
import {
  type ComponentParams,
  type ComponentRendering,
  type Field,
  Placeholder,
  Text,
  useSitecore,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import { JSX, useEffect, useMemo, useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from 'src/core/ui/navigation-menu';
import { cn } from 'src/core/lib/utils';
import { Button } from 'src/core/ui/button';
import { Sheet, SheetContent, SheetTrigger } from 'src/core/ui/sheet';
import { useRouter } from 'next/router';

interface Fields {
  id: string;
  MegaNavTitle: Field<string>;
}

type MegaNavProps = {
  params: { [key: string]: string };
  fields: Fields;
  rendering: ComponentRendering & { params: ComponentParams };
};

type MeganavItem = ComponentRendering & {
  uid: string;
  fields: { MegaNavTitle: Field<string> };
};

const MegaNav = (props: MegaNavProps): JSX.Element | null => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const dynamicPlaceholderKey = isEditing
    ? 'meganav-{*}'
    : `meganav-${props.params.DynamicPlaceholderId}`;
  const allPlaceholders = props.rendering?.placeholders?.[dynamicPlaceholderKey] || [];

  const meganav = useMemo(() => {
    return allPlaceholders.filter(
      (item): item is MeganavItem =>
        typeof item === 'object' && item !== null && 'uid' in item && 'fields' in item
    );
  }, [allPlaceholders]);

  const tabPhKey = `meganav-${props.params.DynamicPlaceholderId}`;

  const handleItemChange = (uid: string) => {
    if (activeItem === uid) {
      setActiveItem('');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('active-menu-item');
      }
    } else {
      setActiveItem(uid);
      if (typeof window !== 'undefined') {
        localStorage.setItem('active-menu-item', uid);
      }
    }
  };

  // Close on mobile menu open
  useEffect(() => {
    if (isMobileMenuOpen) {
      setActiveItem('');
    }
  }, [isMobileMenuOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeItem && !(event.target as Element).closest('.mega-nav-container')) {
        setActiveItem('');
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveItem('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [activeItem]);

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      setActiveItem('');
      setIsMobileMenuOpen(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  const activeItemTitle = meganav.find((item) => item.uid === activeItem)?.fields?.MegaNavTitle
    ?.value;
  const dialogLabel = activeItemTitle ? `${activeItemTitle} menu` : 'Mega navigation menu';

  return (
    <div
      className={`w-full ${
        props.params?.styles || ''
      } mega-nav-container md:relative max-md:absolute max-md:top-0 max-md:container max-md:left-0`}
    >
      {hasMounted && (
        <>
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu className="w-full" role="navigation" aria-label="Main menu">
              <NavigationMenuList className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-none [&_button]:!bg-transparent [&_li]:-ml-4 [&_li]:w-max">
                {meganav.map((item) => {
                  const isActive = activeItem === item.uid;
                  const title = item.fields?.MegaNavTitle;
                  return (
                    <NavigationMenuItem key={item.uid}>
                      <NavigationMenuTrigger
                        onClick={() => handleItemChange(item?.uid || '')}
                        className={cn(
                          '[&>svg:nth-of-type(2)]:hidden bg-background inline-flex h-full w-full items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50',
                          isActive ? 'text-accent-foreground' : 'text-foreground'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                        aria-haspopup="true"
                        aria-controls={`menu-panel-${item.uid}`}
                        aria-expanded={isActive}
                      >
                        {title && (
                          <Text className="font-bold mr-2" field={title as Field<string>} />
                        )}
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transition-transform duration-200 ml-2',
                            isActive ? 'rotate-180' : 'rotate-0'
                          )}
                        />
                      </NavigationMenuTrigger>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Navigation */}
          <div className={cn('md:hidden ml-auto ', activeItem && 'active-menu-item')}>
            <div className="flex items-center justify-between p-4 md:border-b">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Toggle menu"
                    className="ml-auto p-2 [&_svg]:size-6 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 right-5"
                  >
                    <Menu className="h-6 w-6 transition-transform duration-200" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[100%] sm:w-[350px] [&_svg]:size-6"
                  role="dialog"
                  aria-modal="true"
                  aria-label={dialogLabel}
                  id="mobile-nav"
                >
                  <div
                    className={cn('flex flex-col max-md:mt-6', activeItem && 'active-menu-item')}
                  >
                    {activeItem ? (
                      <>
                        <div className="flex items-center mb-4">
                          <button
                            onClick={() => handleItemChange('')}
                            className="flex items-center text-sm text-muted-foreground hover:text-foreground "
                          >
                            <ChevronLeft className="mr-2 h-6 w-6 shrink-0 transition-transform duration-200" />
                            {meganav.find((item) => item.uid === activeItem)?.fields?.MegaNavTitle
                              ?.value || 'Back'}
                          </button>
                        </div>

                        <div>
                          <Placeholder
                            key={activeItem}
                            name={tabPhKey}
                            rendering={props.rendering}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col space-y-2">
                        {meganav.map((item) => {
                          const title = item.fields?.MegaNavTitle;
                          return (
                            <Button
                              key={item.uid}
                              variant="ghost"
                              className="justify-start"
                              onClick={() => handleItemChange(item?.uid || '')}
                            >
                              {title && <Text field={title as Field<string>} />}
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div>
                    <Placeholder name={tabPhKey} rendering={props.rendering} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Desktop Submenu Panel */}
          {activeItem && (
            <div
              className={cn(
                'w-full mega-menu-overlay [&_.linklist>ul]:flex-col [&_.linklist>ul>li>div>a]:text-foreground rounded-lg overflow-hidden',
                isEditing ? 'relative' : 'sticky left-0 top-0 right-0 z-50'
              )}
            >
              <div
                className="absolute inset-0 bg-black/20"
                onClick={() => setActiveItem('')}
                aria-hidden="true"
              />
              <div
                className="relative w-full bg-white max-h-[80vh] navigation-menu "
                role="dialog"
                aria-modal="true"
                aria-label={dialogLabel}
                id={`menu-panel-${activeItem}`}
              >
                <div className={isEditing ? 'hidden' : 'block'}>
                  <Placeholder key={activeItem} name={tabPhKey} rendering={props.rendering} />
                </div>
              </div>
            </div>
          )}

          {/* Mobile Menu Content and editing mode */}
          <div className={isEditing ? 'block' : 'md:hidden'}>
            <div>
              <Placeholder key={activeItem} name={tabPhKey} rendering={props.rendering} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default withDatasourceCheck()<MegaNavProps>(MegaNav);

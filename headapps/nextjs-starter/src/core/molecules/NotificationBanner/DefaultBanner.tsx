import { JSX, useState, useEffect } from 'react';
import { RichText, useSitecore } from '@sitecore-content-sdk/nextjs';
import { SitecoreImage } from 'src/core/atom/Images';
import { Alert } from 'src/core/ui/alert';
import { Button } from 'src/core/ui/button';
import { X } from 'lucide-react';
import { NotificationBannerProps } from 'src/types/NotificationBanner.types';

const DefaultBannerMolecule = (
  props: NotificationBannerProps & { onClose: () => void }
): JSX.Element => {
  return (
    <Alert
      className="relative flex items-start gap-4 p-4 rounded-lg w-full max-w-none min-w-full"
      role="alert"
    >
      <div className="flex max-md:flex-wrap gap-3 justify-center items-start w-full text-foreground">
        {props.fields?.BannerIcon?.value && (
          <div className="flex-shrink-0 pt-1">
            <SitecoreImage
              field={props.fields?.BannerIcon}
              className="w-6 h-6 object-contain"
              editable={true}
            />
          </div>
        )}
        <div className="flex flex-col gap-2 justify-center items-start flex-grow">
          <RichText field={props.fields?.BannerTitle} tag="h6" />
          <RichText field={props.fields?.BannerText} />
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-3"
        onClick={props.onClose}
        aria-label="Close notification"
      >
        <X />
      </Button>
    </Alert>
  );
};

export const DefaultBanner = (props: NotificationBannerProps): JSX.Element => {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const id = props.params?.RenderingIdentifier || 'default';
  const { page } = useSitecore();
  const siteName = page.siteName || 'defaultSite';
  const storageKey = `notification-${siteName}-${id}-closed`;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isClosed = localStorage.getItem(storageKey) === 'true';
      if (isClosed) {
        setIsVisible(false);
      }
      setMounted(true);
    }
  }, [storageKey]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem(storageKey, 'true');
  };

  if (!mounted || !isVisible || !props) return <></>;

  return (
    <div className={`${props.params?.styles} w-full`} id={id}>
      <DefaultBannerMolecule {...props} onClose={handleClose} />
    </div>
  );
};

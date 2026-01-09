import { JSX, useState, useEffect } from 'react';
import { RichText, useSitecore } from '@sitecore-content-sdk/nextjs';
import { Alert } from 'src/core/ui/alert';
import { Button } from 'src/core/ui/button';
import { AlertCircle, X } from 'lucide-react';
import { NotificationBannerProps } from 'src/types/NotificationBanner.types';

const ErrorBannerMolecule = (
  props: NotificationBannerProps & { onClose: () => void }
): JSX.Element => {
  return (
    <Alert
      variant="destructive"
      className="relative flex items-start justify-center gap-4 p-2 rounded-lg w-full border-destructive"
    >
      <div className="flex max-md:flex-wrap gap-3 justify-center items-start w-full">
        <div className="flex-shrink-0 flex-col items-start pt-1">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div className="flex flex-col gap-2 justify-center items-start flex-grow">
          <RichText field={props.fields?.BannerTitle} tag="h6" />
          <RichText field={props.fields?.BannerText} tag="p" />
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-3"
        onClick={props.onClose}
        aria-label="Close notification"
      >
        <X className="h-4 w-4 text-foreground" />
      </Button>
    </Alert>
  );
};

export const ErrorBanner = (props: NotificationBannerProps): JSX.Element => {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const id = props.params?.RenderingIdentifier;
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
      <ErrorBannerMolecule {...props} onClose={handleClose} />
    </div>
  );
};

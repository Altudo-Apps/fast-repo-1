import { JSX } from 'react';
import { NotificationBannerProps } from 'src/types/NotificationBanner.types';
import { DefaultBanner } from 'src/core/molecules/NotificationBanner/DefaultBanner';
import { ErrorBanner } from 'src/core/molecules/NotificationBanner/ErrorBanner';

const DefaultNotification = (props: NotificationBannerProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  return (
    <div className={props.params.styles} id={id}>
      <DefaultBanner {...props} />
    </div>
  );
};

const ErrorNotification = (props: NotificationBannerProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  return (
    <div className={props.params.style} id={id}>
      <ErrorBanner {...props} />
    </div>
  );
};

export const Default = DefaultNotification;
export const Error = ErrorNotification;

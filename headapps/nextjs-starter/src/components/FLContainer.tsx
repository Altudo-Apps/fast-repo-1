import { JSX, useMemo } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { cn } from 'src/core/lib/utils';
import { ComponentProps } from 'src/lib/component-props';

const FLContainerBase = (props: ComponentProps): JSX.Element => {
  const containerStyles = props?.params?.Styles ?? '';
  const styles = `${props.params.GridParameters} ${containerStyles}`.trimEnd();
  const phKey = `container-${props.params.DynamicPlaceholderId}`;
  const id = props.params.RenderingIdentifier;

  const backgroundStyle = useMemo(() => {
    const backgroundImage = props?.params?.BackgroundImage;
    const mediaUrlPattern = new RegExp(/mediaurl=\"([^"]*)\"/, 'i');
    const backgroundImageUrl = backgroundImage?.match(mediaUrlPattern)?.[1];

    return backgroundImage ? { backgroundImage: `url('${backgroundImageUrl}')` } : {};
  }, [props?.params?.BackgroundImage]);

  const isFullWidth = !styles.includes('container');
  const isCentered = styles.includes('position-center');
  const bordered = containerStyles.includes('sxa-bordered');

  return (
    <div
      className={cn(`${styles.replace('container', '').replace('position-center', '')}`)}
      id={id}
    >
      <div className="w-full" style={backgroundStyle}>
        <div
          className={cn({
            'container mx-auto': !isFullWidth,
            'flex flex-col items-center': isCentered,
            'lg:px-12 px-4 container mx-auto': bordered,
          })}
        >
          <Placeholder name={phKey} rendering={props.rendering} />
        </div>
      </div>
    </div>
  );
};

export const Default = (props: ComponentProps): JSX.Element => {
  return <FLContainerBase {...props} />;
};

export const Themed = (props: ComponentProps): JSX.Element => {
  return (
    <div className="flex flex-col">
      <FLContainerBase {...props} />
    </div>
  );
};

export const Header = Themed;
export const Footer = Themed;

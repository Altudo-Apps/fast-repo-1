import { JSX } from 'react';
import { ComponentParams, ComponentRendering, Placeholder } from '@sitecore-content-sdk/nextjs';

interface CarouselslideProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}

export const Default = (props: CarouselslideProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;

  return (
    <div className={`component ${props.params.styles}`} id={id ? id : undefined}>
      <div className="component-content">
        <Placeholder name={`slide-{*}`} rendering={props.rendering} />
      </div>
    </div>
  );
};

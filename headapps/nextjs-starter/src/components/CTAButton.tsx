import { JSX } from 'react';
import { CTAButtonProps } from 'src/core/molecules/CTAButton/CTAButton.type';
import CustomButton from 'src/core/molecules/CTAButton/CustomButton';

export const Default = (props: CTAButtonProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  return (
    <div className={props.params.styles} id={id}>
      <CustomButton {...props} />
    </div>
  );
};

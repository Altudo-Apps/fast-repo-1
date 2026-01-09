import Image from 'next/image';
import React from 'react';

interface LanguageFlagIconProps {
  src: string;
  alt: string;
  className?: string;
}

const LanguageFlagIcon: React.FC<LanguageFlagIconProps> = ({ src, alt, className = '' }) => {
  if (!src) {
    return null;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={20}
      height={20}
      className={`inline-block ${className}`}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default LanguageFlagIcon;

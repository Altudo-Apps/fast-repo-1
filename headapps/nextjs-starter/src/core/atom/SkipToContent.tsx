import React, { useEffect, useRef, useState } from 'react';

interface SkipToContentProps {
  targetId?: string;
  label?: string;
}

const SkipToContent: React.FC<SkipToContentProps> = ({
  targetId = 'main-content',
  label = 'Skip to main content',
}) => {
  const skipLinkRef = useRef<HTMLAnchorElement>(null);
  const [alreadyFocused, setAlreadyFocused] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.setAttribute('tabIndex', '-1'); // make it programmatically focusable
      targetElement.focus();
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // only trigger when at very top
      if (window.scrollY === 0 && e.key === 'Tab' && !alreadyFocused) {
        e.preventDefault();
        skipLinkRef.current?.focus();
        setAlreadyFocused(true); // next tabs should work normally
      }
    };

    const handleScroll = () => {
      // reset if user scrolls away from top
      if (window.scrollY > 0) {
        setAlreadyFocused(false);
      }
    };

    // Only add listeners on client side
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('scroll', handleScroll);
      };
    }

    // Return empty cleanup function for SSR
    return () => {};
  }, [alreadyFocused]);

  return (
    <a
      ref={skipLinkRef}
      href={`#${targetId}`}
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-black focus:text-white focus:px-4 focus:py-2 focus:rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-lg"
      tabIndex={0}
      aria-label={label}
    >
      {label}
    </a>
  );
};

export default SkipToContent;

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '../../ui/button';

const HeaderSearch: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Listen for clicks on the search button
  useEffect(() => {
    const handleButtonClick = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      setIsSearchOpen(true);
    };

    // Wait for DOM to be fully loaded
    const attachListener = () => {
      const searchButton = document.getElementById('search-input-btn');
      if (searchButton) {
        searchButton.addEventListener('click', handleButtonClick);
      }
      return searchButton;
    };

    // Try immediately and also after a short delay (in case of dynamic content)
    const button1 = attachListener();
    const timeoutId = setTimeout(attachListener, 1000);

    return () => {
      if (button1) {
        button1.removeEventListener('click', handleButtonClick);
      }
      clearTimeout(timeoutId);
    };
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  const handleSearchClick = () => {
    const raw = inputRef.current?.value?.trim() ?? '';
    const keyphrase = raw === '' ? '' : raw;
    if (keyphrase) {
      router.push(`/search?q=${encodeURIComponent(keyphrase)}`);
      setIsSearchOpen(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  if (!isSearchOpen) {
    return null;
  }

  return (
    <div ref={searchContainerRef} className="container mx-auto relative">
      <div className="absolute top-4 right-0 bg-slate z-[9999] w-600">
        <div className="flex items-center gap-2">
          {/* Search Input and Button - Matching SearchInput.tsx lines 111-129 */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                placeholder="Search Fastlane"
                defaultValue=""
                onKeyDown={handleKeyDown}
                className="peer rounded-md w-full h-11 px-2 py-3 border border-gray-300 bg-white text-sm focus:outline-gray-700 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleSearchClick}
              className="h-11 px-5 w-full sm:w-auto"
            >
              Search
            </Button>
          </div>

          {/* Close Button (X icon) */}
          <button
            type="button"
            onClick={() => {
              setIsSearchOpen(false);
              if (inputRef.current) {
                inputRef.current.value = '';
              }
            }}
            className="ml-1 p-1 rounded hover:opacity-60"
            aria-label="Close search"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderSearch;

import React from 'react';

interface HeaderNavigationProps {
  isOpenMenu: boolean;
  setIsOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
  list: React.ReactNode[];
}

const HeaderNavigation: React.FC<HeaderNavigationProps> = ({ isOpenMenu, setIsOpenMenu, list }) => {
  return (
    <div className="flex relative flex-col w-full">
      {/* Optional toggle button for mobile menu, remove if handled elsewhere */}
      <button
        className="md:hidden p-2 focus:outline-none"
        onClick={() => setIsOpenMenu(!isOpenMenu)}
        aria-label={isOpenMenu ? 'Close menu' : 'Open menu'}
      >
        {isOpenMenu ? 'Close' : 'Menu'}
      </button>
      <nav role="navigation" className={isOpenMenu ? 'block' : 'hidden md:block'}>
        <ul className="flex flex-col">{list}</ul>
      </nav>
    </div>
  );
};

export default HeaderNavigation;

import React from 'react';
import { cn } from 'src/core/lib/utils';

interface MobileNavProps {
  isOpenMenu: boolean;
  list: React.ReactNode[];
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpenMenu, list }) => {
  return (
    <div
      className={cn(
        'fixed inset-0 z-20 bg-white overflow-y-auto transition-transform duration-300 ease-in-out lg:hidden top-0',
        isOpenMenu ? 'translate-x-0 pt-28' : 'translate-x-full'
      )}
    >
      <nav className="pt-2 pb-20">
        <ul className="flex flex-col divide-y divide-gray-200">{list}</ul>
      </nav>
    </div>
  );
};

export default MobileNav;


import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import NavLink from './NavLink';
import { NavItem } from './types';

interface NavMenuProps {
  navItems: NavItem[];
  closeSidebarOnMobile: () => void;
}

const NavMenu: React.FC<NavMenuProps> = ({ navItems, closeSidebarOnMobile }) => {
  return (
    <ScrollArea className="flex-1 py-4">
      <nav className="grid gap-1 px-2">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            item={item}
            onClick={closeSidebarOnMobile}
          />
        ))}
      </nav>
    </ScrollArea>
  );
};

export default NavMenu;

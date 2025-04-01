
import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { NavItem } from './types';

interface NavLinkProps {
  item: NavItem;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ item, onClick }) => {
  return (
    <RouterNavLink
      to={item.href}
      className={({ isActive }) => 
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
          "transition-colors"
        )
      }
      onClick={onClick}
    >
      <item.icon className="h-4 w-4" />
      <span>{item.title}</span>
    </RouterNavLink>
  );
};

export default NavLink;

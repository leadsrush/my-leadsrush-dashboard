
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

// Import sub-components and types
import { SidebarProps } from './navigation/types';
import NavMenu from './navigation/NavMenu';
import UserProfile from './navigation/UserProfile';

// Import navigation items
import {
  clientNavItems,
  teamNavItems,
  adminNavItems,
  clientManagementItems
} from './navigation/navItems';

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();
  const { user, logout, hasRole } = useAuth();
  
  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };
  
  // Determine which nav items to display based on user role
  const navItems = hasRole(['client']) 
    ? clientNavItems 
    : [...teamNavItems, 
       ...(hasRole(['admin', 'project_manager']) ? clientManagementItems : []), 
       ...(hasRole(['admin']) ? adminNavItems : [])
      ];
  
  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />
      
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transition-transform duration-300 ease-in-out lg:translate-x-0 lg:border-r lg:bg-card lg:z-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <Link 
              to={hasRole(['client']) ? '/client-dashboard' : '/team-dashboard'} 
              className="flex items-center gap-2 font-semibold"
              onClick={closeSidebarOnMobile}
            >
              <img 
                src="/lovable-uploads/4ca15042-e89a-4f8f-8662-4075c5cbe7ca.png" 
                alt="LeadsRush Africa" 
                className="h-8 w-8"
              />
              <span>LeadsRush Africa</span>
            </Link>
          </div>
          
          <NavMenu 
            navItems={navItems} 
            closeSidebarOnMobile={closeSidebarOnMobile} 
          />
          
          <UserProfile 
            user={user} 
            logout={logout}
            closeSidebarOnMobile={closeSidebarOnMobile}
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;

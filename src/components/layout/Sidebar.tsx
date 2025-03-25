
import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Settings, 
  BarChart, 
  FolderKanban,
  LogOut,
  FileText,
  Briefcase,
  PackageOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();
  const { user, logout, hasRole } = useAuth();
  
  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };
  
  // Client sidebar navigation items
  const clientNavItems = [
    {
      title: 'Dashboard',
      href: '/client-dashboard',
      icon: LayoutDashboard
    },
    {
      title: 'Projects',
      href: '/projects',
      icon: FolderKanban
    },
    {
      title: 'Messages',
      href: '/messages',
      icon: MessageSquare
    },
    {
      title: 'Services',
      href: '/services',
      icon: PackageOpen
    },
    {
      title: 'Invoices',
      href: '/invoices',
      icon: FileText
    },
  ];
  
  // Admin/Team sidebar navigation items
  const teamNavItems = [
    {
      title: 'Dashboard',
      href: '/team-dashboard',
      icon: LayoutDashboard
    },
    {
      title: 'Projects',
      href: '/projects',
      icon: FolderKanban
    },
    {
      title: 'Messages',
      href: '/messages',
      icon: MessageSquare
    },
  ];
  
  // Admin sidebar navigation items
  const adminNavItems = hasRole(['admin']) ? [
    {
      title: 'Team',
      href: '/team',
      icon: Users
    },
    {
      title: 'Services',
      href: '/admin/services',
      icon: PackageOpen
    },
    {
      title: 'Invoices',
      href: '/admin/invoices',
      icon: FileText
    },
  ] : [];
  
  // Additional navigation items for admin and project manager
  const clientManagementItems = hasRole(['admin', 'project_manager']) ? [
    {
      title: 'Clients',
      href: '/clients',
      icon: Briefcase
    },
  ] : [];
  
  // Determine which nav items to display based on user role
  const navItems = hasRole(['client']) 
    ? clientNavItems 
    : [...teamNavItems, ...clientManagementItems, ...adminNavItems];
  
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
              <BarChart className="h-5 w-5 text-primary" />
              <span>LeadsRush</span>
            </Link>
          </div>
          
          <ScrollArea className="flex-1 py-4">
            <nav className="grid gap-1 px-2">
              {navItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.href}
                  className={({ isActive }) => 
                    cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                      "transition-colors"
                    )
                  }
                  onClick={closeSidebarOnMobile}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </NavLink>
              ))}
            </nav>
          </ScrollArea>
          
          <div className="border-t p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {user?.role.replace('_', ' ')}
                </p>
              </div>
            </div>
            
            <div className="grid gap-1">
              <NavLink
                to="/settings"
                className={({ isActive }) => 
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                    "transition-colors"
                  )
                }
                onClick={closeSidebarOnMobile}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </NavLink>
              
              <Button
                variant="ghost"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground justify-start"
                onClick={() => {
                  logout();
                  closeSidebarOnMobile();
                }}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

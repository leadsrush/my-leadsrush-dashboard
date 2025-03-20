
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronLeft, LayoutDashboard, MessageSquare, Briefcase, Settings, Users, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { hasRole } = useAuth();
  const location = useLocation();
  
  // Define navigation items based on user role
  const navigationItems = [
    // Common items for all users
    {
      name: 'Dashboard',
      href: hasRole(['admin', 'project_manager', 'team_member']) ? '/team-dashboard' : '/client-dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'project_manager', 'team_member', 'client']
    },
    {
      name: 'Projects',
      href: '/projects',
      icon: Briefcase,
      roles: ['admin', 'project_manager', 'team_member', 'client']
    },
    {
      name: 'Messages',
      href: '/messages',
      icon: MessageSquare,
      roles: ['admin', 'project_manager', 'team_member', 'client']
    },
    // Items for clients only
    {
      name: 'Services',
      href: '/services',
      icon: List,
      roles: ['client']
    },
    // Admin/internal team items
    {
      name: 'Clients',
      href: '/clients',
      icon: Users,
      roles: ['admin', 'project_manager']
    },
    {
      name: 'Team',
      href: '/team',
      icon: Users,
      roles: ['admin']
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      roles: ['admin', 'project_manager', 'team_member', 'client']
    }
  ];
  
  // Filter navigation items based on user role
  const filteredNavItems = navigationItems.filter(item => 
    hasRole(item.roles as any)
  );

  // Check if the current path is active, including nested routes
  const isRouteActive = (path: string) => {
    // For the dashboard, only match exact path
    if (path.includes('dashboard')) {
      return location.pathname === path;
    }
    
    // For other paths, check if the current path starts with the given path
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path + '/'));
  };

  return (
    <div 
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out transform",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <div className="font-semibold text-lg">My LeadsRush</div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsOpen(false)}
          className="md:hidden"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>
      
      <ScrollArea className="h-[calc(100vh-4rem)] py-4">
        <nav className="px-2 space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = isRouteActive(item.href);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { getUnreadMessageCount } from '@/data/mockData';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, signOut: logout } = useAuth();
  const navigate = useNavigate();
  
  // In a real app, this would come from an API
  const unreadMessages = user ? getUnreadMessageCount(user.id) : 0;
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="mr-2 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="text-xl font-semibold">
            LeadsRush Africa
          </div>
        </div>
        
        {user && (
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/messages')}
              className="relative"
            >
              <Mail className="h-5 w-5" />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </Button>
            
            <NotificationCenter />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2">
                  {user.profile?.avatar ? (
                    <img 
                      src={user.profile.avatar} 
                      alt={user.profile?.name || 'User'} 
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.profile?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user.profile?.email}</p>
                </div>
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

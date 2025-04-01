
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface UserProfileProps {
  user: {
    name: string;
    role: string;
  } | null;
  logout: () => void;
  closeSidebarOnMobile: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, logout, closeSidebarOnMobile }) => {
  if (!user) return null;
  
  return (
    <div className="border-t p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium leading-none">{user.name}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {user.role.replace('_', ' ')}
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
  );
};

export default UserProfile;

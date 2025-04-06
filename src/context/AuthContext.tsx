
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  active: boolean;
}

export interface ExtendedUser extends User {
  profile: UserProfile;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: ExtendedUser | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>; // Alias for signIn for backward compatibility
  logout: () => Promise<void>; // Alias for signOut for backward compatibility
  hasRole: (roles: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  userProfile: null,
  isLoading: true,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
  login: async () => false,
  logout: async () => {},
  hasRole: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Set up auth listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          // Get profile data
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileData && !error) {
            const extendedUser = {
              ...session.user,
              profile: profileData
            } as ExtendedUser;
            
            setUser(extendedUser);
            setUserProfile(profileData);
            setIsAuthenticated(true);
          } else {
            setUser(null);
            setUserProfile(null);
            setIsAuthenticated(false);
            console.error('Profile data not found:', error);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser(null);
          setUserProfile(null);
          setIsAuthenticated(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
      }
    });

    // THEN check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get profile data
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileData && !error) {
            const extendedUser = {
              ...session.user,
              profile: profileData
            } as ExtendedUser;
            
            setUser(extendedUser);
            setUserProfile(profileData);
            setIsAuthenticated(true);
          } else {
            console.error('Profile data not found:', error);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInHandler = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    
    return { data, error };
  };

  const signUpHandler = async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    
    return { data, error };
  };

  const signOutHandler = async () => {
    await supabase.auth.signOut();
  };

  // For backward compatibility
  const loginHandler = async (email: string, password: string) => {
    try {
      const { error } = await signInHandler(email, password);
      return !error;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const hasRole = (roles: string | string[]) => {
    if (!userProfile) return false;
    
    const rolesToCheck = Array.isArray(roles) ? roles : [roles];
    return rolesToCheck.includes(userProfile.role);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        userProfile,
        isLoading,
        signIn: signInHandler,
        signUp: signUpHandler,
        signOut: signOutHandler,
        login: loginHandler,
        logout: signOutHandler,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

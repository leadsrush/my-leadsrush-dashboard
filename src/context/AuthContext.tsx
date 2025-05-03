
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
      console.log("Auth state changed:", event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          // Get profile data
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileData && !error) {
            console.log("Profile data loaded:", profileData);
            
            // Map database column names to our interface
            const mappedProfile: UserProfile = {
              id: profileData.id,
              name: profileData.name,
              email: profileData.email,
              role: profileData.role,
              avatar: profileData.avatar,
              active: profileData.active || false
            };
            
            const extendedUser = {
              ...session.user,
              profile: mappedProfile
            } as ExtendedUser;
            
            setUser(extendedUser);
            setUserProfile(mappedProfile);
            setIsAuthenticated(true);
          } else {
            console.error('Profile data not found:', error);
            setUser(null);
            setUserProfile(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser(null);
          setUserProfile(null);
          setIsAuthenticated(false);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
      }
    });

    // THEN check for existing session
    const checkSession = async () => {
      try {
        console.log("Checking for existing session");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log("Existing session found for user:", session.user.id);
          
          // Get profile data
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileData && !error) {
            console.log("Profile data loaded from existing session:", profileData);
            
            // Map database column names to our interface
            const mappedProfile: UserProfile = {
              id: profileData.id,
              name: profileData.name,
              email: profileData.email,
              role: profileData.role,
              avatar: profileData.avatar,
              active: profileData.active || false
            };
            
            const extendedUser = {
              ...session.user,
              profile: mappedProfile
            } as ExtendedUser;
            
            setUser(extendedUser);
            setUserProfile(mappedProfile);
            setIsAuthenticated(true);
          } else {
            console.error('Profile data not found for existing session:', error);
          }
        } else {
          console.log("No existing session found");
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
    console.log("Attempting sign in for:", email);
    const result = await supabase.auth.signInWithPassword({ email, password });
    console.log("Sign in result:", result.data ? "Success" : "Failed", result.error);
    return result;
  };

  const signUpHandler = async (email: string, password: string, userData: any) => {
    console.log("Attempting sign up for:", email);
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    
    console.log("Sign up result:", result.data ? "Success" : "Failed", result.error);
    return result;
  };

  const signOutHandler = async () => {
    console.log("Signing out");
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

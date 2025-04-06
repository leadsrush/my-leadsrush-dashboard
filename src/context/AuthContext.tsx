
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCurrentUser } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userProfile: any | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signOut: () => Promise<void>;
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
  hasRole: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData) {
          setUser(userData);
          setUserProfile(userData.profile);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    // Set up auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const userData = await getCurrentUser();
        if (userData) {
          setUser(userData);
          setUserProfile(userData.profile);
          setIsAuthenticated(true);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signInHandler = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    
    // Fetch profile after sign in
    if (data.user) {
      const userData = await getCurrentUser();
      if (userData) {
        setUser(userData);
        setUserProfile(userData.profile);
        setIsAuthenticated(true);
      }
    }
    
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
    
    if (data.user && !error) {
      // Create profile record
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: email,
        role: userData.role,
        name: userData.name,
        active: true,
        created_at: new Date().toISOString(),
      });
      
      // Fetch profile after sign up
      const newUserData = await getCurrentUser();
      if (newUserData) {
        setUser(newUserData);
        setUserProfile(newUserData.profile);
        setIsAuthenticated(true);
      }
    }
    
    return { data, error };
  };

  const signOutHandler = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
    setIsAuthenticated(false);
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
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ykntoouhkvappmttzhpm.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbnRvb3Voa3ZhcHBtdHR6aHBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NjkxNDAsImV4cCI6MjA1OTU0NTE0MH0.GG0inMteIjI69yrPHC5-sTbhTlSL4dKJb9byJ19UqPo";

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Auth helper functions
export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signUp = async (email: string, password: string, userData: any) => {
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
      created_at: new Date().toISOString(),
    });
  }
  
  return { data, error };
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  
  if (data?.user && !error) {
    // Get profile data
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
      
    return { ...data.user, profile: profileData };
  }
  
  return null;
};


import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Supabase client
export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

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

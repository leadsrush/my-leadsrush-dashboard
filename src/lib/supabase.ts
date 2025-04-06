
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a dummy client if environment variables are missing
// This prevents the app from crashing, but functionality will be limited
let supabase: ReturnType<typeof createClient>;

// Check if environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
  
  // Create a mock client that returns empty data but doesn't crash
  supabase = {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null }, error: { message: 'Configuration error: Supabase not configured' } }),
      signUp: async () => ({ data: { user: null }, error: { message: 'Configuration error: Supabase not configured' } }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => ({ data: null, error: { message: 'Configuration error: Supabase not configured' } }),
      insert: () => ({ data: null, error: { message: 'Configuration error: Supabase not configured' } }),
      update: () => ({ data: null, error: { message: 'Configuration error: Supabase not configured' } }),
      delete: () => ({ data: null, error: { message: 'Configuration error: Supabase not configured' } }),
      eq: () => ({ data: null, error: { message: 'Configuration error: Supabase not configured' } }),
      single: () => ({ data: null, error: { message: 'Configuration error: Supabase not configured' } })
    })
  } as unknown as ReturnType<typeof createClient>;
} else {
  // Create the actual Supabase client
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
}

// Export the client
export { supabase };

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

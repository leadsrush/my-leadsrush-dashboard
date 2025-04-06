
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Verify Supabase environment variables and use our hardcoded values if not available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ykntoouhkvappmttzhpm.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbnRvb3Voa3ZhcHBtdHR6aHBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NjkxNDAsImV4cCI6MjA1OTU0NTE0MH0.GG0inMteIjI69yrPHC5-sTbhTlSL4dKJb9byJ19UqPo";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ Supabase environment variables are missing! Using defaults.");
}

// Import Supabase only if environment variables are available
import { supabase } from "./integrations/supabase/client";

// Verify Supabase connection
const verifySupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error) throw error;
    console.log('✅ Supabase connection established');
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
  }
};

// Run verification
verifySupabaseConnection();

// Render app
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

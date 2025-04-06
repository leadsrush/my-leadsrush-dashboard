
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { supabase } from "./lib/supabase";

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

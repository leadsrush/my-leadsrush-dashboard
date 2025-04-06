
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { supabase } from "./lib/supabase";

// Verify Supabase environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ Supabase environment variables are missing!");
  
  // Render error message instead of crashing
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Configuration Error</h1>
          <p className="mb-4 text-gray-700">
            Supabase environment variables are missing. Please make sure you've set up:
          </p>
          <ul className="text-left bg-gray-50 p-3 rounded border mb-4">
            <li className="font-mono text-sm mb-1">• VITE_SUPABASE_URL</li>
            <li className="font-mono text-sm">• VITE_SUPABASE_ANON_KEY</li>
          </ul>
          <p className="text-sm text-gray-600">
            Contact your administrator for assistance.
          </p>
        </div>
      </div>
    </React.StrictMode>
  );
} else {
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
}

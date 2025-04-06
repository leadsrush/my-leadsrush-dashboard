
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

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
            Set these values in your project's environment settings.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors">
            Retry
          </button>
        </div>
      </div>
    </React.StrictMode>
  );
} else {
  // Import Supabase only if environment variables are available
  import("./lib/supabase").then(({ supabase }) => {
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
  }).catch(error => {
    console.error("Failed to initialize Supabase:", error);
    
    // Render error message
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
      <React.StrictMode>
        <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Initialization Error</h1>
            <p className="mb-4 text-gray-700">
              There was a problem connecting to Supabase. Please check your configuration.
            </p>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border mb-4 font-mono overflow-auto">
              {error.message}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors">
              Retry
            </button>
          </div>
        </div>
      </React.StrictMode>
    );
  });
}

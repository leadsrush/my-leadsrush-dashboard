
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const { isAuthenticated, hasRole } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Determine the appropriate home route based on user role
  const getHomeRoute = () => {
    if (!isAuthenticated) return "/";
    return hasRole(["admin", "project_manager", "team_member"]) 
      ? "/team-dashboard" 
      : "/client-dashboard";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full text-red-500 mb-4">
            <span className="text-4xl font-bold">404</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button asChild>
            <Link to={getHomeRoute()} className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

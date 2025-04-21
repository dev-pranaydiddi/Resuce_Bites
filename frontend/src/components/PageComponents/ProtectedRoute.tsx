import { useContext } from "react";
import { Route, Redirect } from "wouter";
import { AuthContext } from "@/App";
import { Loader } from "lucide-react";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType;
}

/**
 * A route wrapper that redirects to the login page if the user is not authenticated
 */
const ProtectedRoute = ({ path, component: Component }: ProtectedRouteProps) => {
  const { user, loading } = useContext(AuthContext);

  return (
    <Route
      path={path}
      component={() => {
        // Show loading spinner while checking authentication
        if (loading) {
          return (
            <div className="flex justify-center items-center min-h-[50vh]">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          );
        }

        // Redirect to login if not authenticated
        if (!user) {
          return <Redirect to="/login" />;
        }

        // Render the protected component if authenticated
        return <Component />;
      }}
    />
  );
};

export default ProtectedRoute;
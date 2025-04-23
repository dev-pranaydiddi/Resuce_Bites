// App.js
import React, { useContext, useEffect, useState, createContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation as useRouterLocation,
} from "react-router-dom";
import { Toaster, toast } from "sonner";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DonatePage from "./pages/DonatePage";
import RequestPage from "./pages/RequestPage";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/not-found";
// import Address_Fetching from "./pages/Address_Fetching"; 

// Components
import Navbar from "./components/PageComponents/Navbar";
import Footer from "./components/PageComponents/Footer";
import ProtectedRoute from "./components/PageComponents/ProtectedRoute";

// Auth context
export const AuthContext = createContext({
  user: null,
  organization: null,
  loading: true,
  login: () => {},
  logout: () => {},
  checkSession: async () => false,
});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    try {
      const res = await fetch("/api/session", {
        credentials: "include",
      });
      if (!res.ok) {
        setUser(null);
        setOrganization(null);
        return false;
      }
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        // not JSON, likely a redirect or HTML error page
        setUser(null);
        setOrganization(null);
        return false;
      }
      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        console.error("Session JSON parse error:", parseErr);
        setUser(null);
        setOrganization(null);
        return false;
      }
      setUser(data.user);
      setOrganization(data.organization || null);
      return true;
    } catch (error) {
      console.error("Failed to check session:", error);
      return false;
    }
  };

  useEffect(() => {
    (async () => {
      await checkSession();
      setLoading(false);
    })();
    const interval = setInterval(checkSession, 60_000);
    return () => clearInterval(interval);
  }, []);

  const login = (userData, orgData) => {
    setUser(userData);
    setOrganization(orgData || null);
    localStorage.setItem("user", JSON.stringify(userData));
    if (orgData) localStorage.setItem("organization", JSON.stringify(orgData));
    toast.success(`Welcome back, ${userData.name}!`);
  };

  const logout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      setOrganization(null);
      localStorage.removeItem("user");
      localStorage.removeItem("organization");
      toast.success("You have been logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("There was an error logging out. Please try again.");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, organization, loading, login, logout, checkSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function Router() {
  const location = useRouterLocation();

  return (
    <>
      <Navbar />

      <main className="flex-grow">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />

          {/* Protected */}
          <Route
            path="/donate"
            element={
              <ProtectedRoute>
                <DonatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/request"
            element={
              <ProtectedRoute>
                <RequestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* hide footer on auth pages */}
      {location.pathname !== "/login" &&
        location.pathname !== "/register" && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Router />
        <Toaster position="bottom-right" richColors />
      </AuthProvider>
    </BrowserRouter>
  );
}

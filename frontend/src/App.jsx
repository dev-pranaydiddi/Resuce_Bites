import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";
import { useToast } from "./hooks/use-toast";

// Pages (adjust relative paths as needed)
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DonatePage from "./pages/DonatePage";
import RequestPage from "./pages/RequestPage";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth context (no TypeScript)
export const AuthContext = React.createContext({
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
  const { toast } = useToast();

  const checkSession = async () => {
    try {
      const response = await fetch('/api/session', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setOrganization(data.organization || null);
        return true;
      } else {
        setUser(null);
        setOrganization(null);
        return false;
      }
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
    const intervalId = setInterval(checkSession, 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const login = (userData, orgData) => {
    setUser(userData);
    if (orgData) setOrganization(orgData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (orgData) localStorage.setItem('organization', JSON.stringify(orgData));
    toast({
      title: "Logged in successfully",
      description: `Welcome back, ${userData.name}!`,
    });
  };

  const logout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' });
      setUser(null);
      setOrganization(null);
      localStorage.removeItem('user');
      localStorage.removeItem('organization');
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, organization, loading, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}

function Router() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />

          {/* Protected routes */}
          <Route path="/donate" element={<ProtectedRoute><DonatePage /></ProtectedRoute>} />
          <Route path="/request" element={<ProtectedRoute><RequestPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {location.pathname !== '/login' && location.pathname !== '/register' && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;

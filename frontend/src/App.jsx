// src/App.jsx
import React, { useContext, useEffect, useState, createContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation as useRouterLocation,
} from "react-router-dom";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

// Endpoints
import { USER } from "./Endpoints";
// Redux
import { setUser  } from "./store/authSlice";

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

// Components
import Navbar from "./components/PageComponents/Navbar";
import Footer from "./components/PageComponents/Footer";
import ProtectedRoute from "./components/PageComponents/ProtectedRoute";
import { checkUserSession, logoutUser } from "./lib/donation-api";

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
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const organization = useSelector((state) => state.auth.organization);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    try {
      const  data  = await checkUserSession();
      if (data.success) {
        dispatch(setUser({
          user: data.user,
          organization: data.organization || null,
        }));
        return true;
      } else {
        dispatch(setUser(null));
        return false;
      }
    } catch (error) {
      console.error("Failed to check session:", error);
      dispatch(setUser(null));
      return false;
    }
  };

  useEffect(() => {
    (async () => {
      await checkSession();
      setLoading(false);
    })();
    const interval = setInterval(checkSession, 60000);
    return () => clearInterval(interval);
  }, []);

  const login = (userData, orgData) => {
    console.log("login", userData);
    dispatch(
      setUser({ user: userData, organization: orgData || null })
    );
    toast.success(`Welcome back, ${userData.name.first} ${userData.name.last}!`);
  };

  const logout = async () => {
    try {
      await logoutUser();
      dispatch(setUser(null));
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out, try again.");
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
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />

          <Route
            path="/donate"
            element={<ProtectedRoute><DonatePage /></ProtectedRoute>}
          />
          <Route
            path="/request"
            element={<ProtectedRoute><RequestPage /></ProtectedRoute>}
          />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <Footer />
      )}
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

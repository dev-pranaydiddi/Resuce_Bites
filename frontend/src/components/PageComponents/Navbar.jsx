// src/components/PageComponents/Navbar.jsx
import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { persistor } from "@/store/store";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const isAuthenticated = Boolean(user);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // wrap logout to also clear storage and redirect
  const handleLogout = async () => {
    await logout();         // your context/logout logic
    // if you’re persisting redux you can also do:
     await persistor.purge();
    closeMobileMenu();
    navigate("/login", { replace: true });
  };

  const links = !isAuthenticated
    ? [
        { to: "/", label: "Home" },
        { to: "/how-it-works", label: "How It Works" },
        { to: "/about", label: "About Us" },
      ]
    : user.user.role === "RECIPIENT"
    ? [
        { to: "/", label: "Home" },
        { to: "/donation", label: "Browse Donations" },
        { to: "/request", label: "My Requests" },
        { to: "/how-it-works", label: "How It Works" },
        { to: "/about", label: "About Us" },
      ]
    : user.user.role === "VOLUNTEER"
    ? [
        { to: "/", label: "Home" },
        { to: "/deliveries", label: "Deliveries" },
        { to: "/my-deliveries", label: "My Deliveries" },
        { to: "/how-it-works", label: "How It Works" },
        { to: "/about", label: "About Us" },
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/donation", label: "Donations" },
        { to: "/my/donation", label: "My Donations" },
        { to: "/how-it-works", label: "How It Works" },
        { to: "/about", label: "About Us" },
      ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-full px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-8 w-8 fill-red-800 stroke-red-800 text-red-800" />
          <div className="font-heading font-bold text-2xl text-neutral-800">
            Food<span className="text-primary">Share</span>
          </div>
        </Link>

        {/* desktop links */}
        <div className="hidden md:flex items-center space-x-8">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`font-heading font-medium transition-colors ${
                pathname === to ? "text-primary" : "text-black"
              }`}
            >
              {label}
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="outline" className="rounded-full">
                  Dashboard
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="rounded-full"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button className="rounded-full">Login</Button>
            </Link>
          )}
        </div>

        {/* mobile menu button */}
        <button
          className="md:hidden bg-red-900 text-white p-2 rounded"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <>&#10005;</> : <>&#9776;</>}
        </button>
      </nav>

      {/* mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 flex flex-col space-y-3">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={closeMobileMenu}
                className={`font-heading font-medium py-2 transition-colors ${
                  pathname === to ? "text-primary" : "text-neutral-800"
                }`}
              >
                {label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={closeMobileMenu}>
                  <Button variant="outline" className="w-full rounded-full">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full rounded-full"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login" onClick={closeMobileMenu}>
                <Button className="w-full rounded-full">Login</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

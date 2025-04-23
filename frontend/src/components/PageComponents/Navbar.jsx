import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '@/App';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { pathname } = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className=" max-w-full px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-8 w-8 fill-red-800 stroke-red-800 text-red-800" />
          <div className="font-heading font-bold text-2xl text-neutral-800">
            Food<span className="text-primary">Share</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden text-black md:flex items-center space-x-8">
          {[
            { to: '/', label: 'Home' },
            { to: '/donate', label: 'Donate' },
            { to: '/request', label: 'Request Food' },
            { to: '/how-it-works', label: 'How It Works' },
            { to: '/about', label: 'About Us' }
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`font-heading font-medium text-decoration-none ${
                pathname === to ? ' text-black' : ' text-black'
              }`}
            >
              {label}
            </Link>
          ))}

          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="outline" className="rounded-full">
                  Dashboard
                </Button>
              </Link>
              <Button onClick={logout} variant="ghost" className="rounded-full">
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button className="rounded-full">
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden bg-red-900 text-[#fff] text-2xl"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-4 py-3 space-y-3 flex flex-col border-t">
            {[
              { to: '/', label: 'Home' },
              { to: '/donate', label: 'Donate' },
              { to: '/request', label: 'Request Food' },
              { to: '/how-it-works', label: 'How It Works' },
              { to: '/about', label: 'About Us' }
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={closeMobileMenu}
                className={`font-heading font-medium py-2 transition-colors hover:text-[hsl(var(--primary-dark))] ${
                  pathname === to ? 'text-[hsl(var(--primary-dark))]' : 'text-neutral-800'
                }`}
              >
                {label}
              </Link>
            ))}

            {user ? (
              <>
                <Link to="/dashboard" onClick={closeMobileMenu}>
                  <Button variant="outline" className="rounded-full w-full">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  variant="ghost"
                  className="rounded-full w-full"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login" onClick={closeMobileMenu}>
                <Button className="rounded-full w-full">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

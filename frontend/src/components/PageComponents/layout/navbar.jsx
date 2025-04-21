import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation().pathname;

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const navLinks = [
    { title: 'Home', href: '/' },
    { title: 'Donate Food', href: '/donate' },
    { title: 'Request Food', href: '/request' },
    { title: 'How It Works', href: '/how-it-works' },
    { title: 'About Us', href: '/about' }
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Utensils className="text-primary text-2xl" />
            <Link to="/" className="text-xl font-bold text-primary">FoodShare</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map(({ title, href }) => (
              <Link
                key={href}
                to={href}
                className={`font-medium transition-colors ${
                  location === href ? 'text-primary' : 'text-neutral-700 hover:text-primary'
                }`}
              >
                {title}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="font-medium text-neutral-700 hover:text-primary transition-colors">
              Login
            </Link>
            <Button asChild className="bg-primary hover:bg-primary-dark text-white font-medium transition-colors">
              <Link to="/register">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button onClick={toggleMenu} variant="ghost" className="text-neutral-700 p-1">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 py-3 border-t">
            <div className="flex flex-col space-y-2">
              {navLinks.map(({ title, href }) => (
                <Link
                  key={href}
                  to={href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-medium py-2 transition-colors ${
                    location === href ? 'text-primary' : 'text-neutral-700 hover:text-primary'
                  }`}
                >
                  {title}
                </Link>
              ))}
              <div className="pt-2 space-y-2">
                <Button
                  asChild
                  variant="outline"
                  className="w-full text-center font-medium text-neutral-700 hover:text-primary py-2 border border-neutral-300 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="w-full text-center bg-primary hover:bg-primary-dark text-white font-medium py-2 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

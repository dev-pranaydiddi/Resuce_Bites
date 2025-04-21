import { useState, useContext } from "react";
import { Link, useLocation } from "wouter";
import { AuthContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-[hsl(var(--primary-dark))] text-3xl">
            <Heart className="h-8 w-8 fill-[hsl(var(--primary-dark))] stroke-[hsl(var(--primary-dark))]" />
          </div>
          <div className="font-heading font-bold text-2xl text-neutral-800">
            Food<span className="text-primary">Share</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            href="/" 
            className={`font-heading font-medium hover:text-[hsl(var(--primary-dark))] transition-colors ${
              location === "/" ? "text-[hsl(var(--primary-dark))]" : ""
            }`}
          >
            Home
          </Link>
          <Link 
            href="/donate" 
            className={`font-heading font-medium hover:text-[hsl(var(--primary-dark))] transition-colors ${
              location === "/donate" ? "text-[hsl(var(--primary-dark))]" : ""
            }`}
          >
            Donate
          </Link>
          <Link 
            href="/request" 
            className={`font-heading font-medium hover:text-[hsl(var(--primary-dark))] transition-colors ${
              location === "/request" ? "text-[hsl(var(--primary-dark))]" : ""
            }`}
          >
            Request Food
          </Link>
          <Link 
            href="/how-it-works" 
            className={`font-heading font-medium hover:text-[hsl(var(--primary-dark))] transition-colors ${
              location === "/how-it-works" ? "text-[hsl(var(--primary-dark))]" : ""
            }`}
          >
            How It Works
          </Link>
          <Link 
            href="/about" 
            className={`font-heading font-medium hover:text-[hsl(var(--primary-dark))] transition-colors ${
              location === "/about" ? "text-[hsl(var(--primary-dark))]" : ""
            }`}
          >
            About Us
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" className="rounded-full">
                  Dashboard
                </Button>
              </Link>
              <Button 
                onClick={() => logout()} 
                variant="ghost" 
                className="rounded-full"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button className="rounded-full">
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-neutral-800 text-2xl"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
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
            <Link 
              href="/" 
              className={`font-heading font-medium py-2 hover:text-[hsl(var(--primary-dark))] transition-colors ${
                location === "/" ? "text-[hsl(var(--primary-dark))]" : ""
              }`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link 
              href="/donate" 
              className={`font-heading font-medium py-2 hover:text-[hsl(var(--primary-dark))] transition-colors ${
                location === "/donate" ? "text-[hsl(var(--primary-dark))]" : ""
              }`}
              onClick={closeMobileMenu}
            >
              Donate
            </Link>
            <Link 
              href="/request" 
              className={`font-heading font-medium py-2 hover:text-[hsl(var(--primary-dark))] transition-colors ${
                location === "/request" ? "text-[hsl(var(--primary-dark))]" : ""
              }`}
              onClick={closeMobileMenu}
            >
              Request Food
            </Link>
            <Link 
              href="/how-it-works" 
              className={`font-heading font-medium py-2 hover:text-[hsl(var(--primary-dark))] transition-colors ${
                location === "/how-it-works" ? "text-[hsl(var(--primary-dark))]" : ""
              }`}
              onClick={closeMobileMenu}
            >
              How It Works
            </Link>
            <Link 
              href="/about" 
              className={`font-heading font-medium py-2 hover:text-[hsl(var(--primary-dark))] transition-colors ${
                location === "/about" ? "text-[hsl(var(--primary-dark))]" : ""
              }`}
              onClick={closeMobileMenu}
            >
              About Us
            </Link>
            
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="py-2"
                  onClick={closeMobileMenu}
                >
                  <Button 
                    variant="outline" 
                    className="rounded-full w-full"
                  >
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
              <Link
                href="/login"
                onClick={closeMobileMenu}
              >
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

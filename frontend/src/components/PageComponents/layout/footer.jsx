import React from 'react';
import { Link } from 'react-router-dom';
import {
  Utensils,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand and Social */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-primary text-2xl">
                <Utensils />
              </div>
              <span className="text-xl font-bold text-white">FoodShare</span>
            </div>
            <p className="text-neutral-400 mb-4">
              Connecting food donors with those in need to reduce waste and fight hunger.
            </p>
            <div className="flex space-x-4">
              {[
                { Icon: Facebook, label: 'Facebook' },
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Linkedin, label: 'LinkedIn' }
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="text-neutral-400 hover:text-primary transition-colors"
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Us' },
                { to: '/how-it-works', label: 'How It Works' },
                { to: '/donations', label: 'Available Donations' },
                { to: '/organizations', label: 'Partner Organizations' }
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-neutral-400 hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              {[
                { href: '#', label: 'Food Safety Guidelines' },
                { href: '#', label: 'Donation FAQs' }
              ].map(({ href, label }) => (
                <li key={label}>
                  <a href={href} className="text-neutral-400 hover:text-primary transition-colors">
                    {label}
                  </a>
                </li>
              ))}
              {[
                { to: '/register', label: 'Organization Registration' },
                { to: '/register', label: 'Donor Registration' }
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="text-neutral-400 hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2 text-neutral-400">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mt-1 mr-2" />
                <span>
                  123 Main Street, Suite 456<br />Anytown, ST 12345
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>info@foodshare.org</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-neutral-700 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-neutral-500 text-sm mb-4 md:mb-0">
              &copy; {currentYear} FoodShare. All rights reserved.
            </div>
            <div className="flex space-x-4 text-sm text-neutral-500">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((text) => (
                <a key={text} href="#" className="hover:text-primary transition-colors">
                  {text}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
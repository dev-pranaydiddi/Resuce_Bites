import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Phone, Mail, Send, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Heart className="h-6 w-6 fill-white stroke-white text-white" />
              <div className="font-heading font-bold text-xl">
                Food<span className="text-[hsl(var(--primary-light))]">Share</span>
              </div>
            </Link>
            <p className="text-neutral-300 mb-4">
              Connecting surplus food with those who need it most.
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
                  className="text-white hover:text-[hsl(var(--primary-light))] transition-colors"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Us' },
                { to: '/how-it-works', label: 'How It Works' },
                { to: '/donate', label: 'Donate Food' },
                { to: '/request', label: 'Request Food' }
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-neutral-300 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              {[
                'Food Safety Guidelines',
                'Donation Best Practices',
                'FAQ',
                'Blog',
                'Support'
              ].map(label => (
                <li key={label}>
                  <a href="#" className="text-neutral-300 hover:text-white transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-1" />
                <span className="text-neutral-300">123 Main Street, City, State 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3" />
                <span className="text-neutral-300">(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3" />
                <span className="text-neutral-300">info@foodshare.org</span>
              </li>
            </ul>
            <form className="flex">
              <Input
                type="email"
                placeholder="Your email"
                className="rounded-r-none text-neutral-800"
              />
              <Button
                type="submit"
                className="bg-primary hover:bg-[hsl(var(--primary-dark))] px-4 py-2 rounded-l-none transition-colors"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-neutral-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-300 text-sm">&copy; {currentYear} FoodShare. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(text => (
              <a key={text} href="#" className="text-neutral-300 hover:text-white transition-colors text-sm">
                {text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

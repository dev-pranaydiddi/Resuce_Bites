import { Link } from "wouter";
import {
  Utensils,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
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
              <a
                href="#"
                className="text-neutral-400 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-neutral-400 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-400 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-neutral-400 hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/donations" className="text-neutral-400 hover:text-primary transition-colors">
                  Available Donations
                </Link>
              </li>
              <li>
                <Link href="/organizations" className="text-neutral-400 hover:text-primary transition-colors">
                  Partner Organizations
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
                  Food Safety Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
                  Donation FAQs
                </a>
              </li>
              <li>
                <Link href="/register" className="text-neutral-400 hover:text-primary transition-colors">
                  Organization Registration
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-neutral-400 hover:text-primary transition-colors">
                  Donor Registration
                </Link>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

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

        <div className="border-t border-neutral-700 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-neutral-500 text-sm mb-4 md:mb-0">
              &copy; {currentYear} FoodShare. All rights reserved.
            </div>
            <div className="flex space-x-4 text-sm text-neutral-500">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

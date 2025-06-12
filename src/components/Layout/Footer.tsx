import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white">
      {/* Social Media Bar */}
      <div className="bg-[#E5E5E5] py-5 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-black font-bold text-lg">FOLLOW US ON</h3>
            <div className="flex space-x-4 mt-2">
              <a href="https://instagram.com" className="text-black hover:text-gray-600 transition-colors duration-200" aria-label="Instagram">
                <Instagram size={24} />
              </a>
              <a href="https://facebook.com" className="text-black hover:text-gray-600 transition-colors duration-200" aria-label="Facebook">
                <Facebook size={24} />
              </a>
              <a href="https://tiktok.com" className="text-black hover:text-gray-600 transition-colors duration-200" aria-label="TikTok">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.242V2h-3.221v13.798c0 1.276-.973 2.319-2.175 2.319-1.202 0-2.175-1.043-2.175-2.319s.973-2.319 2.175-2.319c.225 0 .44.049.637.122V9.998a6.15 6.15 0 0 0-1.173-.118c-3.070 0-5.55 2.57-5.55 5.743 0 3.174 2.48 5.743 5.55 5.743 3.07 0 5.55-2.57 5.55-5.743V9.798c1.36.917 2.968 1.469 4.7 1.469V7.829c-.146.02-.292.04-.441.04a4.79 4.79 0 0 1-1.083-.127" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info Section */}
          <div className="mb-8 md:mb-0">
            <h3 className="text-sm font-bold mb-6 uppercase">CONTACT US</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-center">
                <Mail size={16} className="mr-2" />
                <a href="mailto:info@labubumaroc.com" className="hover:text-white transition-colors duration-200">
                  info@labubumaroc.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2" />
                <a href="tel:+212600000000" className="hover:text-white transition-colors duration-200">
                  +212 600 000 000
                </a>
              </li>
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1" />
                <span>Casablanca, Morocco</span>
              </li>
            </ul>
          </div>

          {/* SUPPORT Column */}
          <div className="mb-8 md:mb-0">
            <h3 className="text-sm font-bold mb-6 uppercase">SUPPORT</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link to="/faq" className="hover:text-white transition-colors duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping-info" className="hover:text-white transition-colors duration-200">
                  SHIPPING INFO
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors duration-200">
                  CONTACT US
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-white transition-colors duration-200">
                  RETURNS & EXCHANGES
                </Link>
              </li>
            </ul>
          </div>

          {/* ABOUT US Column */}
          <div className="mb-8 md:mb-0">
            <h3 className="text-sm font-bold mb-6 uppercase">ABOUT US</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors duration-200">
                  OUR STORY
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors duration-200">
                  TERMS & CONDITIONS
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors duration-200">
                  PRIVACY POLICY
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Labubu Maroc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
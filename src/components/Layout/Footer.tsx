import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Youtube, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Newsletter */}
      <div className="bg-popmart-lightgray py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-black mb-2">Join the LABUBU Community</h3>
                <p className="text-gray-600">Subscribe to get special offers, free giveaways, and exclusive deals.</p>
              </div>
              <div className="w-full md:w-auto">
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-grow py-3 px-4 border border-gray-300 focus:border-popmart-red focus:outline-none"
                  />
                  <button className="bg-black text-white py-3 px-6 hover:bg-popmart-red transition-colors duration-200 flex items-center">
                    Subscribe <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase text-black">About LABUBU</h3>
            <p className="text-gray-600 mb-6">
              The official store for Labubu collectibles in Morocco. Discover our exclusive collections and limited editions.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-black hover:text-popmart-red transition-colors duration-200" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" className="text-black hover:text-popmart-red transition-colors duration-200" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" className="text-black hover:text-popmart-red transition-colors duration-200" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://youtube.com" className="text-black hover:text-popmart-red transition-colors duration-200" aria-label="YouTube">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase text-black">Collections</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/collections/blind-box" className="text-gray-600 hover:text-popmart-red transition-colors duration-200">
                  Blind Box
                </Link>
              </li>
              <li>
                <Link to="/collections/figures" className="text-gray-600 hover:text-popmart-red transition-colors duration-200">
                  Figures
                </Link>
              </li>
              <li>
                <Link to="/collections/collaborations" className="text-gray-600 hover:text-popmart-red transition-colors duration-200">
                  Collaborations
                </Link>
              </li>
              <li>
                <Link to="/collections/new-arrivals" className="text-gray-600 hover:text-popmart-red transition-colors duration-200">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/collections/best-sellers" className="text-gray-600 hover:text-popmart-red transition-colors duration-200">
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase text-black">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-popmart-red transition-colors duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-600 hover:text-popmart-red transition-colors duration-200">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-popmart-red transition-colors duration-200">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-popmart-red transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-popmart-red transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase text-black">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={18} className="text-black mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-600">123 Labubu Street, Casablanca, Morocco</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-black mr-3 flex-shrink-0" />
                <span className="text-gray-600">+212 123 456 789</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-black mr-3 flex-shrink-0" />
                <span className="text-gray-600">info@labubumaroc.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Labubu Maroc. All rights reserved.</p>
            <div className="flex space-x-3">
              <img src="/images/payment/visa.svg" alt="Visa" className="h-6" />
              <img src="/images/payment/mastercard.svg" alt="Mastercard" className="h-6" />
              <img src="/images/payment/paypal.svg" alt="PayPal" className="h-6" />
              <img src="/images/payment/apple-pay.svg" alt="Apple Pay" className="h-6" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
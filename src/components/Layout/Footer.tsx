import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white">
      {/* Social Media Bar */}
      <div className="bg-[#E5E5E5] py-5 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-black font-bold text-lg">FOLLOW US ON</h3>
            <div className="flex space-x-4 mt-2">
              <a href="https://instagram.com" className="text-black" aria-label="Instagram">
                <Instagram size={24} />
              </a>
              <a href="https://facebook.com" className="text-black" aria-label="Facebook">
                <Facebook size={24} />
              </a>
              <a href="https://tiktok.com" className="text-black" aria-label="TikTok">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.242V2h-3.221v13.798c0 1.276-.973 2.319-2.175 2.319-1.202 0-2.175-1.043-2.175-2.319s.973-2.319 2.175-2.319c.225 0 .44.049.637.122V9.998a6.15 6.15 0 0 0-1.173-.118c-3.070 0-5.55 2.57-5.55 5.743 0 3.174 2.48 5.743 5.55 5.743 3.07 0 5.55-2.57 5.55-5.743V9.798c1.36.917 2.968 1.469 4.7 1.469V7.829c-.146.02-.292.04-.441.04a4.79 4.79 0 0 1-1.083-.127" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center">
            <a href="https://play.google.com/store" className="block">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-10" />
            </a>
            <a href="https://apple.com/app-store" className="block">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" className="h-10" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Community Section */}
          <div className="mb-8 md:mb-0">
            <h3 className="text-sm font-bold mb-6 uppercase">JOIN THE COMMUNITY</h3>
            <p className="text-sm text-gray-400 mb-4">Be the first to know about new releases, exclusive offers, and more.</p>
            <div className="flex mb-6">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow py-2 px-4 bg-transparent border border-gray-700 text-white focus:outline-none focus:border-white text-sm"
              />
              <button className="bg-white text-black py-2 px-4 text-sm hover:bg-gray-200 transition-colors duration-200">
                Sign Up
              </button>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-bold mb-2">Contact Us</h4>
              <div className="text-sm text-gray-400 mb-1 flex items-center">
                <span className="mr-2">Chat</span>
                <span className="text-xs">- Sunday 8:00 am-2:00 am PDT</span>
              </div>
              <div className="text-sm text-gray-400 mb-4">
                <div>Email</div>
                <a href="mailto:na.support@popmart.com" className="text-gray-400 hover:text-white">na.support@popmart.com</a>
              </div>
              <div className="text-sm text-gray-400">
                <a href="/faq" className="text-gray-400 hover:text-white">Visit Help Center (FAQs)</a>
              </div>
            </div>
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
                <Link to="/privacy-policy" className="hover:text-white transition-colors duration-200">
                  PRIVACY POLICY
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors duration-200">
                  TERMS & CONDITIONS
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-white transition-colors duration-200">
                  TRACK YOUR ORDER
                </Link>
              </li>
              <li>
                <Link to="/stores" className="hover:text-white transition-colors duration-200">
                  FIND A STORE
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-white transition-colors duration-200">
                  RETURNS
                </Link>
              </li>
              <li>
                <Link to="/pop-blocks" className="hover:text-white transition-colors duration-200">
                  POP BLOCKS
                </Link>
              </li>
            </ul>
          </div>

          {/* ABOUT US Column */}
          <div className="mb-8 md:mb-0">
            <h3 className="text-sm font-bold mb-6 uppercase">ABOUT US</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link to="/news" className="hover:text-white transition-colors duration-200">
                  NEWS
                </Link>
              </li>
              <li>
                <Link to="/artists" className="hover:text-white transition-colors duration-200">
                  ARTISTS
                </Link>
              </li>
              <li>
                <Link to="/about-pop-mart" className="hover:text-white transition-colors duration-200">
                  ABOUT POP MART
                </Link>
              </li>
              <li>
                <Link to="/investor-relations" className="hover:text-white transition-colors duration-200">
                  INVESTOR RELATIONS
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors duration-200">
                  CONTACT US
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white transition-colors duration-200">
                  CAREERS
                </Link>
              </li>
            </ul>
          </div>

          {/* SHOP Column */}
          <div>
            <h3 className="text-sm font-bold mb-6 uppercase">SHOP</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link to="/calendar" className="hover:text-white transition-colors duration-200">
                  LAUNCH CALENDAR
                </Link>
              </li>
              <li>
                <Link to="/trending" className="hover:text-white transition-colors duration-200">
                  TRENDING
                </Link>
              </li>
              <li>
                <Link to="/blind-boxes" className="hover:text-white transition-colors duration-200">
                  BLIND BOXES
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-white transition-colors duration-200">
                  MEDIA COLLECTIONS
                </Link>
              </li>
              <li>
                <Link to="/accessories" className="hover:text-white transition-colors duration-200">
                  ACCESSORIES
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Country/Region Selector */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col-reverse md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mt-4 md:mt-0">&copy; {new Date().getFullYear()} Labubu Maroc. All rights reserved.</p>
          
          <div className="flex items-center">
            <span className="text-sm text-gray-400 mr-2">COUNTRY/REGION</span>
            <button className="border border-gray-700 px-3 py-1 flex items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Flag_of_Morocco.svg" alt="Morocco flag" className="w-5 h-3 mr-2" />
              <span className="text-sm">CA</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Heart, Search, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  const navItems = [
    { name: 'New Arrivals', path: '/new' },
    { name: 'Collections', path: '/collections', hasChildren: true },
    { name: 'Series', path: '/series', hasChildren: true },
    { name: 'Shop All', path: '/shop' },
    { name: 'POP', path: '/pop' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      {/* Announcement Bar */}
      <div className="bg-popmart-red text-white py-2 text-center text-sm">
        Free shipping on orders over $50 - Limited time offer!
      </div>
      
      {/* Main Header */}
      <div className={`bg-white transition-all duration-300 ${isScrolled ? 'py-2 shadow-sm' : 'py-4'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link to="/" className="text-2xl font-bold flex items-center">
              <span className="text-black text-center md:text-left">
                LABUBU
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    to={item.path}
                    className={`font-medium py-2 text-black hover:text-popmart-red transition-colors duration-200 ${location.pathname === item.path ? 'text-popmart-red' : ''}`}
                  >
                    <span className="flex items-center">
                      {item.name}
                      {item.hasChildren && (
                        <ChevronDown size={16} className="ml-1 group-hover:rotate-180 transition-transform duration-200" />
                      )}
                    </span>
                  </Link>
                  {item.hasChildren && (
                    <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <Link to={`${item.path}/blind-box`} className="block px-4 py-2 text-sm text-black hover:text-popmart-red hover:bg-popmart-lightgray">
                        Blind Box
                      </Link>
                      <Link to={`${item.path}/figures`} className="block px-4 py-2 text-sm text-black hover:text-popmart-red hover:bg-popmart-lightgray">
                        Figures
                      </Link>
                      <Link to={`${item.path}/collaborations`} className="block px-4 py-2 text-sm text-black hover:text-popmart-red hover:bg-popmart-lightgray">
                        Collaborations
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop Icons */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-black hover:text-popmart-red transition-colors duration-200"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <Link 
                to="/account" 
                className="p-2 text-black hover:text-popmart-red transition-colors duration-200"
                aria-label="Account"
              >
                <User size={20} />
              </Link>
              <Link 
                to="/wishlist" 
                className="p-2 text-black hover:text-popmart-red transition-colors duration-200"
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </Link>
              <Link 
                to="/cart" 
                className="p-2 text-black hover:text-popmart-red transition-colors duration-200 relative"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                <span className="absolute -top-1 -right-1 bg-popmart-red text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">0</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-white shadow-md py-4 px-4 z-30"
          >
            <div className="container mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full py-2 pl-10 pr-4 border-b-2 border-gray-200 focus:border-popmart-red outline-none"
                  autoFocus
                />
                <Search size={20} className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-popmart-red"
                  aria-label="Close search"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 z-30"
          >
            <div className="py-4 px-4">
              <nav className="flex flex-col">
                {navItems.map((item) => (
                  <div key={item.name} className="border-b border-gray-100 last:border-b-0">
                    <Link
                      to={item.path}
                      className={`block font-medium py-3 flex justify-between items-center ${location.pathname === item.path ? 'text-popmart-red' : 'text-black'}`}
                    >
                      {item.name}
                      {item.hasChildren && <ChevronDown size={16} />}
                    </Link>
                  </div>
                ))}
              </nav>
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col space-y-2">
                <Link to="/account" className="py-2 text-black hover:text-popmart-red flex items-center">
                  <User size={18} className="mr-2" /> My Account
                </Link>
                <Link to="/wishlist" className="py-2 text-black hover:text-popmart-red flex items-center">
                  <Heart size={18} className="mr-2" /> Wishlist
                </Link>
                <Link to="/contact" className="py-2 text-black hover:text-popmart-red flex items-center">
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
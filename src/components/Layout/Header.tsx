import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Heart, Search, User } from 'lucide-react';
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

  // Updated to match POPMART's navigation items
  const navItems = [
    { name: 'NEW & FEATURED', path: '/new-featured' },
    { name: 'CATEGORIES', path: '/categories' },
    { name: 'CHARACTERS', path: '/characters' },
    { name: 'ACCESSORIES', path: '/accessories' },
    { name: 'MEGA', path: '/mega' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white border-b border-gray-200">
      <div className={`transition-all duration-300 ${isScrolled ? 'py-5' : 'py-6'} w-full`}>
        <div className="w-full mx-0 px-[2cm]">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 ml-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center justify-center">
  <div 
    style={{
      fontFamily: '"Bebas Neue", sans-serif',
      backgroundColor: '#d10a1f',
      color: 'white',
      display: 'flex',                // Flex container
      justifyContent: 'center',      // Horizontal centering
      alignItems: 'center',          // Vertical centering
      height: '30px',                // Fixed height for equal spacing
      width: 'auto',                 // Or 100% if you want full width
      padding: '3px 3px 0 3px',             // Left and right padding only
    }}
    className="text-3xl uppercase"
  >
    LABUBU MAROC
  </div>
</Link>





            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center">
              {navItems.map((item) => (
                <div key={item.name} className="relative">
                  <Link
                    to={item.path}
                    className={`font-medium py-4 px-3 text-black hover:text-popmart-red transition-colors duration-200 uppercase text-base font-bold tracking-wider popmart-nav-font ${location.pathname === item.path ? 'text-popmart-red' : ''}`}
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
            </nav>

            {/* Search Input - Visible on desktop */}
            <div className="hidden lg:flex items-center relative border border-gray-300 rounded-full px-5 py-3 w-32 xl:w-64">
              <input 
                type="text" 
                placeholder="SEARCH"
                className="w-full text-xs uppercase tracking-wider outline-none placeholder-gray-400 popmart-nav-font"
              />
              <Search size={16} className="text-gray-400" />
            </div>

            {/* Desktop Icons */}
            <div className="flex items-center space-x-6 mr-6">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="lg:hidden p-2 text-black hover:text-popmart-red transition-colors duration-200"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <Link 
                to="/wishlist" 
                className="p-2 text-black hover:text-popmart-red transition-colors duration-200 hidden md:block"
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
                <span className="absolute -top-1 -right-1 bg-popmart-red text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">2</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search Overlay - Mobile only */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-white shadow-md py-4 px-0 z-30 lg:hidden"
          >
            <div className="w-full mx-auto">
              <div className="relative px-4">
                <input
                  type="text"
                  placeholder="SEARCH"
                  className="w-full py-2 pl-10 pr-4 border-b-2 border-gray-200 focus:border-popmart-red outline-none uppercase text-xs tracking-wider"
                  autoFocus
                />
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
            className="lg:hidden bg-white shadow-lg absolute top-full left-0 right-0 z-30"
          >
            <div className="py-4 px-4">
              <nav className="flex flex-col">
                {navItems.map((item) => (
                  <div key={item.name} className="border-b border-gray-100 last:border-b-0">
                    <Link
                      to={item.path}
                      className={`block font-medium py-3 flex justify-between items-center uppercase text-base font-bold tracking-wider popmart-nav-font ${location.pathname === item.path ? 'text-popmart-red' : 'text-black'}`}
                    >
                      {item.name}
                    </Link>
                  </div>
                ))}
              </nav>
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col space-y-2">
                <Link to="/wishlist" className="py-2 text-black hover:text-popmart-red flex items-center uppercase text-xs tracking-wider popmart-nav-font">
                  <Heart size={18} className="mr-2" /> Wishlist
                </Link>
                <Link to="/contact" className="py-2 text-black hover:text-popmart-red flex items-center uppercase text-xs tracking-wider popmart-nav-font">
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
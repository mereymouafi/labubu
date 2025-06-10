import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Heart, Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../../context/ShopContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get cart and wishlist counts from shop context
  const { cartCount, wishlistCount } = useShop();

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
    setIsCategoriesDropdownOpen(false);
    setIsMobileCategoriesOpen(false);
    setSearchQuery('');
  }, [location]);

  // Updated to match LABUBU MAROC's navigation items
  const navItems = [
    { name: 'BLIND BOX', path: '/blind-box' },
    { name: 'T-SHIRTS', path: '/t-shirts' },
    { name: 'FIGURINGS', path: '/figurings' },
    { 
      name: 'ACCESSORIES',
      path: '/accessories',
      dropdownItems: [
        { name: 'MUGS', path: '/mugs' },
        { name: 'PORT CLÉS', path: '/port-cles' },
        { name: 'POCHETTES', path: '/accessories/pochettes' }
      ]
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white border-b border-gray-200">
      <div className={`transition-all duration-300 ${isScrolled ? 'py-5' : 'py-6'} w-full`}>
        <div className="w-full mx-0 px-4 md:px-[2cm]">
          <div className="flex items-center justify-between relative">
            {/* Mobile Menu Button - Positioned absolutely on mobile */}
            <button
              className="lg:hidden p-2 absolute left-0 z-10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo - Centered on mobile */}
            <div className="flex-1 flex justify-center lg:justify-start">
              <Link to="/" className="flex items-center justify-center">
                <div 
                  className="bg-labubumaroc-red text-white py-1 px-2 text-center"
                  style={{
                    fontFamily: '"Bebas Neue", sans-serif',
                    fontSize: 'clamp(0.875rem, 3.5vw, 1.5rem)',
                    lineHeight: '1.2',
                    letterSpacing: '0.5px',
                    maxWidth: '100%',
                    whiteSpace: 'nowrap',
                    display: 'inline-block',
                  }}
                >
                  LABUBU MAROC
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center">
              {navItems.map((item) => (
                <div key={item.name} className="relative"
                  onMouseEnter={() => {
                    if (item.name === 'ACCESSORIES') setIsCategoriesDropdownOpen(true);
                  }}
                  onMouseLeave={() => {
                    if (item.name === 'ACCESSORIES') setIsCategoriesDropdownOpen(false);
                  }}
                >
                  {item.dropdownItems ? (
                    <div className="flex items-center cursor-pointer">
                      <Link 
                        to={item.path}
                        className={`font-medium py-4 px-3 text-black hover:text-labubumaroc-red transition-colors duration-200 uppercase text-base font-bold tracking-wider labubumaroc-nav-font ${location.pathname.startsWith(item.path) ? 'text-labubumaroc-red' : ''}`}
                      >
                        {item.name}
                        <ChevronDown size={16} className="inline ml-1 pb-1" />
                      </Link>
                      
                      {/* Accessories Dropdown */}
                      {isCategoriesDropdownOpen && (
                        <div className="absolute top-full left-0 bg-white shadow-lg z-50 w-[200px] p-4">
                          <div className="flex flex-col space-y-3">
                            {item.dropdownItems.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.name}
                                to={dropdownItem.path}
                                className="text-sm font-medium hover:text-labubumaroc-red transition-colors duration-200 uppercase"
                              >
                                {dropdownItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`font-medium py-4 px-3 text-black hover:text-labubumaroc-red transition-colors duration-200 uppercase text-base font-bold tracking-wider labubumaroc-nav-font ${location.pathname === item.path ? 'text-labubumaroc-red' : ''}`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Search, Wishlist, and Cart Icons */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Search Icon */}
              <button
                className="p-2 text-black hover:text-labubumaroc-red transition-colors duration-200"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Wishlist Icon */}
              <Link 
                to="/wishlist" 
                className="p-2 text-black hover:text-labubumaroc-red transition-colors duration-200 relative"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-labubumaroc-red text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link 
                to="/cart" 
                className="p-2 text-black hover:text-labubumaroc-red transition-colors duration-200 relative"
                aria-label="Cart"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-labubumaroc-red text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Search Input - Visible on desktop */}
            <div className="hidden lg:flex items-center relative border border-gray-300 rounded-full px-5 py-3 w-32 xl:w-64">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full outline-none bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
              />
              <button 
                onClick={() => {
                  if (searchQuery.trim()) {
                    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
                className="absolute right-3 text-gray-500 hover:text-labubumaroc-red transition-colors duration-200"
                aria-label="Search"
              >
                <Search size={16} />
              </button>
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
                  className="w-full py-2 pl-10 pr-4 border-b-2 border-gray-200 focus:border-labubumaroc-red outline-none uppercase text-xs tracking-wider"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                      setIsSearchOpen(false);
                    }
                  }}
                />
                <button 
                  onClick={() => {
                    if (searchQuery.trim()) {
                      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                      setIsSearchOpen(false);
                    }
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-labubumaroc-red"
                >
                  <Search size={20} />
                </button>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-labubumaroc-red"
                  aria-label="Close search"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-md z-50 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-5">
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.name}>
                    {item.dropdownItems ? (
                      <div>
                        <button
                          onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                          className="flex items-center justify-between w-full py-2 text-black hover:text-labubumaroc-red transition-colors duration-200 uppercase font-bold tracking-wider labubumaroc-nav-font"
                        >
                          <span>{item.name}</span>
                          <ChevronDown 
                            size={16} 
                            className={`transform transition-transform ${isMobileCategoriesOpen ? 'rotate-180' : ''}`} 
                          />
                        </button>

                        {/* Mobile Accessories Dropdown */}
                        {isMobileCategoriesOpen && (
                          <div className="pl-4 py-2">
                            <div className="flex flex-col space-y-2">
                              {item.dropdownItems.map((dropdownItem) => (
                                <Link
                                  key={dropdownItem.name}
                                  to={dropdownItem.path}
                                  className="text-sm text-gray-700 hover:text-labubumaroc-red uppercase"
                                >
                                  {dropdownItem.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        className={`block font-medium py-3 flex justify-between items-center uppercase text-base font-bold tracking-wider labubumaroc-nav-font ${location.pathname === item.path ? 'text-labubumaroc-red' : 'text-black'}`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col space-y-2">
                <Link to="/wishlist" className="py-2 text-black hover:text-labubumaroc-red flex items-center uppercase text-xs tracking-wider labubumaroc-nav-font">
                  <Heart size={18} className="mr-2" /> Wishlist
                </Link>
                <Link to="/cart" className="py-2 text-black hover:text-labubumaroc-red flex items-center uppercase text-xs tracking-wider labubumaroc-nav-font">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                    <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg> Cart
                </Link>
                <Link to="/contact" className="py-2 text-black hover:text-labubumaroc-red flex items-center uppercase text-xs tracking-wider labubumaroc-nav-font">
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
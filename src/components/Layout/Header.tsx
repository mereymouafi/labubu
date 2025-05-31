import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Search, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCategories, Category } from '../../lib/supabase';

// Fonction utilitaire pour formater les URLs d'images Supabase
const formatImageUrl = (imageUrl: string | undefined) => {
  if (!imageUrl) return '';
  
  // Si l'URL est déjà complète, la retourner telle quelle
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Format attendu pour le stockage Supabase
  const supabaseProjectUrl = import.meta.env.VITE_SUPABASE_URL;
  return `https://${supabaseProjectUrl}/storage/v1/object/public/${imageUrl}`;
};

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
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
    setIsCategoriesDropdownOpen(false);
    setIsMobileCategoriesOpen(false);
  }, [location]);

  useEffect(() => {
    const loadCategories = async () => {
      const categoryData = await fetchCategories();
      console.log('Categories loaded:', categoryData);
      setCategories(categoryData);
    };
    
    loadCategories();
  }, []);

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
                <div key={item.name} className="relative"
                  onMouseEnter={() => item.name === 'CATEGORIES' && setIsCategoriesDropdownOpen(true)}
                  onMouseLeave={() => item.name === 'CATEGORIES' && setIsCategoriesDropdownOpen(false)}
                >
                  {item.name === 'CATEGORIES' ? (
                    <div className="flex items-center cursor-pointer">
                      <span 
                        className={`font-medium py-4 px-3 text-black hover:text-popmart-red transition-colors duration-200 uppercase text-base font-bold tracking-wider popmart-nav-font ${location.pathname.startsWith('/categories') ? 'text-popmart-red' : ''}`}
                      >
                        {item.name}
                        <ChevronDown size={16} className="inline ml-1 pb-1" />
                      </span>
                      
                      {/* Categories Dropdown */}
                      {isCategoriesDropdownOpen && categories.length > 0 && (
                        <div className="absolute top-full left-0 bg-white shadow-lg z-50 w-[450px] p-4">
                          <div className="grid grid-cols-2 gap-6">
                            {categories.map((category) => (
                              <Link
                                key={category.id}
                                to={`/categories/${category.slug}`}
                                className="flex flex-col items-center hover:text-popmart-red transition-transform duration-200 hover:scale-105"
                              >
                                {category.image ? (
                                  <div className="w-[180px] h-[100px] overflow-hidden mb-2">
                                    <img 
                                      src={formatImageUrl(category.image)} 
                                      alt={category.name} 
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        console.error(`Error loading image: ${category.image}`);
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = 'https://via.placeholder.com/180x100?text=' + encodeURIComponent(category.name);
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className="w-[180px] h-[100px] bg-gray-100 flex items-center justify-center mb-2">
                                    <span className="text-gray-400">{category.name}</span>
                                  </div>
                                )}
                                <span className="text-sm text-center uppercase font-medium">{category.name}</span>
                              </Link>
                            ))}
                            <Link 
                              to="/categories"
                              className="flex flex-col items-center hover:text-popmart-red transition-transform duration-200 hover:scale-105"
                            >
                              <div className="w-[180px] h-[100px] border border-gray-200 flex items-center justify-center mb-2 bg-gray-50">
                                <span className="text-3xl">+</span>
                              </div>
                              <span className="text-sm text-center uppercase font-medium">ALL</span>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`font-medium py-4 px-3 text-black hover:text-popmart-red transition-colors duration-200 uppercase text-base font-bold tracking-wider popmart-nav-font ${location.pathname === item.path ? 'text-popmart-red' : ''}`}
                    >
                      {item.name}
                    </Link>
                  )}
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
                className="p-2 text-black hover:text-popmart-red transition-colors duration-200 flex items-center"
                aria-label="Shopping Cart"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="ml-1 text-xs">0</span>
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
                    {item.name === 'CATEGORIES' ? (
                      <div>
                        <button
                          onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                          className="flex items-center justify-between w-full py-2 text-black hover:text-popmart-red transition-colors duration-200 uppercase font-bold tracking-wider popmart-nav-font"
                        >
                          <span>{item.name}</span>
                          <ChevronDown size={16} className={`transform transition-transform ${isMobileCategoriesOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Mobile Categories Dropdown */}
                        {isMobileCategoriesOpen && categories.length > 0 && (
                          <div className="pl-4 py-2">
                            <ul className="space-y-2">
                              {categories.map((category) => (
                                <li key={category.id}>
                                  <Link
                                    to={`/categories/${category.slug}`}
                                    className="flex items-center py-2 text-sm text-gray-700 hover:text-popmart-red"
                                  >
                                    {category.image ? (
                                      <div className="w-[60px] h-[60px] mr-3 overflow-hidden">
                                        <img
                                          src={formatImageUrl(category.image)}
                                          alt={category.name}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = 'https://via.placeholder.com/60x60?text=' + encodeURIComponent(category.name);
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      <div className="w-[60px] h-[60px] mr-3 bg-gray-100 flex items-center justify-center">
                                        <span className="text-gray-400 text-xs">{category.name}</span>
                                      </div>
                                    )}
                                    <span>{category.name}</span>
                                  </Link>
                                </li>
                              ))}
                              <li>
                                <Link
                                  to="/categories"
                                  className="flex items-center py-2 text-sm text-gray-700 hover:text-popmart-red"
                                >
                                  <div className="w-[60px] h-[60px] mr-3 border border-gray-200 flex items-center justify-center bg-gray-50">
                                    <span className="text-xl">+</span>
                                  </div>
                                  <span>ALL</span>
                                </Link>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        className={`block font-medium py-3 flex justify-between items-center uppercase text-base font-bold tracking-wider popmart-nav-font ${location.pathname === item.path ? 'text-popmart-red' : 'text-black'}`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col space-y-2">
                <Link to="/wishlist" className="py-2 text-black hover:text-popmart-red flex items-center uppercase text-xs tracking-wider popmart-nav-font">
                  <Heart size={18} className="mr-2" /> Wishlist
                </Link>
                <Link to="/cart" className="py-2 text-black hover:text-popmart-red flex items-center uppercase text-xs tracking-wider popmart-nav-font">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                    <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg> Cart
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
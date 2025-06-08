import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout/Layout';
import { ShopProvider } from './context/ShopContext';
import AdminRoute from './pages/Admin/components/AdminRoute';

// Lazily load page components
const Home = lazy(() => import('./pages/Home'));
const Categories = lazy(() => import('./pages/Categories'));
const CategoryProducts = lazy(() => import('./pages/CategoryProducts'));
const Characters = lazy(() => import('./pages/Characters'));
const CharacterProducts = lazy(() => import('./pages/CharacterProducts'));
const Collections = lazy(() => import('./pages/Collections'));
const CollectionDetail = lazy(() => import('./pages/CollectionDetail'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const NewArrivalsPage = lazy(() => import('./pages/NewArrivalsPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const BlindBoxPage = lazy(() => import('./pages/BlindBoxPage'));
// Page for new and featured products
const NewAndFeaturedPage = lazy(() => import('./pages/NewAndFeaturedPage'));
// T-shirts pages
const TShirtsPage = lazy(() => import('./pages/TShirtsPage'));
const TShirtDetail = lazy(() => import('./pages/TShirtDetail'));

// Admin pages
const AdminLogin = lazy(() => import('./pages/Admin/Login'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
  </div>
);

function App() {
  const location = useLocation();

  return (
    <ShopProvider>
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="categories" element={<Categories />} />
              <Route path="categories/:slug" element={<CategoryProducts />} />
              <Route path="characters" element={<Characters />} />
              <Route path="characters/:slug" element={<CharacterProducts />} />
              <Route path="collections" element={<Collections />} />
              <Route path="collections/:slug" element={<CollectionDetail />} />
              <Route path="shop" element={<Shop />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="new-arrivals" element={<NewArrivalsPage />} />
              <Route path="new-featured" element={<NewAndFeaturedPage />} />
              <Route path="blind-box" element={<BlindBoxPage />} />
              <Route path="t-shirts" element={<TShirtsPage />} />
              <Route path="tshirt/:id" element={<TShirtDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="wishlist" element={<Wishlist />} />
              
              {/* Admin Routes */}
              <Route path="admin/login" element={<AdminLogin />} />
              <Route path="admin/dashboard" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </Suspense>
    </ShopProvider>
  );
}

export default App;
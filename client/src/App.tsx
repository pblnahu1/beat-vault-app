
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import { Home } from './pages/Home';
import { Cart } from './pages/Cart';
import { ProductDetail } from './pages/ProductDetail';
import DashboardLayout from './pages/dashboard/DashboardUsers';
import Profile from './pages/dashboard/Profile';
import OrderHistory from './pages/dashboard/OrderHistory';
import Wishlist from './pages/dashboard/WishList';
import Addresses from './pages/dashboard/Addresses';
import PaymentMethods from './pages/dashboard/PaymentMethods';
import MyReviews from './pages/dashboard/MyReviews';
import DashboardAuth from './pages/auth/DashboardAuth';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/:id" element={<ProductDetail />} />
              <Route path="/dashboard-auth" element={<DashboardAuth />} />
              <Route path="/account/create-account" element={<Register />} />
              <Route path="/account/login" element={<Login />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path='/dashboard/:username' element={<MainLayout />}>
                <Route path='/dashboard/:username' element={<DashboardLayout />} />
                <Route path='profile' element={<Profile />} />
                <Route path='orders' element={<OrderHistory />} />
                <Route path='wish-list' element={<Wishlist />} />
                <Route path='addresses' element={<Addresses />} />
                <Route path='payments' element={<PaymentMethods />} />
                <Route path='reviews' element={<MyReviews />} />
              </Route>
            </Route>
          </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
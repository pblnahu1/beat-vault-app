import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import { Home } from '../pages/home/Home';
import { Cart } from '../pages/cart/Cart';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { ProductDetail } from '../components/ProductDetail';
import DashboardLayout from '../pages/dashboard/DashboardUsers';
import DashboardAuth from '../pages/auth/DashboardAuth/DashboardAuth';
import Login from '../pages/auth/Login/Login';
import Register from '../pages/auth/Register/Register';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/api/auth" element={<DashboardAuth />} />
        <Route path="/api/auth/create-account" element={<Register />} />
        <Route path="/api/auth/login" element={<Login />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path='/dashboard/:username' element={<MainLayout />}>
          <Route path='/dashboard/:username' element={<DashboardLayout />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes

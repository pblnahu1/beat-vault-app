import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../store/useCart';
import { Product } from '../types/prodCart';

export const useProductCard = (product: Product) => {
  const { addItem, items, isLoading, error } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const navigate = useNavigate();

  const isLogged = !!localStorage.getItem('authToken');
  const cartItem = items.find(item => item.id === product.id);
  const quantityInCart = cartItem?.quantity || 0;

  const handleAddToCart = async () => {
    if (!isLogged) {
      alert('Tenés que crearte una cuenta o iniciar sesión para poder comprar.');
      navigate("/api/auth");
      return;
    }
    
    setIsAdding(true);
    try {
      await addItem(product);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setIsAdding(false);
    }
  };

  return {
    isLogged,
    quantityInCart,
    isAdding,
    justAdded,
    isLoading,
    error,
    handleAddToCart
  };
};
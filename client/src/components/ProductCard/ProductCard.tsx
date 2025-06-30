import React, { useState } from 'react';
import { ShoppingCart, Eye, Check, Loader2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../store/useCart';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // estados del store
  const { addItem, items, isLoading, error } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // detecto si el usuario está logueado
  const isLogged = !!localStorage.getItem('authToken');
  const navigate = useNavigate();

  // verifico si el producto ya está en el carrito
  const cartItem = items.find(item => item.id === product.id);
  const quantityInCart = cartItem?.quantity || 0;

  const handleAddToCart = async () => {
    if(!isLogged){
      alert('Tenés que crearte una cuenta o iniciar sesión para poder comprar.');
      navigate("/dashboard-auth");
      return;
    }
    setIsAdding(true);
    try {
      // agrego
      await addItem(product);
      // muestro un feedback visual
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setIsAdding(false);
    }
  };

  // renderizo el botón según el estado
  const renderAddButton = () => {

    if(!isLogged){
      return(
        <button
          disabled
          className='bg-gray-300 text-gray-500 px-4 py-2 rounded-lg flex items-center gap-2 cursor-not-allowed'
        >
          <ShoppingCart size={20}/>
          Iniciá sesión para agregar
        </button>
      );
    }

    if (justAdded) {
      return (
        <button
          disabled
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Check size={20} />
          ¡Agregado!
        </button>
      );
    }

    return (
      <button
        onClick={handleAddToCart}
        disabled={isAdding || isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAdding ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            <ShoppingCart size={20} />
            Agregar
          </>
        )}
      </button>
    );
  };

  return (
    <div className="bg-zinc-900 rounded-lg shadow-md overflow-hidden">
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      ):(
        <p className="text-slate-50">No hay imagen (image_p está vacío)</p>
      )}
      <div className="p-4">
        <h3 className="text-lg text-slate-50 font-semibold">{product.name}</h3>
        <p className="text-slate-50 mt-1">{product.description}</p>
        
        {/* muestro la cantidad en el carrito si y solo si existe */}
        {quantityInCart > 0 && (
          <p className="text-sm text-blue-600 mt-2 font-medium">
            {quantityInCart} in cart
          </p>
        )}
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold">${product.price}</span>
          <div className="flex gap-2">
            <Link
              to={`/product-${product.id}`}
              className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <Eye size={20} />
              Detalles
            </Link>
            {renderAddButton()}
          </div>
        </div>
        
        {/* muestro algún error si existe (igual más adelante según stock mostrar error si no hay más de esos productos) */}
        {error && (
          <div className="mt-2 flex items-center gap-1 text-red-600 text-sm">
            <AlertCircle size={14} />
            <span>Ocurrió un error al agregar al carrito</span>
          </div>
        )}
      </div>
    </div>
  );
};
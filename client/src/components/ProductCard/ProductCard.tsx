import React, { useState } from 'react';
import { ShoppingCart, Eye, Check, Loader2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../../types/prodCart';
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
    if (!isLogged) {
      alert('Tenés que crearte una cuenta o iniciar sesión para poder comprar.');
      navigate("/api/auth");
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

    if (!isLogged) {
      return (
        <button
          
          onClick={handleAddToCart}
          className='bg-gray-300 text-gray-500 px-4 py-2 rounded-lg flex items-center gap-2 cursor-not-allowed'
        >
          <ShoppingCart size={20} />
          Agregar
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
    <div className="bg-zinc-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden border border-stone-700">
      {/* Imagen */}
      <div className="w-full h-64 flex items-center justify-center bg-zinc-800">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <p className="text-slate-400 text-sm">No hay imagen</p>
        )}
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-slate-50 text-center">{product.name}</h3>
        {product.description ?? (
          <p className="text-slate-400 text-sm mb-4 line-clamp-3">
            {product.description}
          </p>
        )}

        {quantityInCart > 0 && (
          <p className="text-sm text-blue-500 font-medium mb-2">
            {quantityInCart} en carrito
          </p>
        )}

        <div className="mt-auto flex flex-col items-center">
          <span className="text-lg md:text-xl font-bold text-green-500 my-3 border border-green-200 rounded-2xl p-1 bg-green-950">
            ${product.price}
          </span>
          <div className="flex md:flex-row flex-col gap-2 w-full items-center">
            <Link
              to={`/product/${product.id}`}
              className="bg-zinc-800 hover:bg-zinc-700 text-slate-50 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Eye size={18} />
              Detalles
            </Link>
            {renderAddButton()}
          </div>
        </div>

        {error && (
          <div className="mt-3 flex items-center gap-1 text-red-500 text-sm">
            <AlertCircle size={14} />
            <span>Ocurrió un error al agregar al carrito</span>
          </div>
        )}
      </div>
    </div>

  );
};
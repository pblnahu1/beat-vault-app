import React from 'react';
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/prodCart';
import { useProductCard } from '../../hooks/useProductCard';
import { ProductImage } from './ProductImage';
import { AddToCartButton } from './AddToCartButton';
import { ErrorMessage } from './ErrorMessage';

// interface ProductCardProps {
//   product: Product;
// }

export const ProductCard: React.FC<{product: Product}> = ({ product }) => {
  const {
    isLogged,
    quantityInCart,
    isAdding,
    justAdded,
    isLoading,
    error,
    handleAddToCart
  } = useProductCard(product);

  return (
    <div className="bg-zinc-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden border border-stone-700">
      <ProductImage image={product.image} name={product.name} />

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-slate-50 text-center">{product.name}</h3>
        
        {product.description && (
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
            
            <AddToCartButton
              isLogged={isLogged}
              isAdding={isAdding}
              justAdded={justAdded}
              isLoading={isLoading}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>

        <ErrorMessage error={error} />
      </div>
    </div>
  );
};
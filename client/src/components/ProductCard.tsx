import React from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../store/useCart';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCart((state) => state.addItem);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600 mt-1">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold">${product.price}</span>
          <div className="flex gap-2">
            <Link
              to={`/product-${product.id}`}
              className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <Eye size={20} />
              Details
            </Link>
            <button
              onClick={() => addItem(product)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <ShoppingCart size={20} />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
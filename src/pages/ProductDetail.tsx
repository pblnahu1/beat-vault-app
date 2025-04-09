import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../store/useCart';

export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));
  const addItem = useCart((state) => state.addItem);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
        <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
        <ArrowLeft className="mr-2" size={20} />
        Back to Products
      </Link>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[400px] object-cover"
            />
          </div>
          <div className="md:w-1/2 p-8">
            <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">
              {product.category}
            </div>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              {product.name}
            </h1>
            <p className="mt-4 text-xl text-gray-900 font-semibold">
              ${product.price}
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              {product.description}
            </p>
            <div className="mt-8">
              <button
                onClick={() => addItem(product)}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
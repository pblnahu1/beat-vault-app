import React from 'react';
import { ProductCard } from '../components/ProductCard';
// import { products } from '../data/products';
import { useProducts } from '../hooks/useProducts';
import {useEffect } from 'react';

export const Home: React.FC = () => {

  const {products, loading, error} = useProducts();

  useEffect(()=>{
    console.log("products en home:", products);
  },[products]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <h1 className="text-3xl font-bold mb-8">Featured Products</h1>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="text-gray-500 text-center py-12">No se encontraron productos disponibles.</p>
      )}


      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product,index) => (
            // console.log("renderizando producto con ID:", product.id_p);
            <ProductCard key={`${product.id_p}-${index}`} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
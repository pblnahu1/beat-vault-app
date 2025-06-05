/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Plus, Minus, Heart, Share2, Star } from 'lucide-react';
import { products } from '../data/products';
import CartService from '../services/cartService';
import AuthService from '../services/authService';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const product = products.find((p) => p.id === Number(id));

  useEffect(() => {
    if (!product) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [product, navigate]);

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (!AuthService.isAuthenticated()) {
      const shouldLogin = window.confirm(
        'You need to be logged in to add items to your cart. Would you like to login?'
      );
      if (shouldLogin) {
        navigate('/login', { state: { from: `/product/${product.id}` } });
      }
      return;
    }

    setIsLoading(true);
    
    try {

      const currentUser= AuthService.getCurrentUser();
      if(!currentUser) {
        throw new Error('No user found');
      }

      const result = await CartService.addToCart(product.id, quantity, currentUser.id_u);
      
      if (result.success) {
        setIsAddedToCart(true);
        
        setTimeout(() => setIsAddedToCart(false), 2000);
        
        
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform';
        toast.innerHTML = `
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            Added to cart successfully!
          </div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
          toast.style.transform = 'translateX(100%)';
          setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
        
      } else {
        alert(result.message || 'Error adding to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('An error occurred while adding to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        
        navigator.clipboard.writeText(window.location.href);
        alert('Product link copied to clipboard!');
      }
    } else {
      
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="animate-pulse">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6"></div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Product not found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <div className="space-y-4">
            <Link 
              to="/" 
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="mr-2" size={20} />
              Return to Home
            </Link>
            <p className="text-sm text-gray-500">Redirecting automatically in a few seconds...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span>/</span>
        <span className="capitalize">{product.category}</span>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      {/* Back Button */}
      <Link 
        to="/" 
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 group transition-colors"
      >
        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
        Back to Products
      </Link>

      {/* Product Details */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="lg:flex">
          {/* Image Section */}
          <div className="lg:w-1/2 relative">
            <div className="aspect-square lg:aspect-auto lg:h-[600px] bg-gray-100">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              )}
              <img
                src={product.image}
                alt={product.name}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
            
            {/* Action Buttons Overlay */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button
                onClick={handleShare}
                className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors group"
                title="Share product"
              >
                <Share2 size={20} className="text-gray-700 group-hover:text-blue-600 transition-colors" />
              </button>
              <button
                className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors group"
                title="Add to wishlist"
              >
                <Heart size={20} className="text-gray-700 group-hover:text-red-500 transition-colors" />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 p-8 lg:p-12">
            <div className="max-w-lg">
              {/* Category Badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
                {product.category}
              </div>

              {/* Product Name */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {product.name}
              </h1>

              {/* Rating (placeholder) */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={20} 
                      className={`${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">(4.0) • 128 reviews</span>
              </div>

              {/* Price */}
              <div className="mb-8">
                <p className="text-4xl font-bold text-gray-900 mb-2">
                  ${product.price.toLocaleString()}
                </p>
                <p className="text-green-600 font-medium">Free shipping on orders over $50</p>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-2 hover:bg-gray-50 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    Total: ${(product.price * quantity).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className={`
                    w-full px-8 py-4 rounded-xl font-semibold text-lg
                    flex items-center justify-center gap-3
                    transition-all duration-200 transform
                    ${isAddedToCart 
                      ? 'bg-green-500 text-white scale-105' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
                    }
                    ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg'}
                    disabled:transform-none disabled:hover:scale-100
                  `}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Adding to Cart...
                    </>
                  ) : isAddedToCart ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      Add to Cart
                    </>
                  )}
                </button>

                {/* Additional Info */}
                <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                  <span>✓ 30-day returns</span>
                  <span>✓ 2-year warranty</span>
                  <span>✓ Secure payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { CartItem } from '../../components/CartItem';
import { useCart } from '../../store/useCart';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { CartEmpty } from './CartEmpty';
import handleBuyClick from "./handleBuyClick";
import { useLoader } from '../../hooks/useLoader';
import { Loader } from '../../components/UI/Loader';

export const Cart: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const { loading } = useLoader();

  // handlers
  const handleClearCart = () => {
    clearCart();
  }

  const handlePurchase = () => {
    handleBuyClick({ clearCart });
  }

  // valores computados
  const hasItems = items.length > 0;
  const formattedTotal = total.toFixed(2);

  // early returns
  if (loading) return <Loader message='Verificando carrito...' />;
  if (!hasItems) return <CartEmpty items={items} loading={loading} />;

  // render functions
  function renderCartHeader() {
    return (
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart size={32} className="text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-50 uppercase">Tu Carrito</h2>
      </div>
    )
  }

  function renderCartItems() {
    return items.map((item) => (
      <CartItem key={item.id} item={item} />
    ))
  }

  function renderCartTotal() {
    return (
      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-semibold text-slate-50">Total:</span>
        <span className="text-2xl font-bold text-green-600">${formattedTotal}</span>
      </div>
    )
  }

  function renderCartActions() {
    return (
      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={handleClearCart}
          className="flex items-center justify-center gap-2 px-6 py-3 text-red-950 bg-red-600 hover:bg-red-700 rounded-lg transition"
          aria-label='Limpiar carrito'
        >
          <Trash2 size={20} />
        </button>
        <button
          onClick={handlePurchase}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Seguir con tu compra <ArrowRight size={20} />
        </button>
      </div>
    )
  }

  function renderCartFooter() {
    return (
      <div className="mt-4 border-t border-stone-700 pt-6">
        {renderCartTotal()}
        {renderCartActions()}
      </div>
    )
  }

  // main tsx
  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="w-full max-w-4xl bg-zinc-950/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-10 border border-stone-700">
        {renderCartHeader()}
        {renderCartItems()}
        {renderCartFooter()}
      </div>
    </div>
  );
};

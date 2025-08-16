import React from 'react';
import { CartItem } from '../../components/CartItem';
import { useCart } from '../../store/useCart';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { CartEmpty } from './CartEmpty';
import handleBuyClick from "./handleBuyClick";
import { useLoader } from '../../hooks/useLoader';

export const Cart: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const { loading } = useLoader();

  // 1) Si está cargando mostramos un loader global o un placeholder
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* Aquí podrías usar tu componente Loader global */}
        <div>Cargando...</div>
      </div>
    );
  }

  // 2) Si no hay items mostramos CartEmpty
  if (items.length === 0) {
    return <CartEmpty items={items} loading={loading} />;
  }

  // 3) Si hay items, mostramos la UI del carrito
  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="w-full max-w-4xl bg-zinc-950/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-10 border border-stone-700">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart size={32} className="text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-50 uppercase">Tu Carrito</h2>
        </div>

        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}

        <div className="mt-4 border-t border-stone-700 pt-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-semibold text-slate-50">Total:</span>
            <span className="text-2xl font-bold text-green-600">${total.toFixed(2)}</span>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={clearCart}
              className="flex items-center justify-center gap-2 px-6 py-3 text-red-950 bg-red-600 hover:bg-red-700 rounded-lg transition"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={() => handleBuyClick({ clearCart })}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Seguir con tu compra <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

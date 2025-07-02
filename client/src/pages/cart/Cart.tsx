import React from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../../components/CartItem';
import { useCart } from '../../store/useCart';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';

export const Cart: React.FC = () => {
  const { items, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center text-center">
        <ShoppingCart size={48} className='text-blue-600 mb-4' />
        <h2 className="text-2xl font-semibold mb-4 text-slate-200">Tu carrito está vacío... ¡Agregá ahora tus productos preferidos!</h2>
        <Link
          to="/"
          className="p-4 rounded-lg bg-blue-950 text-blue-200 hover:text-blue-300 font-medium underline"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="w-full max-w-4xl bg-slate-950/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-10">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart size={32} className="text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-50 uppercase">Tu Carrito</h2>
        </div>
        {/* <div className="divide-y divide-zinc-900"> */}
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        {/* </div> */}
        <div className="mt-8 border-t pt-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-semibold text-slate-50">Total:</span>
            <span className="text-2xl font-bold text-blue-700">${total.toFixed(2)}</span>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={clearCart}
              className="flex items-center justify-center gap-2 px-6 py-3 text-red-950 bg-red-600 hover:bg-red-700 rounded-lg transition"
            >
              <Trash2 size={20} />
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
              Seguir con tu compra <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
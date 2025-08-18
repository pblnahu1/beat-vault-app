import { FC } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItemProps } from '../../types/prodCart';
import { useCart } from '../../store/useCart';

export const CartItemControls: FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 py-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(item.id_cart, item.id, Math.max(0, item.quantity - 1))} // item.id es number
            className="p-1 bg-gray-100 hover:bg-gray-300 rounded text-black"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center text-slate-50">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id_cart, item.id, item.quantity + 1)}
            className="p-1 bg-gray-100 hover:bg-gray-300 rounded text-black"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={() => removeItem(item.id)}
            className="p-1 text-red-500 hover:bg-red-50 rounded ml-4"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { useCart } from '../../store/useCart';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 py-4 border-b">
      <img
        src={item.image}
        alt={item.name}
        className="w-24 h-24 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-gray-600">${item.price}</p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(item.id_cart, item.id, Math.max(0, item.quantity - 1))} // item.id es number
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id_cart, item.id, item.quantity + 1)}
            className="p-1 hover:bg-gray-100 rounded"
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
      <div className="text-right">
        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
      </div>
    </div>
  );
};
import { FC } from 'react';
import { OrderDetailsProps } from '../../types/orders';

export const OrderDetails: FC<OrderDetailsProps> = ({ items }) => (
  <div className="mt-4 pt-4 border-t border-gray-700">
    <h4 className="text-white font-medium mb-2">Productos:</h4>
    {items.map((item, index) => (
      <div key={index} className="flex justify-between text-sm mb-1">
        <span className="text-gray-300">
          {item.name} (x{item.quantity})
        </span>
        <span className="text-green-400">${item.price}</span>
      </div>
    ))}
  </div>
);
import { FC } from 'react';
import { Calendar, Eye } from 'lucide-react';
import type { OrderItemProps } from '../../types/orders';
import { getStatusColor } from './utils';
import { OrderDetails } from './OrderDetails';

export const OrderItem: FC<OrderItemProps> = ({ order, isExpanded, onToggleExpanded }) => (
  <div className="bg-gray-800 rounded-2xl p-4">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-3">
        <Calendar size={20} className="text-gray-400" />
        <div>
          <h3 className="text-white font-medium">Pedido #{order.id_purchase_history}</h3>
          <p className="text-gray-400">{order.date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-green-400 font-bold">${order.total_amount}</p>
        <p className={`text-sm ${getStatusColor(order.status)}`}>{order.status}</p>
      </div>
    </div>

    <button
      onClick={onToggleExpanded}
      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
      aria-label={isExpanded ? 'Ocultar detalles del pedido' : 'Ver detalles del pedido'}
    >
      <Eye size={16} />
      {isExpanded ? 'Ocultar' : 'Ver detalles'}
    </button>

    {isExpanded && <OrderDetails items={order.items} />}
  </div>
);
import { Calendar, Eye, ShoppingBag } from "lucide-react";
import { useState } from "react";
import type { Order } from "../../types/orders.ts";
import { useOrderHistory } from "../../hooks/useOrderHistory";

export const OrderHistoryComponent = () => {
  const { orders, loading, error } = useOrderHistory();
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Entregado': return 'text-green-400';
      case 'En camino': return 'text-blue-400';
      case 'Procesando': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const toggleExpanded = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <p className="text-gray-400">Cargando historial...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-4">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.length === 0 ? ( 
        <div className="text-center py-12">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-600 mb-4" />
          <p className="text-gray-400">No tienes compras anteriores</p>
        </div>
      ): (
        orders.map((order: Order) => (
          <div key={order.id_purchase_history} className="bg-gray-800 rounded-2xl p-4">
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
              onClick={() => toggleExpanded(order.id_purchase_history)}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
            >
              <Eye size={16} />
              {expandedOrder === order.id_purchase_history ? 'Ocultar' : 'Ver detalles'}
            </button>

            {expandedOrder === order.id_purchase_history && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <h4 className="text-white font-medium mb-2">Productos:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">
                      {item.name} (x{item.quantity})
                    </span>
                    <span className="text-green-400">${item.price}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};
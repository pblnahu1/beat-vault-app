import { Calendar, Eye, ShoppingBag } from "lucide-react";
import { useState } from "react"

export const OrderHistoryComponent = () => {

  const [orders, setOrders] = useState([
    // inicializo con datos ficticios
    {
      id: 1,
      date: "2024-01-20",
      total: 89.99,
      status: "Entregado",
      items: [
        { name: "Producto A", quantity: 2, price: 29.99 },
        { name: "Producto B", quantity: 1, price: 30.01 }
      ]
    },
    {
      id: 2,
      date: "2024-01-15",
      total: 45.50,
      status: "En camino",
      items: [
        { name: "Producto C", quantity: 1, price: 45.50 }
      ]
    }
  ])

  const [expandedOrder, setExpandedOrder] = useState(null); // se declara en null ya que no sabemos si el usuairo expandirá el orden del pedido (revisar)

  const getStatusColor = (status) => {
    switch (status) {
      case 'Entregado': return 'text-green-400';
      case 'En camino': return 'text-blue-400';
      case 'Procesando': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const toggleExpanded = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  }

  return (
    <div className="space-y-4">
      {orders.length === 0 ? ( 
        <div className="text-center py-12">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-600 mb-4" />
          <p className="text-gray-400">No tienes compras anteriores</p>
        </div>
      ): (
        orders.map(order => (
          <div key={order.id} className="bg-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-gray-400" />
                <div>
                  <h3 className="text-white font-medium">Pedido #{order.id}</h3>
                  <p className="text-gray-400">{order.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-bold">${order.total}</p>
                <p className={`text-sm ${getStatusColor(order.status)}`}>{order.status}</p>
              </div>
            </div>

            <button
              onClick={()=>toggleExpanded(order.id)}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
            >
              <Eye size={16} />
              {expandedOrder === order.id ? 'Ocultar' : 'Ver detalles'}
            </button>

            {expandedOrder === order.id && (
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
  )
}

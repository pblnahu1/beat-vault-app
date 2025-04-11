
const mockOrders = [
  {
    id: "123456",
    date: "2025-04-01",
    total: 199.99,
    status: "Entregado",
    items: [
      { name: "Zapatillas Urbanas", quantity: 1 },
      { name: "Remera Oversize", quantity: 2 },
    ],
  },
  {
    id: "789012",
    date: "2025-03-20",
    total: 89.5,
    status: "En camino",
    items: [{ name: "Buzo canguro", quantity: 1 }],
  },
];

export default function OrderHistory() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Historial de Compras</h1>

      {mockOrders.length === 0 ? (
        <p className="text-gray-500">Todavía no realizaste ninguna compra.</p>
      ) : (
        <div className="space-y-6">
          {mockOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow rounded-lg p-6 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-lg font-medium">Pedido #{order.id}</p>
                  <p className="text-sm text-gray-500">Fecha: {order.date}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "Entregado"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <ul className="list-disc list-inside text-gray-700 mb-2">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.quantity}x {item.name}
                  </li>
                ))}
              </ul>

              <p className="text-right text-lg font-semibold text-gray-800">
                Total: ${order.total.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


const mockPaymentMethods = [
  {
    id: 1,
    brand: "Visa",
    last4: "1234",
    name: "Juan Pérez",
    expiry: "08/26",
    isDefault: true,
  },
  {
    id: 2,
    brand: "Mastercard",
    last4: "5678",
    name: "Juan Pérez",
    expiry: "11/25",
    isDefault: false,
  },
];

export default function PaymentMethods() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Métodos de Pago</h1>

      {mockPaymentMethods.length === 0 ? (
        <p className="text-gray-500">No tenés métodos de pago guardados.</p>
      ) : (
        <div className="space-y-6">
          {mockPaymentMethods.map((card) => (
            <div
              key={card.id}
              className={`bg-white border rounded-lg shadow p-5 ${
                card.isDefault ? "border-blue-500" : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">{card.brand}</p>
                  <p className="text-gray-600">**** **** **** {card.last4}</p>
                  <p className="text-gray-600">Titular: {card.name}</p>
                  <p className="text-gray-600">Vencimiento: {card.expiry}</p>
                  {card.isDefault && (
                    <span className="text-sm text-blue-600 font-medium mt-2 inline-block">
                      Predeterminado
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {!card.isDefault && (
                    <button className="text-sm text-blue-500 hover:underline">
                      Usar como predeterminado
                    </button>
                  )}
                  <button className="text-sm text-red-500 hover:underline">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          Agregar método de pago
        </button>
      </div>
    </div>
  );
}

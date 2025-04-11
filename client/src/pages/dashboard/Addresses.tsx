
const mockAddresses = [
  {
    id: 1,
    name: "Casa",
    fullName: "Juan Pérez",
    addressLine: "Calle Falsa 123",
    city: "Buenos Aires",
    province: "CABA",
    zip: "1000",
    phone: "+54 9 11 1234-5678",
  },
  {
    id: 2,
    name: "Oficina",
    fullName: "Juan Pérez",
    addressLine: "Av. Siempreviva 456",
    city: "La Plata",
    province: "Buenos Aires",
    zip: "1900",
    phone: "+54 9 11 8765-4321",
  },
];

export default function Addresses() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Direcciones Guardadas</h1>

      {mockAddresses.length === 0 ? (
        <p className="text-gray-500">No tenés direcciones guardadas.</p>
      ) : (
        <div className="space-y-6">
          {mockAddresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white border rounded-lg shadow p-5 relative"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-lg font-semibold">{addr.name}</p>
                  <p className="text-gray-700">{addr.fullName}</p>
                  <p className="text-gray-600">{addr.addressLine}</p>
                  <p className="text-gray-600">
                    {addr.city}, {addr.province} - CP {addr.zip}
                  </p>
                  <p className="text-gray-600">{addr.phone}</p>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <button className="text-blue-500 text-sm hover:underline">
                    Editar
                  </button>
                  <button className="text-red-500 text-sm hover:underline">
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
          Agregar nueva dirección
        </button>
      </div>
    </div>
  );
}

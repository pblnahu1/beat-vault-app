
const mockWishlist = [
  {
    id: "prod-1",
    name: "Zapatillas Nike Air Max",
    price: 149.99,
    image: "https://via.placeholder.com/120x120", // Reemplazalo por tu imagen real
  },
  {
    id: "prod-2",
    name: "Buzo Oversize Unisex",
    price: 59.5,
    image: "https://via.placeholder.com/120x120",
  },
];

export default function Wishlist() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Lista de Deseos</h1>

      {mockWishlist.length === 0 ? (
        <p className="text-gray-500">No tenés productos en tu lista de deseos.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockWishlist.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-md border rounded-lg p-4 flex flex-col"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover rounded mb-4"
              />
              <h2 className="text-lg font-medium text-gray-800">{product.name}</h2>
              <p className="text-gray-600 text-sm mt-1">${product.price.toFixed(2)}</p>

              <div className="mt-auto pt-4 flex justify-between items-center">
                <button className="text-sm text-red-500 hover:underline">
                  Quitar
                </button>
                <button className="bg-black text-white text-sm px-3 py-1 rounded hover:bg-gray-800">
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

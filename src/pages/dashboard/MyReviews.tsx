
const mockReviews = [
  {
    id: 1,
    productName: "Zapatillas Adidas Run Falcon",
    productImage: "https://via.placeholder.com/100",
    rating: 4,
    comment: "Muy cómodas y buena relación precio/calidad.",
    date: "2025-03-22",
  },
  {
    id: 2,
    productName: "Remera Básica Blanca",
    productImage: "https://via.placeholder.com/100",
    rating: 5,
    comment: "Excelente tela, muy suave.",
    date: "2025-02-14",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
        </svg>
      ))}
    </div>
  );
}

export default function MyReviews() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Mis Reseñas</h1>

      {mockReviews.length === 0 ? (
        <p className="text-gray-500">No realizaste ninguna reseña todavía.</p>
      ) : (
        <div className="space-y-6">
          {mockReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white shadow border rounded-lg p-5 flex gap-5"
            >
              <img
                src={review.productImage}
                alt={review.productName}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-lg font-semibold">{review.productName}</h2>
                  <StarRating rating={review.rating} />
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                </div>
                <p className="text-sm text-gray-400 mt-3">
                  Fecha: {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

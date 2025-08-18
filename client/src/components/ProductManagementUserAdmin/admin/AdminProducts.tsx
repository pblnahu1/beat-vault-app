/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useMemo } from "react";
import { Product } from "../../../types/prodCart";
import { ROLES } from "../../../components/DashboardUsers/navItemsDashboard";
import { useManagementUsers } from "../../../hooks/useManagementUsers";
import { useProducts } from "../../../hooks/useProducts";

export function AdminProducts() {
  const currentUser = useManagementUsers();

  const { products, addProduct, removeProduct } = useProducts();

  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  if (currentUser?.role_id !== ROLES.ADMIN) {
    return (
      <p className="text-red-500 text-center mt-6">
        No tenés permisos para ver esta página
      </p>
    );
  }

  const handleCreate = async () => {
    try {
      if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.category) {
        alert("Todos los campos son obligatorios");
        return;
      }

      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("price", newProduct.price.toString());
      formData.append("category", newProduct.category);
      if (selectedFile) formData.append("image", selectedFile);

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/products/create`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error creando producto");

      await addProduct({
        ...newProduct,
        image: data.imageUrl,
      });

      setNewProduct({ name: "", description: "", price: 0, image: "", category: "" });
      setSelectedFile(null);

    } catch (error) {
      console.error("Error creando producto:", error);
    }
  };



  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("¿Estás seguro de eliminar este producto?");
    if (!confirmed) return;

    await removeProduct(id);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  }, [products]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-white text-center sm:text-left">
        Administrar Productos
      </h1>

      <div className="bg-gray-800 p-6 rounded-xl shadow-md max-w-full mx-auto sm:mx-0 border border-stone-500">
        <h2 className="text-xl font-semibold text-indigo-400 mb-4">Crear Producto</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nombre"
            className="p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Precio"
            className="p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
          />
          <input
            type="text"
            placeholder="Categoría"
            className="p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none sm:col-span-2"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          />
          <textarea
            placeholder="Descripción"
            className="p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none sm:col-span-2"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />

          <input
            type="file"
            accept="image/*"
            className="sm:col-span-2 text-white"
            onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
          />

          <button
            className="bg-indigo-600 hover:bg-indigo-500 transition-colors text-white font-semibold px-4 py-3 rounded-lg sm:col-span-2"
            onClick={handleCreate}
          >
            Crear Producto
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="flex-1 p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-300 col-span-full">No se encontraron productos.</p>
        )}
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="bg-gray-700 rounded-xl p-4 flex flex-col justify-between shadow hover:shadow-lg transition-shadow"
          >
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">{p.name}</h3>
              {p.image && <img src={p.image} alt={p.name} className="rounded w-full h-48 object-cover" />}
              <p className="text-sm text-gray-300">${p.price}</p>
              {p.category && <p className="text-sm text-indigo-300">Categoría: {p.category}</p>}
            </div>
            <button
              className="mt-4 bg-red-500 hover:bg-red-400 text-white font-semibold py-2 px-4 rounded transition-colors"
              onClick={() => handleDelete(p.id)}
            >
              Borrar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

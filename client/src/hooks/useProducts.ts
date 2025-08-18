// src/hooks/useProducts.ts
import { useState, useEffect } from "react";
import { Product } from "../types/prodCart";
import { 
  getProducts, 
  getProductById, 
  getProductsByCategory,
  createProducto,
  updateProduct,
  deleteProduct
} from "../services/productService";
import { useLoader } from "./useLoader";
import { UseProductsReturn } from "../types/prodCart";

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { setLoading } = useLoader();

  /** Cargar todos los productos */
  const fetchProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los productos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /** Cargar un producto por ID */
  const fetchProductById = async (id: number): Promise<Product | null> => {
    try {
      setLoading(true);
      setError(null);
      return await getProductById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Error al cargar el producto con ID ${id}`);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /** Filtrar por categoría */
  const fetchProductsByCategory = async (category: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProductsByCategory(category);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Error al cargar productos de la categoría ${category}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /** Crear un nuevo producto */
  const addProduct = async (product: Omit<Product, "id">): Promise<void> => {
    try {
      setLoading(true);
    //   setError(null);
      const created = await createProducto(product);
      setProducts((prev) => [created, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creando producto");
    //   console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /** Actualizar un producto existente */
  const editProduct = async (id: number, product: Partial<Product>): Promise<void> => {
    try {
      setLoading(true);
    //   setError(null);
      const updated = await updateProduct(id, product);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error actualizando producto");
    //   console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /** Eliminar un producto */
  const removeProduct = async (id: number): Promise<void> => {
    try {
      setLoading(true);
    //   setError(null);
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error eliminando producto");
    //   console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    error,
    fetchProducts,
    fetchProductById,
    fetchProductsByCategory,
    addProduct,
    editProduct,
    removeProduct,
  };
};

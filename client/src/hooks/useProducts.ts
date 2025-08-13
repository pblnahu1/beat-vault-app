import {useState, useEffect} from "react";
import { Product } from "../types/prodCart";
import { getProducts, getProductById, getProductsByCategory } from "../services/productService";
import { useLoader } from "./useLoader";

interface UseProductsReturn {
    products: Product[];
    error: string | null;
    fetchProducts: () => Promise<void>;
    fetchProductById: (id: number) => Promise<Product | null>;
    fetchProductsByCategory: (category: string) => Promise<void>;
}

export const useProducts = (): UseProductsReturn => {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    const {setLoading} = useLoader();

    const fetchProducts = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const data = await getProducts();
            console.log("Productos recibidos: ", data);
            setProducts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar los productos');
            console.error('Error fetching products: ', err);
        } finally {
            setLoading(false);
        }
    }

    const fetchProductById = async (id: number): Promise<Product | null> => {
        try {
            setLoading(true);
            setError(null);
            const product = await getProductById(id);
            return product;
        } catch (err) {
            setError(err instanceof Error ? err.message : `Error al cargar el producto con ID ${id}`);
            console.error(`Error fetching product with ID ${id}: `, err);
            return null;
        } finally {
            setLoading(false);
        }
    }

    const fetchProductsByCategory = async (category: string): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const data = await getProductsByCategory(category);
            setProducts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : `Error al cargar productos de la categoría ${category}`);
            console.error(`Error fetching products from category ${category}:`, err);
        } finally {
            setLoading(false);
        }
    }

    // cargo productos al montar el componente
    useEffect(() => {
        fetchProducts();
    },[]);

    return {
        products,
        error,
        fetchProducts,
        fetchProductById,
        fetchProductsByCategory
    };
};
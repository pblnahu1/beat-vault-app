// interfaces para los productos
import { Product, ErrorResponseProduct } from "../types/prodCart"; // CartItem también


const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

if(!BASE_URL) {
    throw new Error("BACKEND_URL no está definido en el .env");
}

/**
 * Función asíncrona para traer todos los datos
 * @return Promise<Product[]>
 */

export const getProducts = async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${BASE_URL}/products`);
      
      if (!response.ok) {
        const errorData: ErrorResponseProduct = await response.json();
        throw new Error(errorData.message || 'Error al obtener productos');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  };

/**
 * Función asíncrona para obtener un producto por su id
 * @param id ID del producto
 * @return Promise<Product>
 * 
 */

export const getProductById = async (id:number): Promise<Product> => {
    try {
        const response = await fetch(`${BASE_URL}/products/${id}`);
        if(!response.ok){
            const errData: ErrorResponseProduct = await response.json();
            throw new Error(errData.message || `Error al obtener el producto con ID ${id}`);
        }
        return response.json() as Promise<Product>;
    } catch (error) {
        console.error(`Èrror al obtener el producto con ID ${id}:`, error);
        throw error;
    }
}

/**
 * Función asíncrona para crear un nuevo producto
 * (super admin)
 * @param product Datos del producto a crear
 * @return Promise<Product>
 */

export const createProducto = async (product: Omit<Product, "id">): Promise<Product> => {
    try {
        const response = await fetch(`${BASE_URL}/product`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify(product),
        });

        if(!response.ok){
            const errData: ErrorResponseProduct = await response.json();
            throw new Error(errData.message || "Error al crear el producto");
        }

        return response.json() as Promise<Product>;
    } catch (error) {
        console.error("Error al crear el producto:",error);
        throw error;
    }
} 

/**
 * Función asíncrona para actualizar un producto existente
 * (super admin)
 * @param id ID del producto a actualizar
 * @param product Datos actualizados del producto
 * @return Promise<Product>
 */

export const updateProduct = async(id: number, product: Partial<Product>): Promise<Product> => {
    try {
        const response = await fetch(`${BASE_URL}/product/${id}`, {
            method: "PUT",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify(product),
        });

        if(!response.ok){
            const errData: ErrorResponseProduct = await response.json();
            throw new Error(errData.message || `Error al actualizar el producto con ID ${id}`);
        }

        return response.json() as Promise<Product>;
    } catch (error) {
        console.error(`Error al acctualizar el producto con ID ${id}:`,error);
        throw error;
    }
}

/**
 * Función asíncrona para eliminar un producto
 * (super admin)
 * @param id ID del producto a eliminar
 * @return Promise<void>
 */

export const deleteProduct = async (id:number): Promise<void> => {
    try {
        const response = await fetch(`${BASE_URL}/product/${id}`,{
            method: "DELETE",
        });

        if(!response.ok){
            const errData: ErrorResponseProduct = await response.json();
            throw new Error(errData.message || `Error al eliminar el producto con ID ${id}`);
        }
    } catch (error) {
        console.error(`Error al eliminar el producto con ID ${id}:`,error);
        throw error;
    }
}

/**
 * Función asíncrona para filtrar productos por categoría
 * @param category Categoría para la que filtrar
 * @return Promise<Product[]>
 */

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
    try {
        const response = await fetch(`${BASE_URL}/products/category/${category}`);

        if(!response.ok) {
            const errData: ErrorResponseProduct = await response.json();
            throw new Error(errData.message || `Error al obtener productos de la categoría ${category}`);
        }

        return response.json() as Promise<Product[]>;
    } catch (error) {
        console.error(`Error al obtener productos de la categoría ${category}:`, error);
        throw error;
    }
}

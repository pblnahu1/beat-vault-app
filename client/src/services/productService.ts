// src/services/productService.ts
import { apiClient } from "../api/apiClient";
import { Product } from "../types/prodCart";

export const getProducts = async (): Promise<Product[]> => {
  return apiClient<Product[]>("/products");
};

export const getProductById = async (id: number): Promise<Product> => {
  return apiClient<Product>(`/products/${id}`);
};

export const createProducto = async (product: Omit<Product, "id">): Promise<Product> => {
  return apiClient<Product>("/product", {
    method: "POST",
    body: product,
  });
};

export const updateProduct = async (
  id: number,
  product: Partial<Product>
): Promise<Product> => {
  return apiClient<Product>(`/product/${id}`, {
    method: "PUT",
    body: product,
  });
};

export const deleteProduct = async (id: number): Promise<void> => {
  return apiClient<void>(`/product/${id}`, {
    method: "DELETE",
  });
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  return apiClient<Product[]>(`/products/category/${category}`);
};

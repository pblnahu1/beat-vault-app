// src/services/productService.ts
import { apiClient } from "../core/apiClient";
import { Product } from "../types/prodCart";
import authService from "./authService";

const getAuthToken = () => authService.getToken() || "";

export const getProducts = async (): Promise<Product[]> => {
  return apiClient<Product[]>("/products");
};

export const getProductById = async (id: number): Promise<Product> => {
  return apiClient<Product>(`/products/${id}`);
};

export const createProducto = async (product: Omit<Product, "id">): Promise<Product> => {
  return apiClient<Product>("/admin/products/create", {
    method: "POST",
    body: product,
    token: getAuthToken(),
  });
};

export const updateProduct = async (
  id: number,
  product: Partial<Product>
): Promise<Product> => {
  return apiClient<Product>(`/admin/products/update/${id}`, {
    method: "PUT",
    body: product,
    token: getAuthToken(),
  });
};

export const deleteProduct = async (id: number): Promise<void> => {
  return apiClient<void>(`/admin/products/delete/${id}`, {
    method: "DELETE",
    token: getAuthToken(),
  });
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  return apiClient<Product[]>(`/products/category/${category}`);
};

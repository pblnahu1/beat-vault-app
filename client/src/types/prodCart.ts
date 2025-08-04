/* eslint-disable @typescript-eslint/no-explicit-any */

// niveles de profundidad

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
  id_cart: number;
}

export interface CartResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export interface ErrorResponseProduct {
  message: string;
}

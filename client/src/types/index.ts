/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Product {
  id_p: number;
  name_p: string;
  description_p: string;
  price_p: number;
  image_p: string;
  category_p: string;
}

export interface User {
  id_u: number;
  email: string;
  name?: string;
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

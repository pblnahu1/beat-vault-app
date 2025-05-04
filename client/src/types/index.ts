export interface Product {
  id_p: number;
  name_p: string;
  description_p: string;
  price_p: number;
  image_p: string;
  category_p: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ErrorResponseProduct {
  message: string;
}
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
export interface UseProductsReturn {
  products: Product[];
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: number) => Promise<Product | null>;
  fetchProductsByCategory: (category: string) => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  editProduct: (id: number, product: Partial<Product>) => Promise<void>;
  removeProduct: (id: number) => Promise<void>;
}
export interface AddToCartButtonProps {
  isLogged: boolean;
  isAdding: boolean;
  justAdded: boolean;
  isLoading: boolean;
  onAddToCart: () => void;
}
export interface ProductImageProps {
  image: string | null;
  name: string;
}
export interface ErrorResponseProduct {
  message: string;
}
export interface ErrorMessageProps {
  error: string | null;
}


export interface CartItem extends Product {
  quantity: number;
  id_cart: number;
}
export interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  total: number;
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  updateQuantity: (cartId: number, productCartId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncWithBackend: () => Promise<void>;
  loadCart: () => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  resetCartLocal: () => void;
}
export interface CartResponse {
  success: boolean;
  data?: any;
  message?: string;
}
export interface CartItemProps {
  item: CartItem;
}
export interface CartItemImageProps { 
  src: string; 
  alt: string; 
}
export interface CartItemInfoProps { 
  name: string; 
}
export interface CartEmptyProps {
  items: Product[]; // reemplazar unknown[] por Product[] si existe ese tipo
  loading: boolean;
}
export interface HandleBuyClickProps {
  clearCart: () => void;
}
export interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

export interface OrderDetailsProps {
  items: OrderItem[];
}

export interface Order {
    items: OrderItem[];
    id_purchase_history: number;
    date: string;
    total_amount: number;
    status: string;
    item: OrderItem[];
}

export interface OrderItemProps {
  order: Order;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export interface ErrorDisplayProps {
    error: string;
}
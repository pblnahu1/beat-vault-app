export interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id_purchase_history: number;
    date: string;
    total_amount: number;
    status: string;
    items: OrderItem[];
}
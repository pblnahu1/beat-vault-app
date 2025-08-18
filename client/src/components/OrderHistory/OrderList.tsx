import { FC } from 'react';
import type { Order } from '../../types/orders';
import { OrderItem } from './OrderItem';

interface OrderListProps {
  orders: Order[];
  expandedOrder: number | null;
  onToggleExpanded: (orderId: number) => void;
}

export const OrderList: FC<OrderListProps> = ({ orders, expandedOrder, onToggleExpanded }) => (
  <div className="space-y-4">
    {orders.map((order) => (
      <OrderItem
        key={order.id_purchase_history}
        order={order}
        isExpanded={expandedOrder === order.id_purchase_history}
        onToggleExpanded={() => onToggleExpanded(order.id_purchase_history)}
      />
    ))}
  </div>
);
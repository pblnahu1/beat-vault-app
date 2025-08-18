import { useState } from 'react';
import { useOrderHistory } from './useOrderHistory.ts';

export const useOrderHistoryLogic = () => {
  const { orders, loading, error } = useOrderHistory();
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const toggleExpanded = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return {
    orders,
    loading,
    error,
    expandedOrder,
    toggleExpanded,
    hasOrders: orders.length > 0
  };
};
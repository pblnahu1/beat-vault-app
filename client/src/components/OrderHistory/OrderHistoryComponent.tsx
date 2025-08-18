import { FC } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorDisplay } from './ErrorDisplay';
import { EmptyState } from './EmptyState';
import { OrderList } from './OrderList';
import { useOrderHistoryLogic } from '../../hooks/useOrderHistoryLogic';

export const OrderHistoryComponent: FC = () => {
  const {
    orders,
    loading,
    error,
    expandedOrder,
    toggleExpanded,
    hasOrders
  } = useOrderHistoryLogic();

  if (loading) {
    <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (!hasOrders) {
    return <EmptyState />;
  }

  return (
    <OrderList
      orders={orders}
      expandedOrder={expandedOrder}
      onToggleExpanded={toggleExpanded}
    />
  );
};
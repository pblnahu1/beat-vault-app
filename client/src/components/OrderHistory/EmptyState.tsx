import { FC } from 'react';
import { ShoppingBag } from 'lucide-react';

export const EmptyState: FC = () => (
  <div className="text-center py-12">
    <ShoppingBag className="mx-auto h-16 w-16 text-gray-600 mb-4" />
    <p className="text-gray-400">No tienes compras anteriores</p>
  </div>
);
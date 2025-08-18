export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Entregado': return 'text-green-400';
    case 'En camino': return 'text-blue-400';
    case 'Procesando': return 'text-yellow-400';
    default: return 'text-gray-400';
  }
};

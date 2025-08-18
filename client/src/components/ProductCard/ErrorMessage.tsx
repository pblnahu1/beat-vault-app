import React from 'react';
import { AlertCircle } from 'lucide-react';
import { ErrorMessageProps } from '../../types/prodCart';

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="mt-3 flex items-center gap-1 text-red-500 text-sm">
      <AlertCircle size={14} />
      <span>Ocurrió un error al agregar al carrito</span>
    </div>
  );
};
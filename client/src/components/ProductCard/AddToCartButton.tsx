import { FC } from 'react';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { AddToCartButtonProps } from '../../types/prodCart';

export const AddToCartButton: FC<AddToCartButtonProps> = ({
  isLogged,
  isAdding,
  justAdded,
  isLoading,
  onAddToCart
}) => {
  if (!isLogged) {
    return (
      <button
        onClick={onAddToCart}
        className='bg-gray-300 text-gray-500 px-4 py-2 rounded-lg flex items-center gap-2 cursor-not-allowed'
      >
        <ShoppingCart size={20} />
        Agregar
      </button>
    );
  }

  if (justAdded) {
    return (
      <button
        disabled
        className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <Check size={20} />
        ¡Agregado!
      </button>
    );
  }

  return (
    <button
      onClick={onAddToCart}
      disabled={isAdding || isLoading}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isAdding ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          Procesando...
        </>
      ) : (
        <>
          <ShoppingCart size={20} />
          Agregar
        </>
      )}
    </button>
  );
};
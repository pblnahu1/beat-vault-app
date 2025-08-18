import { FC } from "react";
import { CartItemProps } from "../../types/prodCart";
import { CartItemImage, CartItemInfo, formatCurrency } from "./CartItemComponents";
import { CartItemControls } from "./CartItemControls";

export const CartItem: FC<CartItemProps> = ({ item }) => {
  return (
    <div className="flex items-center gap-4 py-4">
      <CartItemImage src={item.image} alt={item.name} />
      <div className="flex-1">
        <CartItemInfo name={item.name} />
        <CartItemControls item={item} />
      </div>
      <div className="text-right">
        <p className="font-semibold text-green-700">
          {formatCurrency(item.price * item.quantity)}
        </p>
      </div>
    </div>
  );
};

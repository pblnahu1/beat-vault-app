import { FC } from "react";
import { ProductImageProps } from "../../types/prodCart";

export const ProductImage: FC<ProductImageProps> = ({ image, name }) => (
  <div className="w-full h-64 flex items-center justify-center bg-zinc-800">
    {image ? (
      <img
        src={image}
        alt={name}
        className="max-h-full max-w-full object-contain"
      />
    ) : (
      <p className="text-slate-400 text-sm">No hay imagen</p>
    )}
  </div>
);
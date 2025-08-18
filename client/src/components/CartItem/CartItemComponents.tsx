/* eslint-disable react-refresh/only-export-components */
import { FC } from "react";
import { CartItemImageProps, CartItemInfoProps } from "../../types/prodCart";

export const CartItemImage: FC<CartItemImageProps> = ({ src, alt }) => <img src={src} alt={alt} className="w-24 h-24 object-cover rounded"/>
export const CartItemInfo: FC<CartItemInfoProps> = ({name}) => <h3 className="font-semibold text-slate-50">{name}</h3>
export const formatCurrency = (value: number): string => {return `$${value.toFixed(2)}`};
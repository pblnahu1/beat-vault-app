// import React from "react";
import { useState } from "react";
import { ShoppingCart} from "lucide-react";
import { useCart } from "../store/useCart";
import authService from "../services/authService";
import { NavLink } from "../types/navBar";

export const useNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const items = useCart((state) => state.items);
  const itemCount = Array.isArray(items)
    ? items.reduce((total, item) => total + item.quantity, 0)
    : 0;

  const token = localStorage.getItem("authToken");
  const currentUser = authService.getCurrentUser();
  const username = currentUser?.username ?? null; // null y no undefined

  const navLinks: NavLink[] = [
    { to: "/", label: "Inicio" },
    { to: "/cart", label: "Carrito", icon: ShoppingCart, badge: itemCount > 0 ? itemCount : undefined }
  ];

  const handleSearch = (query: string) => {
    console.log("Buscando: ", query);
  };

  return { menuOpen, setMenuOpen, navLinks, token, username, handleSearch };
};

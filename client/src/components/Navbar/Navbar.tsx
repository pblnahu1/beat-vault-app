import { FC } from "react";
import { Link } from "react-router-dom";
import { NavLinks } from "./NavLinks";
import { AccountActions } from "./AccountActions";
import { MobileMenu } from "./MobileMenu";
import { MobileMenuButton } from "../UI/Buttons/MobileMenuButton";
import { useNavbar } from "../../hooks/useNavbar";

export const Navbar: FC = () => {
  const { menuOpen, setMenuOpen, navLinks, token, username } = useNavbar();
  return (
    <nav className="bg-stone-900 shadow-md border-b-2 border-b-stone-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 text-xl font-semibold">
            <img
              src="/logo_cart.svg"
              alt="Logo Cart"
              className="w-10 h-10 bg-indigo-100 rounded-xl"
            />
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            <NavLinks navLinks={navLinks} />
            <AccountActions token={token} username={username} />
          </div>
          <MobileMenuButton menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        </div>
      </div>

      {menuOpen && (
        <MobileMenu
          navLinks={navLinks}
          token={token}
          username={username}
          setMenuOpen={setMenuOpen}
        />
      )}
    </nav>
  );
};

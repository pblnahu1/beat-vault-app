
export type NavLink = {
  to: string; 
  label: string; 
  icon?: React.ComponentType;
  badge?: number;
};


export interface MobileMenuProps {
  navLinks: NavLink[];
  token: string | null;
  username: string | null | undefined;
  setMenuOpen: (open: boolean) => void;
}

export interface MobileMenuButtonProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}
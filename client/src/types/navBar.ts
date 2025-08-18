
export type NavLink = {
  to: string; 
  label: string; 
  icon?: React.ComponentType;
  // icon?: LucideIcon;
  badge?: number;
};


export interface MobileMenuProps {
  navLinks: NavLink[];
  token: string | null;
  username: string | null | undefined;
  handleSearch: (query: string) => void;
  setMenuOpen: (open: boolean) => void;
}

export interface MobileMenuButtonProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Link } from 'react-router-dom';

export const NavLinks = ({ navLinks, onClick }: { navLinks: any[], onClick?: () => void }) => (
  <>
    {navLinks.map(({ to, label, icon, badge }) => (
      <Link
        key={to}
        to={to}
        className='flex items-center gap-2 text-slate-50 hover:text-gray-400 relative'
        onClick={onClick}
      >
        {icon && (
          <span className="relative">
            {React.createElement(icon)}
            {badge && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {badge}
              </span>
            )}
          </span>
        )}
        {label}
      </Link>
    ))}
  </>
)
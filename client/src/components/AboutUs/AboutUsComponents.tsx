import { FC } from "react";

export const Logo: FC = () => (
  <img src="/logo_cart.svg" alt="Logo Cart" className="w-16 h-16 bg-indigo-100 rounded-full mb-2" />
);

export const Title: FC<{ text: string }> = ({ text }) => (
  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-50 mb-4 text-center">{text}</h1>
);

export const Description: FC<{ subtitle: string; description: string }> = ({ subtitle, description }) => (
  <>
    <p className="text-slate-300 text-lg text-center mb-2">{subtitle}</p>
    <p className="text-slate-400 text-base text-center mb-6">{description}</p>
  </>
);

export const Thanks: FC<{ text: string }> = ({ text }) => (
  <span className="text-xl font-bold text-blue-500 text-center">{text}</span>
);

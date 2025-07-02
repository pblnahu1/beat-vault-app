import React from "react";
import { Store } from "lucide-react";

export const AboutUs: React.FC = () => {
  return (
      <div className="bg-zinc-900/90 rounded-3xl shadow-2xl h-[50vh] max-w-[1220px] w-full mx-auto flex flex-col items-center justify-center p-8" id="about">
        <Store className="text-blue-600" size={78} />
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-50 mb-4 text-center">
          Sobre Fluxshop
        </h1>
        <p className="text-slate-300 text-lg text-center mb-2">
          Fluxshop nació en 2025 con la misión de revolucionar la experiencia de compra online en Latinoamérica. 
        </p>
        <p className="text-slate-400 text-base text-center mb-6">
          Somos un equipo apasionado por la tecnología y la innovación, comprometidos en ofrecerte una plataforma segura, rápida y personalizada. 
          En Fluxshop podés descubrir productos únicos, gestionar tus pedidos fácilmente y disfrutar de un servicio al cliente cercano y humano.
        </p>
        <span className="text-xl font-bold text-blue-500 text-center">
          ¡Gracias por ser parte de nuestra historia!
        </span>
      </div>
  );
};
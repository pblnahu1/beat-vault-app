export const Footer = () => {
  return (
    <footer className="w-full mx-auto mt-16 bg-blue-800 text-slate-50 rounded-t-[35px] py-6 px-4 text-center">
      <p className="text-sm opacity-80">
        © {new Date().getFullYear()} • Todos los derechos reservados
      </p>
      <p className="text-sm mt-1">
        Desarrollado con <span className="text-red-500">❤️</span> por{" "}
        <a
          href="https://portfolio-pablo-torrez.vercel.app"
          className="font-bold text-stone-100 transition-colors duration-300 underline"
        >
          Pablo Torrez
        </a>
      </p>
    </footer>
  );
};

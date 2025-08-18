import { footerConfig } from "../../content/footer";

export const Footer = () => {
  return (
    <footer className="w-full mx-auto mt-16 bg-blue-800 text-slate-50 rounded-t-[35px] py-6 px-4 text-center">
      <p className="text-sm opacity-80">
        © {footerConfig.year} • {footerConfig.rightsText}
      </p>
      <p className="text-sm mt-1">
        {footerConfig.madeWith}{" "}
        <span className="text-red-500 animate-pulse">{footerConfig.heart}</span>{" "}
        {footerConfig.by}{" "}
        <a
          href={footerConfig.author.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-stone-100 transition-colors duration-300 underline hover:text-green-300"
        >
          {footerConfig.author.name}
        </a>
      </p>
    </footer>
  );
};

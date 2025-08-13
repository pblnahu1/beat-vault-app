import { useContext } from "react";
import { LoaderContext } from "../context/LoaderContext";

// hook para usar el loader context fácilmente
// eslint-disable-next-line react-refresh/only-export-components
export const useLoader = () => {
    const context = useContext(LoaderContext);
    if(!context) throw new Error('useLoader must be used within a LoaderProvider');
    return context;
}
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, ReactNode } from "react";
import { LoaderContextType } from "../types/loader";

export const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider = ({children}: {children: ReactNode}) => {
    const [loading, setLoading] = useState(false);
    return(
        <LoaderContext.Provider value={{loading, setLoading}}>
            {children}
        </LoaderContext.Provider>
    );
};


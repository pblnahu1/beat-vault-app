import { FC } from "react";
import { LoaderProps } from "../../../types/loader";

export const Loader: FC<LoaderProps> = ({ message, className = "" }) => {
    return (
        <div className={`flex flex-col justify-center items-center py-12 bg-transparent ${className}`}>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            {message && (
                <p className="text-gray-400 mt-4">{message}</p>
            )}
        </div>
    )
}
export type LoaderContextType = {
    loading: boolean;
    setLoading: (value: boolean) => void;
}

export interface LoaderProps {
    message?: string;
    className?: string;
}
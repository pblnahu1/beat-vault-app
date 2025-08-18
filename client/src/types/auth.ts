import { FormEvent } from "react";

export interface UseLoginReturn {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    showPassword: boolean;
    setShowPassword: (showPassword: boolean) => void;
    isSubmitDisabled: boolean;
    errorMessage: string | null;
    handleTogglePassword: () => void;
    handleSubmit: (e: FormEvent) => Promise<void>;
}

export interface UseRegisterReturn {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    username: string;
    setUsername: (username: string) => void;
    showPassword: boolean;
    setShowPassword: (showPassword: boolean) => void;
    isSubmitDisabled: boolean;
    error: string | null;
    role: number;
    setRole: (role: number) => void;
    handleTogglePassword: () => void;
    handleSubmit: (e: FormEvent) => Promise<void>;
    successMessage: string | null;
}

export interface RegisterResponse {
    id?: number | string;
    email?: string;
    username?: string;
    role_id?: number;
}
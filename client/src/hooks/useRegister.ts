import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";

interface UseRegisterReturn {
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
}

export const useRegister = (): UseRegisterReturn => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [role, setRole] = useState<number>(2);
    const navigate = useNavigate();

    const handleTogglePassword = (): void => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        try {
            await register(email, password, username, role);
            navigate(`/dashboard/${username}`)
        } catch (error) {
            if(error instanceof Error){
                console.error(error.message);
                setError(error.message);
            }else{
                console.error("Error desconocido");
                setError("Error desconocido durante el registro");
            }
        }
    }

    useEffect(()=>{
        document.title="Registrarse";
        if(
            email === "" || 
            password === "" ||
            username === ""
        ) {
            setIsSubmitDisabled(true);
        }else{
            setIsSubmitDisabled(false);
        }
    },[email, password, username]);

    return {
        email,
        setEmail,
        password,
        setPassword,
        username,
        setUsername,
        showPassword,
        setShowPassword,
        isSubmitDisabled,
        error,
        handleTogglePassword,
        handleSubmit,
        role,
        setRole
    }
}
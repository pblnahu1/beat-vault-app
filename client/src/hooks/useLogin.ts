import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useCart } from "../store/useCart";

interface UseLoginReturn {
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

export const useLogin = (): UseLoginReturn => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const {loadCart, syncWithBackend} = useCart();
  
    const handleTogglePassword = (): void => {
      setShowPassword((prevShowPassword) => !prevShowPassword);
    };  
  
    const handleSubmit = async (e: FormEvent): Promise<void> => {
      e.preventDefault();
      setErrorMessage(null);
      try {
        const {token, username} = await login(email, password);
        if (token) {
          console.log("Token OK. Bienvenido!")
          localStorage.setItem("authToken", token);
          
          try {
            console.log('Inicializando el carrito después del login exitoso');
            await loadCart();  

            // tiempo de espera para sincronizacion
            setTimeout(() => {
              syncWithBackend();
            }, 3000);

            console.log('Carrito correctamente sincronizado')
          } catch (error) {
            console.error('Error inicializando el carrito: ', error);
            // no bloquea el login si falla la sincronizacion por eso el trycatch solo para esto
          }

          navigate(`/dashboard/${username}`);
        } else {
          setErrorMessage("No se recibió un token del servidor");
        }
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Error desconocido al iniciar sesión");
        }
      }
    };

    // configuro listeners de conectividad una sola vez
    useEffect(() => {
      const handleOnline = () => {
        console.log('Connection restored, syncing cart...');
        const token = localStorage.getItem('authToken');
        if(token){
          syncWithBackend();
        }
      };

      const handleOffline = () => {
        console.log('Connection lost, using local storage only.');
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    },[syncWithBackend]);
  
    useEffect(() => {
      document.title = "Iniciar Sesión";
      setIsSubmitDisabled(!email || !password);
    }, [email, password]);
  
    return {
      email,
      setEmail,
      password,
      setPassword,
      showPassword,
      setShowPassword,
      isSubmitDisabled,
      errorMessage,
      handleTogglePassword,
      handleSubmit,
    };
  };
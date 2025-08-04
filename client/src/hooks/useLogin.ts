import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import authService, { login } from "../services/authService";
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
        const {token, username, id_u, needsReactivation, role_id} = await login(email, password);

        // guardo el usuario para futuros accesos
        const user = { id_u, email, username, token, needsReactivation, role_id };
        localStorage.setItem("currentUser", JSON.stringify(user));


        if (needsReactivation) {
          const confirmReactivate = window.confirm("Tu cuenta está desactivada. ¿Querés reactivarla?");
          if (confirmReactivate) {
            try {
              const userId = user?.id_u ?? await authService.getUserIdByEmail(email);
              const { token: newToken, username: reactivatedUsername, role_id: reactivatedRole } = await authService.reactivate_account_and_login(String(userId));

              const updatedUser = { id_u: userId, email, username: reactivatedUsername, token: newToken, role_id: reactivatedRole }
              localStorage.setItem("authToken", newToken);
              localStorage.setItem("currentUser", JSON.stringify(updatedUser));
              console.log("Cuenta reactivada y login exitoso");

              await loadCart();
              setTimeout(() => syncWithBackend(), 3000);

              return navigate(`/dashboard/${reactivatedUsername}`);
            } catch (error) {
              console.error("Error al reactivar la cuenta:", error);
              return setErrorMessage("No se pudo reactivar la cuenta");
            }
          } else {
            return setErrorMessage("La cuenta sigue desactivada");
          }
        }

        // usuario activo, login normal
        // const user = { id_u, email, username, token };
        // localStorage.setItem("authToken", token);
        // localStorage.setItem("currentUser", JSON.stringify(user));

        // await loadCart();
        // setTimeout(() => syncWithBackend(), 3000);
        // return navigate(`/dashboard/${username}`);

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
          if(error.message === "REACTIVATION_REQUIRED") {
            const confirmReactivate = window.confirm("Tu cuenta está desactivada. ¿Querés reactivarla?");
            if(confirmReactivate) {
              try {
                const userStr = localStorage.getItem("currentUser");
                const user = userStr ? JSON.parse(userStr) : null;

                // en caso de que no exista el id del  usuairo podría
                // necesitar hacer una consulta extra o ajustar desde el backend
                // const authServiceInstance = new authService();
                const userId = user?.id_u ?? await authService.getUserIdByEmail(email);
                const {token: newToken, username: reactivatedUsername, role_id: reactivatedRole} = await authService.reactivate_account_and_login(String(userId));

                // retry login después de la reactivación
                // const {token, username} = await login(email, password)
                // if (!token) {
                //   throw new Error("Token no recibido después de reactivar cuenta");
                // }
                const updatedUser = {
                  id_u: userId,
                  email,
                  username: reactivatedUsername,
                  token: newToken,
                  role_id: reactivatedRole
                };
                
                localStorage.setItem("authToken", newToken);
                localStorage.setItem("currentUser", JSON.stringify(updatedUser));

                await loadCart();
                setTimeout(() => syncWithBackend(), 3000);

                return navigate(`/dashboard/${reactivatedUsername}`)
              } catch (error) {
                console.error("Error al reactivar la cuenta:", error);
                setErrorMessage("No se pudo reactivar la cuenta");
                return;
              }
            } else {
              setErrorMessage("La cuenta sigue desactivada");
              return;
            }
          }
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
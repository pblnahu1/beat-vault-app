import { User } from "../types";

interface RegisterRequest{
    email: string;
    password: string;
    username: string;
}

interface RegisterResponse {
    id?: number | string;
    email?: string;
    username?: string;
}

interface ErrorResponse {
    message: string;
}
 
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'; 

if(!BASE_URL) {
    throw new Error("BACKEND_URL no está definido en el .env");
}

/**
 * Función para iniciar sesión
 * @param email correo electrónico del usuario
 * @param password contraseña del usuario
 * @returns token de autenticación
 */

export const login = async (email: string, password: string): Promise<User> => {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password}),
        });

        
        const data = await response.json();
        
        if(!response.ok){
            if(response.status === 401 && data.reactivable) {
                throw new Error("REACTIVATION_REQUIRED")
            }

            if(response.status === 401) {
                throw new Error("Credenciales incorrectas");
            }

            throw new Error(data.message || "Error en el servidor"); //500
        }

        const token = data.token;
        const userInfo = data.user;

        const userData: User = {
            id_u: userInfo.id_u,
            username: userInfo.username,
            email: userInfo.email,
            token: token
        }

        localStorage.setItem('authToken', userData.token);

        const authService = new AuthService();
        authService.setCurrentUser(userData, token);

        return userData; // retorno el token cuando lo necesite
    } catch (error) {
        if(error instanceof Error){
            throw new Error(error.message || "Error desconocido");
        }
        throw new Error("Error desconocido");
    }
};

/**
 * Función para registrar un nuevo usuario
 * @param email correo electrónico del usuario
 * @param password contraseña del usuario
 * @param username nombre del usuario
 * @returns datos del usuario creado
 */

export const register = async (
    email: string,
    password: string,
    username: string
): Promise<RegisterResponse> => {
    try {
        const userData: RegisterRequest = {
            email,
            password,
            username
        };

        const response = await fetch(`${BASE_URL}/api/auth/create-account`, {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if(!response.ok){
            const errData = await response.json() as ErrorResponse;
            throw new Error(errData.message || "Error al registrar usuario");
        }

        return await response.json() as RegisterResponse; // puedo retornar el usuario creado cuando lo necesite
    } catch (error) {
        if(error instanceof Error){
            throw new Error(error.message || "Error desconocido");
        }

        throw new Error("Error desconocido");
    }
};

class AuthService {
    // private currentUser: User | null = null;

    getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    getCurrentUser(): User | null {        
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
        return null;
    }

    async getUserIdByEmail(email: string): Promise<string> {
        const res = await fetch(`${BASE_URL}/api/users/id-by-email?email=${email}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "No se pudo obtener el ID de usuario");
        return data.id_u;
    }


    setCurrentUser(user: User, token: string): void {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('authToken', token);
    }

    logout(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('cart-storage');
        localStorage.removeItem('currentUser');
    }

    paused_account_and_logout(): void {
        const userStr = localStorage.getItem('currentUser');
        const user = userStr ? JSON.parse(userStr) : null;

        if(user?.id_u) {
            fetch(`${BASE_URL}/api/users/paused-account`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({id_u: user.id_u})
            }).catch((err) => {
                console.error("Error al pausar cuenta en el servidor: ", err);
            });
        }

        localStorage.removeItem('authToken');
        localStorage.removeItem('cart-storage');
        localStorage.removeItem('currentUser');
    }

    delete_account_forever(): void {
        const userStr = localStorage.getItem('currentUser');
        const user = userStr ? JSON.parse(userStr) : null;

        if(user?.id_u){
            fetch(`${BASE_URL}/api/users/${user.id_u}`, {
                method: 'DELETE',
            }).catch(err => console.error("Error al eliminar la cuenta: ", err));
        }

        //limpieza total
        this.logout()
    }

    async reactivate_account_and_login(userId: string): Promise<{ token: string, username: string }> {
        const res = await fetch(`${BASE_URL}/api/users/${userId}/reactivate-account`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id_u: userId })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Error al reactivar la cuenta");
        }

        if (!data.token || !data.username) {
            throw new Error("Faltan datos después de la reactivación");
        }

        localStorage.setItem("authToken", data.token);

        return {
            token: data.token,
            username: data.username
        };
    }


    isAuthenticated(): boolean {
        const token = this.getToken();
        const user = this.getCurrentUser();
        return !!(token && user);
    }
}

export default new AuthService();
import { User } from "../types";

// interfaces para los datos
interface LoginResponse {
    token: string;
    username: string;
    id: number;
}

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

// URL base para las peticiones
// const BASE_URL = `${import.meta.env.BACKEND_URL}`; 
const BASE_URL = "http://localhost:3000"; 
if(!BASE_URL) {
    throw new Error("BACKEND_URL no está definido en el .env");
}

/**
 * Función para iniciar sesión
 * @param email correo electrónico del usuario
 * @param password contraseña del usuario
 * @returns token de autenticación
 */

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await fetch(`${BASE_URL}/account/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password}),
        });

        if(!response.ok){
            if(response.status === 401) {
                throw new Error("Credenciales incorrectas"); // devuelve 401
            }
            throw new Error("Error en el servidor"); // 500
        }
        
        const data = await response.json();
        const userData = data as LoginResponse;
        localStorage.setItem('authToken', userData.token);
        const authService = new AuthService();
        authService.setCurrentUser({ id_u: userData.id, name: userData.username, email: '' }, userData.token);

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

        const response = await fetch(`${BASE_URL}/account/create-account`, {
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
    private currentUser: User | null = null;

    getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    getCurrentUser(): User | null {
        if (this.currentUser) {
            return this.currentUser;
        }
        
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
            this.currentUser = JSON.parse(userStr);
            return this.currentUser;
        }
        
        return null;
    }

    setCurrentUser(user: User, token: string): void {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('authToken', token);
    }

    logout(): void {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        const user = this.getCurrentUser();
        return !!(token && user);
    }
}

export default new AuthService();
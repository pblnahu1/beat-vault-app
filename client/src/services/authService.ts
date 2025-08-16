import { User, UpdateProfilePayload, UpdateProfileResponse } from "../types/user.ts";
import { apiClient } from "../api/apiClient.ts";

interface RegisterResponse {
    id?: number | string;
    email?: string;
    username?: string;
    role_id?: number;
}

/**
 * Función para iniciar sesión
 * @param email correo electrónico del usuario
 * @param password contraseña del usuario
 * @returns token de autenticación
 */

export const login = async (email: string, password: string): Promise<User> => {
  try {
    const data = await apiClient("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });

    if (!data.accessToken) throw new Error("No se recibió token del servidor");

    const userData: User = {
      id_u: data.user.id_u,
      username: data.user.username,
      email: data.user.email,
      token: data.accessToken,
      role_id: data.user.role_id,
    };

    localStorage.setItem('authToken', userData.token);
    new AuthService().setCurrentUser(userData, data.accessToken);

    return userData;
  } catch (error) {
    if (error instanceof Error) {
      if(error.message === "REACTIVATION_REQUIRED") {
        throw new Error("REACTIVATION_REQUIRED");
      }
      throw error;
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
  username: string,
  role: number
): Promise<RegisterResponse> => {
  try {
    const role_id = role ? Number(role) : undefined;
    return await apiClient("/api/auth/create-account", {
      method: "POST",
      body: { email, password, username, role_id },
    });
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Error desconocido");
  }
};

class AuthService {

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  async getProfile(token: string): Promise<{ data: User }> {
    try {
      const data = await apiClient('/api/auth/profile', {
        token,
      });
      return { data };
    } catch (error) {
      throw new Error((error as Error).message || "No se pudo obtener el perfil del usuario");
    }
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
    try {
      const data = await apiClient(`/api/users/id-by-email?email=${encodeURIComponent(email)}`);
      return data.id_u;
    } catch (error) {
      throw new Error((error as Error).message || "No se pudo obtener el ID de usuario");
    }
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

  async paused_account_and_logout(): Promise<void> {
    const userStr = localStorage.getItem('currentUser');
    const user = userStr ? JSON.parse(userStr) : null;

    if (user?.id_u) {
      try {
        await apiClient('/api/users/paused-account', {
          method: "POST",
          body: { id_u: user.id_u },
        });
      } catch (error) {
        console.error("Error al pausar cuenta en el servidor: ", (error as Error).message);
      }
    }

    this.logout();
  }

  async delete_account_forever(): Promise<void> {
    const userStr = localStorage.getItem('currentUser');
    const user = userStr ? JSON.parse(userStr) : null;

    if (user?.id_u) {
      try {
        await apiClient(`/api/users/${user.id_u}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error("Error al eliminar la cuenta: ", (error as Error).message);
      }
    }

    this.logout();
  }

  async reactivate_account_and_login(userId: string): Promise<{ token: string, username: string, role_id: number }> {
    const data = await apiClient(`/api/users/${userId}/reactivate-account`, {
      method: "PATCH",
      body: { id_u: userId }
    });

    if (!data.token || !data.username) {
      throw new Error("Faltan datos después de la reactivación");
    }

    localStorage.setItem("authToken", data.token);

    return {
      token: data.token,
      username: data.username,
      role_id: data.role_id || 2,
    };
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  async updateProfile(id_u: number, payload: UpdateProfilePayload, token: string): Promise<UpdateProfileResponse> {
    try {
      const data = await apiClient(`/api/users/${id_u}`, {
        method: "PUT",
        body: payload,
        token,
      });
      return { data, token };
    } catch (error) {
      throw new Error((error as Error).message || "Error al actualizar el perfil");
    }
  }
}

export default new AuthService();

export interface User {
  id_u: number;
  email: string;
  username: string;
  token: string;
  needsReactivation?:boolean;
  role_id: number; // Agregado para manejar roles
}

export interface UpdateProfilePayload {
  email?: string;
  username?: string;
  password?: string;
}

export interface UpdateProfileResponse {
  data: {
    id_u: number;
    email: string;
    username: string;
  };
  token: string;
}
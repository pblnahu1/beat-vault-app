const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

type RequestOptions = {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
    token?: string;
}

export async function apiClient(endpoint: string, options: RequestOptions = {}) {
    const {
        method = "GET", 
        headers = {}, 
        body, 
        token
    } = options;

    const config: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
            ...(token ? {Authorization: `Bearer ${token}`} : {}),
        },
    };

    if(body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if(!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const message = errorBody?.message || response.statusText || "Error en la petición.";
        throw new Error(message);
    }

    if(response.status === 204) return null; //no content

    return response.json();
}
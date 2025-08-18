//url base de mi backend
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

//tipado para las opciones que pueda recibir el cliente
type RequestOptions = {
    method?: string; //metodo http (get,post,put,delete, etc)
    headers?: Record<string, string>; //headers adicionales
    body?: any; //cuerpo de la petición para post put, etc
    token?: string; //token jwt para autenticación
}

/**
 * Cliente HTTP centralizado para todas las peticiones a la API
 * @param endpoint - ruta del endpoint (ej: "/products", "/api/purchase/history", etc)
 * @param options - opciones de config para peticiones
 * @returns Promesa con la respuesta parseada como JSON
 */
export async function apiClient(endpoint: string, options: RequestOptions = {}) {
    //hago desestructuración con valores por defecto
    const {
        method = "GET", //por default uso GET
        headers = {}, //header vacio por default
        body, //cuerpo opcional
        token //token opcional
    } = options;

    //configuro la base de la petición fetch
    const config: RequestInit = {
        method,
        headers: {
            //header por defecto para json
            "Content-Type": "application/json",
            //spread de headers personalizados (pueden sobreescribir content-type)
            ...headers,
            //si hay token agregar header de Authorization
            ...(token ? {Authorization: `Bearer ${token}`} : {}),
        },
    };

    // si existe un body agrego (para post, put , patch)
    if(body) {
        config.body = JSON.stringify(body);
    }

    //hago la petición http
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    //manejo errores http (status 400+)
    if(!response.ok) {
        //intento obtener mensaje de error del servidor
        const errorBody = await response.json().catch(() => null);
        //prioridad del mensaje de error:
        //1. message del servidor
        //2. statusText del response
        //3. mensaje genérico
        const message = errorBody?.message || response.statusText || "Error en la petición.";
        //lanzo el nuevo error con mensaje descriptivo
        throw new Error(message);
    }

    //algunas operaciones como delete puede retornar esto
    if(response.status === 204) return null; //no content (204)

    //parseo y retorno json para respuestas exitosas
    return response.json();
}
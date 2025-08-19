# BeatVault

BeatVault es una aplicación de comercio electrónico sencilla pero potente. Permite a los usuarios explorar productos, agregarlos al carrito y gestionar sus compras de manera eficiente. Incluye autenticación con accessToken y refreshToken para una experiencia personalizada y segura. Integración con Zustand/Zod para un mejor manejo de estado. La aplicación está diseñada de tres maneras distintas: de manera local, dockerizada y también en Supabase (un BaaS muy funcional) gracias a las environments y el estado de ambiente ya sea en local, producción o docker. Se implementó mejoras en seguridad en los endpoints, test unitarios para verificar que cada endpoint hace lo pedido. Se codificó la carpeta database-tools para hacer backups necesarios de PostgreSQL (para Supabase se hace desde el dashboard). Toda la aplicación está contenerizada en una misma red para asegurar de que cada servicio funcione correctamente y en la misma red, intercambiando datos. Se implementó un pipeline CI/CD para manejar las acciones del repositorio cada vez que hay cambios en el mismo, esto nos servirá para detectar errores antes de que la aplicación haga cambios a producción. También hay una carpeta requests para separar los tests de los endpoints por admin, customer y global tests http.

## Características principales

- Catálogo de productos con búsqueda
- Carrito de compras persistente
- Autenticación de usuarios
- Panel de administración para productos
- Diseño responsive
- Gestión de órdenes y estados de pedidos
- Exportación de información detallada en formato CSV o PDF

## Stack Tecnológico

**Frontend**
- React & TypeScript
- Tailwind CSS
- React Router
- Axios
- Zustand/Zod

**Backend**
- Node.js + Express
- PostgreSQL (Docker)
- Supabase
- JWT para autenticación
- Bcrypt para contraseñas
- CSV-Writer para convertir objetos o matrices de JavaScript en una cadena CSV o escribirlos directamente en un archivo. (CsvStringifier para grandes datos)
- JsPDF/PDFKIT para generar archivos PDF en JavaScript

**DevOps & Herramientas**
- Docker y Docker Compose
- Supabase
- Git
- NODE:TEST

---

## Arquitectura del Proyecto

El proyecto está organizado en dos grandes módulos:

### 1. **Frontend (`/client`)**

- **Componentes principales**: Navbar, Footer, ProductCard, CartItem, etc.
- **Páginas**: Home, Carrito, Detalle de producto, Autenticación, Dashboard de usuario.
- **Ruteo protegido**: Solo usuarios autenticados acceden al Dashboard.
- **Estado del carrito**: Persistente y sincronizado con backend.
- **Estilos**: Tailwind CSS.
- **Comunicación**: Axios para interactuar con la API REST del backend mediante un `src/core/apiClient`.

### 2. **Backend (`/server`)**

- **Express**: Organización modular de rutas para autenticación, productos y carrito.
- **Rutas principales**:
    - **Admin**
    - `/products/create`: Crear un producto
    - `/products/update/:id`: Actualizar un producto
    - `/products/delete/:id`: Eliminar un producto
    - **Public**
    - `/api`: Verifica el estado de la API
    - `/api/status`: Verifica el estado de conexión de la Base de Datos
    - `/api/auth/login`: Loguearse
    - `/api/auth/create-account`: Crear cuenta
    - `/api/users/paused-account`: Desactivar cuenta (pausar temporalmente)
    - `/api/users/:id/reactivate-account`: Reactivar cuenta (patch method)
    - `/api/users/:id`: Eliminar cuenta (delete method)
    - `/api/auth/profile`: Tomar los datos del perfil
    - `/api/users/id-by-email`: Tomar el ID del Email registrado para verificaciones
    - `/api/users/:id`: Actualizar perfil de usuario (put method)
    - `/prodcuts`: Tomar productos
    - `/products/:id`: Tomar producto por ID
    - `/products/category/:category`: Verificar productos por categoria
    - `/cart`: Tomar carrito
    - `/cart`: Insertar productos al carrito
    - `/cart/:productId`: Agregar o actualizar productos por ID (aumentar cantidad)
    - `/cart/clear`: Eliminar todo del carrito (delete method)
    - `/cart/:productId`: Eliminar un producto del carrito por su ID (delete method)
    - `/cart/count`: Contar cuántos productos tengo en el carrito
    - `/api/purchases/history`: Verificar todo el historial de compras
    - `/api/cart/purchase`: Insertar los productos del carrito que compré (no literalmente)
    - `/api/export-data`: Exporta datos en formato PDF o CSV (get method)
    - **Protected Route**
    - `/dashboard/:username`: Dashboard del usuario con login/register exitoso (get method)
- **Persistencia**: PostgreSQL, dockerizada y Supabase.
- **Seguridad**: JWT y Bcrypt.
- **Middlewares**: Manejo de archivos estáticos y autenticación.

---

## Diagramas
![ARQUITECTURA](/public/arquitecture-fluxshop-app-arquitecture-1.2.drawio.png)
![MODELO RELACIONAL](/public/arquitecture-fluxshop-app-modelo-relacional.drawio.png)
![DER](/public//arquitecture-fluxshop-app-der-1.3.drawio.png)

---

## Tests (server)

### Ejecutar tests:
```bash
npm run tests
```

### Test de conexión a la DB
El archivo `tests/connection-status.test.js` contiene un test básico que verifica si la base de datos está accesible y operativa. Se realiza una consulta SQL simple (`SELECT 1 + 1`) y se valida que la respuesta sea correcta. Este test sirve para asegurar que la conexión esté funcionando antes de ejecutar tests más complejos.

---

## Instalación rápida

Con Docker:
```bash
docker compose up --build
```
Sin Docker (dos terminales):
```bash
cd client && npm install && npm run dev
cd server && npm install && npm run dev
```

---

## Pro Tip

Usá el archivo `requests/test.http` (VS Code REST Client o Postman) para probar la API fácilmente.

---

## Autor

[Pablo Torrez](https://github.com/pblnahu1)
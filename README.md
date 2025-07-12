# Fluxshop

Fluxshop es una aplicación de comercio electrónico sencilla pero potente. Permite a los usuarios explorar productos, agregarlos al carrito y gestionar sus compras de manera eficiente. Incluye autenticación básica para una experiencia personalizada y segura.

## Características principales

- Catálogo de productos con búsqueda y filtros (próximamente)
- Carrito de compras persistente
- Autenticación de usuarios
- Panel de administración para productos (próximamente)
- Checkout simplificado (próximamente)
- Diseño responsive
- Gestión de órdenes y estados de pedidos (próximamente)
- Integración con sistemas de pago (próximamente)

## Stack Tecnológico

**Frontend**
- React.js (Vite + TypeScript)
- Tailwind CSS
- React Router
- Axios

**Backend**
- Node.js + Express
- PostgreSQL (Docker)
- JWT para autenticación
- Bcrypt para contraseñas

**DevOps & Herramientas**
- Docker y Docker Compose
- Git
- ESLint + Prettier
- Jest (próximamente)

---

## Arquitectura del Proyecto

El proyecto está organizado en dos grandes módulos:

### 1. **Frontend (`client/`)**

- **Componentes principales**: Navbar, Footer, ProductCard, CartItem, etc.
- **Páginas**: Home, Carrito, Detalle de producto, Autenticación, Dashboard de usuario (perfil, historial, direcciones, métodos de pago, reviews).
- **Ruteo protegido**: Solo usuarios autenticados acceden al Dashboard.
- **Estado del carrito**: Persistente y sincronizado con backend.
- **Estilos**: Tailwind CSS.
- **Comunicación**: Axios para interactuar con la API REST del backend.

**Ejemplo de estructura de rutas:**
```tsx
<Routes>
  <Route element={<MainLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/:id" element={<ProductDetail />} />
    <Route path="/account/login" element={<Login />} />
    <Route path="/account/create-account" element={<Register />} />
  </Route>
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard/:username" element={<DashboardLayout />}>
      <Route path="profile" element={<Profile />} />
      <Route path="orders" element={<OrderHistory />} />
      <Route path="wish-list" element={<Wishlist />} />
      <Route path="addresses" element={<Addresses />} />
      <Route path="payments" element={<PaymentMethods />} />
      <Route path="reviews" element={<MyReviews />} />
    </Route>
  </Route>
</Routes>
```

### 2. **Backend (`server/`)**

- **Express**: Organización modular de rutas para autenticación, productos y carrito.
- **Rutas principales**:
    - `/auth`: Registro y login
    - `/products`: Consulta y filtrado de productos
    - `/cart`: Gestión del carrito
- **Persistencia**: PostgreSQL, dockerizada.
- **Seguridad**: JWT y Bcrypt.
- **Middlewares**: Manejo de archivos estáticos y autenticación.

---

## Diagrama de Arquitectura (Descriptivo)

```
┌────────────┐          HTTP/API           ┌────────────┐
│  Frontend  │ <────────────────────────→  │  Backend   │
│ React/Vite │                             │ Express.js │
└─────┬──────┘        JSON Responses       └─────┬──────┘
      │                                         │
      │                                         │
      │        Consultas SQL (ORM/Raw)          │
      └────────────────────────────────────────>│
                                                │
                                         ┌──────▼─────┐
                                         │ PostgreSQL │
                                         └────────────┘
```

- **Frontend:** Hace requests HTTP a la API del backend para obtener productos, autenticarse, manipular el carrito, etc.
- **Backend:** Expone una API REST, valida y procesa las solicitudes, maneja autenticación JWT y consulta la base de datos PostgreSQL.
- **Base de datos:** Almacena usuarios, productos, carritos y órdenes.

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

Usá el archivo `requests/test.http` (VS Code REST Client) para probar la API fácilmente.

---

## Autor

[Pablo Torrez](https://github.com/pblnahu1)
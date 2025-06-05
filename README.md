# Fluxshop

Flux Shop es una aplicación de comercio electrónico sencilla pero funcional que permite a los usuarios explorar 
productos, añadirlos al carrito y gestionar sus compras de forma eficiente. Cuenta con un sistema de autenticación 
básico para gestionar usuarios y garantizar una experiencia personalizada.

## Características principales

- Catálogo de productos con búsqueda y filtros (pending)
- Carrito de compras persistente
- Sistema de autenticación de usuarios
- Panel de administración para gestión de productos (pending)
- Proceso de checkout simplificado (pending)
- Diseño responsive para móviles y escritorio
- Gestión de órdenes y estado de pedidos (pending)
- Integración con sistema de pagos (pending)

## Stack Tecnológico

### Frontend
- React.js con Vite y TypeScript
<!-- - Redux Toolkit para manejo de estado -->
- Tailwind CSS para estilos
- React Router para navegación
- Axios para peticiones HTTP

### Backend
- Node.js con Express
- Postgres como imagen de Docker para la base de datos
- JWT para autenticación
- Bcrypt para encriptación

### DevOps & Herramientas
- Docker y Docker Compose
- Git para control de versiones
- ESLint y Prettier para formato de código
- Jest para testing (pending)

# Instalaciones del proyecto

Si tenés Docker ejecutá el proyecto con:
```bash
docker compose up --build
```

Si no tenés Docker, ejecutá por consola desde /client y /server:
```bash
npm install && npm run dev
```

# Pro Tip
Para probar la API fácilmente, podés usar el archivo requests/test.http con el plugin REST Client de VS Code.

# Autor: [Pablo Torrez](https://github.com/pblnahu1)

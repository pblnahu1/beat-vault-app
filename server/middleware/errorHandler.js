// ============================================
// 1. CLASES DE ERRORES PERSONALIZADOS
// ============================================

class AppError extends Error {
  constructor(message, statusCode, errorCode = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.errorCode = errorCode;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, field = null) {
    super(message, 400, 'VALIDATION_ERROR');
    this.field = field;
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409, 'CONFLICT');
  }
}

class DatabaseError extends AppError {
  constructor(message = 'Database operation failed') {
    super(message, 500, 'DATABASE_ERROR');
  }
}

// ============================================
// 2. UTILIDADES DE ERROR
// ============================================

const ErrorUtils = {
  // Crear respuesta de error estandarizada
  createErrorResponse(err, req) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    const errorResponse = {
      status: err.status || 'error',
      message: err.message,
      errorCode: err.errorCode || 'INTERNAL_ERROR',
      timestamp: err.timestamp || new Date().toISOString(),
      path: req.originalUrl,
      method: req.method
    };

    // Información adicional en desarrollo
    if (isDevelopment) {
      errorResponse.stack = err.stack;
      errorResponse.details = {
        name: err.name,
        statusCode: err.statusCode
      };
    }

    // Información específica por tipo de error
    if (err.field) {
      errorResponse.field = err.field;
    }

    return errorResponse;
  },

  // Determinar si un error debe ser loggeado
  shouldLogError(err) {
    // No loggear errores del cliente (4xx)
    if (err.statusCode && err.statusCode < 500) {
      return false;
    }
    return true;
  },

  // Formatear error para logs
  formatErrorForLog(err, req) {
    return {
      timestamp: new Date().toISOString(),
      level: 'error',
      message: err.message,
      statusCode: err.statusCode || 500,
      errorCode: err.errorCode || 'INTERNAL_ERROR',
      method: req.method,
      url: req.originalUrl,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id || 'anonymous',
      stack: err.stack
    };
  }
};

// ============================================
// 3. MIDDLEWARE DE MANEJO DE ERRORES
// ============================================

const errorHandler = (err, req, res, _next) => {
  // Crear copia del error para evitar mutación
  let error = { ...err };
  error.message = err.message;

  // Log del error si es necesario
  if (ErrorUtils.shouldLogError(error)) {
    const logData = ErrorUtils.formatErrorForLog(error, req);
    console.error('🚨 ERROR:', JSON.stringify(logData, null, 2));
  }

  // Manejar errores específicos de bases de datos y librerías
  if (err.name === 'CastError') {
    const message = 'Invalid resource ID format';
    error = new ValidationError(message);
  }

  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ConflictError(message);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new ValidationError(message);
  }

  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please log in again';
    error = new UnauthorizedError(message);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired. Please log in again';
    error = new UnauthorizedError(message);
  }

  // Errores de PostgreSQL
  if (err.code === '23505') { // unique_violation
    const message = 'Resource already exists';
    error = new ConflictError(message);
  }

  if (err.code === '23503') { // foreign_key_violation
    const message = 'Referenced resource does not exist';
    error = new ValidationError(message);
  }

  if (err.code === '23502') { // not_null_violation
    const message = 'Required field is missing';
    error = new ValidationError(message);
  }

  // Asegurar que el error tenga statusCode
  const statusCode = error.statusCode || 500;
  
  // Crear respuesta
  const errorResponse = ErrorUtils.createErrorResponse(error, req);
  
  res.status(statusCode).json(errorResponse);
};

// ============================================
// 4. MIDDLEWARE PARA RUTAS NO ENCONTRADAS
// ============================================

const notFoundHandler = (req, _res, next) => {
  const error = new NotFoundError(`Route ${req.originalUrl}`);
  next(error);
};

// ============================================
// 5. WRAPPER PARA FUNCIONES ASYNC
// ============================================

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// ============================================
// 6. MIDDLEWARE DE VALIDACIÓN
// ============================================

const validateRequest = (schema) => {
  return (req, _res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      return next(new ValidationError(message));
    }
    next();
  };
};

// ============================================
// 7. MIDDLEWARE DE RATE LIMITING ERRORS
// ============================================

const rateLimitErrorHandler = (_req, _res, next) => {
  const error = new AppError('Too many requests. Please try again later.', 429, 'RATE_LIMIT_EXCEEDED');
  next(error);
};

// ============================================
// 8. EJEMPLO DE USO EN CONTROLADORES
// ============================================

// Ejemplo de controlador usando el sistema de errores
const exampleController = {
  // GET /users/:id
  getUserById: catchAsync(async (req, res, _next) => {
    const { id } = req.params;
    
    // Validación básica
    if (!id || isNaN(id)) {
      throw new ValidationError('Invalid user ID', 'id');
    }

    // Simulación de consulta a BD
    const user = await findUserById(id);
    
    if (!user) {
      throw new NotFoundError('User');
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  }),

  // POST /users
  createUser: catchAsync(async (req, res, _next) => {
    const { email, name, password } = req.body;

    // Validaciones
    if (!email || !name || !password) {
      throw new ValidationError('Email, name and password are required');
    }

    // Verificar si el usuario ya existe
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Crear usuario
    const newUser = await createUser({ email, name, password });

    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      data: { user: newUser }
    });
  }),

  // Ejemplo con autorización
  deleteUser: catchAsync(async (req, res, _next) => {
    const { id } = req.params;
    const currentUser = req.user;

    // Verificar autorización
    if (currentUser.role !== 'admin' && currentUser.id !== parseInt(id)) {
      throw new ForbiddenError('You can only delete your own account');
    }

    // Buscar usuario
    const user = await findUserById(id);
    if (!user) {
      throw new NotFoundError('User');
    }

    // Eliminar usuario
    await deleteUserById(id);

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  })
};

// ============================================
// 9. CONFIGURACIÓN EN APP PRINCIPAL
// ============================================

const setupErrorHandling = (app) => {
  // Middleware de manejo de errores debe ir al final
  app.use(notFoundHandler);
  app.use(errorHandler);
  
  // Manejo de promesas rechazadas no capturadas
  process.on('unhandledRejection', (err, _promise) => {
    console.error('🚨 UNHANDLED PROMISE REJECTION:', err.message);
    console.error('Stack:', err.stack);
    
    // Cerrar servidor gracefully
    process.exit(1);
  });

  // Manejo de excepciones no capturadas
  process.on('uncaughtException', (err) => {
    console.error('🚨 UNCAUGHT EXCEPTION:', err.message);
    console.error('Stack:', err.stack);
    
    // Cerrar aplicación inmediatamente
    process.exit(1);
  });
};

// ============================================
// 10. FUNCIONES HELPER PARA TESTING
// ============================================

// Funciones de ejemplo (reemplazar con tu lógica real)
async function findUserById(id) {
  // Simulación - reemplazar con tu consulta real
  const users = [
    { id: 1, name: 'Juan', email: 'juan@ejemplo.com' },
    { id: 2, name: 'María', email: 'maria@ejemplo.com' }
  ];
  return users.find(user => user.id === parseInt(id));
}

async function findUserByEmail(email) {
  // Simulación - reemplazar con tu consulta real
  const users = [
    { id: 1, name: 'Juan', email: 'juan@ejemplo.com' },
    { id: 2, name: 'María', email: 'maria@ejemplo.com' }
  ];
  return users.find(user => user.email === email);
}

async function createUser(userData) {
  // Simulación - reemplazar con tu lógica real
  return { id: Date.now(), ...userData };
}

async function deleteUserById(_id) {
  // Simulación - reemplazar con tu lógica real
  return true;
}

// ============================================
// EXPORTACIONES
// ============================================

export {
  // Clases de error
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  DatabaseError,
  
  // Middlewares
  errorHandler,
  notFoundHandler,
  catchAsync,
  validateRequest,
  rateLimitErrorHandler,
  
  // Utilidades
  ErrorUtils,
  setupErrorHandling,
  
  // Ejemplo de controlador
  exampleController
};

// Exportación por defecto del middleware principal
export default errorHandler;

/**
Errores tipificados: Diferentes clases para diferentes tipos de errores

Información completa: Timestamps, códigos de error, path, método

Seguro: No expone información sensible en producción

Logging inteligente: Solo loggea errores del servidor (5xx)

Manejo de BD: Errores específicos de PostgreSQL

Validaciones: Middleware para validar requests

Async/await: Wrapper catchAsync para manejar promesas

//////////// Ejemplo para probar desde la terminal

curl "http://localhost:3000/api/test-error?type=validation"
curl "http://localhost:3000/api/test-error?type=notfound" 
curl "http://localhost:3000/api/test-error?type=server

//////////// Ejemplo para probar

import { catchAsync, ValidationError, NotFoundError } from './middleware/errorHandler.js';

app.get('/users/:id', catchAsync(async (req, res, next) => {
  const user = await findUser(req.params.id);
  
  if (!user) {
    throw new NotFoundError('User'); // se convierte automáticamente en respuesta JSON
  }
  
  res.json({ user });
}));

** OUTPUT **

// Error 404
{
  "status": "fail",
  "message": "User not found",
  "errorCode": "NOT_FOUND",
  "timestamp": "2025-06-03T15:30:00.000Z",
  "path": "/api/users/999",
  "method": "GET"
}

// Error 500 en desarrollo
{
  "status": "error", 
  "message": "Database connection failed",
  "errorCode": "DATABASE_ERROR",
  "timestamp": "2025-06-03T15:30:00.000Z",
  "path": "/api/users",
  "method": "POST",
  "stack": "Error: Database connection failed\n    at..."
}
*/
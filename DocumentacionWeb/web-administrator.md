# Administrador Web (Super Admin) - Documentación del Rol

## Resumen
El Administrador Web (Super Admin) es el nivel más alto de autoridad dentro de la plataforma QRPackage. Este rol es responsable de la gestión general de todo el sistema multi-inquilino (multi-tenant), asegurando que todas las empresas de logística que operan en la plataforma funcionen correctamente.

## Responsabilidades y Características Clave

### 1. Gestión de Inquilinos de la Plataforma
* **Integración de Empresas:** Crear, suspender o eliminar empresas (tenants) de la plataforma.
* **Suscripción y Facturación (Futuro):** Gestionar el estado activo de las empresas en función del uso de la plataforma.

### 2. Configuración Global del Sistema
* **Métricas del Sistema:** Monitorear la salud general de la plataforma, incluyendo el uso de la API, el volumen total de entregas en todas las empresas y los indicadores de carga del servidor.
* **Parámetros Globales:** Configurar valores predeterminados a nivel de sistema (por ejemplo, límites máximos de paquetes, coordenadas centrales de los mapas por defecto).

### 3. Panel de Super Admin
* **Reportes Macro:** Acceder a análisis de alto nivel que muestran el rendimiento de todas las empresas registradas.
* **Registros de Auditoría:** Ver registros críticos del sistema y acciones realizadas por los Administradores de Empresa para garantizar el cumplimiento y la seguridad.

### 4. Supervisión de Rutas y Geocercas
* Aunque los Administradores de Empresa crean rutas específicas, el Administrador Web tiene acceso de solo lectura para ver todas las rutas activas y geocercas en la plataforma, con el fin de brindar soporte técnico.

## Acceso a la Interfaz de Usuario
El Administrador Web tiene acceso a las rutas protegidas `/super-admin`, que cuentan con una barra lateral especializada con controles globales que son invisibles para los usuarios estándar.

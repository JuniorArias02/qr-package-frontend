# Administrador de Empresa - Documentación del Rol

## Resumen
El Administrador de Empresa gestiona una empresa de logística específica dentro de la plataforma QRPackage. Este rol tiene total autonomía sobre las operaciones internas de la empresa, la gestión del personal y las configuraciones geográficas.

## Responsabilidades y Características Clave

### 1. Gestión del Personal
* **Gestión de Coordinadores:** Crear, editar y deshabilitar cuentas de Coordinadores. Asignar coordinadores a sucursales o zonas específicas.
* **Supervisión de Conductores:** Aunque los Coordinadores gestionan las actividades diarias de los conductores, el Administrador puede ver toda la flota y realizar acciones administrativas en las cuentas de los Conductores.

### 2. Enrutamiento Geográfico (Gestor de Rutas)
* **Configuración de Geocercas:** Acceder a la interfaz de Planificación de Rutas para dibujar geocercas circulares en el mapa utilizando Leaflet.
* **Definición de Rutas:** Definir zonas operativas (por ejemplo, "Zona Norte", "Zona Sur") y especificar la latitud, longitud y radio exactos (en km) para la asignación automática de paquetes.

### 3. Análisis y Reportes
* **Rendimiento de la Empresa:** Ver los KPIs globales de la empresa, incluyendo el total de paquetes entregados, tiempos de entrega y eficiencia general.
* **Comparación de Sucursales:** Comparar el rendimiento de diferentes coordinadores y zonas.

### 4. Configuración de la Empresa
* **Gestión del Perfil:** Actualizar los detalles de la empresa, información de contacto y horarios operativos.
* **Integraciones API:** (Si aplica) Gestionar las URLs de webhooks y las claves de integración de terceros para los sistemas ERP de la empresa.

## Acceso a la Interfaz de Usuario
El Administrador accede a las rutas protegidas `/admin`. Su panel prioriza la salud de la flota, las configuraciones del mapa de rutas y los reportes logísticos a nivel macro.

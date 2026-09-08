# Coordinador - Documentación del Rol

## Resumen
El Coordinador es el corazón operativo del flujo logístico. Ubicado en los centros de distribución o bodegas, este rol es responsable de procesar los paquetes entrantes, gestionar la flota activa de conductores y asegurar que todos los paquetes sean despachados de manera eficiente.

## Responsabilidades y Características Clave

### 1. Registro y Escaneo de Paquetes
* **Procesamiento de Entrada:** Escanear códigos QR en los paquetes entrantes para registrarlos en el sistema.
* **Geocercas Automáticas:** Cuando se registra un paquete, el Coordinador confía en el sistema para emparejar automáticamente la dirección del paquete con una Ruta definida (creada por el Administrador).

### 2. Gestión de Asignaciones (Vista Kanban/Lista)
* **Paquetes sin Asignar (Pendientes):** Monitorear el panel de "Asignaciones Pendientes" para ver los paquetes que ingresaron al sistema pero no tenían un conductor disponible al momento del registro (`status: 'pending_assignment'`).
* **Asignación Manual:** Seleccionar un paquete no asignado, revisar su ruta sugerida, elegir un conductor activo de la flota y confirmar manualmente la asignación.

### 3. Gestión de Etiquetas QR
* **Etiquetas Temporales:** Imprimir y pegar etiquetas QR temporales (marcadas en color ámbar con un distintivo "Unassigned") para los paquetes que esperan en la bodega.
* **Etiquetas Finales:** Reimprimir o generar las etiquetas QR definitivas una vez que se ha asignado un conductor.

### 4. Monitoreo de la Flota de Conductores
* **Estado Activo:** Ver qué conductores están actualmente en línea, sus rutas asignadas y su progreso de entrega actual.
* **KPIs de Conductores:** Acceder a reportes específicos sobre el rendimiento de los conductores, tiempos promedio de entrega y tasas de éxito.

## Acceso a la Interfaz de Usuario
El Coordinador accede a las rutas protegidas `/coordinator`. Sus herramientas principales son el **Escáner de Paquetes**, el **Panel de Asignaciones** y el **Monitor de Flota Activa**.

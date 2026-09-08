# Conductor (Motorizado) - Documentación del Rol

## Resumen
El Conductor (Motorizado) es el operador de campo responsable de la entrega física de los paquetes. Este rol utiliza una interfaz diseñada principalmente para dispositivos móviles (Mobile-First) pensada para interacciones rápidas, navegación clara y actualizaciones de estado inmediatas mientras está en la ruta.

## Responsabilidades y Características Clave

### 1. Ejecución de Entregas
* **Ruta Asignada:** Ver la lista de paquetes asignados para el día o lote actual (`GET /v1/delivery/my-deliveries`).
* **Navegación:** Acceder a la dirección completa, los detalles del destinatario y los enlaces de mapas integrados (por ejemplo, Google Maps o Waze) para navegar hacia el destino.

### 2. Actualización de Estados
* **Confirmación de Entrega:** Actualizar el estado de un paquete a `delivered` (entregado) tras una entrega exitosa.
* **Manejo de Excepciones:** (Si está configurado) Reportar intentos fallidos de entrega (por ejemplo, "Cliente no estaba en casa", "Dirección incorrecta") y dejar observaciones.

### 3. Gestión de Turnos
* **Alternar Estado Activo:** Marcarse a sí mismos como "Activo" o "Inactivo" para que el sistema y el Coordinador sepan si están disponibles para recibir asignaciones automáticas o manuales.

### 4. Historial y Métricas
* **Historial de Entregas:** Ver las entregas pasadas y las rutas completadas.
* **KPIs Personales:** Rastrear el progreso diario (por ejemplo, "15/20 paquetes entregados hoy").

## Acceso a la Interfaz de Usuario
El Conductor accede a las rutas protegidas `/driver`. La interfaz de usuario está estrictamente optimizada para dispositivos móviles, presentando objetivos táctiles grandes, alto contraste y listas simplificadas para garantizar la seguridad y eficiencia mientras están en movimiento. **No** tienen acceso a paquetes sin asignar ni a configuraciones del sistema.

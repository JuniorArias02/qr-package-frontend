# Recomendaciones para Agentes de IA y Desarrolladores

Estas mejores prácticas están diseñadas para desarrolladores y agentes de IA que trabajan en este código base para mantener la consistencia, prevenir regresiones y alinearse con la arquitectura modular.

## 🧭 Directrices Generales

### 1. Respetar los Límites del Dominio Modular
* Siempre mantenga las características dentro de sus respectivas carpetas de dominio en `src/domains/<nombre-del-dominio>/`.
* Un dominio (ej., `packages`) **NO DEBE** importar componentes internos o archivos internos directamente desde otro dominio (ej., `users`).
* La comunicación entre dominios debe ocurrir a través de:
  1. Configuración/utilidades compartidas en `src/core/`.
  2. Hooks o contextos de estado expuestos públicamente.

### 2. Separación de Preocupaciones (UI vs. Lógica)
* **Componentes Visuales (`.jsx`)**: Solo deben manejar el diseño (layout), el estilo de la UI y los estados de visualización simples (ej., modales abiertos/cerrados, pestañas activas).
* **Lógica de Negocio / Llamadas API**: Debe delegarse completamente a los **Servicios TypeScript** del dominio (`.ts`).
* **Gestión de Estado**: No cree estados locales complejos cuando afecte a otras partes de la aplicación. Utilice contextos o hooks personalizados en su lugar.

### 3. Nunca Evadir el Sistema de Diseño
* **Verifique primero los Componentes Compartidos**: Antes de construir un botón, tarjeta, campo de entrada o contenedor de diseño, verifique si ya existe un componente global.
* **Sin Clases Tailwind Crudas que Desvíen el Estilo**: No utilice espaciados personalizados o colores que difieran de los tokens del sistema de diseño definidos en las reglas principales (`project-rules.md`).

### 4. Tolerancia Cero para Texto Genérico/Relleno
* **Sin Texto Falso**: Nunca inserte generadores de texto falso (como "Lorem Ipsum", "test", o marcadores obvios) en los diseños de UI.
* **Escriba Texto Listo para Producción en Inglés**: El texto estático y los datos simulados deben leerse como si estuvieran escritos para la versión final del producto y **siempre en Inglés**. Use alertas de paquetes reales (ej., "Package has been delivered"), direcciones y errores descriptivos (ej., "Invalid tracking code") en lugar de "an error occurred".

---

## 🤖 Instrucciones para Asistentes de Codificación IA (como Antigravity)

1. **Verificar Archivos Primero**: Antes de crear nuevos componentes o escribir solicitudes API, inspeccione las carpetas existentes para ver si hay plantillas preexistentes o singletons.
2. **Ubicación Estricta de Archivos**:
   - La UI va a `src/domains/<dominio>/components/` o `src/domains/<dominio>/pages/`.
   - Las APIs van a `src/domains/<dominio>/services/`.
   - Los Tipos van a `src/domains/<dominio>/types/`.
3. **No Sobrescribir Configuraciones Centrales (Core)**: No cambie las configuraciones de Axios, estructuras de enrutamiento principales (`src/router/`), o configuraciones globales de Tailwind a menos que se solicite explícitamente.
4. **Desarrollo Interactivo**: Asegúrese de que los componentes tengan clases de transición suaves (`transition-all duration-300`) y efectos de escala/hover (`hover:scale-[1.02]`, `active:scale-95`) en elementos interactivos para preservar el estilo "Modern Premium".
5. **No Usar Andamiaje de Copywriting por IA**: Nunca produzca `Lorem Ipsum`, `test test`, o nombres ficticios por defecto (ej., "John Doe"). Cualquier elemento UI que genere debe tener un copywriting de negocios de alta calidad y consciente del contexto que se alinee perfectamente con el software de QR Package.


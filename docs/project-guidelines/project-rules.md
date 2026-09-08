# QR Package - Directrices del Proyecto y Reglas Empresariales

## 🎯 1. Objetivo y Resumen de la Arquitectura
Este documento define los estándares de desarrollo estrictos para el frontend de QR Package. El proyecto está construido usando **React + Vite + TypeScript** y sigue una **Arquitectura de Dominio Modular / Basada en Características (Features)**. Esto asegura que cada característica de negocio sea aislada, escalable e independientemente mantenible. **Todo el código, así como los textos visibles en el diseño de la página web (UI copy), deben estar estrictamente en Inglés (US).**

### El Enfoque de Dominio Basado en Características:
En lugar de agrupar por tipo de archivo (ej., todos los componentes juntos, todos los hooks juntos), agrupamos por **Dominio** (Característica). Un Dominio es un módulo independiente que contiene todo lo que necesita para funcionar.

1. **`src/domains/`**: El núcleo de la aplicación. Cada carpeta aquí representa un dominio de negocio (ej., `superAdmin`, `users`, `packages`).
   - Cada dominio es autónomo con sus propios `components`, `pages`, `hooks`, `services`, `utils` y `routers`.
   - Los dominios pueden contener submódulos para características complejas.
2. **`src/core/`**: Configuración global y lógica que trasciende cualquier dominio individual. Incluye configuración de Axios, autenticación y utilidades globales.
3. **`src/layouts/`**: Envoltorios principales de la UI (ej., `Layout`, `Sidebar`, `Navbar`) que enmarcan la aplicación.
4. **`src/router/`**: El enrutador global que une los enrutadores de los dominios independientes.

---

## 📁 2. Estructura de Archivos y Carpetas

```text
src/
├── core/                   # Configuración Global
│   ├── api/                # Configuración de Axios e interceptores
│   ├── auth/               # Contextos de autenticación, manejo de tokens
│   └── utils/              # Helpers globales
├── layouts/                # Sistema de Layout Core (Diseño)
│   ├── Layout.jsx          # Envoltorio principal (Outlet)
│   ├── Sidebar.jsx
│   └── Navbar.jsx
├── router/                 # Enrutador Principal
│   └── AppRouter.jsx       # Importa y fusiona los enrutadores de dominio
├── domains/                # Módulos Basados en Características
│   ├── auth/               # Ejemplo: Dominio de Autenticación
│   ├── superAdmin/         # Ejemplo: Dominio de Super Administrador
│   │   ├── components/     # UI específica de superAdmin
│   │   ├── pages/          # Vistas (ej., CompanyFormList.jsx)
│   │   ├── hooks/          # Hooks específicos
│   │   ├── services/       # Llamadas API (Singletons en TypeScript)
│   │   ├── utils/          # Helpers 
│   │   └── routers/        # Rutas del dominio (ej., superAdminRouter.jsx)
│   └── packages/           # Ejemplo: Dominio de Paquetes
├── App.tsx
└── main.tsx
```

---

## 🧠 3. Organización del Código y Mejores Prácticas

1. **Dominios Autónomos**: 
   - Un dominio no debe depender profundamente de los archivos internos de otro dominio. La comunicación cruzada debe ocurrir a través de utilidades compartidas en `core` o APIs/servicios expuestos del dominio.
2. **Extensiones de Archivos**: 
   - **UI (Pages, Components, Layouts)**: Deben usar `.jsx`.
   - **Lógica (Services, Types, Configs)**: Deben usar `.ts`.
   - **Contexts/Hooks que retornan JSX**: Deben usar `.tsx`.
3. **Separación de Lógica y UI**: 
   - Los componentes visuales (`.jsx`) **NO DEBEN** contener lógica de negocio compleja ni llamadas directas a la API.
   - Todas las interacciones con la API **DEBEN** pasar por Servicios Singleton dentro de la carpeta `services` del dominio.
4. **Gestión de Estado**: 
   - Use `Context API` solo para estados globales o profundamente compartidos (ej., Autenticación, Rutas Globales).
5. **Evite Textos de Relleno Generados por IA / Genéricos**:
   - **SIN Lorem Ipsum ni Nombres Genéricos**: No utilice marcadores de posición genéricos como "Lorem Ipsum", "test", "demo", o nombres como "John Doe" / "Jane Smith".
   - **Datos Falsos Realistas**: Si los datos de la API aún no están disponibles, cualquier dato de respaldo debe representar texto del dominio realista y específico del contexto (ej., direcciones de entrega reales en Colombia, IDs de rastreo reales como `QR-983-20A`, estados de paquetes realistas).
   - **Sin Plantillas Obvias de IA**: Evite plantillas de texto perezosas que parezcan generadas por IA. Haga que cada etiqueta, consejo y descripción se lea como un producto final.

---

## ✨ 4. Identidad Visual y Sistema de Diseño

Nuestra aplicación debe lucir **Moderna y Premium**, adaptada para la claridad y facilidad de uso.

### 🎨 Paleta de Colores:
- **Identidad Principal (Violeta/Índigo)**: Usado para branding, acciones principales y el toque premium.
  - **Degradado Principal**: `from-violet-600 via-purple-600 to-indigo-700`
  - **Fondos**: `bg-violet-50` (suave), `bg-violet-600` (fuerte)
  - **Textos/Iconos**: `text-violet-600`, `text-indigo-700`
- **Uso Semántico**:
  - 🟢 **Éxito (Esmeralda/Verde)**: `text-emerald-600`, `bg-emerald-50` (Entregas completadas)
  - 🟠 **Advertencia (Ámbar/Naranja)**: `text-amber-600`, `bg-amber-50` (Tareas pendientes)
  - 🔵 **Información (Cian/Azul)**: `text-blue-600`, `bg-blue-50` (Estadísticas, Escaneo)
  - 🔴 **Error (Rojo/Rosa)**: `text-rose-600`, `bg-rose-50` o `bg-red-50` (Acciones fallidas, errores de input)
- **Neutros (Pizarra / Slate)**: Usados para profundidad profesional y jerarquía.
  - **Encabezados**: `text-slate-900`
  - **Texto del Cuerpo**: `text-slate-600`
  - **Texto Sutil/Etiquetas**: `text-slate-400` u `text-slate-500`
  - **Fondo de la App**: `bg-slate-50`
  - **Bordes**: `border-slate-100` o `border-slate-200`

### ✍️ Tipografía:
- **Encabezados**: Extra-negrita (`font-bold` a `font-black`). Use `text-3xl` o `text-4xl` para títulos de páginas.
- **Cuerpo**: Peso estándar para legibilidad (`font-medium`).
- **Códigos/Datos**: Se usa `font-mono` para referencias QR e identificadores técnicos para evitar confusión de caracteres.

### 📱 Formas y Diseño (Layout):
- **Esquinas Extra Redondeadas**: Usamos `rounded-2xl`, `rounded-3xl` y `rounded-[2.5rem]` para tarjetas, menús y campos de entrada para crear una sensación amigable y moderna.
- **UI Basada en Tarjetas (Cards)**: La información se agrupa en tarjetas blancas con bordes sutiles y sombras suaves (`shadow-sm`, `shadow-md`, o `shadow-lg shadow-slate-200/50`).
- **Glassmorfismo (Efecto Cristal)**: Use `backdrop-blur-md` a `backdrop-blur-2xl` y fondos semitransparentes (ej., `bg-white/80`) para paneles flotantes (Sidebar, Navbar) y superposiciones.

### 🛠 Reglas de Diseño de Componentes:
- **Botones**: Acolchado grande (`py-3` o `py-4`), texto en negrita y un ligero efecto de escala al pasar el cursor (`hover:scale-[1.02]`) o estado activo (`active:scale-95`).
- **Inputs**: Fondos limpios (`bg-slate-50/50`) con bordes gruesos (`border-2`) que brillan al enfocar (`focus:ring-4 focus:ring-violet-500/10`).
- **Dashboards**: Cuadrículas modulares con números grandes e iconos claros.

### 🌊 Movimiento e Interacción:
- **Micro-animaciones**: Efectos sutiles de escala en tarjetas, iconos y botones para que la interfaz se sienta viva.
- **Fondos de Manchas (Blobs)**: Formas abstractas animadas (`animate-blob`) en el fondo para añadir interés visual.
- **Cambios de Estado**: Transiciones suaves (`transition-all duration-300`) para colores, sombras y posiciones.

> **Regla de Oro**: Utilice componentes compartidos predefinidos siempre que sea posible. Nunca use clases de Tailwind crudas para construir botones estándar o inputs directamente dentro de las vistas de dominio si ya existe un componente reutilizable, y asegúrese de que todo respete la estética "Modern Premium".


# Pila Tecnológica (Stack) y Dependencias

Este documento detalla las tecnologías, herramientas y bibliotecas principales utilizadas en la aplicación frontend de **QR Package**.

## 💻 Stack Frontend

### Tecnologías Principales
* **Framework**: [React](https://react.dev/) (V18+)
* **Herramienta de Construcción (Build Tool)**: [Vite](https://vitejs.dev/) (para un servidor de desarrollo rápido y un empaquetado/bundle optimizado)
* **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) (para seguridad de tipos robusta en servicios, lógica y modelos)
* **Estructura UI**: [JSX / JavaScript](https://react.dev/learn/writing-markup-with-jsx) (utilizado específicamente para páginas visuales y plantillas de componentes)

### Sistema de Estilo y Diseño
* **Motor**: [Tailwind CSS](https://tailwindcss.com/) (Framework de estilos "Utility-first")
* **Iconos**: [Lucide React](https://lucide.dev/) (Para iconos premium y consistentes)
* **Temas y Tipografía**: Fuentes de Google (Inter / Mono) configuradas a través de Tailwind.

### Integración de API y Estado
* **Cliente HTTP**: [Axios](https://axios-http.com/) (Instancia singleton centralizada con interceptores de solicitud/respuesta en `src/core/api/`)
* **Manejo de Estado**: [React Context API](https://react.dev/reference/react/createContext) (Para estados globales como Autenticación y Rutas)
* **Enrutamiento**: [React Router DOM](https://reactrouter.com/) (Arquitectura de enrutamiento centralizada y basada en roles)

---

## ⚙️ Entorno de Desarrollo

* **Gestor de Paquetes**: `pnpm`
* **Servidor de Desarrollo**: `pnpm run dev`
* **Comando de Construcción (Build)**: `pnpm run build`

---

## 🔌 Capa de API e Integración (Laravel REST API)

El frontend se comunica con una API REST en Laravel que implementa:
* **Autenticación**: JWT (JSON Web Tokens)
* **Gestión de Roles**: Roles predefinidos (Admin, Coordinador, Conductor) enviados en el payload del usuario para renderizar diseños dinámicos y autorizar rutas.

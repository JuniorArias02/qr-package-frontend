# Technology Stack & Dependencies

This document details the main technologies, tools, and libraries utilized in the **QR Package** frontend application.

## 💻 Frontend Stack

### Core Technologies
* **Framework**: [React](https://react.dev/) (V18+)
* **Build Tool**: [Vite](https://vitejs.dev/) (for fast development server and optimized bundle)
* **Language**: [TypeScript](https://www.typescriptlang.org/) (for robust type safety in services, logic, and models)
* **UI Structure**: [JSX / JavaScript](https://react.dev/learn/writing-markup-with-jsx) (specifically used for visual pages and component templates)

### Styling & Design System
* **Engine**: [Tailwind CSS](https://tailwindcss.com/) (Utility-first styling framework)
* **Icons**: [Lucide React](https://lucide.dev/) (For consistent premium icons)
* **Themes & Typography**: Built-in Google Fonts (Inter / Mono fonts) configured through Tailwind.

### API Integration & State
* **HTTP Client**: [Axios](https://axios-http.com/) (Centralized singleton instance with request/response interceptors in `src/core/api/`)
* **State Management**: [React Context API](https://react.dev/reference/react/createContext) (For global states like Auth and Routes)
* **Routing**: [React Router DOM](https://reactrouter.com/) (Centralized, role-based routing architecture)

---

## ⚙️ Development Environment

* **Package Manager**: `pnpm`
* **Development Server**: `pnpm run dev`
* **Build Command**: `pnpm run build`

---

## 🔌 API & Integration Layer (Laravel REST API)

The frontend communicates with a Laravel REST API which implements:
* **Authentication**: JWT (JSON Web Tokens)
* **Role Management**: Pre-defined roles (Admin, Coordinator, Driver) sent in the user payload to dynamic-render layouts and authorize routes.

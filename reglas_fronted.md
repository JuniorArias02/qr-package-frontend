# Frontend – React + Vite + TypeScript (Arquitectura y Reglas)

## 🎯 Objetivo
Desarrollar un frontend moderno en **React + Vite + TypeScript**, con **TailwindCSS**, arquitectura modular por carpetas según roles y manejo global de **autenticación con JWT** consumiendo una API REST en Laravel.

Este documento define **cómo organizar el código y manejar la lógica**, incluyendo módulos independientes por rol y contextos para módulos compartidos como rutas.

---

## ⚙️ Stack Tecnológico
- React
- Vite
- TailwindCSS
- TypeScript (para services y types)
- JSX (para components y pages)
- Axios
- Context API
- JWT (desde backend)

---

## 🧱 Arquitectura General
- La app está organizada **por roles** dentro de `views`: `admin`, `coordinator`, `driver`.
- Cada rol contiene **módulos**, cada uno con:
  - `services` → lógica y llamadas a la API en **TypeScript**
  - `pages` → vistas en **.jsx**
  - `components` → UI reutilizable en **.jsx**
  - `types` → definiciones TypeScript
  - Subcarpetas opcionales según necesidad (`coordinator/`, `driver/`)
- **No lógica en componentes visuales**
- **Services** usan **TypeScript + singleton**
- **Context** solo para estado global o módulos compartidos (ej: rutas)

> Cada rol y módulo es independiente, para facilitar escalabilidad y mantenimiento.

---

## 📁 Estructura Principal

```text
src/
├── api/
│   └── axios.ts
├── contexts/
│   ├── AuthContext.tsx
│   ├── AuthProvider.tsx
│   └── RutasContext.tsx       # contexto global para rutas
├── hooks/
├── routes/
│   └── AppRoutes.tsx
├── utils/
├── views/
│   ├── admin/
│   │   ├── users/             # módulo de usuarios
│   │   │   ├── services/      # .ts
│   │   │   ├── pages/         # list, create, edit.jsx
│   │   │   ├── components/    # UI específica .jsx
│   │   │   └── types/         # .ts
│   │   └── routes/            # módulo de rutas (usa RutasContext)
│   │       ├── services/      # .ts (opcional)
│   │       ├── pages/         # list, map.jsx
│   │       ├── components/    # UI .jsx
│   │       └── types/         # .ts
│   ├── coordinator/
│   │   ├── deliveries/        # módulo de entregas
│   │   │   ├── services/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   └── types/
│   │   └── ...
│   └── driver/
│       ├── packages/          # módulo de paquetes
│       │   ├── services/
│       │   ├── pages/
│       │   ├── components/
│       │   └── types/
│       └── ...
├── App.tsx
└── main.tsx
```

---

## 🔄 Servicios con TypeScript
- Cada módulo mantiene **services** que:
  - Llaman a la API usando Axios
  - Devuelven **tipos fuertemente tipados**
  - Mantienen lógica de negocio
  - Se exportan como **singleton**
- Módulos compartidos como rutas pueden tener un service propio, pero el **estado principal se maneja desde RutasContext**.

Ejemplo `AuthService`:

```ts
import api from '../../api/axios'
import { AuthResponse, User } from '../types/auth.types'

class AuthService {
    async login(email: string, password: string): Promise<AuthResponse> { ... }
    async register(data: any): Promise<AuthResponse> { ... }
    async logout(): Promise<void> { ... }
    async getProfile(): Promise<User> { ... }
    async updateProfile(name: string, email: string) { ... }
}

export default new AuthService()
```

---

## 🧩 Uso de Types
- Cada módulo tiene **types** para usuarios, roles, permisos, respuestas API, rutas, entregas, etc.
- Ejemplo `User`:

```ts
export enum UserRole {
    ADMIN = 'admin',
    COORDINATOR = 'coordinator',
    DRIVER = 'driver'
}

export enum UserPermission {
    SCAN_PACKAGES = 'scan_packages',
    CREATE_PACKAGES = 'create_packages',
    VIEW_PACKAGES = 'view_packages',
    ASSIGN_PACKAGES = 'assign_packages'
}

export interface User {
    id: number
    name: string
    email: string
    role: UserRole
    permissions: UserPermission[]
    created_at: string
    updated_at: string
}
```

---

## 🔐 Contextos Globales
- **AuthContext** → usuario, token JWT, login/logout, protección de rutas.
- **RutasContext** → estado compartido de rutas, filtros y asignaciones.
- Cualquier **page o component** puede consumirlos con `useContext`.
- Se recomienda combinar **services + context** para mantener la lógica separada y tipada.

Ejemplo `RutasContext`:

```ts
import { createContext, useState, useContext, ReactNode } from 'react'

interface Ruta { id: number; name: string; status: string }
interface RutasContextType {
    rutas: Ruta[]
    setRutas: (r: Ruta[]) => void
}

const RutasContext = createContext<RutasContextType | undefined>(undefined)

export const RutasProvider = ({ children }: { children: ReactNode }) => {
    const [rutas, setRutas] = useState<Ruta[]>([])
    return (
        <RutasContext.Provider value={{ rutas, setRutas }}>
            {children}
        </RutasContext.Provider>
    )
}

export const useRutas = () => {
    const context = useContext(RutasContext)
    if (!context) throw new Error('useRutas must be inside RutasProvider')
    return context
}
```

---

## 🔗 Rutas
- Centralizadas en `routes/AppRoutes.tsx`
- Separadas por **roles y permisos**
- Ejemplo:
  - `/login` → pública
  - `/dashboard` → privada
  - `/admin/users` → solo administradores
- Se valida JWT y roles antes de renderizar

---

## 🧠 Reglas del Proyecto
1. **Services = única fuente de llamadas API**  
2. **Context solo para estado global o módulos compartidos**  
3. **No lógica en components ni pages**  
4. Código modular, escalable y reusable  
5. Tailwind solo para estilos visuales  
6. Todos los services usan **TypeScript + singleton**  
7. Los módulos deben contener sus propios types  
8. Cada rol dentro de `views` tiene independencia lógica y visual  
9. **Pages y Components siempre en .jsx**  
10. **Services y Types siempre en .ts**

---

## 🚀 Escalabilidad
- Fácil agregar nuevos módulos por rol  
- Reutilización de services y components  
- Compatible con crecimiento del proyecto sin refactor pesado  
- Módulos compartidos (ej: rutas) facilitan consistencia y estado global

---

## ✍️ Nota Final
> La arquitectura asegura **modularidad**, **tipado fuerte**, **contextos para módulos compartidos**, y **reutilización de lógica**, mientras mantiene **JSX para UI**, facilitando mantenimiento, testing y escalabilidad.
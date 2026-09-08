# Convenciones del Proyecto

Este documento describe los estándares de codificación, las convenciones de nomenclatura y los patrones que todo el desarrollo (incluidos los agentes de IA) debe seguir.

## 🔤 Convenciones de Nomenclatura

### 📁 Archivos y Carpetas
* **Componentes de React, Páginas y Layouts (Diseños)**: PascalCase (ej., `UserList.jsx`, `AppRouter.jsx`, `Layout.jsx`).
* **Lógica, Servicios, Tipos y Utilidades**: camelCase o minúsculas (ej., `authService.ts`, `axios.ts`, `user.types.ts`).
* **Configuración de Rutas**: camelCase (ej., `usersRoutes.jsx`).

### 🏷️ Identificadores de Código
* **Componentes y Contextos de React**: PascalCase (ej., `UserCard`, `AuthContext`).
* **Variables y Funciones**: camelCase (ej., `fetchPackages`, `userData`).
* **Constantes**: UPPER_SNAKE_CASE (ej., `API_BASE_URL`, `USER_ROLES`).
* **Tipos / Interfaces / Enums**: PascalCase (ej., `interface User`, `enum UserRole`).

---

## 📄 Extensiones y Formatos de Archivos

* **`.jsx`**: Archivos visuales de UI (Páginas, Componentes y Layouts). No escriba sintaxis de TypeScript en estos archivos.
* **`.ts`**: Archivos de lógica pura (Servicios, Utilidades, configuraciones, tipos). No se permite JSX.
* **`.tsx`**: Contextos, Proveedores, o custom hooks (ganchos personalizados) que devuelvan elementos JSX.

---

## 🌐 Regla de Idioma
* **Inglés (US) Estricto para Código y UI**: Todo el código (variables, funciones, clases), los comentarios en el código, **y todos los textos visibles para el usuario en la interfaz web (UI copy / diseño)** deben estar escritos estrictamente en **Inglés (US)**. La documentación interna del proyecto (como este archivo) puede estar en español.

---

## 🛠️ Estilo de Código y Patrones

### 1. Servicios Singleton para Llamadas a la API
Todas las solicitudes de API deben pasar por servicios específicos del dominio exportados como Singletons:
```ts
class ExampleService {
    async getItems(): Promise<Item[]> {
        const response = await api.get('/items');
        return response.data;
    }
}
export default new ExampleService(); // Instancia Singleton
```

### 2. Organización de Importaciones
Siempre agrupe las importaciones en el siguiente orden:
1. React y hooks estándar.
2. Bibliotecas de terceros (ej., Axios, iconos de Lucide).
3. Servicios centrales (core), contextos o utilidades (importaciones relativas desde `src/core/...`).
4. Servicios de dominio locales, hooks, tipos o componentes.
5. Activos (assets) y estilos.

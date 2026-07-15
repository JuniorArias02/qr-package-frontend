# Project Conventions

This document outlines the coding standards, naming conventions, and patterns that all development (including AI agents) must follow.

## 🔤 Naming Conventions

### 📁 Files and Folders
* **React Components, Pages, and Layouts**: PascalCase (e.g., `UserList.jsx`, `AppRouter.jsx`, `Layout.jsx`).
* **Logic, Services, Types, and Utils**: camelCase or lowercase (e.g., `authService.ts`, `axios.ts`, `user.types.ts`).
* **Routes Configuration**: camelCase (e.g., `usersRoutes.jsx`).

### 🏷️ Code Identifiers
* **React Components & Contexts**: PascalCase (e.g., `UserCard`, `AuthContext`).
* **Variables & Functions**: camelCase (e.g., `fetchPackages`, `userData`).
* **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`, `USER_ROLES`).
* **Types / Interfaces / Enums**: PascalCase (e.g., `interface User`, `enum UserRole`).

---

## 📄 File Extensions & Formats

* **`.jsx`**: Visual UI files (Pages, Components, and Layouts). Do not write TypeScript syntax in these files.
* **`.ts`**: Pure logic files (Services, Helper utilities, configurations, types). No JSX allowed.
* **`.tsx`**: Contexts, Providers, or custom hooks that return JSX elements.

---

## 🌐 Language Rule
* **Strict US English**: All code (variables, functions, classes), comments, and documentation must be written strictly in **English (US)**.

---

## 🛠️ Code Style & Patterns

### 1. Singleton Services for API Calls
All API requests must go through domain-specific services exported as Singletons:
```ts
class ExampleService {
    async getItems(): Promise<Item[]> {
        const response = await api.get('/items');
        return response.data;
    }
}
export default new ExampleService(); // Singleton Instance
```

### 2. Imports Organization
Always group imports in the following order:
1. React & standard hooks.
2. Third-party libraries (e.g., Axios, Lucide icons).
3. Core services, contexts, or utilities (relative imports from `src/core/...`).
4. Local domain services, hooks, types, or components.
5. Assets and styles.

# QR Package - Project Guidelines & Enterprise Rules

## 🎯 1. Objective and Architecture Overview
This document defines the strict development standards for the QR Package frontend. The project is built using **React + Vite + TypeScript** and follows a **Feature-Based / Modular Domain Architecture**. This ensures that each business feature is isolated, scalable, and independently maintainable. All code, comments, and documentation must be strictly in English (US).

### The Feature-Based Domain Approach:
Rather than grouping by file type (e.g., all components together, all hooks together), we group by **Domain** (Feature). A Domain is an independent module containing everything it needs to function.

1. **`src/domains/`**: The core of the application. Each folder here represents a business domain (e.g., `users`, `packages`, `deliveries`).
   - Each domain is self-contained with its own `components`, `pages`, `hooks`, `services`, `utils`, and `routers`.
   - Domains can contain submodules for complex features.
2. **`src/core/`**: Global configuration and logic that transcends any single domain. Includes Axios setup, authentication, and global utilities.
3. **`src/layouts/`**: Main UI wrappers (e.g., `Layout`, `Sidebar`, `Navbar`) that frame the application.
4. **`src/router/`**: The global router that stitches together the independent domain routers.

---

## 📁 2. File and Folder Structure

```text
src/
├── core/                   # Global Setup & Configurations
│   ├── api/                # Global Axios config and interceptors
│   ├── auth/               # Auth contexts, token management
│   └── utils/              # Global helpers
├── layouts/                # Core Layout System
│   ├── Layout.jsx          # Main application wrapper (Outlet)
│   ├── Sidebar.jsx
│   └── Navbar.jsx
├── router/                 # Main Application Router
│   └── AppRouter.jsx       # Imports and merges domain routers
├── domains/                # Feature-Based Modules
│   ├── auth/               # Example: Authentication Domain
│   ├── users/              # Example: Users Domain (Admin role focus)
│   │   ├── components/     # User-specific UI
│   │   ├── pages/          # User-related views (e.g., UserList.jsx)
│   │   ├── hooks/          # Hooks specific to users
│   │   ├── services/       # User API calls (TypeScript Singletons)
│   │   ├── utils/          # User helpers
│   │   └── routers/        # User routes (e.g., usersRoutes.jsx)
│   └── packages/           # Example: Packages Domain
├── App.tsx
└── main.tsx
```

---

## 🧠 3. Code Organization & Best Practices

1. **Self-Contained Domains**: 
   - A domain should not rely deeply on the internal files of another domain. Cross-domain communication should happen via shared `core` utilities or exposed domain APIs/services.
2. **File Extensions**: 
   - **UI (Pages, Components, Layouts)**: Must use `.jsx`.
   - **Logic (Services, Types, Configs)**: Must use `.ts`.
   - **Contexts/Hooks returning JSX**: Must use `.tsx`.
3. **Separation of Logic and UI**: 
   - Visual components (`.jsx`) **MUST NOT** contain complex business logic or direct API calls.
   - All API interactions **MUST** go through Singleton Services inside the domain's `services` folder.
4. **State Management**: 
   - Use `Context API` only for global or deeply shared state (e.g., Auth, Global Routes).
5. **Avoid Generic / Hardcoded AI Placeholder Copy**:
   - **NO Lorem Ipsum or Generic Names**: Do not use generic placeholders like "Lorem Ipsum", "test", "demo description", or names like "John Doe" / "Jane Smith" for actual interface states.
   - **Realistic Mock Data**: If API data is not yet available, any mock/fallback data must represent realistic, context-specific domain text (e.g., real delivery addresses in Colombia, actual tracking IDs like `QR-983-20A`, realistic package statuses, and actual department names).
   - **No Obvious AI Templates**: Avoid lazy text templates that scream "AI-generated placeholder" just to fill layout spaces. Make every label, tip, and description read like a finished product copy.

---

## ✨ 4. Visual Identity & Design System

Our application must look **Modern and Premium**, tailored for clarity and ease of use in the field.

### 🎨 Color Palette:
- **Primary Identity (Violet/Indigo)**: Used for branding, main actions, and the premium feel.
  - **Main Gradient**: `from-violet-600 via-purple-600 to-indigo-700`
  - **Backgrounds**: `bg-violet-50` (soft), `bg-violet-600` (bold)
  - **Text/Icons**: `text-violet-600`, `text-indigo-700`
- **Semantic Usage**:
  - 🟢 **Success (Emerald/Green)**: `text-green-600`, `bg-green-50` (Completed Deliveries, successful actions)
  - 🟠 **Warning (Amber/Orange)**: `text-orange-600`, `bg-orange-50` (Pending Tasks, tips)
  - 🔵 **Info (Cyan/Blue)**: `text-cyan-600`, `bg-cyan-50` (Stats, Scanning)
  - 🔴 **Error (Red)**: `text-red-600`, `bg-red-50` (Failed Actions, input errors)
- **Neutrals (Slate)**: Used for professional depth and hierarchy.
  - **Headings**: `text-slate-900`
  - **Body Text**: `text-slate-600`
  - **Subtle Text/Labels**: `text-slate-400`
  - **App Background**: `bg-slate-50`
  - **Borders**: `border-slate-200`

### ✍️ Typography:
- **Headings**: Extra-bold (`font-bold` to `font-black`) with tight tracking. Use `text-3xl` or `text-4xl` for page titles.
- **Body**: Medium tracking, standard weight for readability (`font-medium`).
- **Codes/Data**: `font-mono` is used for QR references and technical identifiers to prevent character confusion.

### 📱 Shapes & Layout:
- **Extra Rounded Corners**: We use `rounded-2xl` and `rounded-3xl` for cards and inputs to create a friendly, modern feel.
- **Card-Based UI**: Information is grouped in white cards with subtle borders (`border-slate-200`) and soft shadows (`shadow-sm` or `shadow-md`).
- **Glassmorphism**: Use `backdrop-blur-md` and `bg-white/10` for login panels and overlays to create depth.

### 🛠 Component Design Rules:
- **Buttons**: Large padding (`py-4`), bold text, and a slight scale effect on hover (`hover:scale-[1.02]`) or active state (`active:scale-[0.98]`).
- **Inputs**: Clean white backgrounds with thick borders (`border-2`) that glow on focus (`focus:ring-4 focus:ring-violet-500/10`).
- **Dashboards**: Modular grids with large numbers and clear icons.

### 🌊 Motion & Interaction:
- **Micro-animations**: Subtle scale effects on cards and buttons to make the interface feel alive.
- **Blob Backgrounds**: Animated abstract shapes (`animate-blob`) in the background of authentication pages to add visual interest without being distracting.
- **State Changes**: Smooth transitions (`transition-all duration-200`) for colors and shadows.

> **Golden Rule**: Use predefined shared components whenever possible to ensure the Design System is universally applied. Never use raw Tailwind classes to build standard buttons or inputs directly inside domain views.


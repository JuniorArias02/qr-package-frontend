# AI Agent & Developer Recommendations

These best practices are designed for developers and AI agents working on this codebase to maintain consistency, prevent regressions, and align with the modular architecture.

## 🧭 General Guidelines

### 1. Respect Modular Domain Boundaries
* Always keep features within their respective domain folders in `src/domains/<domain-name>/`.
* A domain (e.g., `packages`) **MUST NOT** import internal components or internal files directly from another domain (e.g., `users`).
* Cross-domain communication must happen via:
  1. Shared configuration/utilities in `src/core/`.
  2. Publicly exposed hooks or state contexts.

### 2. Separation of Concerns (UI vs. Logic)
* **Visual Components (`.jsx`)**: Should only handle layout, UI styling, and simple display states (e.g., modals open/close, active tabs).
* **Business Logic / API Calls**: Should be delegated entirely to the domain's **TypeScript Services** (`.ts`).
* **State Management**: Do not create complex local states when it affects other parts of the application. Utilize contexts or custom hooks instead.

### 3. Never Bypass the Design System
* **Check Shared Components first**: Before building a button, card, input field, or layout container, check if a global component already exists.
* **No Raw Tailwind Classes**: Do not use custom spacing or colors that diverge from the design system tokens defined in the main guidelines (`project-rules.md`).

### 4. Zero Tolerance for Generic/Placeholder Copy
* **No Dummy Text**: Never insert dummy text generators (like "Lorem Ipsum", "test description", or obvious placeholders) in UI designs.
* **Write Production-Ready Copy**: Static copy and mock data must read as if they were written for the final product release. For example, use realistic package tracking alerts, realistic Colombia addresses (e.g., "Calle 100 #15-30, Bogotá"), and descriptive errors instead of "an error occurred".

---

## 🤖 Instructions for AI Coding Assistants (like Antigravity)

1. **Verify Files First**: Before creating new components or writing API requests, inspect the existing folders to check if there are pre-existing templates or singletons.
2. **Strict File Placement**:
   - UI goes to `src/domains/<domain>/components/` or `src/domains/<domain>/pages/`.
   - APIs go to `src/domains/<domain>/services/`.
   - Types go to `src/domains/<domain>/types/`.
3. **No Overwrites of Core Configurations**: Do not change Axios configurations, main routing structures (`src/router/`), or global Tailwind settings unless explicitly requested.
4. **Interactive Development**: Ensure components have smooth transition classes (`transition-all duration-200`) and scale/hover effects (`hover:scale-[1.02]`) on actionable items to preserve the "Modern Premium" style.
5. **No AI Copywriting Scaffolding**: Never output `Lorem Ipsum`, `test test`, or default mock names (e.g., "John Doe"). Any UI element you generate must have high-quality, context-aware business copywriting that aligns perfectly with the QR Package software suite.


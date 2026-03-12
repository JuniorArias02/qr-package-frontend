# QR Package - Design System & Visual Identity

This document outlines the visual standards and design philosophy for the **QR Package** platform. Our design is built to be modern, premium, and highly interactive, ensuring a professional experience for all user roles.

## 🎨 Color Palette

We use a curated set of colors based on the Tailwind CSS palette, with a focus on vibrant gradients and deep contrasts.

### 🟣 Primary Identity (Violet/Indigo)
Used for branding, main actions, and the "premium" feel.
- **Main Gradient**: `from-violet-600 via-purple-600 to-indigo-700`
- **Backgrounds**: `bg-violet-50` (soft), `bg-violet-600` (bold)
- **Text/Icons**: `text-violet-600`, `text-indigo-700`

### 🌈 Semantic Colors
Used to convey status and guide the user through different types of data.
- **Success (Emerald/Green)**: `text-green-600`, `bg-green-50`. Represents completed deliveries or successful actions.
- **Warning (Amber/Orange)**: `text-orange-600`, `bg-orange-50`. Used for pending tasks or tips.
- **Info (Cyan/Blue)**: `text-cyan-600`, `bg-cyan-50`. Used for general statistics and scanning.
- **Error (Red)**: `text-red-600`, `bg-red-50`. Used for failed deliveries or input errors.

### 🌑 Neutrals (Slate)
Used for professional depth and typography.
- **Headings**: `text-slate-900`
- **Body Text**: `text-slate-600`
- **Subtle Text/Labels**: `text-slate-400`
- **App Background**: `bg-slate-50`
- **Borders**: `border-slate-200`

---

## ✍️ Typography

The system prioritizes readability and hierarchy.
- **Headings**: Extra-bold (`font-bold` to `font-black`) with tight tracking. Use `text-3xl` or `text-4xl` for page titles.
- **Body**: Medium tracking, standard weight for readability (`font-medium`).
- **Codes/Data**: `font-mono` is used for QR references and technical identifiers to prevent character confusion.

---

## ✨ Design Style: "Modern Premium"

We follow several core principles to achieve a state-of-the-art look:

### 📱 Layout & Shapes
- **Extra Rounded Corners**: We use `rounded-2xl` and `rounded-3xl` for cards and inputs to create a friendly, modern feel.
- **Card-Based UI**: Information is grouped in white cards with subtle borders (`border-slate-200`) and soft shadows (`shadow-sm` or `shadow-md`).
- **Glassmorphism**: Login and welcome panels use `backdrop-blur-md` and `bg-white/10` to create layers and depth.

### 🛠 Components Design
- **Buttons**: Large padding (`py-4`), bold text, and a slight scale effect on hover (`hover:scale-[1.02]`) or active state (`active:scale-[0.98]`).
- **Inputs**: Clean white backgrounds with thick borders (`border-2`) that glow on focus (`focus:ring-4 focus:ring-violet-500/10`).
- **Dashboards**: Modular grids with large numbers and clear icons.

---

## 🌊 Motion & Interaction

An interface that "lives" encourages engagement.
- **Micro-animations**: Subtle scale effects on cards and buttons.
- **Blob Backgrounds**: Animated abstract shapes (`animate-blob`) in the background of authentication pages to add visual interest without being distracting.
- **State Changes**: Smooth transitions (`transition-all duration-200`) for colors and shadows.

---

## 🤔 Why this design?

1. **Clarity**: High-contrast typography and semantic colors make the platform easy to use for drivers in the field.
2. **Professionalism**: The premium violet palette builds trust with administrators and clients.
3. **Efficiency**: Large click targets (buttons/inputs) are optimized for mobile use during package scanning and delivery.
4. **Modernity**: By using current web design trends (gradients, rounded corners, blur), we ensure the system feels like a modern tool, not legacy software.

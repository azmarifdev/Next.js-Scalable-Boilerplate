---
name: ui-brand-guidelines
description: Applies the boilerplate's exact design system, styling classes, typography, dark/light themes, card configurations, input rules, and landing shell gradients defined in globals.css. Use this skill when constructing new visual pages, editing React UI layout components, styling Tailwind elements, or adding new features in Storybook.
---

# UI Visual Styling & Brand Identity

This skill governs the visual styling, theme configurations, colors, and layout guidelines of the Next.js Boilerplate. Follow this guide to ensure that new features, landing blocks, panels, and forms align perfectly with the premium dark/light theme definitions and CSS classes configured inside `src/styles/globals.css`.

---

## 🎨 Theme Colors & Visual Tokens

The boilerplate implements a highly modern, premium HSL/Hex color palette designed for high contrast and glassmorphism.

### 1. General Mode Colors

- **Light Theme Background**: `#ffffff` (cards, sidebar, topbar), with `#f8fafc` or `#f1f5f9` for subtle containers.
- **Dark Theme Background**: `#070513` (Landing home), `#0f172a` (Dashboard body), `#111827` (cards/sidebar).
- **Core Text colors**:
  - Light mode: Primary `#111827`, Secondary/Muted `#475569`.
  - Dark mode: Primary `#f8fafc`, Secondary/Muted `#94a3b8` / `#cbd5e1`.

### 2. Premium Landing & Auth Shell Gradients

The landing page and authentication screens leverage custom background glows:

- **`--landing-bg-start`**: `#090614` (dark) | `#ffffff` (light)
- **`--landing-bg-mid`**: `#070513` (dark) | `#fbf7ff` (light)
- **`--landing-bg-end`**: `#06040f` (dark) | `#f2f6ff` (light)
- **Blue Glow (`--landing-glow-blue`)**: `rgba(71, 85, 255, 0.22)` (dark) | `rgba(59, 130, 246, 0.16)` (light)
- **Pink Glow (`--landing-glow-pink`)**: `rgba(236, 72, 153, 0.16)` (dark) | `rgba(244, 114, 182, 0.14)` (light)
- **Auth Button Gradient**: `linear-gradient(135deg, #8b3dff 0%, #d946ef 48%, #fb7185 100%)` (triggers beautiful purple-to-pink glow).

---

## 🏗️ Reusable CSS Layout Classes

When creating custom pages or mockups, map your markup directly to these pre-configured classes:

### 1. Cards and Panels

- **Standard Card (`.card`)**: Enforces borders and `border-radius: 12px` (adjusts automatically between `#ffffff` and `#111827` based on active theme).
- **Auth Card (`.auth-card`)**: Max width `420px` with a glassmorphism backdrop filter, border, and light/dark theme color mixing.
- **Modal Overlay (`.modal-overlay` / `.modal-card`)**: Centered fixed z-index dialog container.

### 2. Forms & Inputs

- **Input fields (`.input`)**: Fully styled input borders, outline resets, focus states (`.input:focus`), error borders (`.input-error`), and help text placement (`.help-text`).
- **Button Primitives (`.btn`)**:
  - Primary button (`.btn-primary`): Dark Slate `#0f172a` (light mode) / Auth Gradient (auth screens).
  - Secondary button (`.btn-secondary`): Light Gray `#e2e8f0`.
  - Danger button (`.btn-danger`): Bright Red `#dc2626`.

### 3. Grid & Typography

- **Headings**: Sanitized to Poppins/Georgia fallback hierarchies.
- **Grids**: Use `.form-grid` or `.grid-two` for rapid grid creations, and `.stack` for standard gap-12 vertical flex items.
- **Table wrapper (`.table-wrap` / `.table`)**: Custom styled, overflow-x clean tables with smooth borders and light/dark mode properties.

---

## 💡 Visual Design Principles

1. **Leverage CSS Variables**: Do not use hardcoded hex values (like `#ffffff` or `#000000`) inside Tailwind classes unless absolutely necessary. Rely on custom properties (e.g. `var(--landing-text)`, `var(--landing-border)`) to ensure that dark and light themes toggle seamlessly.
2. **Micro-animations**: Incorporate subtle transitions on interactive states (e.g., hover lifts using `transform 0.2s ease` or opacity shifts).
3. **Typography Consistency**: Maintain clear spacing and hierarchy. Use class names like `.card-title`, `.card-subtitle`, `.text-title-sm`, `.text-title-xs` to bind text sizes securely.

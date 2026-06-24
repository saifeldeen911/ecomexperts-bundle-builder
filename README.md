# Bundle Builder

A multi-step bundle builder prototype with a live review panel, built with **React 19 + TypeScript + Vite**.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Live Preview

[https://ecomexperts-bundle-builder.vercel.app/](https://ecomexperts-bundle-builder.vercel.app/)

### Build for production

```bash
npm run build
npm run preview
```

## What It Does

A two-column experience for assembling a security system bundle:

- **Left column — Builder:** A 4-step accordion (cameras → plan → sensors → extra protection). Each step shows product cards with quantity steppers, variant selectors, and pricing. Steps can be opened and closed by clicking the header, with smooth CSS transitions.
- **Right column — Review panel:** A live summary grouped by category (Cameras, Sensors, Accessories, Plan) with editable quantity steppers, shipping, total, savings, and a Checkout button.

## Architecture

| Area | Approach |
|------|----------|
| **Data** | JSON source (`src/data/bundleData.json`) + typed TypeScript adapter for asset resolution |
| **State** | `useReducer` with typed actions for accordion, variant selection, and quantities |
| **Derived values** | Selected counts, review lines, totals, and savings are computed during render — not stored in state |
| **Components** | `AccordionStep`, `ProductCard`, `VariantSelector`, `QuantityStepper`, `ReviewPanel`, `ReviewLineItem` — all presentational with typed props |
| **Persistence** | `localStorage` via "Save my system for later" with versioned schema and defensive validation |
| **Styling** | CSS with custom properties for Figma colors, typography, and spacing; responsive breakpoints for tablet and mobile |

## Design Decisions

- **Variant quantities are independent.** Each color variant of a product tracks its own quantity. Switching variants doesn't reset anything — Red ×2 stays when you switch to Blue.
- **Review panel reflects all selected variants.** Every variant with quantity > 0 appears as its own line in the review panel.
- **No backend required.** All data is local. A small JSON file seeds the catalog and initial configuration.
- **Accordion toggle.** Steps open on click and close on re-click, with a smooth grid-template-rows CSS transition.
- **Persistence is explicit.** The "Save my system for later" link writes to localStorage; reload restores the saved configuration. Malformed or stale data is handled defensively.
- **Checkout is a placeholder.** The Checkout button is non-navigating as specified in the task requirements.

## Tech Stack

- React 19 with React Compiler
- TypeScript 5
- Vite 8
- CSS custom properties (no CSS framework)
- Gilroy + TT Norms Pro fonts

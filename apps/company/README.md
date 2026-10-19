# Corporate Marketing & Information Website

A premium corporate SaaS website for the hyperlocal multi-vendor platform, built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, DaisyUI, Framer Motion and Lucide React.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Build for production

```bash
npm run build
npm start
```

> Note: `npm run build` requires internet access on first build so Next.js
> can fetch the Poppins font from Google Fonts (via `next/font/google`).

## Pages

| Route            | Description                                   |
|-------------------|------------------------------------------------|
| `/`                | Home — problem, how it works, features, categories |
| `/for-retailers`   | Retailer-focused product page                  |
| `/for-customers`   | Customer-focused product page                  |
| `/platform`        | Full platform overview                          |
| `/about-us`        | Company story, values, roadmap                  |

Navbar and footer links route between these pages (not same-page anchors).

## Images

Place these files in `public/images/` — placeholders are included so the
site runs out of the box, but swap in your real assets:

- `lightLogo.png` — used on dark/transparent backgrounds (navbar when not
  scrolled, footer)
- `darkLogo.png` — used on white backgrounds (navbar once scrolled)
- `bannerImage.png` — Home hero banner visual
- `mobileImage.png` — Home hero + For Customers app-download phone mockup

## Project Structure

```
app/
  page.tsx                 — Home
  for-retailers/page.tsx   — For Retailers
  for-customers/page.tsx   — For Customers
  platform/page.tsx        — Platform
  about-us/page.tsx        — About Us
  layout.tsx               — root layout, Poppins font, SEO metadata
  globals.css               — Tailwind base + design-system utilities

components/
  layout/
    Navbar.tsx        — sticky navbar, logo swap on scroll, page routing
    Footer.tsx          — dark navy footer, links to dedicated pages

  ui/                   — shared primitives used across every page
    Button.tsx, SectionHeading.tsx, FeatureCard.tsx, TimelineCard.tsx,
    CategoryCard.tsx, GlassCard.tsx, CTASection.tsx, PageHero.tsx,
    FlowSteps.tsx, ColumnList.tsx, PhaseTimeline.tsx

  home/         — Home page sections
  retailers/    — For Retailers page sections
  customers/    — For Customers page sections
  platform/     — Platform page sections
  about/        — About Us page sections

public/
  images/   — logos, hero, and mockup images
  icons/    — custom SVG icons if needed
```

## Content

All page copy is sourced from the provided content docs (Home, For
Retailers, For Customers, Platform, About Us) and mapped 1:1 into the
matching sections above.

## Notes

- All sections are independent, reusable components.
- Motion is powered by Framer Motion with scroll-triggered reveals, hover
  lifts, and floating animations.
- Fully responsive from 320px up to large desktop/2K screens.

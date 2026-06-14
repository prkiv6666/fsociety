# FSOCIETY SERVICES — Landing Site

A modern, responsive landing site with a dark cyberpunk / hacker aesthetic:
black background, red neon accents, futuristic grid, glassmorphism cards,
glowing borders, film grain, floating particles, and smooth Framer Motion
animations.

## Tech stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS 3**
- **Framer Motion**
- **Lucide React** icons
- No backend required

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build

```bash
npm run build
npm run start
```

## Project structure

```
app/
  layout.tsx        # fonts + metadata, loads globals
  page.tsx          # composes all sections
  globals.css       # Tailwind + cyber utilities (grid, grain, metallic logo)
components/
  Background.tsx    # grid, glow circles, particles, grain
  Navbar.tsx        # responsive nav + mobile menu
  Hero.tsx          # brand lockup + CTAs
  Features.tsx      # 4 feature cards
  Stores.tsx        # store grid with region badges
  Services.tsx      # services grid
  Vouches.tsx       # vouches / proof panel
  WhyChooseUs.tsx   # trust reasons
  Contact.tsx       # final CTA
  Footer.tsx        # footer
  Logo.tsx          # CSS gothic wordmark + image drop-in slot
  Reveal.tsx        # scroll fade/slide-up wrapper
  SectionHeading.tsx
lib/
  data.ts           # stores, services, contact handle (single source of truth)
```

## Customizing

- **Telegram contact** — edit `TELEGRAM_HANDLE` / `TELEGRAM_URL` in `lib/data.ts`.
- **Stores / services / reasons** — edit the arrays in `lib/data.ts`.
- **Brand colors** — `tailwind.config.ts` (`base` + `neon` palettes).
- **Use the original logo image** — see `public/README-LOGO.txt`.

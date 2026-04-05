# AgencyAI Design System

Extracted from `wireframe-v2.html`. All UI implementation must follow these tokens.

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `bg` | `#fafaf9` | Page background |
| `bg-card` | `#ffffff` | Card surfaces |
| `bg-dark` | `#18181b` | Dark sections (hero card, CTA banner, chatbot preview) |
| `bg-dark-card` | `#27272a` | Cards inside dark sections |
| `text-primary` | `#18181b` | Headlines, body text |
| `text-secondary` | `#52525b` | Descriptions, supporting text |
| `text-muted` | `#a1a1aa` | Labels, metadata, footer |
| `accent` | `#10b981` | Primary accent (Emerald 500) |
| `accent-muted` | `#059669` | Hover state for accent |
| `accent-bg` | `rgba(16,185,129,0.06)` | Subtle accent backgrounds |
| `accent-border` | `rgba(16,185,129,0.15)` | Accent-tinted borders |
| `border` | `rgba(0,0,0,0.06)` | Default borders |
| `border-strong` | `rgba(0,0,0,0.10)` | Emphasized borders |

### Rules
- Max 1 accent color (Emerald). No secondary accent.
- No purple, violet, or indigo. Ever.
- No pure black (#000000). Use `#18181b` (Zinc 900).
- Dark sections use `#18181b` background, never pure black.

## Typography

| Element | Font | Size | Weight | Letter-spacing |
|---------|------|------|--------|----------------|
| H1 (hero) | Outfit | `clamp(2.75rem, 5vw, 3.75rem)` | 800 | -1.8px |
| H2 (section) | Outfit | `clamp(2rem, 3.5vw, 2.75rem)` | 800 | -1.2px |
| H3 (card) | Outfit | 22px | 700 | -0.4px |
| H4 (feature) | Outfit | 16px | 700 | -0.3px |
| Body | Outfit | 17px | 400 | -0.1px |
| Small/labels | Outfit | 13-14px | 500-600 | 0.1-0.3px |
| Section label | Outfit | 12px | 600 | 1.2px (uppercase) |

### Rules
- Font: Outfit (via `next/font`). No fallback to Inter, Roboto, or system fonts.
- No gradient text on headlines.
- Hierarchy through weight + tracking, not just size.
- Section labels: uppercase, 12px, emerald color, letter-spacing 1.2px.

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| Section padding | 96px vertical, 48px horizontal | All major sections |
| Card padding | 36-40px | Service cards, contact form card |
| Gap (grid) | 16-24px | Between cards, grid items |
| Mobile padding | 20px horizontal, 64px vertical | Below 640px |

### Rules
- VISUAL_DENSITY: 4 (art gallery mode). Generous whitespace.
- Section gaps are large and intentional.
- No cramped layouts.

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius` | 1.25rem (20px) | Cards, major containers |
| `radius-sm` | 0.625rem (10px) | Buttons, inputs, icon boxes |

### Rules
- No uniform large radius on everything.
- Buttons and inputs use smaller radius than cards.

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-card` | `0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)` | Default card elevation |
| `shadow-elevated` | `0 4px 12px rgba(0,0,0,0.06), 0 20px 40px rgba(0,0,0,0.04)` | Hover state, emphasis |

### Rules
- No neon glows or outer glow effects.
- Shadows are tinted to background hue, not generic black.
- Shadows appear on hover, not by default (capability cards).

## Motion

| Property | Value |
|----------|-------|
| Transition | `all 0.4s cubic-bezier(0.16, 1, 0.3, 1)` |
| Hover lift | `translateY(-2px)` to `translateY(-3px)` |
| Active press | `translateY(0) scale(0.98)` |
| Breathing dot | `opacity 1→0.4→1, 2.4s ease-in-out infinite` |

### Rules
- MOTION_INTENSITY: 6. Fluid CSS transitions.
- No linear easing. Always cubic-bezier.
- Animate only `transform` and `opacity` (GPU-accelerated).
- Never animate `top`, `left`, `width`, `height`.

## Layout

| Section | Grid | Notes |
|---------|------|-------|
| Hero | `5fr 4fr` | Text left, chatbot preview right |
| Capabilities | `1fr 1fr` | Icon+text rows, no card borders by default |
| Services | `2fr 1fr`, 2 rows | AI Chatbot dark card spans rows 1-2 left, other cards right |
| How It Works | `1fr 1fr 1fr` | Steps with connecting line |
| Contact | `1fr 1fr` | Info left, form card right |

### Rules
- DESIGN_VARIANCE: 8. Asymmetric layouts mandatory.
- No centered-everything. Left-align by default.
- No 3-column equal card grids (banned).
- Responsive: single-column at 1024px, mobile at 640px.
- Use `min-h-[100dvh]` not `h-screen` for hero sections.

## Components

### Buttons
- **Primary:** `bg-dark` (#18181b) text white, 14-15px, 600 weight, `radius-sm`
- **Ghost:** Transparent, `border-strong`, text secondary, `radius-sm`
- **Accent:** `accent` (#10b981) text white, for CTA sections
- Hover: darken/lighten + `translateY(-1px)`
- Active: `translateY(0) scale(0.98)`

### Cards
- White background, `border` (subtle), `radius` (20px)
- Hover: `shadow-elevated` + `translateY(-3px)` + `border-strong`
- Dark variant: `bg-dark` background, white text, transparent border

### Form Inputs
- `bg` background, `border-strong`, `radius-sm`, 14px text
- Focus: `accent` border + `0 0 0 3px accent-bg` ring
- Error: red text below input
- Success: green check + confirmation text replacing form

### Nav
- Sticky top, `bg` with `backdrop-filter: blur(16px) saturate(1.8)` at 85% opacity
- `border-bottom: border`
- Mobile: hamburger menu (hidden nav links on mobile)

## Anti-Slop Rules (from taste-skill)

These patterns are BANNED:
1. Purple/violet/indigo anything
2. 3-column equal card grids
3. Gradient text on headlines
4. Neon/outer glow effects
5. Inter, Roboto, or system font defaults
6. Centered-everything layouts
7. Icons in colored circles
8. Emoji as design elements
9. Generic hero copy ("Welcome to...", "Unlock the power...")
10. Cookie-cutter section rhythm (same height/style for all sections)

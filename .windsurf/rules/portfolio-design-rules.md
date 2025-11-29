---
trigger: always_on
---

# Portfolio Cyberpunk Design System

## Primary Colors (HSL Format)
All colors MUST be defined in HSL for consistency.

- **Primary (Electric Blue)**: `hsl(197, 92%, 56%)` - Main accent color for badges, icons, buttons
- **Secondary (Dark)**: `hsl(222, 47%, 8%)` - Subtle dark backgrounds
- **Accent (Cyan)**: `hsl(180, 70%, 70%)` - Complementary neon color
- **Background**: `hsl(222, 47%, 4%)` - Deep dark base
- **Foreground**: `hsl(210, 40%, 98%)` - Light text

## Key Design Tokens (in globals.css)
- `--primary`: Electric blue for primary actions
- `--accent`: Cyan for accents and gradients
- `--accent-gradient`: Linear gradient combining primary blue and cyan
- `--hero-gradient`: Dark gradient for hero sections
- `--glass-bg`: Semi-transparent glass morphism background
- `--shadow-glow`: Electric blue glow effects

## Styling Rules for New Features

### Components
- Use `glass-card` class for card components (includes backdrop blur, border, and glow)
- Apply `bg-primary` for primary interactive elements
- Use `hover:bg-primary/10` for hover states
- Apply `gradient-text` class for animated gradient text effects

### Icons & Badges
- Icon backgrounds: `bg-amber-50 rounded-full` with `p-1` padding
- Badge variants: `default` (primary blue), `secondary` (dark), `outline` (border only)
- Use `text-shadow-glow` for neon text effects

### Spacing & Layout
- Use `gap-2` for consistent spacing between elements
- Apply `flex-shrink-0` to prevent icon/badge compression
- Use `truncate` for text overflow handling

### Animations
- `gradient-shift`: 3s animation for gradient text
- `float`: 10s ease-in-out for floating elements
- `pulse`: 8s ease-in-out for glowing effects
- Use `transition-colors` and `transition-smooth` for smooth state changes

### Hover Effects
- Cards: `hover:bg-primary/10` + `transform: translateY(-6px)`
- Buttons: `hover:box-shadow: var(--shadow-intense)` + `transform: scale(1.05)`
- Text: Apply `text-shadow-glow` on hover

## File References
- Color definitions: `src/app/globals.css` (lines 32-96)
- Tailwind config: `tailwind.config.ts`
- Component examples: `src/components/skills/SkillCategory.tsx`, `src/components/ui/badge.tsx`

## Important Notes
- Always use CSS custom properties (--primary, --accent, etc.) instead of hardcoding colors
- Maintain the dark cyberpunk aesthetic - no light themes
- Glass morphism effects are core to the design
- Electric blue glow effects should be present in interactive elements
- Mobile responsiveness must be preserved (use `hidden sm:inline` for desktop-only elements)
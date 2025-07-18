# Color Scheme Documentation

## Overview

Project Vibe It now uses a modern green-based color palette with yellow and red accents, designed to provide excellent contrast and accessibility in both light and dark modes.

## Primary Color Palette

### Green (Primary)
- **Light Mode**: `oklch(0.45 0.15 120)` - Vibrant green
- **Dark Mode**: `oklch(0.55 0.18 120)` - Bright green
- **Usage**: Primary buttons, links, focus states, brand elements

### Yellow/Amber (Accent)
- **Light Mode**: `oklch(0.75 0.12 85)` - Warm yellow
- **Dark Mode**: `oklch(0.8 0.15 85)` - Bright yellow
- **Usage**: Warnings, highlights, secondary actions, project badges

### Red (Destructive/Alert)
- **Light Mode**: `oklch(0.65 0.25 25)` - Red-orange
- **Dark Mode**: `oklch(0.75 0.25 25)` - Bright red
- **Usage**: Error states, destructive actions, alerts

## Color Classes

### Background Colors
```css
/* Light backgrounds */
bg-green-50          /* Very light green tint */
bg-green-100         /* Light green */
bg-green-950/90      /* Semi-transparent dark green */

/* Dark backgrounds */
dark:bg-green-950    /* Very dark green */
dark:bg-green-900/50 /* Semi-transparent dark green */
```

### Text Colors
```css
/* Primary text */
text-green-900       /* Dark green text */
dark:text-green-100  /* Light green text in dark mode */

/* Secondary text */
text-green-600       /* Medium green text */
dark:text-green-300  /* Light green text in dark mode */

/* Muted text */
text-green-500       /* Muted green text */
dark:text-green-400  /* Muted green text in dark mode */
```

### Border Colors
```css
/* Borders */
border-green-200     /* Light green border */
dark:border-green-800 /* Dark green border in dark mode */
```

## Component Usage Examples

### Buttons
```tsx
// Primary button
<Button className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white">

// Secondary button
<Button variant="outline" className="border-green-300 text-green-700 dark:border-green-600 dark:text-green-300">

// Destructive button
<Button className="bg-red-600 hover:bg-red-700 text-white">
```

### Cards
```tsx
<Card className="bg-white/95 dark:bg-green-950/95 backdrop-blur-sm border-green-200 dark:border-green-800 shadow-xl">
```

### Badges
```tsx
// Success badge
<Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">

// Warning badge
<Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">

// Error badge
<Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
```

## Status Colors

### Success States
- **Color**: Green (`green-600`, `green-500`)
- **Usage**: Completed lessons, successful actions, positive feedback

### Warning States
- **Color**: Amber/Yellow (`amber-600`, `amber-500`)
- **Usage**: Incomplete items, pending actions, caution messages

### Error States
- **Color**: Red (`red-600`, `red-500`)
- **Usage**: Errors, failed actions, destructive operations

### Info States
- **Color**: Teal (`teal-600`, `teal-500`)
- **Usage**: Information messages, neutral states

## Accessibility

### Contrast Ratios
All color combinations meet WCAG AA standards:
- **Normal text**: 4.5:1 minimum contrast ratio
- **Large text**: 3:1 minimum contrast ratio
- **UI components**: 3:1 minimum contrast ratio

### Focus States
- **Primary focus**: Green ring (`ring-green-600`)
- **Secondary focus**: Green border with opacity

### Dark Mode Considerations
- All colors have appropriate dark mode variants
- Maintains readability and contrast in both modes
- Uses semi-transparent backgrounds for depth

## Implementation Guidelines

### 1. Use Semantic Colors
```tsx
// ✅ Good - Semantic meaning
<Button className="bg-green-600">Complete</Button>
<Button className="bg-red-600">Delete</Button>

// ❌ Bad - Arbitrary colors
<Button className="bg-blue-600">Complete</Button>
```

### 2. Consistent Spacing
```tsx
// Use consistent color intensity levels
text-green-600    // Primary text
text-green-500    // Secondary text
text-green-400    // Muted text
```

### 3. Hover States
```tsx
// Always provide hover states
className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
```

### 4. Backdrop Blur
```tsx
// Use backdrop blur for modern glass effect
className="bg-white/95 dark:bg-green-950/95 backdrop-blur-sm"
```

## Migration Notes

When updating existing components:

1. Replace `slate-` colors with `green-` equivalents
2. Update `blue-` and `purple-` colors to use the new accent palette
3. Ensure all interactive elements have proper hover states
4. Test in both light and dark modes
5. Verify accessibility with screen readers

## CSS Custom Properties

The color scheme is defined using CSS custom properties in `globals.css`:

```css
:root {
  --primary: oklch(0.45 0.15 120);
  --primary-foreground: oklch(0.98 0.01 120);
  --destructive: oklch(0.65 0.25 25);
  /* ... more properties */
}
```

These properties are automatically used by shadcn/ui components and can be referenced in custom CSS. 
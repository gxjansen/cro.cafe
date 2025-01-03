# CRO.cafe Design Standards

## Brand Colors

```css
--color-primary: #dd8e91;    /* Primary brand color - Pink */
--color-secondary: #95c3c0;  /* Secondary brand color - Teal */
--color-accent-1: #ff676d;   /* Accent color 1 - Bright pink */
--color-accent-2: #7bfff8;   /* Accent color 2 - Bright teal */
--color-light: #dadada;      /* Light grey */
--color-dark: #333333;       /* Dark grey */
```

## Typography

### Font Family
- Primary: Inter, system-ui, sans-serif
- Monospace: 'JetBrains Mono', monospace (for code blocks)

### Font Sizes
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### Font Weights
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

## Spacing

### Container
- Max width: 1280px
- Padding: 1rem (16px) on small screens
- Padding: 2rem (32px) on larger screens

### Spacing Scale
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

## Components

### Buttons
- Primary: Bright pink background (#ff676d) with white text
- Secondary: Teal background (#95c3c0) with dark text
- Outline: Bright teal border (#7bfff8) with teal text, hover fills background
- Padding: 0.75rem 1.5rem
- Border radius: 0.375rem
- Hover state: 90% opacity
- Transition: 150ms ease-in-out

### Podcast Buttons
- Background: White
- Border: Light grey (#e5e7eb)
- Border radius: 0.75rem
- Shadow: Small drop shadow
- Padding: 0.75rem 1.5rem
- Layout: Flex with gap between icon and text
- Text:
  - Label: Small, muted text ("Listen on")
  - Platform: Semibold text
- Icons:
  - Size: 1.5rem (24px)
  - Colors:
    - Apple Podcasts: #933AC3
    - Spotify: #1DB954
    - Google Podcasts: #4285F4
- Hover state:
  - Slightly larger shadow
  - Darker border
  - Subtle lift effect
- Transition: 150ms ease-in-out all properties

### Cards
- Background variants:
  - Light: #dadada (for contrast with dark text)
  - Primary: #dd8e91 (brand color with dark text)
  - Secondary: #95c3c0 (teal with dark text)
- Border radius: 0.5rem
- Padding: 1.5rem
- Box shadow: subtle drop shadow
- Text color: #333333 (dark)

### Navigation
- Background: Dark grey (#333333)
- Text color: Light grey (#dadada)
- Active state: Bright pink (#ff676d)
- Hover state: Bright teal (#7bfff8)

## Layout

### Grid System
- 12 column grid
- Gutter width: 2rem (32px)
- Responsive breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

### Section Spacing
- Vertical padding: 4rem (64px)
- Reduced on mobile: 2rem (32px)

## Images & Media

### Aspect Ratios
- Hero images: 16:9
- Thumbnails: 1:1
- Blog featured images: 2:1

### Image Optimization
- Format: WebP with JPEG/PNG fallback
- Max width: 1920px
- Quality: 80%
- Lazy loading enabled

## Accessibility

### Color Contrast
- Text on dark: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio
- Interactive elements: Minimum 3:1 ratio

### Focus States
- Visible focus ring
- Color: Bright pink (#ff676d)
- Width: 2px
- No outline

## Animation & Transitions

### Duration
- Fast: 150ms
- Medium: 300ms
- Slow: 500ms

### Easing
- Default: ease-in-out
- Enter: ease-out
- Exit: ease-in

## Icons

### Size
- Small: 16px
- Medium: 24px
- Large: 32px

### Color
- Default: Light grey (#dadada)
- Primary: Bright pink (#ff676d)
- Secondary: Bright teal (#7bfff8)

## Best Practices

1. Always use Tailwind classes instead of inline styles
2. Extend Tailwind's theme in tailwind.config.js for custom values
3. Use semantic HTML elements
4. Maintain consistent spacing using the defined scale
5. Follow mobile-first responsive design
6. Ensure all interactive elements have hover and focus states
7. Use CSS Grid for layout and Flexbox for component alignment
8. Implement dark mode by default
9. Test color contrast for accessibility
10. Use relative units (rem) for typography and spacing

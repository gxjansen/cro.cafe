# Design Standards

## Color System

### Brand Colors

Our color system uses CSS variables to maintain consistency across the site. The primary accent color is used for interactive elements and important UI components.

```css
:root {
  --color-accent: #ff676d; /* Light mode accent color */
}

:root[data-theme='dark'] {
  --color-accent: #7bfff8; /* Dark mode accent color */
}
```

### Color Usage Guidelines

1. **Interactive Elements**

   - Links: Use accent color on hover
   - Buttons: Primary buttons use accent color as background
   - Focus rings: Use accent color for keyboard focus states

2. **Icons and Social Links**

   - Social media icons (LinkedIn, Twitter, etc.) use accent color on hover
   - Icon buttons use accent color to indicate interactivity

3. **Loading States**

   - Loading overlays use neutral colors (gray-200 in light mode, gray-700 in dark mode)
   - Error states use red-200 in light mode and red-900 in dark mode

4. **Text Colors**
   - Regular text: gray-900 (light) / white (dark)
   - Secondary text: gray-600 (light) / gray-400 (dark)
   - Links and interactive text: accent color on hover

### Implementation

Use Tailwind's color classes with our CSS variables:

```html
<!-- Using accent color -->
<a class="text-gray-600 hover:text-accent dark:text-gray-400 dark:hover:text-accent">Link</a>

<!-- Using accent color for focus rings -->
<button class="focus:ring-2 focus:ring-accent">Button</button>
```

### Accessibility

- Maintain WCAG 2.1 AA contrast ratios
- Light mode accent (#ff676d) on white: 4.5:1
- Dark mode accent (#7bfff8) on dark backgrounds: 4.5:1
- Use darker shades of accent colors for text to ensure readability

### Component-Specific Usage

1. **Guest Profile Pages**

   - Profile image loading overlay: gray-200 (light) / gray-700 (dark)
   - Social links: accent color on hover
   - Focus rings: accent color

2. **Episode Pages**

   - Episode cards: accent color for interactive elements
   - Featured guests section: accent color for links
   - Transcript links: accent color

3. **Navigation**
   - Active links: accent color
   - Hover states: accent color with reduced opacity

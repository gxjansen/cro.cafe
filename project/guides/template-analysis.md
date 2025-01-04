# Template Analysis Guide

This guide helps you understand and adapt the existing Astro template for the CRO.CAFE project.

## Template Structure Analysis

### Key Components to Keep

1. **Layout Components** (`src/layouts/`)
- `Layout.astro`: Base layout with meta tags and common scripts
- `PageLayout.astro`: Standard page layout with header/footer
- Modify these for language support and podcast-specific metadata

2. **UI Components** (`src/components/ui/`)
- `Button.astro`: Reusable button component
- `Headline.astro`: Typography components
- `ItemGrid.astro`: Grid layout component
- Keep all UI components as they provide foundation for new features

3. **Widget Components** (`src/components/widgets/`)
- `Header.astro`: Navigation header (needs language switcher)
- `Footer.astro`: Site footer (needs platform links)
- `Hero.astro`: Hero section (adapt for podcast features)
- `Features.astro`: Feature grid (useful for platform display)
- Keep but modify for podcast-specific needs

4. **Blog Components** (`src/components/blog/`)
- Rename to `episode` and adapt for podcast content
- Modify for RSS feed integration
- Adapt pagination for episode listing
- Keep tag system for episode categorization

### Components to Remove

1. **Unused Widgets**
- `Pricing.astro`: Not needed for podcast site
- `Steps.astro`: Not relevant for current needs
- `Stats.astro`: May repurpose later for analytics

2. **Demo Content**
- All demo blog posts in `src/data/post/`
- Sample images in `src/assets/images/`
- Demo configuration files

### Required New Components

1. **Podcast-Specific Components**
- EpisodePlayer.astro: Transistor.FM embed wrapper
- EpisodeGrid.astro: Language-specific episode grid
- GuestProfile.astro: Guest information display
- PlatformSelector.astro: Podcast platform links
- LanguageSwitcher.astro: Language selection UI

2. **Content Display Components**
- QuoteDisplay.astro: Listener testimonials
- BrandGrid.astro: Brand listener showcase
- SearchResults.astro: PageFind integration

## Template Cleanup Steps

1. **Content Organization**
```bash
# Create reference directory
mkdir -p src/_reference

# Move demo content
mv src/data/post/* src/_reference/posts/
mv src/pages/[...blog]/* src/_reference/blog-pages/
mv src/pages/homes/* src/_reference/home-variants/
mv src/pages/landing/* src/_reference/landing-pages/
```

2. **Component Preparation**
- Create new component directories:
```
src/components/
  ├── episode/     # Episode-related components
  ├── guest/       # Guest profile components
  ├── platform/    # Platform selection components
  └── search/      # Search functionality
```

3. **Asset Management**
- Clean up unused images
- Organize assets by type:
```
src/assets/
  ├── images/
  │   ├── hosts/      # Host profile images
  │   ├── guests/     # Guest profile images
  │   └── brands/     # Brand logos
  └── icons/          # UI and platform icons
```

## Configuration Updates

1. **TypeScript Configuration**
- Update `tsconfig.json` for strict mode
- Add podcast-specific types
- Configure path aliases

2. **Astro Configuration**
- Update `astro.config.ts`:
  - Configure i18n
  - Set up image optimization
  - Configure content collections

3. **Tailwind Configuration**
- Update `tailwind.config.js`:
  - Add podcast-specific colors
  - Configure custom components
  - Set up responsive breakpoints

## Next Steps

1. Review [Project Structure Guide](./project-structure.md) for detailed setup
2. Follow [Content Schema Definitions](./content-schemas.md) for data modeling
3. Implement components following [Component Development Guide](./component-development.md)

## Validation Checklist

- [ ] All demo content moved to _reference directory
- [ ] Unused components removed
- [ ] New component structure created
- [ ] Asset directories organized
- [ ] Configuration files updated
- [ ] No TypeScript errors
- [ ] Build completes successfully

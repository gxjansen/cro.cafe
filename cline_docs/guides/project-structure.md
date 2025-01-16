# Project Structure Guide

This guide outlines the organization of the CRO.CAFE project, explaining key directories and their purposes.

## Root Directory Structure

```
cro.cafe/
├── src/                  # Source code
├── public/              # Static assets
├── project/             # Project documentation
└── scripts/             # Build and utility scripts
```

## Source Code Organization

```
src/
├── assets/              # Images and other assets
├── components/          # UI components
├── content/             # Content collections
├── layouts/             # Page layouts
├── pages/              # Route pages
├── styles/             # Global styles
└── utils/              # Utility functions
```

### Content Collections (`src/content/`)

```
content/
├── config.ts           # Collection definitions
├── episodes/           # Podcast episodes
│   ├── en/            # English episodes
│   ├── de/            # German episodes
│   ├── es/            # Spanish episodes
│   └── nl/            # Dutch episodes
├── guests/            # Guest profiles
│   ├── en/            # English profiles
│   ├── de/            # German profiles
│   ├── es/            # Spanish profiles
│   └── nl/            # Dutch profiles
├── quotes/            # Listener quotes
│   ├── en/
│   ├── de/
│   ├── es/
│   └── nl/
├── brands/            # Brand listeners
└── platforms/         # Platform data by language
```

### Components Organization (`src/components/`)

```
components/
├── common/            # Shared components
│   ├── Header.astro
│   ├── Footer.astro
│   └── LanguageSwitcher.astro
├── episode/           # Episode-related components
│   ├── Player.astro
│   ├── Grid.astro
│   └── Card.astro
├── guest/             # Guest components
│   ├── Profile.astro
│   └── List.astro
├── platform/          # Platform components
│   ├── Grid.astro
│   └── Card.astro
├── search/           # Search components
└── ui/               # Base UI components
```

### Page Structure (`src/pages/`)

```
pages/
├── index.astro       # Global landing page
├── [lang]/           # Language-specific routes
│   ├── index.astro   # Language landing page
│   ├── episodes/     # Episode pages
│   ├── guests/       # Guest pages
│   ├── platforms/    # Platform pages
│   └── search.astro  # Search page
└── api/              # API endpoints
```

### Assets Organization (`src/assets/`)

```
assets/
├── images/
│   ├── hosts/        # Host profile images
│   ├── guests/       # Guest profile images
│   ├── brands/       # Brand logos
│   └── episodes/     # Episode-specific images
├── icons/            # UI and platform icons
└── styles/           # Global styles
```

### Utils Organization (`src/utils/`)

```
utils/
├── content/          # Content helpers
│   ├── episodes.ts   # Episode data processing
│   ├── guests.ts     # Guest data processing
│   └── rss.ts        # RSS feed processing
├── i18n/             # Internationalization
│   ├── translations.ts
│   └── detect.ts
└── seo/              # SEO utilities
```

## Scripts Organization

```
scripts/
├── import/           # Data import scripts
│   ├── rss.ts       # RSS feed import
│   ├── csv.ts       # CSV data import
│   └── images.ts    # Image download/optimization
├── build/           # Build scripts
└── sync/            # RSS sync scripts
```

## Public Directory

```
public/
├── _redirects       # Netlify redirects
├── robots.txt       # SEO configuration
├── favicon.ico      # Site favicon
└── assets/         # Static assets
```

## Configuration Files

```
├── astro.config.ts          # Astro configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json            # Project dependencies
```

## Implementation Guidelines

1. **Content Organization**

   - Keep language-specific content in appropriate directories
   - Use consistent naming conventions
   - Maintain clear separation of concerns

2. **Component Development**

   - Create reusable components
   - Follow atomic design principles
   - Implement proper TypeScript types

3. **Asset Management**

   - Optimize images during build
   - Use appropriate formats
   - Maintain organized structure

4. **Configuration**
   - Keep environment variables in .env
   - Document configuration options
   - Use TypeScript for type safety

## Validation Checklist

- [ ] Directory structure matches specification
- [ ] All required components exist
- [ ] Content collections properly configured
- [ ] Asset optimization pipeline working
- [ ] Build process successful
- [ ] TypeScript compilation clean
- [ ] ESLint passes without errors

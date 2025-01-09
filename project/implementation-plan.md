# CRO.CAFE Implementation Plan

This document outlines the step-by-step implementation plan for migrating four CRO.CAFE podcast websites into a single, unified platform using Astro 5.0. Each section includes validation checks to ensure proper implementation.

After completing a task, mark it as complete by replacing the [ ] with [x].

## 1. Project Setup & Template Analysis

- [x] Initialize Git repository with proper .gitignore
- [x] Clean up template files and organize reference material
- [x] Set up project structure following Astro 5.0 best practices
- [x] Configure TypeScript with strict mode
- [x] Set up Tailwind CSS with proper configuration
- [x] Configure ESLint and Prettier
- [x] Implement base metadata component
- [x] Configure OpenGraph tags and image generation
- [x] Set up structured data templates

**Validation Checks:**

- All template demo content moved to a reference folder
- No TypeScript errors (`npm run typecheck`)
- ESLint passes without errors (`npm run lint`)
- Development server runs without errors (`npm run dev`)
- Project builds successfully (`npm run build`)
- OpenGraph tags validate in social media debuggers
- Structured data validates in testing tools

**Reference Files:**

- [Template Analysis Guide](./guides/template-analysis.md)
- [Project Structure Guide](./guides/project-structure.md)
- [SEO & Metadata Guide](./guides/seo-metadata.md)

## 2. Content Collections Setup

- [x] Define Zod schemas for all content types
- [x] Set up content collections for episodes, guests, quotes, brands, and platforms
- [x] Create folder structure for language-specific content
- [x] Implement type-safe content management
- [x] Set up image optimization pipeline
- [x] Configure canonical URLs and language references
- [x] Implement hreflang tags for all content types

**Validation Checks:**

- Content schemas compile without errors
- Test content entries validate against schemas
- Image optimization works as expected
- Content queries work in test components
- Canonical URLs properly reference primary language versions
- hreflang tags validate for all language combinations

**Reference Files:**

- [Content Schema Definitions](./guides/content-schemas.md)
- [Content Organization Guide](./guides/content-organization.md)

## 3. Data Import System

- [x] Create RSS feed parser
- [x] Develop CSV data import scripts
- [x] Set up image download and optimization pipeline
- [x] Implement slug generation and validation
- [x] Create GitHub Action for RSS sync
- [x] Implement OpenGraph image generation during import

**Validation Checks:**

- RSS feeds parse correctly
- CSV data imports successfully
- Images download and optimize properly
- Slugs generate uniquely without conflicts
- GitHub Action runs successfully
- OpenGraph images generate for all content types

**Reference Files:**

- [Data Import Guide](./guides/data-import.md)
- [RSS Sync Implementation](./guides/rss-sync.md)

## 4. Core Components Development

- [x] Implement language-aware layout components
- [x] Create episode display components
- [x] Develop navigation with language switching
- [x] Build footer with platform links
- [x] Implement Transistor.FM player embedding
- [x] Create metadata components for all page types
- [x] Implement structured data components

**Validation Checks:**

- Components render in all supported languages
- Language switching works correctly
- Episode player embeds function properly
- Navigation works across all routes
- Responsive design functions on all viewports
- SEO components generate valid metadata
- Structured data validates in testing tools

**Reference Files:**

- [Component Development Guide](./guides/component-development.md)
- [Language Implementation Guide](./guides/language-implementation.md)

## 5. Routing & Language Management

- [x] Set up language-specific routes
- [x] Implement language detection and redirection
- [x] Configure canonical URLs
- [x] Set up cross-language linking
- [x] Implement hreflang tags
- [x] Configure browser language detection
- [x] Set up language-specific sitemaps
- [x] Implement RSS feed sync for all languages
- [x] Add episode cleanup and deduplication

**Implementation Details:**

- Created language utility (src/utils/language.ts) for:
  - Language detection from URLs
  - Browser language preference detection
  - Language validation and type safety
  - Cross-language URL generation
- Implemented middleware (src/middleware.ts) for:
  - Automatic language detection and redirection
  - Language information in locals
  - Proper caching headers
- Set up sitemap generation (src/pages/sitemap.xml.ts) with:
  - Support for all content types
  - Language-specific URLs
  - Proper change frequencies and priorities
  - Last modified dates
- Updated robots.txt with:
  - Sitemap reference
  - Crawl optimization settings
  - Directory exclusions
- Added comprehensive test coverage:
  - Language utility tests (src/utils/language.test.ts):
    - URL language detection
    - Browser language preference parsing
    - Language validation
    - URL generation
    - Redirection logic
  - Sitemap generation tests (src/pages/sitemap.xml.test.ts):
    - XML structure validation
    - Content entry handling
    - Empty collection handling
    - Error handling
    - Priority and frequency validation
- Implemented RSS sync (src/utils/rss-sync.ts) with:
  - Support for all podcast languages (en, nl, de, es)
  - Episode duration extraction from RSS feeds
  - Smart title normalization for matching episodes
  - Duplicate episode detection and cleanup
  - Short slug generation for consistent URLs
  - CSV file generation for new episodes

**Validation Checks:**

- URLs follow specified structure ✓
- Language detection works correctly ✓
- Canonical tags are properly set ✓
- Cross-language navigation functions ✓
- SEO tags validate correctly ✓
- Browser language detection works across browsers ✓
- Sitemaps include all language versions ✓

**Reference Files:**

- src/utils/language.ts (Language utilities)
- src/middleware.ts (Language middleware)
- src/pages/sitemap.xml.ts (Sitemap generation)
- public/robots.txt (Crawler configuration)
- src/utils/language.test.ts (Language utility tests)
- src/pages/sitemap.xml.test.ts (Sitemap generation tests)

## 6. Search Implementation

- [ ] Set up PageFind integration
- [ ] Implement language-aware search
- [ ] Create search results page
- [ ] Add search filters
- [ ] Implement search analytics
- [ ] Configure search result metadata

**Validation Checks:**

- Search indexes build correctly
- Results display in correct languages
- Filters work as expected
- Search performance meets requirements
- Analytics capture search data
- Search results have proper metadata

**Reference Files:**

- [Search Implementation Guide](./guides/search.md)
- [PageFind Configuration](./guides/pagefind.md)

## 7. Testing & Quality Assurance

- [ ] Set up Vitest testing environment
- [ ] Write component tests
- [ ] Create end-to-end tests
- [ ] Implement accessibility tests
- [ ] Set up performance monitoring
- [ ] Implement SEO validation tests

**Validation Checks:**

- All tests pass (`npm run test`)
- Lighthouse scores meet targets
- Accessibility tests pass
- Performance metrics meet requirements
- Cross-browser testing passes
- SEO validation tests pass

**Reference Files:**

- [Testing Guide](./guides/testing.md)
- [Performance Optimization](./guides/performance.md)

## 8. Deployment & Infrastructure

- [ ] Configure Netlify build settings
- [ ] Set up URL redirects
- [ ] Configure build caching
- [ ] Implement error handling
- [ ] Set up monitoring
- [ ] Configure robots.txt
- [ ] Set up sitemap generation

**Validation Checks:**

- Builds complete successfully
- Redirects work as expected
- Cache invalidation functions
- Error pages display correctly
- Monitoring captures issues
- Sitemaps generate correctly
- Search engines can crawl properly

**Reference Files:**

- [Deployment Guide](./guides/deployment.md)
- [Infrastructure Setup](./guides/infrastructure.md)

## Future Enhancements (Post-MVP)

- Custom audio player implementation
- Transcript generation and display
- AI-powered content enrichment
- Advanced search capabilities
- Translation management system
- Automated OpenGraph image generation with branding
- Enhanced structured data for podcast episodes

**Note:** Each section's reference files will be created separately with detailed technical specifications and implementation instructions for junior developers.

# Technical Debt and Future Improvements

## TypeScript Type Predicate Challenge in Permalinks Utility

**Location:** `src/utils/permalinks.ts`

**Issue:** Encountered a complex TypeScript type predicate challenge in the `generateHreflangTags` function. The current implementation struggles with type narrowing, specifically with the `language` property in the type predicate.

**Potential Solutions to Investigate:**

1. Refactor the type definition to make it more flexible
2. Create a more robust type guard function
3. Consider using a different approach to type validation
4. Potentially simplify the function signature

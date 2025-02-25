# Build Issues Documentation

## TypeScript Errors

### Missing Modules (Resolved)

- `vitest` (✓ type definitions included in package)
- `node-fetch` (✓ type definitions installed)
- `dotenv` (✓ type definitions installed)
- `csv-parse/sync` (✓ type definitions installed)

### Missing Modules (Unresolved)

- `@unpic/astro` (type definitions not available)
- `@astrojs/rss` (type definitions not available)

### Type Mismatches (Resolved)

- ✓ `title` property on `Episode` type
- ✓ `description` property on `Episode` type
- ✓ `canonicalUrl` property on `Episode` type
- ✓ `duration` property on `Episode` type
- ✓ `date` property on `Episode` type
- ✓ `audio_url` property on `Episode` type
- ✓ `transcript_url` property on `Episode` type
- ✓ `guests` property on `Episode` type
- ✓ `social_links` property on `Person` type
- ✓ `language` property on `Episode` type
- ✓ `author` property on `Quote` type (now string)
- ✓ `episode` property on `Quote` type (now string)
- ✓ `timestamp` property on `Quote` type (now string)
- ✓ `type` property on `Quote` type (now 'quotes')
- ✓ `type` property on `Platform` type (now 'platforms')
- ✓ `site` property on `AstroConfig` type
- ✓ `base` property on `AstroConfig` type
- ✓ `ANALYTICS` property added to configuration object

### Undefined Properties (Resolved)

- ✓ `child` property in `frontmatter.ts`
- ✓ `num` property in `images-optimization.ts`
- ✓ `den` property in `images-optimization.ts`
- ✓ `person.social_links` property in `structured-data.ts`
- ✓ `quote.episode` property in `structured-data.ts`

## Steps Taken

1. Installed missing type definitions:

   - vitest
   - @types/node-fetch
   - @types/dotenv
   - @types/csv-parse

2. Fixed type definitions:

   - Updated Episode interface with all required properties
   - Changed Quote type to use string for author and episode
   - Updated Platform type to use 'platforms'
   - Added ANALYTICS property to AstroConfig
   - Added proper type guards for undefined properties

3. Fixed data structure:
   - Updated LatestEpisodes component to provide correct episode data structure
   - Added proper type checking in Card component

## Remaining Issues

1. Missing type definitions for:
   - @unpic/astro
   - @astrojs/rss
     These packages do not provide TypeScript definitions, and no @types packages are available.

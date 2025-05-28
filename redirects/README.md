# CRO.CAFE Website Redirects

This directory contains redirect mappings for migrating from the four separate language websites to the unified new website structure.

## Overview

The new unified website structure uses:

- Main site: `www.cro.cafe` (English interface, all languages)
- Language-specific pages: `/[lang]/` (e.g., `/en/`, `/nl/`, `/de/`, `/es/`)

## Old Website Structure

### English (www.cro.cafe)

- Episodes: `/podcast/[episode-slug]`
- Guests: `/guest/[guest-slug]`
- Platforms: `/subscribe/[platform-name]`
- Books: `/cro-book/[book-slug]`
- Events: `/event/[event-slug]`

### Dutch (nl.cro.cafe)

- Episodes: `/podcast/[episode-slug]`
- Guests: `/gast/[guest-slug]`
- Platforms: `/subscribe/[platform-name]`

### German (de.cro.cafe)

- Episodes: `/podcast/[episode-slug]`
- Guests: `/guest/[guest-slug]`
- Platforms: `/subscribe/[platform-name]`

### Spanish (es.cro.cafe)

- Episodes: `/podcast/[episode-slug]`
- Guests: `/invitados/[guest-slug]`
- Platforms: `/suscribete/[platform-name]`

## New Website Structure

### Main Site (www.cro.cafe)

- Homepage: `/` (unified feed, English interface)
- Language-specific homepages: `/[lang]/` (e.g., `/en/`, `/nl/`, `/de/`, `/es/`)
- Episodes: `/[lang]/episodes/[episode-slug]`
- Guests: `/[lang]/guests/[guest-slug]`
- Platforms: `/[lang]/subscribe/`
- About: `/[lang]/about/`
- Search: `/search/`

## Redirect Files

1. **Main Website (www.cro.cafe)**: Uses Astro middleware (`src/middleware.ts`)
2. **Dutch Subdomain**: `nl-subdomain-redirects.html`
3. **German Subdomain**: `de-subdomain-redirects.html`
4. **Spanish Subdomain**: `es-subdomain-redirects.html`
5. **Deployment Guide**: `deployment-guide.md`

## Implementation

### Main Website (www.cro.cafe)

✅ **Already implemented** using Astro middleware in `src/middleware.ts`

- Uses native Astro redirect capabilities
- Handles all old English website URLs
- 301 permanent redirects for SEO preservation

### Subdomains (nl.cro.cafe, de.cro.cafe, es.cro.cafe)

📁 **HTML redirect files created**

- JavaScript-based redirects with meta refresh fallback
- User-friendly messages in appropriate languages
- Ready to deploy as `index.html` in subdomain root directories

### Deployment

See `deployment-guide.md` for detailed implementation instructions.

## Notes

- All redirects use 301 (permanent) status codes for SEO preservation
- Unmapped URLs redirect to the appropriate language homepage
- Books and Events sections from English site are not migrated (redirect to homepage)
- Platform pages redirect to the unified subscribe page for each language

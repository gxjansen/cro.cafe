# CRO.CAFE Redirect Deployment Guide

This guide explains how to implement the redirect system for migrating from the four separate language websites to the unified new website structure.

## Overview

The redirect system consists of two parts:

1. **Astro middleware** for www.cro.cafe (native Astro redirects)
2. **HTML redirect files** for subdomains (nl.cro.cafe, de.cro.cafe, es.cro.cafe)

## 1. Main Website (www.cro.cafe) - Astro Middleware

The main website uses Astro's native middleware system for redirects.

### Implementation Status

✅ **Already implemented** in `src/middleware.ts`

The middleware handles:

- `/podcast/[slug]` → `/en/episodes/[slug]`
- `/guest/[slug]` → `/en/guests/[slug]`
- `/subscribe/[platform]` → `/en/subscribe/`
- `/event/[slug]` → `/en/` (events not migrated)
- `/cro-book/[slug]` → `/en/` (books not migrated)
- Static pages like `/about` → `/en/about/`

### How it works

- Runs on every request before page rendering
- Uses 301 permanent redirects for SEO preservation
- Automatically handles all old English website URLs

## 2. Subdomain Redirects

For the subdomains, we use HTML files with JavaScript redirects that can be placed in the root directory of each subdomain when the old sites are removed.

### Files Created

- `nl-subdomain-redirects.html` - For nl.cro.cafe
- `de-subdomain-redirects.html` - For de.cro.cafe
- `es-subdomain-redirects.html` - For es.cro.cafe

### Deployment Steps for Subdomains

#### Step 1: Backup Current Sites

Before removing the old subdomain sites, ensure you have backups.

#### Step 2: Deploy Redirect Files

For each subdomain, rename the appropriate redirect file to `index.html` and place it in the root directory:

**For nl.cro.cafe:**

```bash
# Copy and rename the Dutch redirect file
cp redirects/nl-subdomain-redirects.html /path/to/nl.cro.cafe/index.html
```

**For de.cro.cafe:**

```bash
# Copy and rename the German redirect file
cp redirects/de-subdomain-redirects.html /path/to/de.cro.cafe/index.html
```

**For es.cro.cafe:**

```bash
# Copy and rename the Spanish redirect file
cp redirects/es-subdomain-redirects.html /path/to/es.cro.cafe/index.html
```

#### Step 3: Configure Web Server (Optional)

For better SEO, configure your web server to serve 301 redirects instead of relying solely on JavaScript:

**Apache (.htaccess):**

```apache
RewriteEngine On
RewriteRule ^podcast/(.*)$ https://www.cro.cafe/nl/episodes/$1 [R=301,L]
RewriteRule ^gast/(.*)$ https://www.cro.cafe/nl/guests/$1 [R=301,L]
RewriteRule ^subscribe/(.*)$ https://www.cro.cafe/nl/subscribe/ [R=301,L]
RewriteRule ^(.*)$ https://www.cro.cafe/nl/ [R=301,L]
```

**Nginx:**

```nginx
location ~* ^/podcast/(.*)$ {
    return 301 https://www.cro.cafe/nl/episodes/$1;
}
location ~* ^/gast/(.*)$ {
    return 301 https://www.cro.cafe/nl/guests/$1;
}
location ~* ^/subscribe/(.*)$ {
    return 301 https://www.cro.cafe/nl/subscribe/;
}
location / {
    return 301 https://www.cro.cafe/nl/;
}
```

## 3. URL Mapping Reference

### Dutch (nl.cro.cafe → www.cro.cafe/nl/)

- `/podcast/[slug]` → `/nl/episodes/[slug]`
- `/gast/[slug]` → `/nl/guests/[slug]`
- `/subscribe/[platform]` → `/nl/subscribe/`
- `/about` → `/nl/about/`
- All other URLs → `/nl/`

### German (de.cro.cafe → www.cro.cafe/de/)

- `/podcast/[slug]` → `/de/episodes/[slug]`
- `/guest/[slug]` → `/de/guests/[slug]`
- `/subscribe/[platform]` → `/de/subscribe/`
- `/about` → `/de/about/`
- All other URLs → `/de/`

### Spanish (es.cro.cafe → www.cro.cafe/es/)

- `/podcast/[slug]` → `/es/episodes/[slug]`
- `/invitados/[slug]` → `/es/guests/[slug]`
- `/suscribete/[platform]` → `/es/subscribe/`
- `/about` → `/es/about/`
- All other URLs → `/es/`

### English (www.cro.cafe → www.cro.cafe/en/)

- `/podcast/[slug]` → `/en/episodes/[slug]`
- `/guest/[slug]` → `/en/guests/[slug]`
- `/subscribe/[platform]` → `/en/subscribe/`
- `/about` → `/en/about/`
- `/event/[slug]` → `/en/` (not migrated)
- `/cro-book/[slug]` → `/en/` (not migrated)

## 4. Testing

### Test Main Website Redirects

1. Deploy the new website with middleware
2. Test old URLs:
   - `https://www.cro.cafe/podcast/some-episode`
   - `https://www.cro.cafe/guest/some-guest`
   - `https://www.cro.cafe/about`

### Test Subdomain Redirects

1. Deploy redirect files to subdomains
2. Test old URLs:
   - `https://nl.cro.cafe/podcast/some-episode`
   - `https://de.cro.cafe/guest/some-guest`
   - `https://es.cro.cafe/invitados/some-guest`

## 5. SEO Considerations

- All redirects use 301 (permanent) status codes
- JavaScript redirects include meta refresh as fallback
- HTML redirect pages include user-friendly messages
- Search engines will eventually update their indexes

## 6. Monitoring

After deployment, monitor:

- 404 errors in server logs
- Search console for crawl errors
- Analytics for traffic patterns
- User feedback about broken links

## 7. Rollback Plan

If issues arise:

1. Keep backups of old sites
2. Can quickly restore old subdomain sites
3. Can disable middleware by commenting out redirect logic
4. Monitor for 24-48 hours after deployment

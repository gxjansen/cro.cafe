# SEO & Metadata Implementation Guide

This guide outlines the implementation of SEO, OpenGraph, and metadata requirements for the CRO.CAFE project.

## OpenGraph Implementation

### Base Metadata Component

```typescript
// src/components/common/Metadata.astro
---
import { getImage } from 'astro:assets';

interface Props {
  title: string;
  description: string;
  image?: ImageMetadata;
  canonicalUrl?: string;
  type?: 'website' | 'article';
  publishDate?: Date;
  language: 'en' | 'de' | 'es' | 'nl';
}

const {
  title,
  description,
  image,
  canonicalUrl,
  type = 'website',
  publishDate,
  language,
} = Astro.props;

// Process OG image
const ogImage = image
  ? await getImage({
      src: image,
      width: 1200,
      height: 630,
      format: 'jpeg',
    })
  : '/images/default-og.jpg';

// Language mapping
const languageMap = {
  en: 'en_US',
  de: 'de_DE',
  es: 'es_ES',
  nl: 'nl_NL',
};

// Generate alternate language URLs
const alternateUrls = {
  en: new URL(Astro.url.pathname.replace(/^\/(en|de|es|nl)/, '/en'), Astro.site),
  de: new URL(Astro.url.pathname.replace(/^\/(en|de|es|nl)/, '/de'), Astro.site),
  es: new URL(Astro.url.pathname.replace(/^\/(en|de|es|nl)/, '/es'), Astro.site),
  nl: new URL(Astro.url.pathname.replace(/^\/(en|de|es|nl)/, '/nl'), Astro.site),
};
---

<!-- Primary Meta Tags -->
<title>{title}</title>
<meta name="title" content={title} />
<meta name="description" content={description} />

<!-- Language Tags -->
<meta property="og:locale" content={languageMap[language]} />
{Object.entries(alternateUrls).map(([lang, url]) => (
  <link
    rel="alternate"
    hreflang={lang}
    href={url}
  />
))}
<link
  rel="canonical"
  href={canonicalUrl || Astro.url}
/>

<!-- Open Graph -->
<meta property="og:type" content={type} />
<meta property="og:url" content={Astro.url} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImage} />
{publishDate && (
  <meta property="article:published_time" content={publishDate.toISOString()} />
)}

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content={Astro.url} />
<meta property="twitter:title" content={title} />
<meta property="twitter:description" content={description} />
<meta property="twitter:image" content={ogImage} />

<!-- Additional Meta -->
<meta name="generator" content={Astro.generator} />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

## Language Detection & Routing

### Language Detection Script

```typescript
// src/utils/language.ts
export function getBrowserLanguage(): "en" | "de" | "es" | "nl" {
  if (typeof navigator === "undefined") return "en";

  const browserLang = navigator.language.toLowerCase().split("-")[0];

  const supportedLanguages = {
    en: true,
    de: true,
    es: true,
    nl: true,
  };

  return supportedLanguages[browserLang] ? browserLang : "en";
}

export function getLanguageFromURL(
  pathname: string,
): "en" | "de" | "es" | "nl" {
  const langMatch = pathname.match(/^\/(en|de|es|nl)\//);
  return langMatch ? (langMatch[1] as "en" | "de" | "es" | "nl") : "en";
}
```

### Language Redirect Middleware

```typescript
// src/middleware.ts
import { defineMiddleware } from "astro:middleware";
import { getBrowserLanguage, getLanguageFromURL } from "./utils/language";

export const onRequest = defineMiddleware(async (context, next) => {
  const { request } = context;
  const url = new URL(request.url);

  // Skip redirect for assets and API routes
  if (
    url.pathname.match(/\.(jpg|png|gif|svg|css|js|ico)$/) ||
    url.pathname.startsWith("/api/")
  ) {
    return next();
  }

  // Check if already on language path
  if (url.pathname.match(/^\/(en|de|es|nl)\//)) {
    return next();
  }

  // Get preferred language
  const preferredLang = getBrowserLanguage();

  // Redirect to language path
  return Response.redirect(
    new URL(`/${preferredLang}${url.pathname}`, url.origin),
  );
});
```

## SEO Optimization

### Structured Data Implementation

```typescript
// src/components/common/StructuredData.astro
---
interface Props {
  type: 'Episode' | 'Person' | 'Organization';
  data: Record<string, unknown>;
}

const { type, data } = Astro.props;

const structuredData = {
  '@context': 'https://schema.org',
  '@type': type,
  ...data,
};
---

<script type="application/ld+json" set:html={JSON.stringify(structuredData)} />
```

### Episode Schema Example

```typescript
// src/pages/[lang]/episodes/[...slug].astro
---
import StructuredData from '../../../components/common/StructuredData.astro';
import type { CollectionEntry } from 'astro:content';

interface Props {
  episode: CollectionEntry<'episodes'>;
}

const { episode } = Astro.props;
const { title, pubDate, description, audioUrl, duration } = episode.data;

const episodeSchema = {
  name: title,
  datePublished: pubDate.toISOString(),
  description,
  associatedMedia: {
    '@type': 'AudioObject',
    contentUrl: audioUrl,
    duration,
  },
};
---

<StructuredData type="Episode" data={episodeSchema} />
```

## Sitemap Configuration

```typescript
// astro.config.ts
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.cro.cafe",
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en-US",
          de: "de-DE",
          es: "es-ES",
          nl: "nl-NL",
        },
      },
      filter: (page) => !page.includes("/admin"),
      customPages: [
        "https://www.cro.cafe/en",
        "https://www.cro.cafe/de",
        "https://www.cro.cafe/es",
        "https://www.cro.cafe/nl",
      ],
    }),
  ],
});
```

## Robots.txt Configuration

```typescript
// public/robots.txt
User-agent: *
Allow: /

# Language-specific sitemaps
Sitemap: https://www.cro.cafe/sitemap-index.xml

# Prevent indexing of admin areas
Disallow: /admin/
Disallow: /keystatic/
```

## Implementation Checklist

- [ ] Base metadata component implemented
- [ ] OpenGraph images generated and optimized
- [ ] Language detection and routing working
- [ ] Structured data implemented for all content types
- [ ] Sitemap generation configured
- [ ] robots.txt properly configured
- [ ] Canonical URLs implemented
- [ ] hreflang tags added for all languages
- [ ] Meta descriptions unique and optimized
- [ ] Social media preview cards tested

## Testing & Validation

1. **OpenGraph Validation**

   - Use Facebook Sharing Debugger
   - Use Twitter Card Validator
   - Test all content types

2. **Structured Data Testing**

   - Use Google Rich Results Test
   - Validate all schema types

3. **Language Implementation**

   - Test browser language detection
   - Verify language switching
   - Check canonical URLs
   - Validate hreflang implementation

4. **SEO Tools Integration**
   - Configure Google Search Console
   - Setup Bing Webmaster Tools
   - Implement basic analytics

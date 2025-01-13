# CRO.CAFE Website Project - MVP Briefing

## Overview

CRO.cafe is a multilingual podcast network focused on Conversion Rate Optimization (CRO). The network consists of four shows in different languages:

- English (https://www.cro.cafe/)
- Dutch (https://nl.cro.cafe/)
- German (https://de.cro.cafe/)
- Spanish (https://es.cro.cafe/)

## MVP Goals

1. Create a unified website that showcases all four podcast shows
2. Implement automated episode management through Transistor API
3. Provide excellent user experience across all languages
4. Build a solid foundation for future expansion

## Core Features

### Homepage (English)

- Latest episodes from all shows
- Links to language-specific landing pages
- Clear navigation structure
- Responsive design

### Language-Specific Landing Pages

- Show-specific episode lists
- Content in respective language
- Consistent layout across languages
- Easy language switching

### Episode Pages

- Episode content from Transistor API
- Media embeds (YouTube, etc.)
- Share functionality
- Responsive design
- Graceful degradation for missing fields

## Technical Requirements

### Transistor API Integration

- Rate limit compliance (10 calls/minute)
- Error handling for API failures
- Graceful degradation for missing fields
- Automated content updates via webhook/GitHub Action
- Episode data stored in JSON format

### Content Management

- Language-specific content structure
- Image optimization
- Canonical URLs and language references
- SEO optimization
- Structured data for episodes

### Performance & UX

- Fast page loads
- Responsive design
- Loading states
- Error handling
- Accessibility compliance
- SEO optimization

## Future Features (Post-MVP)

- Guest detail pages
- Platform subscription pages
- Quotes system
- Advanced search functionality
- Enhanced analytics
- Additional language features

## Technical Stack

- Framework: Astro 5.0
- Styling: Tailwind CSS
- Language: TypeScript
- Hosting: Netlify
- Content: Transistor API
- Build: GitHub Actions

## Development Standards

- TypeScript strict mode
- Tailwind CSS for styling
- Responsive design
- Accessibility compliance
- Performance optimization
- SEO best practices
- Error handling
- Testing coverage

## Deployment

- Netlify hosting
- Automatic deployments from main branch
- Environment-specific configurations
- Proper caching headers
- SEO-friendly URLs

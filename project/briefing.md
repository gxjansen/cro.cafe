# Initial Project briefing

In the workspace, you find an Astro 5.0 website, with a template (based on Tailwind).

My end goal is to migrate 4 different websites to a single website for cost saving purposes.

Your challenge, as very experienced website architect is to create an plan for a junior software developer to implement this project. Investigate the current websites and podcast feeds, and design the best architecture for this project.

You will add your implementation-plan.md file to the /project folder. This document should contain an overview of the migration and implementation steps as a checklist divided into sections. We should work towards a working website MVP first, and then add more functionality as we go. Each section of the implementation plan should show verifiable (by the user of through software tests) validation checks that are required to complete the section. For each section you can create an additional specialist file with detailed information and instructions for the junior developer.

Use the MCP tools at your disposal, mainly 'astro-docs', 'puppeteer' and 'sequential-thinking' could be relevant.

## Template Analysis & Setup

### Reusable Components

Analyze and adapt existing template components:

- Article/MDX page structure for episodes and guests
- Tag and category page layouts for filtering
- Homepage examples for language-specific landing pages
- Header and footer components
- Dark/light mode switcher functionality

### Template Cleanup

- Move existing template content to a reference folder:
  - Original pages
  - Navigation structure
  - Sample images
  - Demo content
- Keep reference material accessible for future consultation
- Clean up unused components and styles

## General information about the CRO.CAFE podcast:

- Each of the 4 shows is in a different language and has it's own unique RSS feed in that language. We can use this RSS feed to pull episode data from.
- The podcast content is mostly interviews with people from the CRO.CAFE community. Each episode has 0, 1 or 2 guests and 1 or 2 hosts.
- Each feed consists of unique content, these are not translations of the same episodes (maybe something we can offer in the future, but not now)

### The 4 podcast shows: Website URL - Language - RSS feed - Sitemap

- https://www.cro.cafe/ - (English) - https://feeds.transistor.fm/cro-cafe - https://www.cro.cafe/sitemap.xml
- https://nl.cro.cafe/ - (Dutch) - https://feeds.transistor.fm/cro-cafe-nl - https://nl.cro.cafe/sitemap.xml
- https://de.cro.cafe/ - (German) - https://feeds.transistor.fm/cro-cafe-deutsch - https://de.cro.cafe/sitemap.xml
- https://es.cro.cafe/ - (Spanish) - https://feeds.transistor.fm/cro-cafe-es - https://es.cro.cafe/sitemap.xml

## Similarities between the current websites:

- Design and structure:
  - Navigation: Header and footer showing logo, navigation links, search functionality and a language/show switcher
  - Homepage: Shows widgets with: latest episode(s), brand listeners, quotes, most popular subscription options, general info about the podcast and host, featured guests, featured episodes.
  - Episode overview: show latest episodes for the specific show
  - Episode detail pages: show all available details on that episode, including (linking to) the host and guests
  - Guest overview (overview of all guests)
  - Guest detail pages (show all available details on a specific guest)
  - Platform overview (show subscription options for that show)
- Search functionality to search through episode descriptions
- Host(s): feature a short intro of the podcast host on each episode page
- Quotes: section on the homepage, featuring quotes from listeners. There is overlap in between the sites: some quotes have been translated, but are essentially the same quote.
- Brand listeners: the (people from) brands that listen to the podcast. There is overlap in between the sites: we show the same brands across different languages.

## Differences between the current websites and podcast feeds/languages:

- Language: Each website is in the language that aligns with the language of the podcast show
- Hosts: Each show is hosted by a different person. For all episodes within a language show, this is mostly the same person or persons (2 hosts max), but there can be different hosts for different episodes.
- Guests: Each show has different guests. Some guests can appear in multiple episodes and even in multiple shows. When a guest appears in multiple shows: create a guest page for each in their respective language folder, add a canonical that makes the English variant the main page.
- Platforms: The Podcast apps people can use to subscribe to. For each of the 4 shows, there can be up to 24 different apps, each with their own unique landingpage for each show. E.g.: for Spotify, we will have 4 different links that people can use to subscribe to each language feed opf the podcast. This needs to presented in a user friendly way.
- The English variant of the current website also featured an events and books section, that can be ignored and will not be transferred to the new website.

## Data Management & Content Structure

### Content Organization

Use Astro 5.0 Content Collections to manage all content with the following structure:

- episodes: MDX files for podcast episodes

  - Folder structure: /content/episodes/{language}/season-{number}/
  - Images stored alongside MDX in episode folders
  - Required RSS feed data:
    - title
    - pubDate
    - podcast:season
    - podcast:episode
    - description
    - enclosure
    - duration
    - itunes:episodeType (Normal, Trailer, Bonus)
  - Optional metadata from Transistor API:
    - Host
    - Guests
    - Summary (for SERP Meta Description)
    - ID
    - Number (overall episode number)
    - Type (full, trailer, bonus)
    - Image URL
    - Share URL
    - Embed HTML/URL
    - Keywords
    - Featured flag
  - Organized by language/show
  - Type-safe content management through Zod schemas
  - Supports rich content formatting

- guests: MDX files for guest profiles

  - Multi-language support for bios
  - References to episodes they appear in
  - Social media links and profile information

- quotes: MDX files for listener quotes

  - Multi-language support for translated quotes
  - Author and company information
  - Featured flag for homepage display

- brands: MDX files for brand listeners

  - Logo and website information
  - Featured flag for homepage display

- platforms: JSON files for platform data
  - One file per show
  - List of platforms with their respective show URLs
  - Up to 24 different apps per show
  - Simple data structure without rich content needs

### Data Import & Synchronization

#### Initial Import & Updates

- Source all episode data from Transistor API
- Use Transistor episode ID as unique identifier
- Preserve existing slugs for SEO
- Generate new slugs from episode titles
- Download and optimize images from Transistor CDN

#### Real-time Updates

Implement Transistor webhooks and Netlify Functions:

```typescript
// netlify/functions/transistor-webhook.ts
export const handler: Handler = async (event) => {
  const payload = JSON.parse(event.body!) as TransistorWebhookPayload;

  if (payload.event === 'episode.published' || payload.event === 'episode.updated') {
    await fetch(process.env.NETLIFY_BUILD_HOOK!, {
      method: 'POST',
    });
  }

  return { statusCode: 200 };
};
```

This setup:

- Receives real-time updates from Transistor
- Processes episode publish/update events
- Triggers Netlify rebuild automatically
- Maintains content freshness with minimal delay

## Project Standards

### Design & Accessibility

- Follow design guidelines in project/design-standards.md
- Implement accessibility requirements from project/accessibility-checklist.md
- Use proper HTML language tags (e.g., "en-US", "nl-NL")
- Implement OpenGraph for all pages

### Performance Requirements

- Target Lighthouse scores of 95+ in all dimensions:
  - Performance
  - Accessibility
  - Best Practices
  - SEO
- Leverage Astro's built-in performance optimizations

### Browser Support

- Support latest versions of:
  - Safari
  - Chrome-based browsers (Chrome, Edge, Opera)
- No specific polyfills required

### Testing Requirements

- Implement Vitest for unit and integration testing
- Create end-to-end tests for critical user flows:
  - Episode navigation
  - Language switching
  - Search functionality
  - RSS feed synchronization

### Error Handling

- RSS Feed failures:
  - GitHub Actions will retry on next scheduled run
  - No additional error handling needed beyond GitHub's notifications
- Component failures:
  - Implement graceful fallbacks for UI components
  - Log errors to console in development

## Website Structure & Language Management

- On the homepage of www.cro.cafe, show the latest episodes for each show. The interface for the combined feed will (also) be in English, but individual episode cards (Transistor embeds) will be in the language of the show.
- In addition, create language specific pages for each show, with the same episode cards as the homepage. The interface will be in the language of the show.
- On all pages, give the user the ability to switch between the 4 shows and the unified feed.
- Redirect language-specific users (based on browser language detection for first visit) on their first visit to their respective pages while allowing easy access to the single feed and the rest of the website/languages
- Use canonical tags to clarify the primary version of each page and prevent duplicate content penalties. For instance, make language-specific pages canonical for language-specific queries and the single feed canonical for general podcast searches.
- Optimize for search engines by dynamically embedding episode metadata within the page.

### Use language folders

#### URL Structure:

- Use /en/, /de/, etc., for language-specific content.
- Maintain unique slugs for guests and episodes across languages. Individual episode pages can be created based on the Transistor API data. For guests, generate slugs from their names while ensuring uniqueness across languages.

#### Handle Cross-Language Guests/Episodes:

For guests or episodes appearing in multiple languages:

- Create separate pages for each language version (e.g., /en/guest-name and /de/guest-name).
- Use canonical tags to point to the primary language version (English).
- Include cross-language links (hreflang tags) for user and SEO clarity.

#### Language Selection:

Offer a language switcher that moves the user to the landingpage of the selected language. Do NOT preserves the user’s context (e.g., switching from /en/guest-name to /de/guest-name), because in most cases, the episode or guest won't exist in the other language. The language switcher should be in the header of the website and in the native language of the show (e.g. "Deutsch" for the German version of the website).

#### Fallback Strategy:

Default to English if the user’s language preference cannot be detected or matched.

### Language management

- For UI elements (navigation, buttons, etc.), manage translations through translation files, fallback to English if the translation is not available.
- The content should already be in the language of the show, so we don't need to translate the content.

## Deployment & Infrastructure

- Deployment via Netlify from main branch
- Automatic builds triggered by content updates
- URL redirects handled through Netlify:
  - Map old site URLs to new structure using sitemaps
  - Redirect unmapped URLs to language-specific landing pages
  - Example: Unmapped es.cro.cafe URLs redirect to Spanish landing page

## Features & Components

### Episode Display

- Show sequential episode numbers (e.g., "Overall Episode #21")
- Use Transistor.FM embed player in phase 1:
  ```html
  <iframe
    width="100%"
    height="180"
    frameborder="no"
    scrolling="no"
    seamless=""
    src="https://share.transistor.fm/e/90b62ec1"
  ></iframe>
  ```
  - Episode ID from RSS feed (last 8 digits of link/enclosure URL)

### Search Functionality

- Implement PageFind for static search in phase 1
- Features:
  - Global search across all episodes and guests
  - Mixed results with language filters
  - Results page shows content in original language
- Evaluate need for more powerful search solution in later phases

### Image Management

- Download images from Transistor CDN
- Store optimized versions locally
- Use Astro's built-in <Image> component for automatic optimization

## Technical Details & Future Plans

### Project Scope & Development

- No timeline constraints for transition
- Analytics and tracking handled separately
- Content management through Transistor dashboard
- Create sync script for Transistor API integration
- Monitor API rate limits and webhook reliability

### Custom player (later phase):

- Use open-source libraries like Howler.js or Audio.js to simplify development
- Ensure your player is responsive and works across devices and browsers.

### Episode enrichment (later phase)

- Use existing services to generate transcripts for each episode
- Use AI to generate episode summaries, timelines and tags, to improve search results

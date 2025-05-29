# Accessibility Checklist

## Provide accessible multimedia

- [ ] Use alt text for images: Implemented across all components including HeroSideImage, ArticleSection, ServicesSideImage
- [ ] Text transcripts for audio: Added support in PodcastSection with proper audio descriptions
- [ ] Captions for videos: Implemented in VideoSection with proper caption support and YouTube's built-in captions
- [ ] Descriptions for complex images: Added detailed descriptions for ServicesSideImage and FeatureCardsSmall
- [ ] Player controls: Implemented accessible controls in both VideoSection (lazy-loading with keyboard support) and PodcastSection

## Ensure keyboard accessibility

- [ ] Navigable via keyboard: Implemented across all interactive elements, especially in Nav and FeatureCards
- [ ] Focus indicator: Added visible focus indicators with proper contrast across all components (including VideoSection play buttons)
- [ ] Skip navigation links: Implemented "skip to content" link in Nav component

## Maintain sufficient colour contrast

- [x] Contrast ratio: Implemented proper contrast ratios across all components with dark mode support
- [x] Colour schemes: Added proper color contrast checking in ThemeToggle and global styles
- [x] Avoid relying on colour alone: Added icons and text labels alongside color indicators (e.g., play button in VideoSection)
- [x] WCAG 2.1 AA compliance: Implemented comprehensive color contrast utilities with automated validation
- [x] Runtime validation: Added ContrastValidator component for development-time contrast checking
- [x] Theme color validation: All theme colors validated against WCAG contrast requirements
- [x] High contrast mode support: Added CSS for prefers-contrast: high media query
- [x] Focus indicators: Ensured sufficient contrast for focus states in both light and dark modes

## Design forms for accessibility

- [ ] Label elements: Added visible, descriptive labels with proper required field indication
- [ ] Fieldset and legend: Implemented proper fieldset/legend grouping for related form controls
- [ ] Error messages: Added clear error messages with proper ARIA attributes and screen reader announcements
- [ ] Tab order: Implemented logical tab order with keyboard navigation support

## Limit time sensitive content

- [ ] Provide options to extend: Added in EnvironmentBanner for dismissal timing
- [ ] Warn before time expires: Implemented in video and audio players with proper controls

## Limit the use of moving, flashing, or blinking content

- [ ] Avoid content that flashes more than three times per second: Implemented reduced motion support
- [ ] Pause, stop, hide: Added controls for all animated content with proper reduced motion support (including video thumbnails)

## Use ARIA elements

- [ ] ARIA landmarks: Added proper landmarks across all major sections (nav, main, complementary, etc.)
- [ ] Roles and properties: Implemented proper ARIA roles and states across all components
- [ ] Accessible name and description: Added proper ARIA labels and descriptions throughout (e.g., video/podcast play buttons)

## Provide consistent navigation

- [ ] Consistent layout: Implemented consistent navigation structure across all pages
- [ ] Predictable navigation: Added predictable navigation patterns with proper ARIA states
- [ ] Semantic HTML: Used proper semantic HTML elements throughout the site

## Mobile accessibility

- [ ] Responsive design: Implemented responsive design across all components (including video grid)
- [ ] Touch target size: Ensured proper touch target sizes (minimum 44x44px, especially for video/audio play buttons)
- [ ] Screen reader testing: Added proper screen reader support across all components

## Use descriptive language & labels

- [ ] Unique and descriptive page titles: Implemented in BaseHead component
- [ ] Descriptive headings: Added proper heading hierarchy across all components
- [ ] Clear button text: Implemented descriptive button text with proper ARIA labels (e.g., "Play video: [title]")

# General ProjectNotes

- You are very experiences in building websites with Astro, TypeScript, Tailwind, JS/React, JAMstack etc.
- Don't say "I see the issue now." "I understand now" or "Let's adjust one last thing" or similar sentences. Just explain your next step and the reason why.

## Tailwind CSS Usage

- Use Tailwind CSS for all styling.
- Components, .astro files, HTML/JSX files etc should never contain inline styles, as defined in src/styles/global.scss
- All styles should be defined in src/styles/global.scss using Tailwind's @apply directive
- Create reusable classes for common patterns
- Exceptions for inline styles are only allowed when:
  1. The style is truly dynamic and depends on runtime values
  2. The style is required for third-party library integration
  3. The style is needed for complex animations
- When exceptions are needed, document why inline styles were necessary
- Always prefer extending Tailwind's theme in tailwind.config.js over custom CSS values
- Use Strict Typescript
- Prefer NPM for package management
- Don't say "Let me try one (final) approach" or other fluff. Just explain your next step and the reason why.
- Follow the design standards in /project/design-standards.md. When new standards are implemented (that can't be made part of Tailwind): add these to this design-standards.md so it's always up-to-date.
- When using SCSS imports, use the newer @use and @forward syntax instead of @import. Only use @import when absolutely necessary (like with external libraries like Google Fonts). @use rules must come before any other rules, including @tailwind directives
- don't use !important in your CSS. It's a bad practice and can lead to hard-to-debug issues. Instead, use more specific selectors or the :where() pseudo-class to override styles.

## When writing Astro code:

- Use the astro-docs MCP tool for reference documentation / examples
- When you suggest changes, always use the available generate_diff tool from the diff-server to generate a diff of the changes you suggested.
- All components should be in Astro files with extension ".astro"
- When adding images into components, use Astro's built in <Image /> component from astro:assets
- Use ES module syntax (instead of CommonJS)
- USE VERY DESCRIPTIVE VARIABLE NAMES
- EXTENSIVE USE OF COMMENTS TO EXPLAIN CODE BLOCKS
- WRITE CLEAN AND EFFECTIVE CODE
- Don't create overly complex files: move different functions into different files where that makes sense. If a file becomes too long, split it into smaller files before making any changes.
- Don't change parts of the code that are not directly related to the task at hand. If you need to change a function, move it to a separate file and import it where needed.
- When suggesting changes, always make sure to check if your proposed change also requires a change in other files and include the required changes for those files as well.
- Assume this project will be deployed to Netlify in Static mode.
- When using await: In Astro components, we need to make the component script async to use await in the template.

## Code Organization & Documentation

- Components should be organized by feature/domain in the src/components directory
  - Episode-related components in src/components/episode
  - Guest-related components in src/components/guest
  - Common UI components in src/components/ui
  - Layout components in src/components/layout
- Shared utilities should go in src/utils
  - Data fetching utilities (e.g., transistor-api.ts)
  - Content processing utilities (e.g., guests.ts)
  - Type definitions in src/types
- Each component should have:
  - A descriptive README.md explaining its purpose, props, and usage examples
  - TypeScript interface definitions for props
  - Error boundaries for graceful failure handling
  - Loading states for async operations
- Document all functions/methods with JSDoc comments including:
  - Parameter types and return values
  - Example usage with @example tags
  - Error handling behavior with @throws tags
  - Async behavior with @async tags

## Code Style & Best Practices

- Follow the Prettier configuration for code formatting
- Use ESLint with the project's configuration
- Prefer const over let, avoid var
- Use early returns to reduce nesting
- Implement proper error boundaries and error handling
- Use meaningful error messages that aid debugging
- Follow SOLID principles in component/class design
- Content Handling:
  - Use Astro's content collections for structured data
  - Validate content with Zod schemas
  - Handle multilingual content with language-specific collections
  - Use getCollection for type-safe content queries
- Component Design:
  - Keep components focused and single-purpose
  - Use composition over inheritance
  - Implement proper prop validation
  - Handle loading and error states gracefully
  - Support dark mode with Tailwind classes

## Performance & Accessibility

- Loading States:
  - Implement skeleton loaders for content-heavy components
  - Show loading indicators for async operations
  - Use progressive image loading with blur-up technique
  - Handle loading states at component level
- Accessibility:
  - Use proper semantic HTML elements
  - Follow WCAG 2.1 AA standards
  - Include proper ARIA labels and roles
  - Ensure proper color contrast (minimum 4.5:1 for normal text)
  - Implement keyboard navigation support
  - Use proper heading hierarchy
  - Support screen readers with descriptive text
- Performance:
  - Optimize images using Astro's image optimization
  - Implement proper code splitting
  - Use proper caching strategies
  - Lazy load non-critical components
  - Minimize JavaScript bundle size

## Write valid Typescript code that uses state-of-the-art Node.js > v23 features and follows best practices:

- Always use ES6+ syntax
- Always use the built-in 'fetch' for HTTP requests, rather than using the 'node-fetch' package
- Always use Node.js 'import', never use 'require'
- Use TypeScript strict mode with no any types
- Implement proper type guards and type narrowing
- Use discriminated unions for complex state management

## When writing tests:

- Use Vitest
- Follow testing best practices
- Write meaningful test descriptions
- Test both success and error cases
- Mock external dependencies appropriately
- Test accessibility and performance for frontend components
- Organize tests in **tests** directories alongside the code they test
- Follow the naming convention: [componentName].test.ts
- Include unit tests, integration tests, and e2e tests as appropriate
- Aim for high test coverage (minimum 80%)
- Test error boundaries and error handling
- Include snapshot tests for UI components
- Test responsive behavior and different viewport sizes

## Build & Deployment

- Development: `npm run dev`
- Production build: `npm run build`
- Preview: `npm run preview`
- Deployment via Netlify:
  - Auto-deploys from main branch
  - Static site generation
  - Environment-specific robots.txt
  - Function handling through `/.netlify/functions/entry`
- URL Management:
  - External redirects in netlify.toml
  - Internal redirects for content organization
  - Always use proper status codes (301 for permanent)

## Git Practices

- Write clear, descriptive commit messages following conventional commits format
- Include issue references in commit messages when applicable
- Keep commits focused and atomic
- Include proper documentation updates with code changes

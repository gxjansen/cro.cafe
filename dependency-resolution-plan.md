# Dependency Resolution Plan for Netlify Build

## Current Issue

The Netlify build is failing with the following error:

```
npm error While resolving: @astrojs/react@4.2.0
npm error Found: @types/react@18.3.18
npm error node_modules/@types/react
npm error   dev @types/react@"^18.2.31" from the root project
npm error   peer @types/react@"^17.0.50 || ^18.0.21 || ^19.0.0" from @astrojs/react@4.2.0
npm error   node_modules/@astrojs/react
npm error     @astrojs/react@"^4.2.0" from the root project

npm error Could not resolve dependency:
npm error peer @types/react-dom@"^17.0.17 || ^18.0.6 || ^19.0.0" from @astrojs/react@4.2.0
```

This is a peer dependency conflict between `@astrojs/react`, `@types/react`, and `@types/react-dom`.

## Solution Options

### Option 1: Add Missing Peer Dependency

Add `@types/react-dom` as a dev dependency in `package.json`:

```json
"devDependencies": {
  "@types/react-dom": "^18.2.19",
  // existing dependencies...
}
```

### Option 2: Use Legacy Peer Dependencies Flag in Netlify Build

Update the Netlify build command in `netlify.toml` to use the `--legacy-peer-deps` flag:

```toml
[build]
  command = "npm install --legacy-peer-deps && npm run build"
  publish = "dist"
```

### Option 3: Update React Types to Compatible Versions

Update both React types to versions that are compatible with each other:

```json
"devDependencies": {
  "@types/react": "^18.2.45",
  "@types/react-dom": "^18.2.18",
  // existing dependencies...
}
```

## Recommended Approach

Option 1 is the simplest and least invasive. It adds the missing peer dependency without changing existing dependencies or build processes.

## Implementation Steps

1. Switch to Code mode to edit the package.json file
2. Add `@types/react-dom` to the `devDependencies` in `package.json` with the following change:

```diff
"devDependencies": {
  "@astrojs/rss": "^4.0.11",
  "@iconify-json/tabler": "^1.2.14",
  "@netlify/functions": "^3.0.0",
  "@octokit/rest": "^21.1.0",
  "@tailwindcss/typography": "^0.5.16",
  "@types/csv-parse": "^1.1.12",
  "@types/dotenv": "^6.1.1",
  "@types/js-yaml": "^4.0.9",
  "@types/jsdom": "^21.1.3",
  "@types/lodash.merge": "^4.6.9",
  "@types/node": "^20.8.7",
  "@types/node-fetch": "^2.6.12",
  "@types/react": "^18.2.31",
+ "@types/react-dom": "^19.0.4",
  "@unpic/astro": "^0.1.0",
  "@vitest/ui": "^3.0.2",
  "eslint": "^8.52.0",
  "eslint-plugin-astro": "^0.29.1",
  "node-fetch": "^3.3.2",
  "tsx": "^4.7.0",
  "typescript": "^5.7.3",
  "vitest": "^3.0.3"
}
```

3. Test the build locally
4. Push the changes to GitHub
5. Verify the Netlify build succeeds

## Potential Risks

- There could be other peer dependency conflicts that aren't immediately apparent
- The specific version of `@types/react-dom` might not be compatible with the current setup

If Option 1 doesn't work, we can try Option 2 or Option 3 as fallbacks.
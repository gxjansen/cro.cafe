/** @type {import("prettier").Config} */
export default {
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
        jsxBracketSameLine: false,
        singleQuote: false,
        jsxSingleQuote: false,
        semi: true,
        tabWidth: 2,
        useTabs: false,
        printWidth: 100,
        trailingComma: 'es5',
        bracketSpacing: true,
      },
    },
  ],
};

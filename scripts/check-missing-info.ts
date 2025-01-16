import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

interface Episode {
  attributes: {
    title: string;
    alternate_url: string | null;
    description: string;
  };
}

// Function to check if a file has missing information
function checkEpisode(filePath: string): { title: string; issues: string[] } | null {
  try {
    const content = JSON.parse(readFileSync(filePath, 'utf-8'));

    // Validate the content structure
    if (!content?.attributes?.title) {
      console.error(`Invalid episode format in ${filePath}: missing title`);
      return null;
    }

    const issues: string[] = [];

    // Check for convert.com in summary or description
    const summary = content.attributes?.summary?.toLowerCase() || '';
    const description = content.attributes?.description?.toLowerCase() || '';

    if (summary.includes('convert.com') || description.includes('convert.com')) {
      issues.push('Contains reference to convert.com');
    }

    if (issues.length > 0) {
      return {
        title: content.attributes.title,
        issues,
      };
    }

    return null;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return null;
  }
}

// Function to check all episodes in a language directory
function checkLanguageDirectory(langDir: string): { title: string; issues: string[] }[] {
  const results: { title: string; issues: string[] }[] = [];
  const episodesPath = join(process.cwd(), 'src/content', langDir);

  try {
    const files = readdirSync(episodesPath);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const result = checkEpisode(join(episodesPath, file));
        if (result) {
          results.push(result);
        }
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${langDir}:`, error);
  }

  return results;
}

// Main function to check all language directories
function main() {
  const languageDirs = ['de-episodes', 'en-episodes', 'es-episodes', 'nl-episodes'];
  const allResults: Record<string, { title: string; issues: string[] }[]> = {};

  for (const langDir of languageDirs) {
    const results = checkLanguageDirectory(langDir);
    if (results.length > 0) {
      allResults[langDir] = results;
    }
  }

  // Generate markdown output
  let markdown = '# Missing Information in Episodes\n\n';
  markdown +=
    'This document lists episodes that are missing critical information. Episodes are categorized by language and listed if they are missing either:\n\n';
  markdown += '- Contains reference to convert.com in summary or description\n\n';

  // Sort language directories for consistent output
  const sortedLangDirs = Object.entries(allResults)
    .filter(([_, results]) => results && results.length > 0)
    .sort(([a], [b]) => a.localeCompare(b));

  for (const [langDir, results] of sortedLangDirs) {
    const langTitle = (langDir.split('-')[0] || '').toUpperCase();
    markdown += `## ${langTitle} Episodes (${langDir})\n\n`;

    results
      .filter((result): result is { title: string; issues: string[] } => {
        return Boolean(result?.title && result?.issues);
      })
      .forEach((result, index) => {
        markdown += `${index + 1}. "${result.title}"\n`;
        result.issues.forEach((issue) => {
          markdown += `   - ${issue}\n`;
        });
        markdown += '\n';
      });
  }

  // Write results to file
  writeFileSync(join(process.cwd(), 'project/missing-info.md'), markdown);
}

main();

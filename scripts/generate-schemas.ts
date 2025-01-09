import { zodToJsonSchema } from 'zod-to-json-schema';
import fs from 'fs/promises';
import path from 'path';
import {
  EpisodeSchema,
  PersonSchema,
  PlatformSchema,
  BrandSchema,
} from '../src/utils/content-schemas';

// Define the schemas to generate
const schemas = {
  'de/episodes': EpisodeSchema,
  'de/guests': PersonSchema,
  'de/platforms': PlatformSchema,
  'en/episodes': EpisodeSchema,
  'en/guests': PersonSchema,
  'en/platforms': PlatformSchema,
  'es/episodes': EpisodeSchema,
  'es/guests': PersonSchema,
  'es/brands': BrandSchema,
  'nl/episodes': EpisodeSchema,
  'nl/guests': PersonSchema,
};

async function generateSchemas() {
  const schemaDir = path.join(process.cwd(), '.astro', 'collections');

  // Ensure the directory exists
  await fs.mkdir(schemaDir, { recursive: true });

  // Generate schema files
  for (const [name, schema] of Object.entries(schemas)) {
    const jsonSchema = zodToJsonSchema(schema, {
      name: name.replace('/', '_'),
      $refStrategy: 'none',
    });

    const dirPath = path.join(schemaDir, path.dirname(name));
    await fs.mkdir(dirPath, { recursive: true });

    const filePath = path.join(schemaDir, `${name}.schema.json`);
    await fs.writeFile(filePath, JSON.stringify(jsonSchema, null, 2));
    console.log(`Generated schema for ${name}`);
  }
}

generateSchemas().catch(console.error);

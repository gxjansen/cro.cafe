import { parse } from "csv-parse/sync";
import type { CastingContext } from "csv-parse/sync";
import fs from "fs";
import type { Episode, Person, Platform, Quote, BrandListener } from "../types";

export function importEpisodes(filePath: string): Episode[] {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    console.log("Raw content from episodes CSV:", content);
    return parse(content, {
      columns: true,
      skip_empty_lines: true,
      cast: (value: string, context: CastingContext) => {
        if (context.column === "Duration (min)") return Number(value);
        return value;
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function importPeople(filePath: string): Person[] {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return parse(content, {
      columns: true,
      skip_empty_lines: true,
    });
  } catch (error) {
    console.error(`Error reading CSV file at ${filePath}:`, error);
    throw error;
  }
}

export function importPlatforms(filePath: string): Platform[] {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return parse(content, {
      columns: true,
      skip_empty_lines: true,
    });
  } catch (error) {
    console.error(`Error reading CSV file at ${filePath}:`, error);
    throw error;
  }
}

export function importQuotes(filePath: string): Quote[] {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return parse(content, {
      columns: true,
      skip_empty_lines: true,
      cast: (value: string, context: CastingContext) => {
        if (context.column === "Timestamp (s)") return Number(value);
        return value;
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function importBrandListeners(filePath: string): BrandListener[] {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return parse(content, {
      columns: true,
      skip_empty_lines: true,
    });
  } catch (error) {
    console.error(`Error reading CSV file at ${filePath}:`, error);
    throw error;
  }
}

import { describe, it, expect } from "vitest";
import {
  importEpisodes,
  importPeople,
  importPlatforms,
  importQuotes,
  importBrandListeners,
} from "./data-import";

describe("Data Import Utilities", () => {
  it("should import episodes", () => {
    const episodes = importEpisodes(
      "project/current-site-data/English/CRO.CAFE - Episodes.csv",
    );
    expect(episodes).toBeInstanceOf(Array);
    expect(episodes[0]).toHaveProperty("Episode Title");
  });

  it("should import people", () => {
    const people = importPeople(
      "project/current-site-data/English/CRO.CAFE - People.csv",
    );
    expect(people).toBeInstanceOf(Array);
    expect(people[0]).toHaveProperty("Name");
  });

  it("should import platforms", () => {
    const platforms = importPlatforms(
      "project/current-site-data/English/CRO.CAFE - Platforms.csv",
    );
    expect(platforms).toBeInstanceOf(Array);
    expect(platforms[0]).toHaveProperty("Name");
  });

  it("should import quotes", () => {
    const quotes = importQuotes(
      "project/current-site-data/English/CRO.CAFE - Quotes.csv",
    );
    expect(quotes).toBeInstanceOf(Array);
    expect(quotes[0]).toHaveProperty("Quote Text");
  });

  it("should import brand listeners", () => {
    const brandListeners = importBrandListeners(
      "project/current-site-data/English/CRO.CAFE - Brand listeners.csv",
    );
    expect(brandListeners).toBeInstanceOf(Array);
    expect(brandListeners[0]).toHaveProperty("Name");
  });
});

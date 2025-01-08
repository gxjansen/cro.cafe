import { describe, it, expect } from 'vitest';
import { validateProps, EpisodeGridPropsSchema } from '~/utils/component-validation';

describe('Grid Component Validation', () => {
  // Test validation schema directly
  const validProps = {
    language: 'en',
    limit: 10,
    featured: false,
    showGuests: true,
    columns: '3',
  };

  it('validates required props', () => {
    // Missing required language prop
    expect(() => validateProps(EpisodeGridPropsSchema, {})).toThrow();

    // Only required prop
    expect(() =>
      validateProps(EpisodeGridPropsSchema, {
        language: 'en',
      })
    ).not.toThrow();

    // All valid props
    expect(() => validateProps(EpisodeGridPropsSchema, validProps)).not.toThrow();
  });

  it('validates language values', () => {
    // Invalid language
    expect(() =>
      validateProps(EpisodeGridPropsSchema, {
        language: 'fr', // Not in supported languages
      })
    ).toThrow();

    // Valid languages
    ['en', 'de', 'es', 'nl'].forEach((lang) => {
      expect(() =>
        validateProps(EpisodeGridPropsSchema, {
          language: lang,
        })
      ).not.toThrow();
    });
  });

  it('validates optional props', () => {
    // Invalid limit type
    expect(() =>
      validateProps(EpisodeGridPropsSchema, {
        language: 'en',
        limit: '10', // Should be number
      })
    ).toThrow();

    // Invalid featured type
    expect(() =>
      validateProps(EpisodeGridPropsSchema, {
        language: 'en',
        featured: 'true', // Should be boolean
      })
    ).toThrow();

    // Invalid showGuests type
    expect(() =>
      validateProps(EpisodeGridPropsSchema, {
        language: 'en',
        showGuests: 1, // Should be boolean
      })
    ).toThrow();
  });

  it('validates columns prop', () => {
    // Invalid column number
    expect(() =>
      validateProps(EpisodeGridPropsSchema, {
        language: 'en',
        columns: '5', // Should be '2', '3', or '4'
      })
    ).toThrow();

    // Valid column numbers
    ['2', '3', '4'].forEach((cols) => {
      expect(() =>
        validateProps(EpisodeGridPropsSchema, {
          language: 'en',
          columns: cols,
        })
      ).not.toThrow();
    });
  });

  it('handles combinations of optional props', () => {
    // Multiple optional props
    expect(() =>
      validateProps(EpisodeGridPropsSchema, {
        language: 'en',
        limit: 5,
        featured: true,
        columns: '2',
      })
    ).not.toThrow();

    // All props with edge values
    expect(() =>
      validateProps(EpisodeGridPropsSchema, {
        language: 'en',
        limit: 1,
        featured: false,
        showGuests: false,
        columns: '4',
      })
    ).not.toThrow();
  });
});

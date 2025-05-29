import { describe, it, expect } from 'vitest';
import {
  getContrastRatio,
  meetsContrastRequirement,
  getContrastGrade,
  validateThemeContrast,
  CONTRAST_RATIOS,
} from './accessibility';

describe('Color Contrast Utilities', () => {
  describe('getContrastRatio', () => {
    it('should calculate correct contrast ratio for black and white', () => {
      const ratio = getContrastRatio('#000000', '#ffffff');
      expect(ratio).toBe(21);
    });

    it('should calculate correct contrast ratio for same colors', () => {
      const ratio = getContrastRatio('#ff0000', '#ff0000');
      expect(ratio).toBe(1);
    });

    it('should handle colors without # prefix', () => {
      const ratio = getContrastRatio('000000', 'ffffff');
      expect(ratio).toBe(21);
    });

    it('should throw error for invalid colors', () => {
      expect(() => getContrastRatio('invalid', '#ffffff')).toThrow();
    });
  });

  describe('meetsContrastRequirement', () => {
    it('should pass AA normal text requirements', () => {
      // Black on white should pass AA
      expect(meetsContrastRequirement('#000000', '#ffffff', 'AA', false)).toBe(true);

      // Light gray on white should fail AA
      expect(meetsContrastRequirement('#cccccc', '#ffffff', 'AA', false)).toBe(false);
    });

    it('should pass AA large text requirements', () => {
      // Light gray on white should pass AA for large text
      expect(meetsContrastRequirement('#767676', '#ffffff', 'AA', true)).toBe(true);
    });

    it('should handle AAA requirements', () => {
      expect(meetsContrastRequirement('#000000', '#ffffff', 'AAA', false)).toBe(true);
      expect(meetsContrastRequirement('#595959', '#ffffff', 'AAA', false)).toBe(false);
    });
  });

  describe('getContrastGrade', () => {
    it('should return correct grades', () => {
      expect(getContrastGrade('#000000', '#ffffff')).toBe('AAA');
      expect(getContrastGrade('#595959', '#ffffff')).toBe('AA');
      expect(getContrastGrade('#cccccc', '#ffffff')).toBe('FAIL');
    });

    it('should handle large text grading', () => {
      expect(getContrastGrade('#767676', '#ffffff', true)).toBe('AA');
      expect(getContrastGrade('#949494', '#ffffff', true)).toBe('FAIL');
    });
  });

  describe('validateThemeContrast', () => {
    it('should validate theme colors', () => {
      const result = validateThemeContrast();

      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('issues');
      expect(Array.isArray(result.issues)).toBe(true);

      // Log any issues for debugging
      if (result.issues.length > 0) {
        console.log('Contrast issues found:', result.issues);
      }
    });

    it('should identify specific problematic combinations', () => {
      const result = validateThemeContrast();

      // Check if any issues are reported
      result.issues.forEach((issue) => {
        expect(issue).toHaveProperty('combination');
        expect(issue).toHaveProperty('ratio');
        expect(issue).toHaveProperty('grade');
        expect(issue).toHaveProperty('required');
        expect(issue.ratio).toBeLessThan(issue.required);
      });
    });
  });

  describe('Theme Color Compliance', () => {
    it('should ensure primary color has sufficient contrast on white', () => {
      const ratio = getContrastRatio('#ff676d', '#ffffff');
      expect(ratio).toBeGreaterThanOrEqual(CONTRAST_RATIOS.AA_NORMAL);
    });

    it('should ensure secondary color has sufficient contrast on white', () => {
      const ratio = getContrastRatio('#95c3c0', '#ffffff');
      expect(ratio).toBeGreaterThanOrEqual(CONTRAST_RATIOS.AA_NORMAL);
    });

    it('should ensure default text color has sufficient contrast on white', () => {
      const ratio = getContrastRatio('#1f2937', '#ffffff');
      expect(ratio).toBeGreaterThanOrEqual(CONTRAST_RATIOS.AA_NORMAL);
    });

    it('should ensure heading color has sufficient contrast on white', () => {
      const ratio = getContrastRatio('#111827', '#ffffff');
      expect(ratio).toBeGreaterThanOrEqual(CONTRAST_RATIOS.AA_NORMAL);
    });

    it('should ensure language badge combinations meet requirements', () => {
      // German badge: yellow text on black
      const germanRatio = getContrastRatio('#FFD700', '#000000');
      expect(germanRatio).toBeGreaterThanOrEqual(CONTRAST_RATIOS.AA_NORMAL);

      // Spanish badge: red text on yellow
      const spanishRatio = getContrastRatio('#AA151B', '#F1BF00');
      expect(spanishRatio).toBeGreaterThanOrEqual(CONTRAST_RATIOS.AA_NORMAL);

      // English badge: white text on red
      const englishRatio = getContrastRatio('#ffffff', '#cf142b');
      expect(englishRatio).toBeGreaterThanOrEqual(CONTRAST_RATIOS.AA_NORMAL);

      // Dutch badge: white text on blue
      const dutchRatio = getContrastRatio('#ffffff', '#21468B');
      expect(dutchRatio).toBeGreaterThanOrEqual(CONTRAST_RATIOS.AA_NORMAL);
    });
  });
});

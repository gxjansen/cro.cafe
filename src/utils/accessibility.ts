/**
 * Utility functions for managing keyboard navigation and focus
 */

// Keyboard key codes
export const KEYS = {
  TAB: 'Tab',
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
} as const;

/**
 * Focus trap for modal dialogs and other components that need to trap focus
 */
export class FocusTrap {
  private element: HTMLElement;
  private focusableElements: HTMLElement[];
  private firstFocusableElement: HTMLElement | null;
  private lastFocusableElement: HTMLElement | null;
  private previousActiveElement: HTMLElement | null;

  constructor(element: HTMLElement) {
    this.element = element;
    this.focusableElements = [];
    this.firstFocusableElement = null;
    this.lastFocusableElement = null;
    this.previousActiveElement = document.activeElement as HTMLElement;
    this.updateFocusableElements();
  }

  private updateFocusableElements() {
    // Get all focusable elements
    this.focusableElements = Array.from(
      this.element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];

    // Filter out hidden elements
    this.focusableElements = this.focusableElements.filter(
      (el) => !el.hasAttribute('hidden') && el.offsetParent !== null
    );

    this.firstFocusableElement = this.focusableElements[0] || null;
    this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1] || null;
  }

  public activate() {
    this.element.addEventListener('keydown', this.handleKeyDown);
    // Store current focus
    this.previousActiveElement = document.activeElement as HTMLElement;
    // Set initial focus
    if (this.firstFocusableElement) {
      this.firstFocusableElement.focus();
    }
  }

  public deactivate() {
    this.element.removeEventListener('keydown', this.handleKeyDown);
    // Restore previous focus
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
    }
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === KEYS.TAB) {
      // Trap focus within the element
      if (!this.firstFocusableElement || !this.lastFocusableElement) return;

      if (event.shiftKey) {
        if (document.activeElement === this.firstFocusableElement) {
          event.preventDefault();
          this.lastFocusableElement.focus();
        }
      } else {
        if (document.activeElement === this.lastFocusableElement) {
          event.preventDefault();
          this.firstFocusableElement.focus();
        }
      }
    }
  };
}

/**
 * Helper to manage focus within a list of items
 */
export class ListKeyboardNav {
  private element: HTMLElement;
  private items: HTMLElement[];
  private currentIndex: number;

  constructor(element: HTMLElement, itemSelector: string) {
    this.element = element;
    this.items = Array.from(element.querySelectorAll(itemSelector)) as HTMLElement[];
    this.currentIndex = 0;
  }

  public activate() {
    this.element.addEventListener('keydown', this.handleKeyDown);
  }

  public deactivate() {
    this.element.removeEventListener('keydown', this.handleKeyDown);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case KEYS.ARROW_DOWN:
        event.preventDefault();
        this.focusNextItem();
        break;
      case KEYS.ARROW_UP:
        event.preventDefault();
        this.focusPreviousItem();
        break;
      case KEYS.HOME:
        event.preventDefault();
        this.focusFirstItem();
        break;
      case KEYS.END:
        event.preventDefault();
        this.focusLastItem();
        break;
    }
  };

  private focusNextItem() {
    if (this.items.length === 0) return;
    this.currentIndex = Math.min(this.currentIndex + 1, this.items.length - 1);
    this.items[this.currentIndex]?.focus();
  }

  private focusPreviousItem() {
    if (this.items.length === 0) return;
    this.currentIndex = Math.max(this.currentIndex - 1, 0);
    this.items[this.currentIndex]?.focus();
  }

  private focusFirstItem() {
    if (this.items.length === 0) return;
    this.currentIndex = 0;
    this.items[0]?.focus();
  }

  private focusLastItem() {
    if (this.items.length === 0) return;
    this.currentIndex = this.items.length - 1;
    this.items[this.currentIndex]?.focus();
  }
}

/**
 * Helper to announce messages to screen readers
 */
export class LiveRegion {
  private element: HTMLElement;

  constructor(ariaLive: 'polite' | 'assertive' = 'polite') {
    this.element = document.createElement('div');
    this.element.setAttribute('aria-live', ariaLive);
    this.element.setAttribute('aria-atomic', 'true');
    this.element.className = 'sr-only';
    document.body.appendChild(this.element);
  }

  public announce(message: string) {
    this.element.textContent = message;
  }

  public remove() {
    this.element.remove();
  }
}

/**
 * Helper to manage skip links
 */
export function setupSkipLinks() {
  const skipLinks = document.querySelectorAll('[data-skip-link]');
  skipLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = (link as HTMLAnchorElement).hash.slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.tabIndex = -1;
        target.focus();
        // Remove tabindex after blur
        target.addEventListener(
          'blur',
          () => {
            target.removeAttribute('tabindex');
          },
          { once: true }
        );
      }
    });
  });
}

/**
 * Color contrast utilities for WCAG 2.1 AA compliance
 */

// WCAG 2.1 contrast ratio requirements
export const CONTRAST_RATIOS = {
  AA_NORMAL: 4.5,
  AA_LARGE: 3,
  AAA_NORMAL: 7,
  AAA_LARGE: 4.5,
} as const;

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance of a color
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    throw new Error('Invalid color format. Please use hex colors (e.g., #ffffff)');
  }

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check if color combination meets WCAG contrast requirements
 */
export function meetsContrastRequirement(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  const requirement = isLargeText
    ? level === 'AA'
      ? CONTRAST_RATIOS.AA_LARGE
      : CONTRAST_RATIOS.AAA_LARGE
    : level === 'AA'
    ? CONTRAST_RATIOS.AA_NORMAL
    : CONTRAST_RATIOS.AAA_NORMAL;

  return ratio >= requirement;
}

/**
 * Get contrast ratio grade for a color combination
 */
export function getContrastGrade(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): 'AAA' | 'AA' | 'FAIL' {
  const ratio = getContrastRatio(foreground, background);

  if (isLargeText) {
    if (ratio >= CONTRAST_RATIOS.AAA_LARGE) return 'AAA';
    if (ratio >= CONTRAST_RATIOS.AA_LARGE) return 'AA';
  } else {
    if (ratio >= CONTRAST_RATIOS.AAA_NORMAL) return 'AAA';
    if (ratio >= CONTRAST_RATIOS.AA_NORMAL) return 'AA';
  }

  return 'FAIL';
}

/**
 * Validate all theme colors for contrast compliance
 */
export function validateThemeContrast(): {
  valid: boolean;
  issues: Array<{
    combination: string;
    ratio: number;
    grade: string;
    required: number;
  }>;
} {
  // Define our theme colors from tailwind.config.js
  const colors = {
    primary: '#ff676d',
    secondary: '#95c3c0',
    accent: '#ff676d',
    'accent-dark': '#7bfff8',
    default: '#1f2937',
    muted: '#6b7280',
    heading: '#111827',
    page: '#ffffff',
    'lang-en': '#cf142b',
    'lang-nl': '#21468B',
    'lang-de': '#000000',
    'lang-de-text': '#FFD700',
    'lang-es': '#F1BF00',
    'lang-es-text': '#AA151B',
  };

  const backgrounds = ['#ffffff', '#1f2937', '#111827']; // white, gray-800, gray-900
  const issues: Array<{
    combination: string;
    ratio: number;
    grade: string;
    required: number;
  }> = [];

  // Test common color combinations
  const testCombinations = [
    { fg: colors.primary, bg: colors.page, name: 'Primary on White' },
    { fg: colors.secondary, bg: colors.page, name: 'Secondary on White' },
    { fg: colors.accent, bg: colors.page, name: 'Accent on White' },
    { fg: colors.default, bg: colors.page, name: 'Default on White' },
    { fg: colors.heading, bg: colors.page, name: 'Heading on White' },
    { fg: colors.muted, bg: colors.page, name: 'Muted on White' },
    { fg: colors.page, bg: colors.default, name: 'White on Default' },
    { fg: colors.page, bg: colors.heading, name: 'White on Heading' },
    { fg: colors['lang-de-text'], bg: colors['lang-de'], name: 'German Badge' },
    { fg: colors['lang-es-text'], bg: colors['lang-es'], name: 'Spanish Badge' },
    { fg: colors.page, bg: colors['lang-en'], name: 'English Badge' },
    { fg: colors.page, bg: colors['lang-nl'], name: 'Dutch Badge' },
  ];

  testCombinations.forEach(({ fg, bg, name }) => {
    const ratio = getContrastRatio(fg, bg);
    const grade = getContrastGrade(fg, bg);

    if (grade === 'FAIL') {
      issues.push({
        combination: name,
        ratio: Math.round(ratio * 100) / 100,
        grade,
        required: CONTRAST_RATIOS.AA_NORMAL,
      });
    }
  });

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Generate accessible color suggestions
 */
export function suggestAccessibleColor(
  baseColor: string,
  background: string,
  targetRatio: number = CONTRAST_RATIOS.AA_NORMAL
): string {
  const bgRgb = hexToRgb(background);
  if (!bgRgb) throw new Error('Invalid background color');

  const bgLuminance = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

  // Calculate target luminance
  let targetLuminance: number;
  if (bgLuminance > 0.5) {
    // Light background, need darker text
    targetLuminance = (bgLuminance + 0.05) / targetRatio - 0.05;
  } else {
    // Dark background, need lighter text
    targetLuminance = (bgLuminance + 0.05) * targetRatio - 0.05;
  }

  // Clamp luminance to valid range
  targetLuminance = Math.max(0, Math.min(1, targetLuminance));

  // Convert back to RGB (simplified approach)
  const targetValue = targetLuminance > 0.5 ? 255 : 0;
  const hex = targetValue.toString(16).padStart(2, '0');

  return `#${hex}${hex}${hex}`;
}

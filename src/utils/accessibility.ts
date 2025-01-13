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

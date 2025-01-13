import { ListKeyboardNav } from '~/utils/accessibility';

// Initialize keyboard navigation for episode grids
export function initializeGridNavigation() {
  document.querySelectorAll('[data-grid-nav]').forEach((grid) => {
    const nav = new ListKeyboardNav(grid as HTMLElement, '.episode-cell');
    nav.activate();
  });
}

/**
 * Process episode description to add pagebreaks around guest sections
 */
export function processEpisodeDescription(description: string): string {
  // Add pagebreaks around guest section if it exists
  const guestSectionStart = '<!-- GUESTS START -->';
  const guestSectionEnd = '<!-- GUESTS END -->';

  let processedDescription = description;

  if (description.includes(guestSectionStart) && description.includes(guestSectionEnd)) {
    processedDescription = description.replace(
      new RegExp(`${guestSectionStart}(.*?)${guestSectionEnd}`, 's'),
      `\n\n${guestSectionStart}$1${guestSectionEnd}\n\n`
    );
  }

  // Strip HTML tags while preserving guest section markers
  return processedDescription.replace(/<(?!\!--\s*GUESTS\s(?:START|END)\s*--)([^>]*?)>/g, '');
}

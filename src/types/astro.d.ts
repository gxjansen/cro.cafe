export interface Metadata {
  title: string;
  description: string;
  type?: string;
  alternateLanguages?: { [key: string]: string };
}

export interface PageProps {
  metadata: Metadata;
  availableLanguages: readonly ('en' | 'nl' | 'de' | 'es')[];
  currentLang: 'en' | 'nl' | 'de' | 'es';
}

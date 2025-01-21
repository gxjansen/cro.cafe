export interface Metadata {
  title: string;
  description: string;
  type?: 'article' | 'page' | 'website';
  alternateLanguages?: { [key: string]: string };
  image?: string;
  canonicalUrl?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}

export interface PageProps {
  metadata: Metadata;
  availableLanguages: readonly ('en' | 'nl' | 'de' | 'es')[];
  currentLang: 'en' | 'nl' | 'de' | 'es';
}

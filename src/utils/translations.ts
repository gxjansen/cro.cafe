export const translations = {
  en: {
    title: 'CRO.cafe - Conversion Rate Optimization Podcast',
    description:
      'Expert interviews and discussions about Conversion Rate Optimization, A/B testing, and UX research.',
    latestEpisodes: 'Latest Episodes',
    listenNow: 'Listen Now',
    languageButtons: {
      en: 'English Podcast',
      nl: 'Nederlandse Podcast',
      de: 'Deutsche Podcast',
      es: 'Podcast en Español',
    },
    error404: {
      title: 'Page not found',
      description: "But don't worry, you can find plenty of other things on our homepage.",
      backToHome: 'Back to homepage',
    },
  },
  nl: {
    title: 'CRO.cafe - Conversie Optimalisatie Podcast',
    description:
      'Expert interviews en discussies over Conversie Optimalisatie, A/B testen en UX onderzoek.',
    latestEpisodes: 'Laatste Afleveringen',
    listenNow: 'Luister Nu',
    languageButtons: {
      en: 'English Podcast',
      nl: 'Nederlandse Podcast',
      de: 'Deutsche Podcast',
      es: 'Podcast en Español',
    },
    error404: {
      title: 'Pagina niet gevonden',
      description: 'Maar geen zorgen, je kunt genoeg andere dingen vinden op onze homepage.',
      backToHome: 'Terug naar homepage',
    },
  },
  de: {
    title: 'CRO.cafe - Conversion Rate Optimierung Podcast',
    description:
      'Experteninterviews und Diskussionen über Conversion Rate Optimierung, A/B-Tests und UX-Research.',
    latestEpisodes: 'Neueste Folgen',
    listenNow: 'Jetzt Anhören',
    languageButtons: {
      en: 'English Podcast',
      nl: 'Nederlandse Podcast',
      de: 'Deutsche Podcast',
      es: 'Podcast en Español',
    },
    error404: {
      title: 'Seite nicht gefunden',
      description:
        'Aber keine Sorge, auf unserer Homepage findest du viele andere interessante Inhalte.',
      backToHome: 'Zurück zur Homepage',
    },
  },
  es: {
    title: 'CRO.cafe - Podcast de Optimización de Conversión',
    description:
      'Entrevistas con expertos y discusiones sobre Optimización de Conversión, pruebas A/B e investigación UX.',
    latestEpisodes: 'Últimos Episodios',
    listenNow: 'Escuchar Ahora',
    languageButtons: {
      en: 'English Podcast',
      nl: 'Nederlandse Podcast',
      de: 'Deutsche Podcast',
      es: 'Podcast en Español',
    },
    error404: {
      title: 'Página no encontrada',
      description:
        'Pero no te preocupes, puedes encontrar muchas otras cosas en nuestra página principal.',
      backToHome: 'Volver a la página principal',
    },
  },
} as const;

export type Language = keyof typeof translations;

export function getTranslations(lang: Language) {
  return translations[lang];
}

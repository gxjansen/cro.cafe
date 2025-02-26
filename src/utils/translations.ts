export const translations = {
  en: {
    title: 'CRO.CAFE - Conversion Rate Optimization Podcast',
    description:
      "Join 15K+ subscribers for the world's most exciting, raw discussions on experimentation, CRO, user research and digital marketing from the industry leaders who live and breathe it\.",
    latestEpisodes: 'Latest Episodes',
    listenNow: 'Listen Now',
    yourHost: 'Your Host',
    yourHosts: 'Your Hosts',
    episodeGuests: 'Episode Guests',
    meetTheGuests: 'Meet the Guests',
    allGuests: 'All Guests',
    viewAllGuests: 'View all guests',
    guest: 'Guest',
    episodesWithGuest: 'Episodes with {name}',
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
    title: 'CRO.CAFE - De podcast over klantgedreven digitale optimalisatie',
    description: 'Sluit je aan bij 15K+ CRO en digital marketing specialisten',
    latestEpisodes: 'Laatste Afleveringen',
    listenNow: 'Luister Nu',
    yourHost: 'Uw Host',
    yourHosts: 'Uw Hosts',
    episodeGuests: 'Aflevering Gasten',
    meetTheGuests: 'Ontmoet de Gasten',
    allGuests: 'Alle Gasten',
    viewAllGuests: 'Bekijk alle gasten',
    guest: 'Gast',
    episodesWithGuest: 'Afleveringen met {name}',
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
    title: 'CRO.CAFE - Conversion Rate Optimierung Podcast',
    description:
      'Werde Teil unserer 15K+ Abonnenten und begleite Branchenführer und Experten der Marketing-Szene in spannenden Diskussionen über digitales Marketing, CRO, Nutzerforschung und Testing.',
    latestEpisodes: 'Neueste Folgen',
    listenNow: 'Jetzt Anhören',
    yourHost: 'Ihr Gastgeber',
    yourHosts: 'Ihre Gastgeber',
    episodeGuests: 'Folgen Gäste',
    meetTheGuests: 'Treffen Sie die Gäste',
    allGuests: 'Alle Gäste',
    viewAllGuests: 'Alle Gäste anzeigen',
    guest: 'Gast',
    episodesWithGuest: 'Episoden mit {name}',
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
    title: 'CRO.CAFE - El podcast sobre optimización digital centrado en el consumidor',
    description:
      'Únete a más de 15K+ profesionales y especialistas del marketing digital que ya están suscritos.',
    latestEpisodes: 'Últimos Episodios',
    listenNow: 'Escuchar Ahora',
    yourHost: 'Su Anfitrión',
    yourHosts: 'Sus Anfitriones',
    episodeGuests: 'Invitados del Episodio',
    meetTheGuests: 'Conozca a los Invitados',
    allGuests: 'Todos los Invitados',
    viewAllGuests: 'Ver todos los invitados',
    guest: 'Invitado',
    episodesWithGuest: 'Episodios con {name}',
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

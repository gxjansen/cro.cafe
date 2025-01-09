import type { MiddlewareHandler, APIContext } from 'astro';

// Supported languages
const supportedLanguages = ['en', 'de', 'es', 'nl'] as const;
type SupportedLanguage = (typeof supportedLanguages)[number];

// Routes that should be redirected to language-specific versions
const languageRoutes = ['/episodes', '/guests', '/topics'];

export const onRequest: MiddlewareHandler = async (
  context: APIContext,
  next: () => Promise<Response>
) => {
  // Skip for static assets and API routes
  if (
    context.url.pathname.startsWith('/assets/') ||
    context.url.pathname.startsWith('/api/') ||
    context.url.pathname.startsWith('/_astro/') ||
    context.url.pathname === '/favicon.ico'
  ) {
    return next();
  }

  const pathSegments = context.url.pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0] || '';

  // Check if current path needs language redirect
  if (languageRoutes.includes('/' + firstSegment)) {
    // Get preferred language from cookie or Accept-Language header
    let preferredLanguage: SupportedLanguage = 'en';

    // Check cookie first
    const cookies = context.request.headers.get('cookie') || '';
    const cookieMatch = cookies.match(/preferredLanguage=([^;]+)/);
    const languageCookie = cookieMatch ? cookieMatch[1] : null;

    if (languageCookie && supportedLanguages.includes(languageCookie as SupportedLanguage)) {
      preferredLanguage = languageCookie as SupportedLanguage;
    } else {
      // Fall back to Accept-Language header
      const acceptLanguage = context.request.headers.get('accept-language');
      if (acceptLanguage) {
        const browserLanguages = acceptLanguage
          .split(',')
          .map((lang) => lang.split(';')[0].trim().substring(0, 2).toLowerCase());

        for (const browserLang of browserLanguages) {
          if (supportedLanguages.includes(browserLang as SupportedLanguage)) {
            preferredLanguage = browserLang as SupportedLanguage;
            break;
          }
        }
      }
    }

    // Redirect to language-specific version
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/${preferredLanguage}${context.url.pathname}`,
      },
    });
  }

  // Set language in locals for components to use
  const currentLang: SupportedLanguage = supportedLanguages.includes(
    firstSegment as SupportedLanguage
  )
    ? (firstSegment as SupportedLanguage)
    : 'en';

  (context.locals as Record<string, unknown>).lang = currentLang;

  return next();
};

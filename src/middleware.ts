import type { MiddlewareHandler, APIContext } from 'astro';
import { checkLanguageRedirect } from './utils/language';

export const onRequest: MiddlewareHandler = async (
  context: APIContext,
  next: () => Promise<Response>
) => {
  // Skip language check for static assets and API routes
  if (
    context.url.pathname.startsWith('/assets/') ||
    context.url.pathname.startsWith('/api/') ||
    context.url.pathname.startsWith('/_astro/') ||
    context.url.pathname === '/favicon.ico'
  ) {
    return next();
  }

  // Add language information to locals for use in components
  const currentLang = context.url.pathname.split('/')[1];
  (context.locals as Record<string, unknown>).lang = currentLang;

  // Check if language redirect is needed
  const redirectUrl = checkLanguageRedirect(context);

  if (redirectUrl) {
    return context.redirect(redirectUrl, 307);
  }

  // Continue to page rendering
  const response = await next();

  // Add Vary header to ensure proper caching with language detection
  response.headers.append('Vary', 'Accept-Language');

  return response;
};

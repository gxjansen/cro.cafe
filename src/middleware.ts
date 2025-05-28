import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, redirect } = context;
  const pathname = url.pathname;

  // Skip redirects for API routes, assets, and new structure URLs
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_') ||
    pathname.startsWith('/en/') ||
    pathname.startsWith('/nl/') ||
    pathname.startsWith('/de/') ||
    pathname.startsWith('/es/') ||
    pathname.includes('.') ||
    pathname === '/' ||
    pathname === '/search' ||
    pathname === '/rss.xml'
  ) {
    return next();
  }

  // Episode redirects: /podcast/[slug] -> /en/episodes/[slug]
  if (pathname.startsWith('/podcast/')) {
    const slug = pathname.replace('/podcast/', '');
    return redirect(`/en/episodes/${slug}`, 301);
  }

  // Guest redirects: /guest/[slug] -> /en/guests/[slug]
  if (pathname.startsWith('/guest/')) {
    const slug = pathname.replace('/guest/', '');
    return redirect(`/en/guests/${slug}`, 301);
  }

  // Subscribe platform redirects: /subscribe/[platform] -> /en/subscribe/
  if (pathname.startsWith('/subscribe/')) {
    return redirect('/en/subscribe/', 301);
  }

  // Event redirects: /event/[slug] -> /en/ (events not migrated)
  if (pathname.startsWith('/event/')) {
    return redirect('/en/', 301);
  }

  // Book redirects: /cro-book/[slug] -> /en/ (books not migrated)
  if (pathname.startsWith('/cro-book/')) {
    return redirect('/en/', 301);
  }

  // Collaboration redirects: /collaborate/* -> /en/
  if (pathname.startsWith('/collaborate/')) {
    return redirect('/en/', 301);
  }

  // Static page redirects
  const staticRedirects: Record<string, string> = {
    '/about': '/en/about/',
    '/privacy-policy': '/en/privacy/',
    '/female-cro-specialists': '/en/',
    '/croppuccino': '/en/',
    '/croppuccino-succes': '/en/',
    '/code-of-conduct': '/en/',
    '/live': '/en/',
    '/rss-episodes': '/rss.xml',
  };

  if (staticRedirects[pathname]) {
    return redirect(staticRedirects[pathname], 301);
  }

  // Default: continue to next middleware/page
  return next();
});

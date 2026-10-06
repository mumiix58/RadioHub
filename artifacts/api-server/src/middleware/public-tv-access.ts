import { SEO_LANGUAGES } from '@workspace/seo-shared/seo-config';
import { URL_TRANSLATIONS } from '@workspace/seo-shared/url-translations';

// A TV sign-in page is deliberately public. Let it reach the existing session,
// OAuth, validation and rate-limit handlers from every supported TV market.
// This is a route/method policy, never a reviewer, user-agent or account bypass.
const pageNames = ['tv', 'login', 'signup', 'forgot-password', 'reset-password'];
const pages = new Set(pageNames.map(name => `/${name}`));
const languages = new Set(SEO_LANGUAGES.filter(lang => lang.enabled).map(lang => lang.code));
for (const language of languages) {
  for (const name of pageNames) {
    pages.add(`/${language}/${name}`);
    const translated = URL_TRANSLATIONS[language]?.[name];
    if (translated) {
      pages.add(`/${language}/${translated}`);
      pages.add(encodeURI(`/${language}/${translated}`));
    }
  }
}

const readableAuth = new Set([
  '/api/auth/me',
  '/api/auth/social-status',
  '/api/auth/google', '/api/auth/google/callback',
  '/api/auth/apple',
  '/api/auth/facebook', '/api/auth/facebook/callback',
  '/api/auth/tv/verify',
]);
const writableAuth = new Set([
  '/api/auth/login', '/api/auth/signup',
  '/api/auth/forgot-password', '/api/auth/reset-password',
  '/api/auth/token-session', '/api/auth/logout',
  '/api/auth/apple/callback',
  '/api/auth/tv/code', '/api/auth/tv/activate', '/api/auth/tv/logout',
]);
const staticFiles = new Set([
  '/favicon.ico', '/favicon.png', '/apple-touch-icon.png',
  '/logo-icon.webp', '/header-logo-80w.webp', '/manifest.json', '/sw.js',
]);
// Hashed Vite imports, UI artwork and fonts are transitive dependencies of the
// public login shell. Read-only files only; API and arbitrary files stay blocked.
const staticAsset = /^\/(?:assets|fonts|images|icons)\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_.-]+\.(?:js|css|woff2?|ttf|otf|png|jpe?g|webp|svg|ico)$/;

export function isPublicTvAccessRequest(method: string, rawPath: string): boolean {
  if (!rawPath.startsWith('/') || /[\\\u0000-\u0020\u007f]/.test(rawPath)
    || /\/{2}|\/\.{1,2}(?:\/|$)/.test(rawPath)) return false;
  const path = rawPath.endsWith('/') ? rawPath.slice(0, -1) : rawPath;
  if (method === 'POST') return writableAuth.has(path);
  if (method !== 'GET' && method !== 'HEAD') return false;
  if (pages.has(path) || readableAuth.has(path) || staticFiles.has(path) || staticAsset.test(path)) return true;
  if (/^\/api\/auth\/tv\/code\/\d{6}\/status$/.test(path)) return true;
  const dictionary = /^\/api\/translations\/([a-z]{2})(?:\/critical)?$/.exec(path);
  return !!dictionary && languages.has(dictionary[1]);
}

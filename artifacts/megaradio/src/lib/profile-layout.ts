// Figma desktop profile shell: 250px sidebar + 30px content gutter.
// Share the inset with breadcrumbs so their first link tracks the page heading.
export const PROFILE_CONTENT_INSET = 'px-2 md:px-8 lg:pl-[280px] lg:pr-[30px]';

export function isProfileFavoritesPath(path: string) {
  return path.split(/[?#]/)[0].replace(/\/$/, '') === '/profile/favorites';
}

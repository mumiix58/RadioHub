export const OPEN_HOME_SEARCH = 'megaradio:open-home-search';

export type HomeSearchOpenEvent = CustomEvent<{ returnFocusTo: HTMLElement | null }>;

// A mounted home page claims the request; other routes (or a still-loading
// home page) can keep the header's standalone search as a fallback.
export function requestHomeSearch(returnFocusTo: HTMLElement | null): boolean {
  return !window.dispatchEvent(new CustomEvent(OPEN_HOME_SEARCH, {
    cancelable: true,
    detail: { returnFocusTo },
  }));
}

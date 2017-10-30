export function redirectTo(uri) {
  window.history.pushState({}, '', uri);
  window.dispatchEvent(new CustomEvent('location-changed'));
}

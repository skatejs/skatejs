export function observe(host: HTMLElement, observer: () => void) {
  const mo = new MutationObserver(observer);
  mo.observe(this, { childList: true });
  document.addEventListener('DOMContentLoaded', observer);
}

import { html } from './html';

export function style(...css) {
  return html`<style textContent="${css.join('')}"></style>`;
}

// @flow

import { html } from './html';

export function style(...css: Array<string>) {
  return html`<style textContent="${css.join('')}"></style>`;
}

import { bind } from 'hyperhtml';
import { CustomElement } from '@skatejs/component';

const cache = new WeakMap();

export default function(elem: CustomElement) {
  let html = cache.get(elem);
  if (!html) cache.set(elem, (html = bind(elem.renderRoot)));
  elem.render(html);
}

import init from './init';
import createFromHtml from '../util/create-from-html';

const slice = Array.prototype.slice;

function buildFragment (frag, arg) {
  if (arg) {
    if (typeof arg === 'string') {
      arg = fragment.apply(null, slice.call(createFromHtml(arg).childNodes));
    } else if (arg.length) {
      arg = fragment.apply(null, slice.call(arg));
    } else if (arg.nodeType) {
      init(arg);
    }
    frag.appendChild(arg);
  }
  return frag;
}

export default function fragment (...args) {
  return args.reduce(buildFragment, document.createDocumentFragment());
}

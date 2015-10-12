import init from './init';
import createFromHtml from '../util/create-from-html';

function buildFragment (frag, arg) {
  if (arg) {
    if (typeof arg === 'string') {
      arg = fragment(...createFromHtml(arg).childNodes);
    } else if (arg.length) {
      arg = fragment(...arg);
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

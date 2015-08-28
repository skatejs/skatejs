import init from './init';
import createFromHtml from '../util/create-from-html'

const DocumentFragmentPrototype = DocumentFragment.prototype;
const slice = Array.prototype.slice;

function decorateFragmentMethods (frag) {
  frag.appendChild = function (el) {
    return DocumentFragmentPrototype.appendChild.call(this, init(el));
  };

  frag.insertBefore = function (el, beforeEl) {
    return DocumentFragmentPrototype.insertBefore.call(this, init(el), beforeEl);
  };

  frag.replaceChild = function (el, replacedEl) {
    return DocumentFragmentPrototype.replaceChild.call(this, init(el), replacedEl);
  };

  frag.cloneNode = function () {
    var clone = DocumentFragmentPrototype.cloneNode.apply(this, arguments);
    decorateFragmentMethods(clone);
    var children = slice.call(clone.childNodes);
    for (var i = 0; i < children.length; i++) {
      init(children[i]);
    }
    return clone;
  };
}

export default function (html) {
  var frag = document.createDocumentFragment();
  decorateFragmentMethods(frag);
  if (typeof html === 'string') {
    var par = createFromHtml(html);
    while (par.firstElementChild) {
      frag.appendChild(par.firstElementChild);
    }
  }
  return frag;
}

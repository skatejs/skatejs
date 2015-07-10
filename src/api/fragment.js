import init from './init';
import createParentElement from '../util/create-parent-element'

var DocumentFragmentPrototype = DocumentFragment.prototype;

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
    for (var i = 0; i < clone.childElementCount; i++) {
      init(clone.childNodes[i]);
    }
    return clone;
  };
}

function createInitingFragment() {
  var frag = document.createDocumentFragment();
  decorateFragmentMethods(frag);
  return frag;
}

export default function (html) {
  var frag = createInitingFragment();
  if (typeof html === 'string') {
    var par = createParentElement(html);
    par.innerHTML = html;
    while (par.firstElementChild) {
      frag.appendChild(par.firstElementChild);
    }
  }
  return frag;
}

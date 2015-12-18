import fragment from '../fragment';

function createDomArray (initialState, onUpdate) {
  const childNodes = [].slice.call(initialState);
  const onUpdateFn = typeof onUpdate === 'function' ? onUpdate : function () {};
	
  return {
    get childNodes () {
      return childNodes;
    },
    get value () {
      return childNodes.length ? childNodes : '';
    },
    appendChild (child) {
      childNodes.push(child);
      onUpdateFn();
    },
    removeChild (child) {
      const index = childNodes.indexOf(child);
      index > -1 && childNodes.splice(index, 1);
      onUpdateFn();
      return this;
    },
    replaceChild (newChild, oldChild) {
      const index = childNodes.indexOf(oldChild);
      childNodes.splice(index, 1, newChild);
      onUpdateFn();
      return this;
    }
  };
}

export default {
  created (elem) {
    elem.__content = createDomArray(elem.childNodes, this.change.bind(null, elem));
  },
  get (elem) {
    return elem.__content;
  },
  set (elem, data) {
    if (data.newValue !== elem.__content) {
      while (elem.__content.childNodes.length) {
        elem.__content.childNodes.removeChild(elem.__content.childNodes[0]);
      }
      elem.__content.appendChild(fragment(data.newValue));
    }
  }
};
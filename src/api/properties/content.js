import data from '../../util/data';
import fragment from '../fragment';

function normalize (node) {
  return node instanceof DocumentFragment ? [].slice.call(node.childNodes) : [node];
}

function mutate (elem, type, args) {
  const desc = data(elem).contentPropertyProjectee;
  desc && desc[type].apply(desc, args);
}

function update (elem, change) {
  return function (type, args) {
    mutate(elem, type, args);
    change && change(elem, type, args);
  };
}

function createDomArray (elem, update) {
  const childNodes = [];

  return {
    get childNodes () {
      return childNodes;
    },
    appendChild (newNode) {
      childNodes.push.apply(childNodes, normalize(newNode));
      update('appendChild', [newNode]);
      return newNode;
    },
    insertBefore (newNode, referenceNode) {
      childNodes.splice.apply(null, [childNodes.indexOf(referenceNode), 0].concat(normalize(newNode)));
      update('insertBefore', [newNode, referenceNode]);
      return newNode;
    },
    removeChild (oldNode) {
      normalize(oldNode).forEach(function (oldNode) {
        childNodes.splice(childNodes.indexOf(oldNode), 1);
      });
      update('removeChild', [oldNode]);
      return oldNode;
    },
    replaceChild (newNode, oldNode) {
      childNodes.splice.apply(null, [childNodes.indexOf(oldNode), 1].concat(normalize(newNode)));
      update('replaceChild', [newNode, oldNode]);
      return oldNode;
    }
  };
}

export default {
  created (elem) {
    const eldata = data(elem);
    eldata.contentProperty = createDomArray(elem, update(elem, this.change));
    eldata.contentPropertyInitialState = [].slice.call(elem.childNodes);
    eldata.contentPropertyProjectee = this.selector ? elem.querySelector(this.selector) : null;
  },
  get (elem) {
    return data(elem).contentProperty;
  },
  ready (elem) {
    const eldata = data(elem);
    eldata.contentProperty.appendChild(fragment(eldata.contentPropertyInitialState));
    delete eldata.contentPropertyInitialState;
  },
  set (elem, data) {
    const eldata = data(elem);
    
    // If the initial state hasn't been set yet then we can't do anything.
    if (!eldata.contentPropertyInitialState) {
      eldata.contentProperty.appendChild(fragment(data.newValue));
    }
  }
};

import data from '../../util/data';
import fragment from '../fragment';

function normalize (node) {
  return node instanceof DocumentFragment ? [].slice.call(node.childNodes) : [node];
}

function createDomArray (onUpdate) {
  const childNodes = [];
  const onUpdateFn = typeof onUpdate === 'function' ? onUpdate : function () {};
	
  return {
    get childNodes () {
      return childNodes;
    },
    appendChild (newNode) {
      childNodes.push.apply(childNodes, normalize(newNode));
      onUpdateFn({
        type: 'appendChild',
        newValue: newNode,
        oldValue: null
      });
      return newNode;
    },
    insertBefore (newNode, referenceNode) {
      childNodes.splice.apply(null, [childNodes.indexOf(referenceNode), 0].concat(normalize(newNode)));
      onUpdateFn({
        type: 'insertBefore',
        newValue: newNode,
        oldValue: referenceNode
      });
      return newNode;
    },
    removeChild (oldNode) {
      normalize(oldNode).forEach(function (oldNode) {
        childNodes.splice(childNodes.indexOf(oldNode), 1);
      });
      onUpdateFn({
        type: 'removeChild',
        newValue: null,
        oldValue: oldNode
      });
      return oldNode;
    },
    replaceChild (newNode, oldNode) {
      childNodes.splice.apply(null, [childNodes.indexOf(oldNode), 1].concat(normalize(newNode)));
      onUpdateFn({
        type: 'replaceChild',
        newValue: newNode,
        oldValue: oldNode
      });
      return oldNode;
    },
    toArray () {
      return childNodes;
    },
    toFragment () {
      const frag = document.createDocumentFragment();
      childNodes.forEach(child => frag.appendChild(child));
      return frag;
    },
    toString () {
      return childNodes.map(child => child.outerHTML || child.textContent).join('');
    },
    toValue () {
      return childNodes.length ? childNodes : '';
    }
  };
}

export default {
  created (elem) {
    const change = (this.change || function() {});
    const eldata = data(elem);
    eldata.contentProperty = createDomArray(change.bind(null, elem));
    eldata.contentPropertyInitiaState = [].slice.call(elem.childNodes);
  },
  get (elem) {
    return data(elem).contentProperty;
  },
  ready (elem) {
    const eldata = data(elem);
    eldata.contentProperty.appendChild(fragment(elem.__initialState));
    delete eldata.contentPropertyIntialState;
  },
  set (elem, data) {
    const eldata = data(elem);
    
    if (data.newValue === eldata.contentProperty) {
      return;
    }
    
    const content = eldata.contentProperty;
    const childNodes = content.childNodes;
    
    while (childNodes.length) {
      childNodes.removeChild(childNodes[0]);
    }
    
    content.appendChild(fragment(data.newValue));
  }
};
import assign from 'object-assign';
import data from '../../util/data';

const { MutationObserver } = window;

if (!MutationObserver) {
  throw new Error('Usage of the content property requires MutationObserver support.');
}

// Calls the `change` callback if it's defined.
function change (el, cb) {
  cb = cb || function () {};
  return function (mo) {
    cb(el, mo.addedNodes || [], mo.removedNodes || []);
  };
}

// Creates a fake node for usage before the element is rendered so that the way
// of accessing the value of the content node does not change at any point
// during the rendering process. This is basically syntanctic sugar for not
// having to do something like:
//
//     elem.content && elem.content.value
//
// In your `render` function. Instead, you can just do:
//
//     elem.content.value
//
// This is to get around having to know about the implementation details which
// vary depending on if we're in native or polyfilled custom element land.
function createFakeNode (name) {
  return { 
    get [name] () {
      return null;
    }
  };
}

// Creates a real node so that the renering process can attach nodes to it.
function createRealNode (elem, name, selector) {
  const node = selector ? elem.querySelector(selector) : document.createElement('div'); 
  Object.defineProperty(node, name, {
    get () {
      const ch = this.childNodes;
      return ch && ch.length ? [].slice.call(ch) : null;
    }
  });
  return node;
}

// Sets initial content for the specified node.
function init (node, nodes) {
  for (let a = 0; a < nodes.length; a++) {
    node.appendChild(nodes[a]);
  }
}

export default function (opts = {}) {
  opts = assign({
    accessor: 'nodes',
    change: function () {},
    selector: ''
  }, opts);
  return {
    created (el) {
      const info = data(el);
      info.contentNode = createFakeNode(opts.accessor);
      info.initialState = [].slice.call(el.childNodes);
    },
    get (el) {
      return data(el).contentNode;
    },
    ready (elem) {
      const info = data(elem);
      const observer = new MutationObserver(change(elem, opts.change));
      info.contentNode = createRealNode(elem, opts.accessor, opts.selector);
      init(info.contentNode, info.initialState);
      observer.observe(info.contentNode, { childList: true });
    }
  };
}
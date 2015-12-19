import assign from 'object-assign';
import data from '../../util/data';

const { MutationObserver } = window;

if (!MutationObserver) {
  throw new Error('Usage of the content property requires MutationObserver support.');
}

function change (el, cb) {
  cb = cb || function () {};
  return function (mo) {
    cb(el, mo.addedNodes || [], mo.removedNodes || []);
  };
}

function createFakeProperty (node, opts) {
  return { 
    get [opts.nodeAccessor] () {
      return node;
    },
    get [opts.valueAccessor] () {
      return null;
    }
  };
}

function createRealProperty (node, opts) {
  Object.defineProperties(node, {
    [opts.nodeAccessor]: {
      get () {
        return node;
      }
    },
    [opts.valueAccessor]: {
      get () {
        const ch = this.childNodes;
        return ch && ch.length ? [].slice.call(ch) : null;
      }
    }
  });
  return node;
}

function init (el, nodes) {
  for (let a = 0; a < nodes.length; a++) {
    el.appendChild(nodes[a]);
  }
}

export default function (opts = {}) {
  opts = assign({
    nodeAccessor: 'node',
    valueAccessor: 'nodes',
    change: function () {},
    type: 'div'
  }, opts);
  return {
    created (el) {
      const info = data(el);
      info.contentNode = createFakeProperty(document.createElement(opts.type), opts);
      info.initialState = [].slice.call(el.childNodes);
    },
    get (el) {
      return data(el).contentNode;
    },
    ready (el) {
      const info = data(el);
      const observer = new MutationObserver(change(el, opts.change));
      info.contentNode = createRealProperty(info.contentNode.node, opts);
      init(info.contentNode, info.initialState);
      observer.observe(info.contentNode, { childList: true });
    }
  };
}
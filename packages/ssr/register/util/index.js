const fs = require('fs');
const path = require('path');
const vm = require('vm');

function each(node, call) {
  if (!node) {
    return node;
  }
  if (node.nodeName === '#document-fragment') {
    Array.from(node.childNodes).forEach(call);
  } else {
    call(node);
  }
  return node;
}

function execCode(data, opts = {}) {
  const { context, ...args } = opts;
  return vm.runInNewContext(data, context || window, opts);
}

function execFile(file, opts = {}) {
  const filename = path.resolve(path.join(document.ssr.scriptBase, file));
  const filedata = fs.readFileSync(filename).toString('utf-8');
  return execCode(filedata, { ...opts, ...{ filename } });
}

function expose(name, value) {
  return (global[name] = window[name] = value || require(`./${name}`)[name]);
}

function find(root, call, opts = {}) {
  const tree = document.createTreeWalker(root);

  // Since we short-circuit in the loop, we can initialise this to the default
  // return value we'd expect if nothing is found.
  const list = opts.one ? null : [];

  while (tree.nextNode()) {
    if (call(tree.currentNode)) {
      // Short-circuit if only returning one.
      if (opts.one) {
        return tree.currentNode;
      }
      list.push(tree.currentNode);
    }
  }

  return list;
}

function prop(obj, name, opts) {
  Object.defineProperty(obj, name, {
    ...{ configurable: true, enumerable: true },
    ...opts
  });
}

function walk(root, call) {
  if (!root) return;
  const tree = document.createTreeWalker(root);
  while (tree.nextNode()) {
    call(tree.currentNode, tree);
  }
}

module.exports = {
  each,
  execCode,
  execFile,
  expose,
  find,
  prop,
  walk
};

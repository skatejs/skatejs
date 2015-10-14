'use strict';

const created = require('../lib/lifecycle/created');
const Parser = require('htmlparser2').Parser;
const registry = require('../lib/global/registry');

function isTextNode (node) {
  return typeof node === 'string' && node.indexOf('<!--') === -1;
}

function objectifyAttributes (attrs) {
  return Object.keys(attrs).reduce(function (newAttrs, name) {
    newAttrs[name] = {
      nodeName: name,
      nodeValue: attrs[name]
    };
    return newAttrs;
  }, {});
}

function stringifyAttributes (attrs) {
  return Object.keys(attrs).reduce(function (html, name) {
    const attr = attrs[name];
    html += ` ${attr.nodeName}="${attr.nodeValue}"`;
    return html;
  }, '');
}

function stringifyChildNodes (childNodes) {
  return childNodes.reduce(function (html, node) {
    html += typeof node === 'object' ? node.outerHTML : node;
    return html;
  }, '');
}

function createVirtualElement (name, attrs) {
  return {
    tagName: name.toUpperCase(),
    attributes: objectifyAttributes(attrs),
    childNodes: [],
    className: attrs.class,
    id: attrs.id,
    get innerHTML () {
      return stringifyChildNodes(this.childNodes);
    },
    set innerHTML (html) {
      this.childNodes = [];
      parse(html).forEach(elem => this.childNodes.push(elem));
    },
    get outerHTML () {
      const tagName = this.tagName.toLowerCase();
      return `<${tagName}${stringifyAttributes(this.attributes)}>${this.innerHTML}</${tagName}>`;
    },
    set outerHTML (html) {
      // TODO
    },
    get textContent () {
      return this.childNodes.reduce(function (text, node) {
        if (typeof node === 'string' && node.indexOf('<!--') === -1) {
          text += node;
        }
        return text;
      }, '');
    },
    set textContent (text) {
      this.childNodes = [];
      parse(text).forEach(elem => isTextNode(elem) && this.childNodes.push(elem));
    },
    getAttribute (name) {
      const attr = this.attributes[name];
      return attr ? attr.nodeValue : null;
    },
    hasAttribute (name) {
      return typeof this.attributes[name] === 'object';
    },
    removeAttribute (name) {
      delete this.attributes[name];
    },
    setAttribute (name, value) {
      const attr = this.attributes[name];
      if (attr) {
        attr.nodeValue = value;
      } else {
        this.attributes[name] = {
          nodeName: name,
          nodeValue: value
        };
      }
    },
    appendChild (node) {
      invokeLifecycle(node);
      this.childNodes.push(node);
    },
    removeChild (node) {
      this.childNodes = this.childNodes.filter(function (existingNode) {
        return existingNode !== node;
      });
    },
    replaceChild (node, referenceNode) {
      invokeLifecycle(node);
      this.childNodes = this.childNodes.map(function (existingNode) {
        return existingNode === referenceNode ? node : existingNode;
      });
    }
  };
}

function invokeLifecycle (elem) {
  registry.find(elem).forEach(function (comp) {
    created(comp).call(elem);
    if (comp.render) {
      elem.innerHTML = render(comp.render(elem));
    }
  });
}

function parse (html) {
  let level = 0;
  let parent = null;
  const parents = [];

  function addToTree (elem) {
    if (parent) {
      parent.childNodes.push(elem);
    } else {
      parents.push(elem);
    }
  }

  const parser = new Parser({
    onopentag (name, attrs) {
      const elem = createVirtualElement(name, attrs);
      addToTree(elem);
      parent = elem;
      ++level;
    },
    onclosetag () {
      // Invoking the lifecycle at the closing tag point allows the element to
      // be populated with it's initial HTML which may be used by the
      // component.
      invokeLifecycle(parent);
      --level;
      if (level === 0) {
        parent = null;
      }
    },
    oncomment (data) {
      addToTree(`<!--${data}-->`);
    },
    ontext (text) {
      addToTree(text);
    }
  });
  parser.write(html);
  parser.end();
  return parents;
}

function render (html) {
  return stringifyChildNodes(parse(html));
}

module.exports = render;

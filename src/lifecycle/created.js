import assign from '../util/assign';
import data from '../util/data';
import events from './events';
import properties from './properties';
import protos from '../util/protos';
import registry from '../polyfill/registry';
import walkTree from '../util/walk-tree';

var elProto = window.Element.prototype;
var oldSetAttribute = elProto.setAttribute;
var oldRemoveAttribute = elProto.removeAttribute;

function patchAttributeMethods (elem) {
  elem.setAttribute = function (name, newValue) {
    var oldValue = this.getAttribute(name);
    oldSetAttribute.call(elem, name, newValue);
    elem.attributeChangedCallback(name, oldValue, String(newValue));
  };

  elem.removeAttribute = function (name) {
    var oldValue = this.getAttribute(name);
    oldRemoveAttribute.call(elem, name);
    elem.attributeChangedCallback(name, oldValue, null);
  };
}

function triggerAttributesCreated (elem) {
  var attrs = elem.attributes;
  for (let attr in attrs) {
    attr = attrs[attr];
    elem.attributeChangedCallback(attr.nodeName, null, attr.value || attr.nodeValue);
  }
}

function markAsResolved (elem, opts) {
  elem.removeAttribute(opts.unresolvedAttribute);
  elem.setAttribute(opts.resolvedAttribute, '');
}

function initAttributes (elem, attrs = {}) {
  Object.keys(attrs).forEach(function (name) {
    var attr = attrs[name];
    if (attr && attr.value && !elem.hasAttribute(name)) {
      var value = attr.value;
      value = typeof value === 'function' ? value(elem) : value;
      elem.setAttribute(name, value);
    }
  });
}

function applyPrototype (elem, opts) {
  protos(opts.prototype).forEach(function (proto) {
    if (!proto.isPrototypeOf(elem)) {
      assign(elem, proto);
    }
  });
}

function template (elem, opts) {
  if (opts.template && !elem.hasAttribute(opts.resolvedAttribute)) {
    opts.template(elem);
  }
}

function callCreatedOnDescendants (elem, opts) {
  walkTree(elem.childNodes, function (elem) {
    registry.getForElement(elem).forEach(Ctor => Ctor.prototype.createdCallback.call(elem));
  }, function (elem) {
    return !data(elem, opts.id).created;
  });
}

function callCreated (elem, opts) {
  if (opts.created) {
    opts.created(elem);
  }
}

export default function (opts) {
  /* jshint expr: true */
  return function () {
    var info = data(this, opts.id);
    var isNative = this.createdCallback;

    if (info.created) {
      return;
    }

    info.created = true;
    isNative || applyPrototype(this, opts);
    properties(this, opts.properties);
    template(this, opts);
    isNative || callCreatedOnDescendants(this, opts);
    isNative || patchAttributeMethods(this);
    events(this, opts.events);
    initAttributes(this, opts.attributes);
    callCreated(this, opts);
    triggerAttributesCreated(this);
    markAsResolved(this, opts);
  };
}

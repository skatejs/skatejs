import apiEvent from '../api/event';
import apiProperty from '../api/property';
import assignSafe from '../util/assign-safe';
import data from '../util/data';
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
  var attrsLength = attrs.length;
  for (let a = 0; a < attrsLength; a++) {
    let attr = attrs[a];
    elem.attributeChangedCallback(attr.name, null, attr.value);
  }
}

function markAsResolved (elem, opts) {
  elem.removeAttribute(opts.unresolvedAttribute);
  elem.setAttribute(opts.resolvedAttribute, '');
}

function applyPrototype (elem, opts) {
  protos(opts.prototype).forEach(function (proto) {
    if (!proto.isPrototypeOf(elem)) {
      assignSafe(elem, proto);
    }
  });
}

function template (elem, opts) {
  if (opts.template && !elem.hasAttribute(opts.resolvedAttribute)) {
    opts.template.call(elem);
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
    opts.created.call(elem);
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
    apiProperty(this, opts.properties);
    template(this, opts);
    isNative || callCreatedOnDescendants(this, opts);
    isNative || patchAttributeMethods(this);
    apiEvent(this, opts.events);
    callCreated(this, opts);
    triggerAttributesCreated(this);
    markAsResolved(this, opts);
  };
}

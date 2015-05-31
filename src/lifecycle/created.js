import assign from '../util/assign';
import camelCase from '../util/camel-case';
import data from '../util/data';
import events from './events';
import hasOwn from '../util/has-own';
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

function defineAttributeProperty (elem, attr) {
  Object.defineProperty(elem, camelCase(attr), {
    get: function () {
      return this.getAttribute(attr);
    },
    set: function (value) {
      return value === undefined ?
        this.removeAttribute(attr) :
        this.setAttribute(attr, value);
    }
  });
}

function linkProperties (elem, attrs = {}) {
  for (var attr in attrs) {
    if (hasOwn(attrs, attr) && elem[attr] === undefined) {
      defineAttributeProperty(elem, attr);
    }
  }
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

export default function (opts) {
  return function () {
    var isNative;
    var elem = this;
    var info = data(elem, opts.id);

    if (info.created) {
      return;
    }

    info.created = true;
    isNative = !!elem.createdCallback;

    // Native custom elements automatically inherit the prototype. We apply
    // the user defined prototype directly to the element instance if not.
    // Skate will always add lifecycle callbacks to the definition. If native
    // custom elements are being used, one of these will already be on the
    // element. If not, then we are initialising via non-native means.
    if (!isNative) {
      protos(opts.prototype).forEach(function (proto) {
        if (!proto.isPrototypeOf(elem)) {
          assign(elem, proto);
        }
      });
    }

    // We use the unresolved / resolved attributes to flag whether or not the
    // element has been templated or not.
    if (opts.template && !elem.hasAttribute(opts.resolvedAttribute)) {
      opts.template(elem);
    }

    // Native custom elements initialise descendants before the current node.
    if (!isNative) {
      walkTree(elem.childNodes, function (elem) {
        registry.getForElement(elem).forEach(Ctor => Ctor.prototype.createdCallback.call(elem));
      }, function (elem) {
        return !data(elem, opts.id).created;
      });
    }

    if (!isNative) {
      patchAttributeMethods(elem);
    }

    events(elem, opts.events);
    linkProperties(elem, opts.attributes);
    initAttributes(elem, opts.attributes);

    if (opts.created) {
      opts.created(elem);
    }

    triggerAttributesCreated(elem);
    markAsResolved(elem, opts);
  };
}

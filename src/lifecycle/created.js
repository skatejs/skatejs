import assign from '../util/assign';
import camelCase from '../util/camel-case';
import data from '../util/data';
import events from './events';
import hasOwn from '../util/has-own';
import protos from '../util/protos';

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

export default function (options) {
  return function () {
    var isNative;
    var element = this;
    var targetData = data(element, options.id);

    if (targetData.created) {
      return;
    }

    targetData.created = true;
    isNative = !!element.createdCallback;

    // Native custom elements automatically inherit the prototype. We apply
    // the user defined prototype directly to the element instance if not.
    // Skate will always add lifecycle callbacks to the definition. If native
    // custom elements are being used, one of these will already be on the
    // element. If not, then we are initialising via non-native means.
    if (!isNative) {
      protos(options.prototype).forEach(function (proto) {
        if (!proto.isPrototypeOf(element)) {
          assign(element, proto);
        }
      });
    }

    // We use the unresolved / resolved attributes to flag whether or not the
    // element has been templated or not.
    if (options.template && !element.hasAttribute(options.resolvedAttribute)) {
      options.template(element);
    }

    if (!isNative) {
      patchAttributeMethods(element);
    }

    events(element, options.events);
    linkProperties(element, options.attributes);
    initAttributes(element, options.attributes);

    if (options.created) {
      options.created(element);
    }

    triggerAttributesCreated(element);
    markAsResolved(element, options);
  };
}

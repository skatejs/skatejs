import assign from '../util/assign';
import camelCase from '../util/camel-case';
import data from '../util/data';
import hasOwn from '../util/has-own';
import matchesSelector from '../util/matches-selector';
import objEach from '../util/obj-each';

function getPrototypes (proto) {
  var chains = [proto];
  /* jshint boss: true */
  while (proto = Object.getPrototypeOf(proto)) {
    chains.push(proto);
  }
  chains.reverse();
  return chains;
}

function parseEvent (e) {
  var parts = e.split(' ');
  return {
    name: parts.shift(),
    delegate: parts.join(' ')
  };
}

function addEventListeners (target, component) {
  if (typeof component.events !== 'object') {
    return;
  }

  function makeHandler (handler, delegate) {
    return function (e) {
      // If we're not delegating, trigger directly on the component element.
      if (!delegate) {
        return handler(target, e, target);
      }

      // If we're delegating, but the target doesn't match, then we've have
      // to go up the tree until we find a matching ancestor or stop at the
      // component element, or document. If a matching ancestor is found, the
      // handler is triggered on it.
      var current = e.target;

      while (current && current !== document && current !== target.parentNode) {
        if (matchesSelector(current, delegate)) {
          return handler(target, e, current);
        }

        current = current.parentNode;
      }
    };
  }

  objEach(component.events, function (handlers, name) {
    handlers = typeof handlers === 'function' ? [handlers] : handlers;
    var evt = parseEvent(name);
    var useCapture = !!evt.delegate && (evt.name === 'blur' || evt.name === 'focus');

    handlers.forEach(function (handler) {
      target.addEventListener(evt.name, makeHandler(handler, evt.delegate), useCapture);
    });
  });
}

function patchAttributeMethods (element) {
  var oldSetAttribute = element.setAttribute.bind(element);
  var oldRemoveAttribute = element.removeAttribute.bind(element);

  element.setAttribute = function (name, newValue) {
    var oldValue = this.getAttribute(name);
    oldSetAttribute(name, newValue);
    element.attributeChangedCallback(name, String(newValue), oldValue);
  };

  element.removeAttribute = function (name) {
    var oldValue = this.getAttribute(name);
    oldRemoveAttribute(name);
    element.attributeChangedCallback(name, null, oldValue);
  };
}

function defineAttributeProperty (elem, attr) {
  Object.defineProperty(elem, camelCase(attr), {
    get: function () {
      return this.getAttribute(attr);
    },
    set: function (value) {
      if (value === undefined) {
        this.removeAttribute(attr);
      } else {
        this.setAttribute(attr, value);
      }
    }
  });
}

function addAttributeToPropertyLinks (elem, attrs = {}) {
  for (var attr in attrs) {
    if (hasOwn(attrs, attr) && elem[attr] === undefined) {
      defineAttributeProperty(elem, attr);
    }
  }
}

function triggerAttributesCreated (target) {
  var a;
  var attrs = target.attributes;
  var attrsCopy = [];
  var attrsLen = attrs.length;

  for (a = 0; a < attrsLen; a++) {
    attrsCopy.push(attrs[a]);
  }

  // In default web components, attribute changes aren't triggered for
  // attributes that already exist on an element when it is bound. This sucks
  // when you want to reuse and separate code for attributes away from your
  // lifecycle callbacks. Skate will initialise each attribute by calling the
  // created callback for the attributes that already exist on the element.
  for (a = 0; a < attrsLen; a++) {

    var attr = attrsCopy[a];
    target.attributeChangedCallback(attr.nodeName, attr.value || attr.nodeValue, null);
  }
}

function markAsResolved (elem, opts) {
  elem.removeAttribute(opts.unresolvedAttribute);
  elem.setAttribute(opts.resolvedAttribute, '');
}

export default function (options) {
  return function () {
    var native;
    var element = this;
    var targetData = data(element, options.id);

    if (targetData.created) {
      return;
    }

    targetData.created = true;
    native = !!element.createCallback;

    // Native custom elements automatically inherit the prototype. We apply
    // the user defined prototype directly to the element instance if not.
    // Skate will always add lifecycle callbacks to the definition. If native
    // custom elements are being used, one of these will already be on the
    // element. If not, then we are initialising via non-native means.
    if (!native) {
      getPrototypes(options.prototype).forEach(function (proto) {
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

    markAsResolved(element, options);
    addEventListeners(element, options);

    if (!native) {
      patchAttributeMethods(element);
    }

    addAttributeToPropertyLinks(element, options.attributes);

    if (options.created) {
      options.created(element);
    }

    triggerAttributesCreated(element);
  };
}

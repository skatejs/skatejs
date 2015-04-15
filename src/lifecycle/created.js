import assign from '../utils/assign';
import camelCase from '../utils/camel-case';
import data from '../utils/data';
import hasOwn from '../utils/has-own';
import matchesSelector from '../utils/matches-selector';
import MutationObserver from '../polyfill/mutation-observer';
import objEach from '../utils/obj-each';

function addAttributeListeners (target, component) {
  var attrs = target.attributes;

  if (!component.attributes || component.isNative) {
    return;
  }

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      var name = mutation.attributeName;
      var attr = attrs[name];
      target.attributeChangedCallback(name, mutation.oldValue, attr && (attr.value || attr.nodeValue));
    });
  });

  observer.observe(target, {
    attributes: true,
    attributeOldValue: true
  });
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

  objEach(component.events, function (handler, name) {
    var evt = parseEvent(name);
    var useCapture = !!evt.delegate && (evt.name === 'blur' || evt.name === 'focus');
    target.addEventListener(evt.name, makeHandler(handler, evt.delegate), useCapture);
  });
}

function defineAttributeProperty (target, attribute) {
  Object.defineProperty(target, camelCase(attribute), {
    get: function () {
      return this.getAttribute(attribute);
    },
    set: function (value) {
      if (value === undefined) {
        this.removeAttribute(attribute);
      } else {
        this.setAttribute(attribute, value);
      }
    }
  });
}

function addAttributeToPropertyLinks (target, component) {
  var componentAttributes = component.attributes;

  if (typeof componentAttributes !== 'object') {
    return;
  }

  for (var attribute in componentAttributes) {
    if (hasOwn(componentAttributes, attribute) && target[attribute] === undefined) {
      defineAttributeProperty(target, attribute);
    }
  }
}

function initAttributes (target, component) {
  var componentAttributes = component.attributes;

  if (typeof componentAttributes !== 'object') {
    return;
  }

  for (var attribute in componentAttributes) {
    if (hasOwn(componentAttributes, attribute) && hasOwn(componentAttributes[attribute], 'value') && !target.hasAttribute(attribute)) {
      var value = componentAttributes[attribute].value;
      value = typeof value === 'function' ? value(target) : value;
      target.setAttribute(attribute, value);
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
    target.attributeChangedCallback(attr.nodeName, null, attr.value || attr.nodeValue);
  }
}

export default function (options) {
  return function () {
    var element = this;
    var targetData = data(element, options.id);

    if (targetData.created) {
      return;
    }

    targetData.created = true;

    // Native custom elements automatically inherit the prototype. We apply
    // the user defined prototype directly to the element instance if not.
    if (!options.isNative) {
      assign(element, options.prototype);
    }

    // We use the unresolved / resolved attributes to flag whether or not the
    // element has been templated or not.
    if (options.template && !element.hasAttribute(options.resolvedAttribute)) {
      options.template(element);
    }

    element.removeAttribute(options.unresolvedAttribute);
    element.setAttribute(options.resolvedAttribute, '');
    addEventListeners(element, options);
    addAttributeListeners(element, options);
    addAttributeToPropertyLinks(element, options);
    initAttributes(element, options);
    triggerAttributesCreated(element, options);

    if (options.created) {
      options.created(element);
    }
  };
}

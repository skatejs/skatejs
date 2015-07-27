import utilElementContains from '../util/element-contains';

var CustomEvent = window.CustomEvent;
var hasBubbleOnDetachedElements = false;

// Detect support for using the CustomElement constructor.
if (CustomEvent) {
  try {
    new CustomEvent();
  } catch (e) {
    CustomEvent = undefined;
  }
}

// Common way for constructing a new custom event.
function createCustomEvent (name, opts = {}) {
  if (CustomEvent) {
    return new CustomEvent(name, opts);
  }

  var e = document.createEvent('CustomEvent');
  e.initCustomEvent(name, opts.bubbles, opts.cancelable, opts.detail);
  return e;
}

// Detect whether or not bubbling is supported on detached elements. This is
// non-standard, but Firefox allows it. In a web component world, this is
// very useful for decoupled inter-component communication without relying on
// DOM attachment, so we polyfill it.
(function () {
  var parent = document.createElement('div');
  var child = document.createElement('div');
  parent.appendChild(child);
  parent.addEventListener('test', () => hasBubbleOnDetachedElements = true);
  child.dispatchEvent(createCustomEvent('test', { bubbles: true }));
}());

function emitOne (elem, name, opts) {
  var cevent, status, isBubbling;

  /* jshint expr: true */
  opts.bubbles === undefined && (opts.bubbles = true);
  opts.cancelable === undefined && (opts.cancelable = true);
  cevent = createCustomEvent(name, opts);
  isBubbling = opts.bubbles;
  status = elem.dispatchEvent(cevent);
  elem = elem.parentNode;

  // Simulate bubbling if the browser doesn't support it on detached elements.
  if (isBubbling && !utilElementContains(document, elem) && !hasBubbleOnDetachedElements) {
    let oldStopPropagation = cevent.stopPropagation;

    // Patch stopPropagation() to set isPropagationStopped because there's no
    // other way to tell if it was stopped.
    cevent.stopPropagation = function () {
      isBubbling = false;
      oldStopPropagation.call(cevent);
    };

    // Bubble.
    while (elem && isBubbling) {
      cevent.currentTarget = elem;
      if (elem.dispatchEvent(cevent) === false) {
        status = false;
      }
      elem = elem.parentNode;
    }
  }

  return status;
}

export default function (elem, name, opts = {}) {
  var names = (typeof name === 'string' ? name.split(' ') : name);
  return names.reduce(function (prev, curr) {
    if (!emitOne(elem, curr, opts)) {
      prev.push(curr);
    }
    return prev;
  }, []);
}

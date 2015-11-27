import utilElementContains from '../util/element-contains';

var CustomEvent = (function (CustomEvent) {
  if (CustomEvent) {
    try {
      new CustomEvent();
    } catch (e) {
      return undefined;
    }
  }
  return CustomEvent;
}(window.CustomEvent));

var hasBubbleOnDetachedElements = (function () {
  var parent = document.createElement('div');
  var child = document.createElement('div');
  var hasBubbleOnDetachedElements = false;
  parent.appendChild(child);
  parent.addEventListener('test', () => hasBubbleOnDetachedElements = true);
  child.dispatchEvent(createCustomEvent('test', { bubbles: true }));
  return hasBubbleOnDetachedElements;
}());

function createCustomEvent (name, opts = {}) {
  if (CustomEvent) {
    return new CustomEvent(name, opts);
  }

  var e = document.createEvent('CustomEvent');
  e.initCustomEvent(name, opts.bubbles, opts.cancelable, opts.detail);
  return e;
}

function createReadableStopPropagation (oldStopPropagation) {
  return function () {
    this.isPropagationStopped = true;
    oldStopPropagation.call(this);
  };
}

function simulateBubbling (elem, cEvent) {
  let didPreventDefault;
  let currentElem = elem;
  cEvent.stopPropagation = createReadableStopPropagation(cEvent.stopPropagation);
  Object.defineProperty(cEvent, 'target', { get: () => elem });
  while (currentElem && !cEvent.isPropagationStopped) {
    cEvent.currentTarget = currentElem;
    if (currentElem.dispatchEvent(cEvent) === false) {
      didPreventDefault = false;
    }
    currentElem = currentElem.parentNode;
  }
  return didPreventDefault;
}

function emitOne (elem, name, opts) {
  var cEvent, shouldSimulateBubbling;

  /* jshint expr: true */
  opts.bubbles === undefined && (opts.bubbles = true);
  opts.cancelable === undefined && (opts.cancelable = true);
  cEvent = createCustomEvent(name, opts);
  shouldSimulateBubbling = opts.bubbles &&
    !hasBubbleOnDetachedElements &&
    !utilElementContains(document, elem);

  return shouldSimulateBubbling ?
    simulateBubbling(elem, cEvent) :
    elem.dispatchEvent(cEvent);
}

export default function (elem, name, opts = {}) {
  var names = (typeof name === 'string' ? name.split(' ') : name);
  return names.reduce(function (prev, curr) {
    if (emitOne(elem, curr, opts) === false) {
      prev.push(curr);
    }
    return prev;
  }, []);
}

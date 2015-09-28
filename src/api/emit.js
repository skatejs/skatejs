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

  // We use HTMLEvents instead of custom events if falling back because JSDom
  // doesn't support e.initCustomEvent().
  let e = document.createEvent('HTMLEvents');
  e.detail = opts.detail;
  e.initEvent(name, opts.bubbles, opts.cancelable);
  return e;
}

function createReadableStopPropagation (oldStopPropagation) {
  return function () {
    this.isPropagationStopped = true;
    oldStopPropagation.call(this);
  };
}

function simulateBubbling (elem, cEvent) {
  var didPreventDefault;
  cEvent.stopPropagation = createReadableStopPropagation(cEvent.stopPropagation);
  while (elem && !cEvent.isPropagationStopped) {
    cEvent.currentTarget = elem;
    if (elem.dispatchEvent(cEvent) === false) {
      didPreventDefault = false;
    }
    elem = elem.parentNode;
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

import createElement from '../native/create-element';
import utilElementContains from '../util/element-contains';
import CustomEvent from '../fix/custom-event';

function dispatch (elem, cEvent) {
  if (!elem.disabled) {
    return elem.dispatchEvent(cEvent);
  }
  cEvent.isPropagationStopped = true;
}

var hasBubbleOnDetachedElements = (function () {
  var parent = createElement('div');
  var child = createElement('div');
  var hasBubbleOnDetachedElements = false;
  parent.appendChild(child);
  parent.addEventListener('test', () => hasBubbleOnDetachedElements = true);
  child.dispatchEvent(new CustomEvent('test', { bubbles: true }));
  return hasBubbleOnDetachedElements;
}());

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
  try {
    // Safari 7.0 fails here with
    // "Attempting to change access mechanism for an unconfigurable property"
    // 7.1 and up seem to be fine
    Object.defineProperty(cEvent, 'target', { get: () => elem });
  } catch(e) {
    cEvent.target = elem;
  }
  while (currentElem && !cEvent.isPropagationStopped) {
    cEvent.currentTarget = currentElem;
    if (dispatch(currentElem, cEvent) === false) {
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
  cEvent = new CustomEvent(name, opts);
  shouldSimulateBubbling = opts.bubbles &&
    !hasBubbleOnDetachedElements &&
    !utilElementContains(document, elem);

  return shouldSimulateBubbling ?
    simulateBubbling(elem, cEvent) :
    dispatch(elem, cEvent);
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

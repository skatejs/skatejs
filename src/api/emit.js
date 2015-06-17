var CustomEvent = window.CustomEvent;

if (CustomEvent) {
  try {
    new CustomEvent();
  } catch (e) {
    CustomEvent = undefined;
  }
}

function createCustomEvent (name, opts) {
  if (CustomEvent) {
    return new CustomEvent(name, opts);
  }

  var e = document.createEvent('CustomEvent');
  e.initCustomEvent(name, opts.bubbles, opts.cancelable, opts.detail);
  return e;
}

function emitOne (elem, name, opts) {
  /* jshint expr: true */
  opts.bubbles === undefined && (opts.bubbles = true);
  opts.cancelable === undefined && (opts.cancelable = true);
  return elem.dispatchEvent(createCustomEvent(name, opts));
}

function emitAll (elem, name, opts) {
  var names = (typeof name === 'string' ? name.split(' ') : name);
  return names.reduce(function (prev, curr) {
    if (!emitOne(elem, curr, opts)) {
      prev.push(curr);
    }
    return prev;
  }, []);
}

function emitFn (name, opts) {
  return function () {
    return emitAll(this, name, opts);
  };
}

export default function (elem, name = {}, opts = {}) {
  return typeof elem === 'string' ? emitFn(elem, name) : emitAll(elem, name, opts);
}

import matches from '../util/matches-selector';

function readonly (obj, prop, val) {
  Object.defineProperty(obj, prop, {
    configurable: true,
    get () {
      return val;
    }
  });
}

function parseEvent (e) {
  const parts = e.split(' ');
  const name = parts.shift();
  const selector = parts.join(' ').trim();
  return {
    name: name,
    selector: selector
  };
}

function makeDelegateHandler (elem, handler, parsed) {
  return function (e) {
    let current = e.target;
    const selector = parsed.selector;
    while (current && current !== elem.parentNode) {
      if (matches(current, selector)) {
        readonly(e, 'currentTarget', current);
        readonly(e, 'delegateTarget', elem);
        return handler(e);
      }
      current = current.parentNode;
    }
  };
}

function makeNormalHandler (elem, handler) {
  return function (e) {
    readonly(e, 'delegateTarget', elem);
    handler(e);
  };
}

function bindEvent (elem, event, handler) {
  const parsed = parseEvent(event);
  const { name, selector } = parsed;
  const capture = selector && (name === 'blur' || name === 'focus');
  handler = selector ? makeDelegateHandler(elem, handler, parsed) : makeNormalHandler(elem, handler);
  elem.addEventListener(name, handler, capture);
}

export default function events (opts) {
  const events = opts.events;
  return function (elem) {
    Object.keys(events).forEach(function (name) {
      bindEvent(elem, name, events[name].bind(elem));
    });
  };
}

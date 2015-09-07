import matches from '../util/matches-selector';

function parseEvent (e) {
  let parts = e.split(' ');
  let name = parts.shift();
  let selector = parts.join(' ').trim();
  return {
    name: name,
    selector: selector
  };
}

function makeDelegateHandler (elem, handler, parsed) {
  return function (e) {
    let current = e.target;
    let selector = parsed.selector;
    while (current && current !== elem.parentNode) {
      if (matches(current, selector)) {
        e.delegateTarget = current;
        return handler(e);
      }
      current = current.parentNode;
    }
  };
}

function makeNormalHandler (elem, handler) {
  return function (e) {
    e.delegateTarget = elem;
    handler(e);
  };
}

function bindEvent (elem, event, handler) {
  let parsed = parseEvent(event);
  let { name, selector } = parsed;
  let capture = selector && (name === 'blur' || name === 'focus');
  handler = selector ? makeDelegateHandler(elem, handler, parsed) : makeNormalHandler(elem, handler);
  elem.addEventListener(name, handler, capture);
}

export default function (events) {
  Object.keys(events).forEach(name => bindEvent(this, name, events[name].bind(this)));
}

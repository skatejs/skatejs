import matches from '../util/matches-selector';

function parseEvent (e) {
  var parts = e.split(' ');
  var name = parts.shift();
  var selector = parts.join(' ').trim();
  return {
    name: name,
    selector: selector
  };
}

function makeDelegateHandler (elem, handler, parsed) {
  return function (e) {
    var current = e.target;
    var selector = parsed.selector;
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
  var parsed = parseEvent(event);
  var { name, selector } = parsed;
  var capture = selector && (name === 'blur' || name === 'focus');
  handler = handler.bind(elem);
  handler = selector ? makeDelegateHandler(elem, handler, parsed) : makeNormalHandler(elem, handler);
  elem.addEventListener(name, handler, capture);
}

export default function (elem, events) {
  Object.keys(events).forEach(function (name) {
    bindEvent(elem, name, events[name]);
  });
}

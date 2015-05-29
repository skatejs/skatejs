import matchesSelector from '../util/matches-selector';

function parseEvent (e) {
  var parts = e.split(' ');
  return {
    name: parts.shift(),
    delegate: parts.join(' ')
  };
}

function makeHandler (elem, handler, delegate) {
  return function (e) {
    // If we're not delegating, trigger directly on the component element.
    if (!delegate) {
      return handler(elem, e, elem);
    }

    // If we're delegating, but the elem doesn't match, then we've have
    // to go up the tree until we find a matching ancestor or stop at the
    // component element, or document. If a matching ancestor is found, the
    // handler is triggered on it.
    var current = e.target;

    while (current && current !== document && current !== elem.parentNode) {
      if (matchesSelector(current, delegate)) {
        return handler(elem, e, current);
      }

      current = current.parentNode;
    }
  };
}

export default function (elem, evts) {
  Object.keys(evts || {}).forEach(function (evt) {
    var handlers = evts[evt];
    var parsed = parseEvent(evt);
    var useCapture = !!parsed.delegate && (parsed.name === 'blur' || parsed.name === 'focus');

    handlers = typeof handlers === 'function' ? [handlers] : handlers;
    handlers.forEach(function (handler) {
      handler = makeHandler(elem, handler, parsed.delegate);
      elem.addEventListener(parsed.name, handler, useCapture);
    });
  });
}

import chain from '../api/chain';
import matchesSelector from '../util/matches-selector';

function parseEvent (e) {
  var parts = e.split(' ');
  return {
    name: parts.shift(),
    delegate: parts.join(' ')
  };
}

function makeDelegateHandler (elem, handler, delegate) {
  return function (e) {
    var current = e.target;
    while (current && current !== document && current !== elem.parentNode) {
      if (matchesSelector(current, delegate)) {
        return handler(elem, e, current);
      }
      current = current.parentNode;
    }
  };
}

function makeNormalHandler (elem, handler) {
  return function (e) {
    handler(elem, e, elem);
  };
}

function makeHandler (elem, handler, delegate) {
  return delegate ?
    makeDelegateHandler(elem, handler, delegate) :
    makeNormalHandler(elem, handler);
}

export default function (elem, evts) {
  Object.keys(evts || {}).forEach(function (evt) {
    var handler = chain(evts[evt]);
    var parsed = parseEvent(evt);
    var useCapture = !!parsed.delegate && (parsed.name === 'blur' || parsed.name === 'focus');

    elem.addEventListener(
      parsed.name,
      makeHandler(elem, handler, parsed.delegate),
      useCapture
    );
  });
}

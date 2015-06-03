import chain from '../util/chain';
import matchesSelector from '../util/matches-selector';

var isShadowSelectorRegex = /(::shadow|\/deep\/)/;
var ShadowRoot = window.ShadowRoot;

function parseEvent (e) {
  var parts = e.split(' ');
  return {
    name: parts.shift(),
    delegate: parts.join(' ')
  };
}

function makeDelegateHandler (elem, handler, delegate) {
  var isShadowSelector = isShadowSelectorRegex.test(delegate);
  return function (e) {
    var current = isShadowSelector ? e.path[0] : e.target;
    while (current && current !== document && current !== elem.parentNode) {
      if (matchesSelector(current, delegate)) {
        return handler(elem, e, current);
      }

      current = current.parentNode;

      if (current && ShadowRoot && current instanceof ShadowRoot) {
        current = current.host;
      }
    }
  };
}

function makeNormalHandler (elem, handler) {
  return function (e) {
    handler(elem, e, elem);
  };
}

export default function (elem, evts) {
  Object.keys(evts || {}).forEach(function (evt) {
    var handler = chain(evts[evt]);
    var { name, delegate } = parseEvent(evt);

    elem.addEventListener(
      name,
      delegate ? makeDelegateHandler(elem, handler, delegate) : makeNormalHandler(elem, handler),
      delegate && (name === 'blur' || name === 'focus')
    );
  });
}

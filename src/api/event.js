import apiChain from './chain';
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
    while (current && current !== elem.parentNode) {
      if (matchesSelector(current, delegate)) {
        e.delegateTarget = current;
        return handler(e);
      }

      current = current.parentNode;
    }
  };
}

function makeNormalHandler (elem, handler) {
  return function (e) {
    e.delegateTarget = e.currentTarget;
    handler(e);
  };
}

function bindEvent (elem, event, handler) {
  var { name, delegate } = parseEvent(event);
  var capture = delegate && (name === 'blur' || name === 'focus');
  handler = apiChain(handler).bind(elem);
  handler = delegate ? makeDelegateHandler(elem, handler, delegate) : makeNormalHandler(elem, handler);
  elem.addEventListener(name, handler, capture);
}

function bindEvents (elem, events) {
  Object.keys(events).forEach(function (name) {
    bindEvent(elem, name, events[name]);
  });
}

export default function (elem, events, handler) {
  if (typeof events === 'string') {
    bindEvent(elem, events, handler);
  } else {
    bindEvents(elem, events || {});
  }
}

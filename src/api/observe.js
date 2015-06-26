import apiChain from './chain';
import event from './event';
import maybeThis from '../util/maybe-this';
import parseEvent from '../util/parse-event';

var slice = Array.prototype.slice;

function observeOne (elem, handler, dependencies) {
  var events;
  handler = apiChain(handler);
  events = dependencies.map(e => parseEvent(e));
  events.forEach(function (e) {
    event(elem, `skate.property.${e.name} ${e.selector}`, function () {
      handler.apply(elem, events.map(function (e) {
        return elem.querySelector(e.selector)[e.name];
      }));
    });
  });
}

function observeAll(elem, observers = {}) {
  Object.keys(observers).forEach(handler => observeOne(elem, handler, observers[handler]));
}

export default maybeThis(function (elem, handler, dependencies) {
  if (dependencies === undefined) {
    observeAll(elem, handler);
  } else {
    observeOne(elem, handler, dependencies);
  }
});

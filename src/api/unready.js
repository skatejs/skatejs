import utilMaybeThis from '../util/maybe-this';

const EVENT = '_skate-unready';

export default utilMaybeThis(function (elem, name, func) {
  elem.addEventListener(EVENT, function (e) {
    if (e.detail.definition.id === name) {
      func.call(e.detail.element);
    }
  });
});

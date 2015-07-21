import utilMaybeThis from '../util/maybe-this';

const EVENT = '_skate-unready';

export default utilMaybeThis(function (elem, name, func) {
  elem.addEventListener(EVENT, function (e) {
    if (e.detail.id === name) {
      func.call(this);
    }
  });
});

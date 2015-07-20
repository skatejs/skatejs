import utilData from '../util/data';
import utilMaybeThis from '../util/maybe-this';
import utilQuery from '../util/query';

const EVENT = '_skate-ready';
const RESOLVED = 'resolved';

export default utilMaybeThis(function (elem, name, func, once = false) {
  var data = once && utilData(elem);

  utilQuery(elem, name).forEach(function (desc) {
    if (desc.hasAttribute(RESOLVED)) {
      func.call(desc);
    }
  });

  if (!data || !data.hasReadyListener) {
    /* jshint expr: true */
    data && (data.hasReadyListener = true);
    elem.addEventListener(EVENT, function (e) {
      if (e.detail.definition.id === name) {
        func.call(e.detail.element);
      }
    });
  }
});

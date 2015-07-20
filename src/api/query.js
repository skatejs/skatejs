import apiReady from '../api/ready';
import utilMaybeThis from '../util/maybe-this';

export default utilMaybeThis(function (elem, name, func) {
  apiReady(elem, name, func, true);
});

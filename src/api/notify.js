import maybeThis from '../util/maybe-this';
import emit from './emit';

/* jshint expr: true */
export default maybeThis(function (elem, name, detail = {}) {
  // Notifications must *always* have:
  // - name
  // - newValue
  // - oldValue
  // but may contain other information.
  detail.name = name;
  detail.newValue === detail.newValue === undefined ? elem[name] : detail.newValue;
  detail.oldValue === detail.oldValue === undefined ? elem[name] : detail.oldValue;

  emit(elem, [
    'skate.property',
    `skate.property.${name}`
  ], {
    detail: detail
  });
});

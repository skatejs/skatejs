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
  detail.newValue === undefined && (detail.newValue = elem[name]);
  detail.oldValue === undefined && (detail.oldValue = elem[name]);

  emit(elem, [
    'skate.property',
    `skate.property.${name}`
  ], {
    detail: detail
  });
});

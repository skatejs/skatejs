import apiEmit from './emit';

/* jshint expr: true */
export default function (elem, name, detail = {}) {
  // Notifications must *always* have:
  // - name
  // - newValue
  // - oldValue
  // but may contain other information.
  detail.name = name;
  detail.newValue === undefined && (detail.newValue = elem[name]);
  detail.oldValue === undefined && (detail.oldValue = elem[name]);

  // Always fire a generic event. These don't bubble because dependencies can
  // be placed on specific events. If that is done, then the dependency will
  // trigger a generic event for the element. Bubbling would cause children
  // to falsely notify parents.
  apiEmit(elem, `skate.property`, {
    bubbles: false,
    cancelable: false,
    detail: detail
  });

  // Fire specific event. This event bubbles so that parents can listen for
  // changes in children.
  apiEmit(elem, `skate.property.${name}`, {
    bubbles: true,
    cancelable: false,
    detail: detail
  });
}

import data from '../util/data';

export default function (opts) {
  var callback = opts.attribute || function () {};

  /* jshint expr: true */
  return function (name, oldValue, newValue) {
    var info = data(this);
    var attributeToPropertyMap = info.attributeToPropertyMap || {};

    callback.call(this, name, oldValue, newValue);

    // Ensure properties are notified of this change. We only do this if we're
    // not already updating the attribute from the property. This is so that
    // we don't invoke an infinite loop.
    if (attributeToPropertyMap[name] && !info.updatingAttribute) {
      info.updatingProperty = true;
      this[attributeToPropertyMap[name]] = newValue === null ? undefined : newValue;
      info.updatingProperty = false;
    }
  };
}

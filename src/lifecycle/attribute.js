import data from '../util/data';

export default function (opts) {
  var callback = opts.attribute;

  /* jshint expr: true */
  return function (name, oldValue, newValue) {
    var info = data(this);
    var attributeToPropertyMap = info.attributeToPropertyMap || {};

    // Only call a callback if one was specified.
    typeof callback === 'function' && callback.call(this, name, oldValue, newValue);

    // Ensure properties are notified of this change. We only do this if we're
    // not already updating the attribute from the property. This is so that
    // we don't invoke an infinite loop.
    if (attributeToPropertyMap[name] && !info.updatingAttribute) {
      info.updatingProperty = true;
      this[attributeToPropertyMap[name]] = newValue;
      info.updatingProperty = false;
    }
  };
}

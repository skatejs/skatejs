import data from '../util/data';
import support from '../native/support';

export default function (Ctor) {
  const { attribute, observedAttributes } = Ctor;

  return function (name, oldValue, newValue) {
    // If native support for custom elements v1 exists, then it will natively
    // do this check before calling the attributeChangedCallback.
    if (!support.v1 && observedAttributes.indexOf(name) === -1) {
      return;
    }

    const propertyName = data(this, 'attributeLinks')[name];

    if (propertyName) {
      const propertyData = data(this, `api/property/${propertyName}`);
      if (!propertyData.settingProperty) {
        const propOpts = this.constructor.properties[propertyName];
        this[propertyName] = newValue !== null && propOpts.deserialize ? propOpts.deserialize(newValue) : newValue;
      }
    }

    if (attribute) {
      attribute(this, {
        name: name,
        newValue: newValue === null ? undefined : newValue,
        oldValue: oldValue === null ? undefined : oldValue
      });
    }
  };
}

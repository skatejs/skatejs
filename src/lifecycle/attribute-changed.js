import data from '../util/data';
import support from '../native/support';

export default function (Ctor) {
  const { attributeChanged, observedAttributes } = Ctor;

  return function (name, oldValue, newValue) {
    // If native support for custom elements v1 exists, then it will natively
    // do this check before calling the attributeChangedCallback.
    if (!support.v1 && observedAttributes.indexOf(name) === -1) {
      return;
    }

    const propertyName = data(this, 'attributeLinks')[name];

    if (propertyName) {
      const propertyData = data(this, `api/property/${propertyName}`);

      // This ensures a property set doesn't cause the attribute changed
      // handler to run again once we set this flag. This only ever has a
      // chance to run when you set an attribute, it then sets a property and
      // then that causes the attribute to be set again.
      if (propertyData.settingAttribute) {
        return;
      }

      // Set this here so the next set to the attribute doesn't cause this
      // handler to run a gain.
      propertyData.settingAttribute = true;

      // Sync up the property.
      if (!propertyData.settingProperty) {
        const propOpts = this.constructor.properties[propertyName];
        this[propertyName] = newValue !== null && propOpts.deserialize ? propOpts.deserialize(newValue) : newValue;
      }

      // Allow this handler to run again.
      propertyData.settingAttribute = false;
    }

    if (attributeChanged) {
      attributeChanged(this, {
        name: name,
        newValue: newValue === null ? undefined : newValue,
        oldValue: oldValue === null ? undefined : oldValue
      });
    }
  };
}

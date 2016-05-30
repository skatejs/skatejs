import data from '../util/data';
import support from '../native/support';

const isCustomElementsV0 = support.v0;
const isCustomElementsV1 = support.v1;

export default function (Ctor) {
  const { attributeChanged, observedAttributes } = Ctor;

  return function (name, oldValue, newValue) {
    const elemData = data(this);

    // Chrome legacy custom elements batch attribute changes in a microtask so
    // so we have to tell it to emulate v1 behaviour by setting a unique
    // unique attribute.
    if (isCustomElementsV0 && name === '____can_start_triggering_now') {
      elemData.canStartTriggeringNow = true;
      return;
    }

    // We prevent legacy Chrome from ever triggering a change unless it's been
    // flagged to do so using the unique attribute or explicitly told that it
    // can via the property data.
    if (isCustomElementsV0 && !elemData.canStartTriggeringNow) {
      return;
    }

    // If native support for custom elements v1 exists, then it will natively
    // do this check before calling the attributeChangedCallback.
    if (!isCustomElementsV1 && observedAttributes.indexOf(name) === -1) {
      return;
    }

    const propertyName = data(this, 'attributeLinks')[name];

    if (propertyName) {
      const propData = data(this, `api/property/${propertyName}`);

      // This ensures a property set doesn't cause the attribute changed
      // handler to run again once we set this flag. This only ever has a
      // chance to run when you set an attribute, it then sets a property and
      // then that causes the attribute to be set again.
      if (propData.settingAttribute) {
        return;
      }

      // Set this here so the next set to the attribute doesn't cause this
      // handler to run a gain.
      propData.settingAttribute = true;

      // Sync up the property.
      if (!propData.settingProperty) {
        const propOpts = this.constructor.props[propertyName];
        this[propertyName] = newValue !== null && propOpts.deserialize ? propOpts.deserialize(newValue) : newValue;
      }

      // Allow this handler to run again.
      propData.settingAttribute = false;
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

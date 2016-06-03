import data from '../util/data';

export default function (Ctor) {
  const { attributeChanged } = Ctor;

  return function (name, oldValue, newValue) {
    const propertyName = data(this, 'attributeLinks')[name];

    if (propertyName) {
      const propData = data(this, `api/property/${propertyName}`);

      // This ensures a property set doesn't cause the attribute changed
      // handler to run again once we set this flag. This only ever has a
      // chance to run when you set an attribute, it then sets a property and
      // then that causes the attribute to be set again.
      if (propData.syncingAttribute) {
        propData.syncingAttribute = false;
        return;
      }

      // Sync up the property.
      const propOpts = this.constructor.props[propertyName];
      propData.settingAttribute = true;
      this[propertyName] = newValue !== null && propOpts.deserialize ? propOpts.deserialize(newValue) : newValue;
    }

    if (attributeChanged) {
      attributeChanged(this, { name, newValue, oldValue });
    }
  };
}

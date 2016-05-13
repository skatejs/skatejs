import data from '../util/data';

export default function (opts) {
  const { attribute } = opts;

  return function (name, oldValue, newValue) {
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

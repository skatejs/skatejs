import data from './data';
import empty from './empty';
import getDefaultValue from '../util/get-default-value';
import getInitialValue from './get-initial-value';

function getPropData(elem, name) {
  const namespace = `api/property/${typeof name === 'symbol' ? String(name) : name}`;
  return data(elem, namespace);
}

function syncFirstTimeProp(elem, prop, propName, attributeName, propData) {
  let syncAttrValue = propData.lastAssignedValue;
  if (empty(syncAttrValue)) {
    if ('initial' in prop) {
      syncAttrValue = getInitialValue(elem, propName, prop);
    } else if ('default' in prop) {
      syncAttrValue = getDefaultValue(elem, propName, prop);
    }
  }
  if (!empty(syncAttrValue) && prop.serialize) {
    syncAttrValue = prop.serialize(syncAttrValue);
  }
  if (!empty(syncAttrValue)) {
    propData.syncingAttribute = true;
    elem.setAttribute(attributeName, syncAttrValue);
  }
}

function syncExistingProp(elem, prop, propName, attributeName, propData) {
  if (attributeName && !propData.settingAttribute) {
    const { internalValue } = propData;
    const serializedValue = prop.serialize(internalValue);
    const currentAttrValue = elem.getAttribute(attributeName);
    const serializedIsEmpty = empty(serializedValue);
    const attributeChanged = !(
      (serializedIsEmpty && empty(currentAttrValue)) || serializedValue === currentAttrValue
    );

    propData.syncingAttribute = true;

    const shouldRemoveAttribute = empty(propData.lastAssignedValue);
    if (shouldRemoveAttribute || serializedIsEmpty) {
      elem.removeAttribute(attributeName);
    } else {
      elem.setAttribute(attributeName, serializedValue);
    }

    if (!attributeChanged && propData.syncingAttribute) {
      propData.syncingAttribute = false;
    }
  }

  // Allow the attribute to be linked again.
  propData.settingAttribute = false;
}

export default function syncPropToAttr(elem, prop, propName, isFirstSync) {
  const attributeName = data(elem, 'propertyLinks')[propName];
  const propData = getPropData(elem, propName);

  if (attributeName) {
    if (isFirstSync) {
      syncFirstTimeProp(elem, prop, propName, attributeName, propData);
    } else {
      syncExistingProp(elem, prop, propName, attributeName, propData);
    }
  }
}

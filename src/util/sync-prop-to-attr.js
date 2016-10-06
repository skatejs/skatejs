import data from './data';
import empty from './empty';
import getInitialValue from './get-initial-value';

function getPropData(elem, name) {
  const namespace = `api/property/${typeof name === 'symbol' ? String(name) : name}`;
  return data(elem, namespace);
}

function syncFirstTimeProp(elem, prop, propName, attributeName, propData) {
  let syncAttrValue = propData.lastAssignedValue;
  // console.log('sync.lastAssignedValue', syncAttrValue)
  if (empty(syncAttrValue) && prop.initial) {
    syncAttrValue = getInitialValue(elem, propName, prop);
  }
  if (!empty(syncAttrValue) && prop.serialize) {
    syncAttrValue = prop.serialize(syncAttrValue);
  }
  if (!empty(syncAttrValue)) {
    // console.log('initial set syncingAttribute to true');
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

  if (isFirstSync && attributeName) {
    syncFirstTimeProp(elem, prop, propName, attributeName, propData);
  } else if (!isFirstSync) {
    syncExistingProp(elem, prop, propName, attributeName, propData);
  }
}

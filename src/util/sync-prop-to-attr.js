import empty from './empty';
import getDefaultValue from '../util/get-default-value';
import getInitialValue from './get-initial-value';
import getPropData from './get-prop-data';

function syncFirstTimeProp (elem, prop) {
  const propData = getPropData(elem, prop.name);

  let syncAttrValue = propData.lastAssignedValue;
  if (empty(syncAttrValue)) {
    if (prop.hasOwnProperty('initial')) {
      syncAttrValue = getInitialValue(elem, prop);
    } else if (prop.hasOwnProperty('default')) {
      syncAttrValue = getDefaultValue(elem, prop);
    }
  }
  if (!empty(syncAttrValue) && prop.serialize) {
    syncAttrValue = prop.serialize(syncAttrValue);
  }
  if (!empty(syncAttrValue)) {
    propData.syncingAttribute = true;
    elem.setAttribute(prop.attrOut, syncAttrValue);
  }
}

function syncExistingProp (elem, prop) {
  const propData = getPropData(elem, prop.name);
  const attributeName = prop.attrOut;

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

export default function syncPropToAttr (elem, prop, isFirstSync) {
  if (prop.attrOut) {
    if (isFirstSync) {
      syncFirstTimeProp(elem, prop);
    } else {
      syncExistingProp(elem, prop);
    }
  }
}

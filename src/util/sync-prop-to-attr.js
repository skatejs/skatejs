import empty from './empty';
import getDefaultValue from '../util/get-default-value';
import getInitialValue from './get-initial-value';
import getPropData from './get-prop-data';

function syncFirstTimeProp (elem, propDef) {
  const propData = getPropData(elem, propDef.name);

  let syncAttrValue = propData.lastAssignedValue;
  if (empty(syncAttrValue)) {
    if (propDef.hasOwnProperty('initial')) {
      syncAttrValue = getInitialValue(elem, propDef);
    } else if (propDef.hasOwnProperty('default')) {
      syncAttrValue = getDefaultValue(elem, propDef);
    }
  }
  if (!empty(syncAttrValue) && propDef.serialize) {
    syncAttrValue = propDef.serialize(syncAttrValue);
  }
  if (!empty(syncAttrValue)) {
    propData.syncingAttribute = true;
    elem.setAttribute(propDef.attrName, syncAttrValue);
  }
}

function syncExistingProp (elem, propDef) {
  const propData = getPropData(elem, propDef.name);
  const attributeName = propDef.attrName;

  if (attributeName && !propData.settingAttribute) {
    const { internalValue } = propData;
    const serializedValue = propDef.serialize(internalValue);
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

export default function syncPropToAttr (elem, propDef, isFirstSync) {
  if (propDef.attrName) {
    if (isFirstSync) {
      syncFirstTimeProp(elem, propDef);
    } else {
      syncExistingProp(elem, propDef);
    }
  }
}

//@flow
import {
  connected as $connected,
} from '../util/symbols';
import getPropData from './get-prop-data';
import toNullString from './to-null-string';

export default function syncPropToAttr (elem:any, propDef:IPropDef, propName:string|Symbol) {

  // Must have a linked attribute
  if (!propDef.attrName) {
    return;
  }

  // Sync attribute only if connected
  if (!elem[$connected]) {
    //console.log('syncPropToAttr STOP elem is not connected');
    return;
  }

  const propData:any = getPropData(elem, propName);

  // Don't sync back the attribute when called from syncAttrToProp
  if (propData.settingProp) {
    propData.settingProp = false;
    //console.log('syncPropToAttr', name, 'was called from syncAttrToProp');
    return;
  }

  const newAttrValue:?string = toNullString(propDef.serialize(propData.internalValue));

  const attrName:string = String(propDef.attrName);
  const currAttrValue:?string = toNullString(elem.getAttribute(attrName));


  if (currAttrValue !== newAttrValue) {

    // Prevent an unnecessary re-sync from syncAttrToProp
    propData.attrValueFromProp = newAttrValue;

    if (newAttrValue === null) {
      //console.log('syncPropToAttr removeAttribute', attrName);
      elem.removeAttribute(attrName);
    }
    else {
      //console.log('syncPropToAttr setAttribute', attrName, 'to:', newAttrValue);
      elem.setAttribute(attrName, newAttrValue);
    }

  }
  else {
    //console.log('syncPropToAttr NOT needed', attrName, 'is already', typeof currAttrValue, currAttrValue);
  }

}

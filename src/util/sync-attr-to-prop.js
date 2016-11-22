//@flow
import data from './data';
import {getPropDefs} from './cached-prop-defs';
import toNullString from './to-null-string';

export default function syncAttrToProp (elem:any, attrName:string, oldValue:?string, newValue:?string) {

  const propName:string|Symbol = data(elem, 'attributeLinks')[attrName];

  // Must be linked to a prop.
  if (!propName) {
    return;
  }

  //console.log('syncAttrToProp', attrName, 'from:', typeof oldValue, oldValue, 'to', typeof newValue, newValue);

  const propData = data(elem, 'props')[propName];
  const newAttrValue:?string = toNullString(newValue);

  // Don't sync back the prop if attribute was set from syncPropToAttr
  let mustSyncProp:boolean = true;
  if (propData.attrValueFromProp !== undefined) {
    if (propData.attrValueFromProp === newAttrValue) {
      mustSyncProp = false;
    }
    delete propData.attrValueFromProp;
  }

  if (!mustSyncProp) {
    //console.log('syncAttrToProp attribute was set from syncPropToAttr');
    return;
  }

  const propDef:IPropDef = getPropDefs(elem.constructor)[propName];

  const currPropValue:any = propData.internalValue;
  const currSerializedValue:?string = toNullString(propDef.serialize(currPropValue));

  if (currSerializedValue === newAttrValue) {
    // prop is already in sync
    //console.log('prop is already in sync.');
    // todo: should we just schedule a re-render anyway?
    return;
  }

  const newPropValue:any = propDef.deserialize(newAttrValue);

  // Sync prop but prevent a re-sync back to attribute
  //console.log('syncAttrToProp setting prop', propName, 'to', typeof newPropValue, newPropValue);
  propData.settingProp = true;
  elem[propName] = newPropValue;
  propData.settingProp = false;
}

//@flow
import empty from './empty';
import getPropData from './get-prop-data';

export default function syncPropToAttr (elem:any, propDef:IPropDef, propName:string|Symbol) {
  if (propDef.attrName) {
    const attributeName:string = propDef.attrName;
    const propData:any = getPropData(elem, propName);
    const { internalValue } = propData;
    const serializedValue:?string = propDef.serialize(internalValue);
    const currentAttrValue:?string = elem.getAttribute(attributeName);
    const serializedIsEmpty:boolean = empty(serializedValue);
    const attributeChanged:boolean = !(
      (serializedIsEmpty && empty(currentAttrValue)) || serializedValue === currentAttrValue
    );
    if(attributeChanged) {
      //console.log('syncExistingPropToAttr', propName, serializedValue, 'was:', currentAttrValue);
      if (serializedIsEmpty) {
        elem.removeAttribute(attributeName);
      } else {
        elem.setAttribute(attributeName, serializedValue);
      }
    }
    // else {
    //   console.log('syncExistingPropToAttr ALREADY the same', propName);
    // }
  }
}

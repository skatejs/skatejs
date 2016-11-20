//@flow
import {
  connected as $connected,
  rendererDebounced as $rendererDebounced
} from '../util/symbols';
import data from '../util/data';
import empty from '../util/empty';
import getAllKeys from '../util/get-all-keys';
import getDefaultValue from '../util/get-default-value';
import getInitialValue from '../util/get-initial-value';
import getPropData from '../util/get-prop-data';
import {getPropDefs} from '../util/cached-prop-defs';
import syncPropToAttr from '../util/sync-prop-to-attr';

function createPropertyDescriptor (propDef:IPropDef):IPropertyDescriptor {

  const name:string|Symbol = propDef.name;

  const propDescriptor:IPropertyDescriptor = {
    configurable: true,
    enumerable: true,

    //called just before actually creating the native property with Object.defineProperty
    created: function created (elem:any) {
      const propData:any = getPropData(elem, name);
      const attrName:?string = propDef.attrName;
      let initialValue:any = elem[name];

      if (attrName) {
        // Store attribute to property link information.
        data(elem, 'attributeLinks')[attrName] = name;
      }

      // Set up initial value if it wasn't specified.
      if (empty(initialValue)) {
        if (attrName && elem.hasAttribute(attrName)) {
          initialValue = propDef.deserialize(elem.getAttribute(attrName));
        } else if ('initial' in propDef) {
          initialValue = getInitialValue(elem, name, propDef);
        } else if ('default' in propDef) {
          initialValue = getDefaultValue(elem, name, propDef);
        }
      }
      if (propDef.coerce) {
        initialValue = propDef.coerce(initialValue);
      }
      //console.log('init internalValue prop', name, typeof initialValue, initialValue);
      propData.internalValue = initialValue;
    },

    get: function get () {
      const propData:any = getPropData(this, name);
      const { internalValue } = propData;
      return typeof propDef.get === 'function' ? propDef.get(this, { name, internalValue }) : internalValue;
    },

    set: function set (newValue:any) {
      const propData:any = getPropData(this, name);

      let oldValue:any = propData.internalValue;

      if (empty(newValue)) {
        newValue = getDefaultValue(this, name, propDef);
      }

      if (typeof propDef.coerce === 'function') {
        newValue = propDef.coerce(newValue);
      }

      const changeData:any = { name, newValue, oldValue };

      if (typeof propDef.set === 'function') {
        propDef.set(this, changeData);
      }

      //console.log('sk.set prop', name, 'to:', typeof newValue, newValue, 'was:', typeof oldValue, oldValue);

      // Queue a re-render.
      this[$rendererDebounced](this);

      // Update prop data so we can use it next time.
      // propData.internalValue = propData.oldValue = newValue;
      propData.internalValue = newValue;

      // Link up the attribute.
      if (this[$connected] && propDef.attrName) {
        syncPropToAttr(this, propDef, name);
      }
    }

  };

  return propDescriptor;
}

export function createPropertyDescriptors (Ctor:any):{[k:string|Symbol]:IPropertyDescriptor} {
  const propDefs:{[k:string|Symbol]:IPropDef} = getPropDefs(Ctor);
  // console.log('>> createPropDescriptors propDefs:', propDefs);

  return getAllKeys(propDefs).reduce((propDescriptors:{[k:string|Symbol]:IPropertyDescriptor}, propName:string|Symbol) => {
    propDescriptors[propName] = createPropertyDescriptor(propDefs[propName]);
    return propDescriptors;
  }, {});
}



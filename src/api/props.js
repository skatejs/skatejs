//@flow
import { renderer as $renderer } from '../util/symbols';
import assign from '../util/assign';
import getAllKeys from '../util/get-all-keys';
import {getPropDefs} from '../util/cached-prop-defs';

function get (elem:any):{[k:string|Symbol]:any} {
  const props = {};
  const propDefs:{[k:string|Symbol]:IPropDef} = getPropDefs(elem.constructor);
  getAllKeys(propDefs).forEach((key:any) => {
    props[key] = elem[key];
  });

  return props;
}

function set (elem:any, newProps:{[k:string|Symbol]:any}) {
  assign(elem, newProps);
  //todo: why is this not debounced?
  if (elem[$renderer]) {
    elem[$renderer]();
  }
}

export default function (elem:any, newProps:{[k:string|Symbol]:any}) {
  return typeof newProps === 'undefined' ? get(elem) : set(elem, newProps);
}

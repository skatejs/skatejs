//@flow
import assign from './assign';
import dashCase from './dash-case';
import getAllKeys from './get-all-keys';

const CACHED_PROP_DEFS:string = '____skate_propDefs';
const PROP_DEFS_COUNT:string = '____skate_propDefsCount';

// creates a normalized skate property definition from a property config options
// because it contains the property name and the attribute name of the linked attribute
function createPropDef(name:string|Symbol, cfg:IPropConfig):IPropDef {

  cfg = cfg || {};

  // todo: is this documented that a config can just be the coerce function?
  if (typeof cfg === 'function') {
    cfg = { coerce: cfg };
  }
  //todo: validate config object for invalid options

  let attribute:?boolean|string = (cfg:IPropConfig).attribute;

  let attrName:?string = undefined;

  if (attribute === true) {
    if (typeof name === 'string') {
      attrName = dashCase(String(name));
    }
    else {
      console.error('attribute must be a string for Symbol property ' + String(name));
      //todo: or allow it?
      //attrName = dashCase(String(name));
    }
  } else if (typeof attribute === 'string') {
    attrName = attribute;
  }

  let result = assign({
    name,
    attrName,
    // These defaults were inside props-init.js file
    default: null, //todo: should default be undefined?
    deserialize: value => value, //todo: why is this the default deserialize?
    serialize: value => value //todo: why is this the default serialize?
  }, cfg);

  delete result.attribute; //not a member of IPropDef

  return result;
}

/**
 * Returns the Property Definitions for the given Component Class
 * The first time this is called Property Definitions are created an cached on the constructor.
 */
export function getPropDefs (Ctor:any):{[k:string|Symbol]:IPropDef} {

  if (!Ctor.hasOwnProperty(CACHED_PROP_DEFS)) {

    const propConfigs:{[k:string|Symbol]:IPropConfig} = Ctor.props || {};

    let count:number = 0;

    Ctor[CACHED_PROP_DEFS] = getAllKeys(propConfigs).reduce((result, propName:string|Symbol) => {
      count++;
      result[propName] = createPropDef(propName, propConfigs[propName]);
      return result;
    }, {});

    //console.log('create', CACHED_PROP_DEFS, 'on constructor', Ctor.name, Ctor[CACHED_PROP_DEFS]);
    Ctor[PROP_DEFS_COUNT] = count;
  }
  // else {
  //   console.log('Cached PropDefs already found on constructor', Ctor.name, Ctor[CACHED_PROP_DEFS]);
  // }

  return Ctor[CACHED_PROP_DEFS];
}

export function getPropDefsCount (Ctor:any):number {
  getPropDefs(Ctor);
  return Ctor.hasOwnProperty(PROP_DEFS_COUNT) ? Ctor[PROP_DEFS_COUNT] : 0;
}

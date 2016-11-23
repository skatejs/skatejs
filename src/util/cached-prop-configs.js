import getAllKeys from './get-all-keys';

const CACHED_PROP_CONFIGS = '____skate_propConfigs';
const PROP_CONFIGS_COUNT = '____skate_propConfigsCount';

/**
 * Returns the Property Definitions for the given Component Class
 * The first time this is called Property Definitions are created an cached on the constructor.
 */
export function getPropConfigs (Ctor) {

  // Must be defined on the constructor and not on an inherited Component
  if (!Ctor.hasOwnProperty(CACHED_PROP_CONFIGS)) {

    const propConfigs = Ctor.props || {};

    let count:number = 0;

    Ctor[CACHED_PROP_CONFIGS] = getAllKeys(propConfigs).reduce((result, propName) => {
      count++;
      result[propName] = propConfigs[propName];
      return result;
    }, {});

    // console.log('create', CACHED_PROP_CONFIGS, 'on constructor', Ctor.name, Ctor[CACHED_PROP_CONFIGS]);
    Ctor[PROP_CONFIGS_COUNT] = count;
  }
  // else {
  //   console.log('Cached PropConfigs already found on constructor', Ctor.name, Ctor[CACHED_PROP_CONFIGS]);
  // }

  return Ctor[CACHED_PROP_CONFIGS];
}

export function getPropConfigsCount (Ctor:any):number {
  getPropConfigs(Ctor);
  return Ctor.hasOwnProperty(PROP_CONFIGS_COUNT) ? Ctor[PROP_CONFIGS_COUNT] : 0;
}

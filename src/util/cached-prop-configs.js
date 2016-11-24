import getAllKeys from './get-all-keys';
import {
  ctor_propConfigs as $ctor_propConfigs,
  ctor_propConfigsCount as $ctor_propConfigsCount
} from './symbols';

/**
 * Returns the Property Configs for the given Component Class.
 *
 * The first time this is called for a new Component Class the Property Configs
 * returned by the static get props are cached on the constructor.
 * This usually occurs when a new Component is registered with customElements.define()
 */
export function getPropConfigs (Ctor) {

  // Must be defined on the constructor and not on an inherited Component
  if (!Ctor.hasOwnProperty($ctor_propConfigs)) {

    const propConfigs = Ctor.props || {};

    let count = 0;

    Ctor[$ctor_propConfigs] = getAllKeys(propConfigs).reduce((result, propName) => {
      count++;
      result[propName] = propConfigs[propName];
      return result;
    }, {});

    // console.log('created PropConfigs on', Ctor.name, Ctor[$ctor_propConfigs]);
    Ctor[$ctor_propConfigsCount] = count;
  }
  // else {
  //   console.log('use PropConfigs on', Ctor.name, Ctor[$ctor_propConfigs]);
  // }

  return Ctor[$ctor_propConfigs];
}

export function getPropConfigsCount (Ctor) {
  getPropConfigs(Ctor);
  return Ctor.hasOwnProperty($ctor_propConfigsCount) ? Ctor[$ctor_propConfigsCount] : 0;
}

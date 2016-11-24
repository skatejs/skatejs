import {
  ctorPropConfigs as $ctorPropConfigs
} from './symbols';
import getAllKeys from './get-all-keys';
import setCtorNativeProperty from './set-ctor-native-property';

/**
 * Returns the Property Configs for the given Component Class.
 *
 * The first time this is called for a new Component Class the Property Configs
 * returned by the static get props are cached on the constructor.
 * This usually occurs when a new Component is registered with customElements.define()
 */
export default function getPropConfigs (Ctor) {
  // Must be defined on constructor and not from a superclass
  if (!Ctor.hasOwnProperty($ctorPropConfigs)) {
    const props = Ctor.props || {};

    const propConfigs = getAllKeys(props).reduce((result, propName) => {
      result[propName] = props[propName];
      return result;
    }, {});
    setCtorNativeProperty(Ctor, $ctorPropConfigs, propConfigs);
  }

  return Ctor[$ctorPropConfigs];
}

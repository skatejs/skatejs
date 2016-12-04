import {
  ctorPropsMap as $ctorPropsMap
} from './symbols';
import getAllKeys from './get-all-keys';
import PropDefinition from './prop-definition';
import setCtorNativeProperty from './set-ctor-native-property';

/**
 * Memoizes a map of PropDefinition for the given component class.
 * Keys in the map are the properties name which can a string or a symbol.
 *
 * The map is created from the result of: static get props
 */
export default function getPropsMap (Ctor) {
  // Must be defined on constructor and not from a superclass
  if (!Ctor.hasOwnProperty($ctorPropsMap)) {
    const props = Ctor.props || {};

    const propsMap = getAllKeys(props).reduce((result, propNameOrSymbol) => {
      result[propNameOrSymbol] = new PropDefinition(propNameOrSymbol, props[propNameOrSymbol]);
      return result;
    }, {});
    setCtorNativeProperty(Ctor, $ctorPropsMap, propsMap);
  }

  return Ctor[$ctorPropsMap];
}

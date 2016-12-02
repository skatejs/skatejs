import dashCase from './dash-case';
import empty from './empty';

/**
 * @internal
 * Property Definition
 *
 * Internal meta data and strategies for a property.
 * Created from the options of a PropOptions config object.
 *
 * Once created a PropDefinition should be treated as immutable and final.
 * 'getPropsMap' function memoizes PropDefinitions by Component's Class.
 *
 * The 'attribute' option is normalized into the 'attrName' property.
 */
export default class PropDefinition {

  constructor (nameOrSymbol, opts) {
    this._name = nameOrSymbol;

    opts = opts || {};

    // Set Default values

    this.attrName = null;

    this.coerce = null;

    // default is null unless overridden
    this.default = null;

    // deserialize default implementation returns the value of the attribute
    this.deserialize = value => value;

    // "initial" option is truly optional and it cannot be initialized.
    // Its presence is tested using: ('initial' in propDef)

    this.get = null;

    // serialize must return a string or null
    this.serialize = value => (empty(value) ? null : String(value));

    this.set = null;

    // Note: option key is always a string (no symbols here)
    Object.keys(opts).forEach(option => {
      const optVal = opts[option];

      // Only accept documented options and perform minimal input validation.
      switch (option) {
        case 'attribute':
          this.attrName = resolveAttrName(optVal, nameOrSymbol);
          break;
        case 'coerce':
        case 'deserialize':
        case 'get':
        case 'serialize':
        case 'set':
          if (typeof optVal === 'function') {
            this[option] = optVal;
          } else {
            console.error(option + ' must be a function.');
          }
          break;
        case 'default':
        case 'initial':
          this[option] = optVal;
          break;
        default:
          console.error(option + ' is not a valid option.');
          break;
      }
    });
  }

  get name () {
    return this._name;
  }

}

function resolveAttrName (attrOption, nameOrSymbol) {
  if (typeof nameOrSymbol === 'symbol') {
    console.error('symbol property cannot have an attribute', nameOrSymbol);
  } else {
    if (attrOption === true) {
      return dashCase(String(nameOrSymbol));
    }
    if (typeof attrOption === 'string') {
      return attrOption;
    }
  }
  return null;
}

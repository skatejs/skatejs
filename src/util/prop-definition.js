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

  constructor (nameOrSymbol, propOptions) {
    this._name = nameOrSymbol;

    propOptions = propOptions || {};

    // default 'attrName': no linked attribute
    this.attrName = null;

    // default 'coerce': don't coerce
    this.coerce = null;

    // default 'default': set prop to 'null'
    this.default = null;

    // default 'deserialize': return attribute's value (string or null)
    this.deserialize = value => value;

    // default 'get': no function
    this.get = null;

    // 'initial' default: unspecified
    // 'initial' option is truly optional and it cannot be initialized.
    // Its presence is tested using: ('initial' in propDef)

    // 'serialize' default: return string value or null
    this.serialize = value => (empty(value) ? null : String(value));

    // default 'set': no function
    this.set = null;

    // Note: option key is always a string (no symbols here)
    Object.keys(propOptions).forEach(option => {
      const optVal = propOptions[option];

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

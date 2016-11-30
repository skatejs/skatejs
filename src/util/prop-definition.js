import dashCase from './dash-case';

/**
 * @internal
 * Property Definition
 *
 * Internal meta data and strategies for a property.
 * Created from the options of a PropOptions config object.
 *
 * Once created a PropDefinition should be treated as immutable and final
 * PropDefinitions are created and cached by Component's Class by getPropsMap()
 *
 * Note: some options of PropOptions no longer exist in PropDefinition
 */
export default class PropDefinition {

  // constructor(name:string|symbol, cfg:PropOptions) {
  constructor (name, cfg) {
    this._name = name;

    cfg = cfg || {};

    if (typeof cfg === 'function') {
      // todo: Where is documented that a config can just be the coerce function?
      cfg = {coerce: cfg};
    }

    // Set Default values

    this.coerce = null;

    // todo: we probabbly need to update the doc
    // from doc one would think default value is undefined
    // value was defined inside props-init.js
    this.default = null;

    // todo: should be JSON.stringify ?
    // value was defined inside props-init.js
    this.deserialize = value => value;

    // "initial" option is truly optional and it cannot be initialized.
    // Its presence is tested using hasOwnProperty()

    this.get = null;

    // todo: should be JSON.parse ?
    // value was defined inside props-init.js
    this.serialize = value => value;

    this.set = null;

    // Note: option key is always a string (no symbols here)
    Object.keys(cfg).forEach(option => {
      const optVal = cfg[option];

      // Only accept documented options and perform minimal input validation.
      switch (option) {
        case 'attribute':
          this.attrName = resolveAttrName(cfg.attribute, name);
          break;
        case 'coerce':
        case 'deserialize':
        case 'get':
        case 'serialize':
        case 'set':
          if (typeof optVal === 'function') {
            this[option] = optVal;
          }
          else {
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
  if (attrOption === true) {
    if (typeof nameOrSymbol === 'string') {
      return dashCase(nameOrSymbol);
    }
    if (typeof nameOrSymbol === 'symbol') {
      // todo: should we even allow a symbol prop to have a linked attribute?
      console.error('attribute must be a string for property ' + nameOrSymbol.toString());
    }
  }
  if (typeof attrOption === 'string') {
    return attrOption;
  }
}

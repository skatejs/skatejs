import assign from './assign';
import dashCase from './dash-case';
import empty from './empty';

/**
 * Property Definition
 *
 * Used internally. It is the meta model for a property.
 * It is created from the options of a property Config object.
 *
 * Once created a Property Definition should be considered final and immutable
 * Property Definitions are created and cached per Component Class
 *
 * Note: some options from the property Config object are transformed
 */
export default class PropDefinition {

  // constructor(name:string|symbol, cfg:IPropConfig) {
  constructor (name, cfg) {

    this._name = name;

    cfg = cfg || {};

    if (typeof cfg === 'function') {
      // todo: Where is documented that a config can just be the coerce function?
      cfg = {coerce: cfg};
    }

    this.coerce = null;
    this.get = null;
    this.set = null;

    // Note: initial option is truly optional and it cannot be initialized.
    // Its presence is tested using hasOwnProperty()

    // todo: from doc one would think default value is undefined
    // we probabbly need to update the doc
    // value was defined inside props-init.js
    this.default = null;

    // todo: should be JSON.stringify ?
    // value was defined inside props-init.js
    this.deserialize = value => value;

    // todo: should be JSON.parse ?
    // value was defined inside props-init.js
    this.serialize = value => value;

    // Copy options from Prop Config
    assign(this, cfg);

    // attribute option
    if (!empty(cfg.attribute)) {
      this.attrIn = cfg.attribute;
      this.attrOut = cfg.attribute;
    }

    // attribute option is not a member of IPropDef
    delete this.attribute;

    this.attrIn = resolveAttrName(this.attrIn, name);
    this.attrOut = resolveAttrName(this.attrOut, name);
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
      // todo: should we allow a symbol prop to have a linked attribute?
      console.error('attribute must be a string for property ' + nameOrSymbol.toString());
    }
  }
  if (typeof attrOption === 'string') {
    return attrOption;
  }
}

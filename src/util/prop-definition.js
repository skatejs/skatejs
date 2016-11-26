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
    cfg = cfg || {};

    this.name = name;

    if (typeof cfg === 'function') {
      // todo: Where is documented that a config can just be the coerce function?
      cfg = {coerce: cfg};
    }

    // this.coerce = null;
    // this.get = null;
    // this.set = null;
    // this.initial = undefined; //todo?

    // todo: from doc one would think default value is undefined
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

    if (!empty(this.attribute)) {
      this.attrIn = this.attribute;
      this.attrOut = this.attribute;
    }

    // attribute is not a member of IPropDef
    // todo
    // delete this.attribute;
    this.attribute = resolveAttrName(this.attribute, name);

    this.attrIn = resolveAttrName(this.attrIn, name);
    this.attrOut = resolveAttrName(this.attrOut, name);

    // console.log(this);
  }

  // get name () {
  //   return this._name;
  // }

}

function resolveAttrName (attrOption, nameOrSymbol) {
  if (attrOption === true) {
    if (typeof nameOrSymbol === 'string') {
      return dashCase(nameOrSymbol);
    }
    if (typeof nameOrSymbol === 'symbol') {
      console.error('attribute must be a string for property ' + nameOrSymbol.toString());
    }
  }
  if (typeof attrOption === 'string') {
    return attrOption;
  }
  return null;
}

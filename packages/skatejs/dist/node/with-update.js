'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.props = exports.withUpdate = undefined;
exports.prop = prop;

var _index = require('./util/index.js');

var _withUpdate = require('./util/with-update.js');

function defineProps(constructor) {
  if (constructor.hasOwnProperty('_propsNormalised')) return;
  const props = constructor.props;

  (0, _index.keys)(props).forEach(name => {
    let func = props[name];
    if (typeof func !== 'function') func = prop(func);
    func({ constructor }, name);
  });
}

function delay(fn) {
  if (window.Promise) {
    Promise.resolve().then(fn);
  } else {
    setTimeout(fn);
  }
}

function prop(definition) {
  const propertyDefinition = definition || {};

  // Allows decorators, or imperative definitions.
  const func = function func({ constructor }, name) {
    const normalised = (0, _withUpdate.normalisePropertyDefinition)(
      name,
      propertyDefinition
    );
    const _value = (0, _index.sym)(name);

    // Ensure that we can cache properties. We have to do this so the _props object literal doesn't modify parent
    // classes or share the instance anywhere where it's not intended to be shared explicitly in userland code.
    if (!constructor.hasOwnProperty('_propsNormalised')) {
      constructor._propsNormalised = {};
    }

    // Cache the value so we can reference when syncing the attribute to the property.
    constructor._propsNormalised[name] = normalised;

    if (normalised.attribute.source) {
      constructor._observedAttributes.push(normalised.attribute.source);
    }

    Object.defineProperty(constructor.prototype, name, {
      configurable: true,
      get() {
        const val = this[_value];
        return val == null ? normalised.default : val;
      },
      set(val) {
        this[_value] = normalised.coerce(val);
        (0, _withUpdate.syncPropertyToAttribute)(
          this,
          normalised.attribute.target,
          normalised.serialize,
          val
        );
        this.triggerUpdate();
      }
    });
  };

  // Allows easy extension of pre-defined props { ...prop(), ...{} }.
  Object.keys(propertyDefinition).forEach(
    key => (func[key] = propertyDefinition[key])
  );

  return func;
}

const withUpdate = (exports.withUpdate = (Base = HTMLElement) => {
  var _class, _temp2;

  return (
    (_temp2 = _class = class extends Base {
      constructor(...args) {
        var _temp;

        return (
          (_temp = super(...args)),
          (this._prevProps = {}),
          (this._prevState = {}),
          (this._state = {}),
          _temp
        );
      }

      static get observedAttributes() {
        // We have to define props here because observedAttributes are retrieved
        // only once when the custom element is defined. If we did this only in
        // the constructor, then props would not link to attributes.
        defineProps(this);
        return this._observedAttributes;
      }

      static get props() {
        return this._props;
      }

      static set props(props) {
        this._props = props;
      }

      get props() {
        return (0, _index.keys)(this.constructor.props).reduce((prev, curr) => {
          prev[curr] = this[curr];
          return prev;
        }, {});
      }

      set props(props) {
        const ctorProps = this.constructor.props;
        (0, _index.keys)(props).forEach(
          k => k in ctorProps && (this[k] = props[k])
        );
      }

      get state() {
        return this._state;
      }

      set state(state) {
        this._state = state;
        this.triggerUpdate();
      }

      attributeChangedCallback(name, oldValue, newValue) {
        if (super.attributeChangedCallback) {
          super.attributeChangedCallback(name, oldValue, newValue);
        }
        (0, _withUpdate.syncAttributeToProperty)(this, name, newValue);
      }

      connectedCallback() {
        if (super.connectedCallback) {
          super.connectedCallback();
        }
        this.triggerUpdate();
      }

      shouldUpdate() {
        return true;
      }

      triggerUpdate() {
        if (this._updating) {
          return;
        }
        this._updating = true;
        delay(() => {
          const _prevProps = this._prevProps,
            _prevState = this._prevState;

          if (this.updating) {
            this.updating(_prevProps, _prevState);
          }
          if (this.updated && this.shouldUpdate(_prevProps, _prevState)) {
            this.updated(_prevProps, _prevState);
          }
          this._prevProps = this.props;
          this._prevState = this.state;
          this._updating = false;
        });
      }
    }),
    (_class._observedAttributes = []),
    _temp2
  );
});

const parse = JSON.parse,
  stringify = JSON.stringify;

const attribute = Object.freeze({ source: true });
const zeroOrNumber = val => ((0, _index.empty)(val) ? 0 : Number(val));

const any = prop({
  attribute
});

const array = prop({
  attribute,
  coerce: val =>
    Array.isArray(val) ? val : (0, _index.empty)(val) ? null : [val],
  default: Object.freeze([]),
  deserialize: parse,
  serialize: stringify
});

const boolean = prop({
  attribute,
  coerce: Boolean,
  default: false,
  deserialize: val => !(0, _index.empty)(val),
  serialize: val => (val ? '' : null)
});

const number = prop({
  attribute,
  default: 0,
  coerce: zeroOrNumber,
  deserialize: zeroOrNumber,
  serialize: val => ((0, _index.empty)(val) ? null : String(Number(val)))
});

const object = prop({
  attribute,
  default: Object.freeze({}),
  deserialize: parse,
  serialize: stringify
});

const string = prop({
  attribute,
  default: '',
  coerce: String,
  serialize: val => ((0, _index.empty)(val) ? null : String(val))
});

const props = (exports.props = {
  any,
  array,
  boolean,
  number,
  object,
  string
});

import data from '../util/data';
import emit from '../api/emit';
import events from './events';
import patchAttributeMethods from './patch-attribute-methods';
import propertiesInit from './properties-init';
import propertiesCreated from './properties-created';
import propertiesReady from './properties-ready';
import prototype from './prototype';
import resolve from './resolve';

const readyEventName = 'skate.ready';
const readyEventOptions = { bubbles: false, cancelable: false };

// TODO Remove this when we no longer support the legacy definitions and only
// support a superset of a native property definition.
function ensurePropertyFunctions (opts) {
  let properties = opts.properties;
  let names = Object.keys(properties || {});
  return names.reduce(function (descriptors, descriptorName) {
    descriptors[descriptorName] = opts.properties[descriptorName];
    if (typeof descriptors[descriptorName] !== 'function') {
      descriptors[descriptorName] = propertiesInit(descriptors[descriptorName]);
    }
    return descriptors;
  }, {});
}

function ensurePropertyDefinitions (elem, propertyFunctions) {
  return Object.keys(propertyFunctions || {}).reduce(function (descriptors, descriptorName) {
    descriptors[descriptorName] = propertyFunctions[descriptorName](descriptorName);
    return descriptors;
  }, {});
}

export default function (opts) {
  const applyEvents = events(opts);
  const applyPrototype = prototype(opts);
  const propertyFunctions = ensurePropertyFunctions(opts);

  return function () {
    const info = data(this, `lifecycle/${opts.id}`);
    const native = opts.isNative;
    const resolved = this.hasAttribute('resolved');

    if (info.created) return;
    info.created = true;
    const propertyDefinitions = ensurePropertyDefinitions(this, propertyFunctions);

    native || opts.attribute && patchAttributeMethods(this);
    native || opts.prototype && applyPrototype(this);
    opts.properties && propertiesCreated(this, propertyDefinitions);
    opts.events && applyEvents(this);
    opts.created && opts.created(this);
    resolved || opts.render && opts.render(this);
    opts.properties && propertiesReady(this, propertyDefinitions);
    opts.ready && opts.ready(this);
    emit(this, readyEventName, readyEventOptions);
    resolved || resolve(this, opts);
  };
}

import data from '../util/data';
import emit from '../api/emit';
import events from './events';
import global from '../util/global';
import patchAttributeMethods from './patch-attribute-methods';
import property from './property';
import propertiesCreated from './properties-created';
import propertiesReady from './properties-ready';
import prototype from './prototype';
import renderer from './renderer';
import resolve from './resolve';

const isBrowser = !!global.document;

// TODO Remove this when we no longer support the legacy definitions and only
// support a superset of a native property definition.
function ensurePropertyFunctions (opts) {
  let props = opts.properties;
  let names = Object.keys(props || {});
  return names.reduce(function (descriptors, descriptorName) {
    descriptors[descriptorName] = opts.properties[descriptorName];
    if (typeof descriptors[descriptorName] !== 'function') {
      descriptors[descriptorName] = property(descriptors[descriptorName]);
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

function notifyReady (elem) {
  emit(elem, 'skate.ready', {
    bubbles: false,
    cancelable: false
  });
}

function renderIfNotResolved (elem, opts) {
  if (!elem.hasAttribute(opts.resolvedAttribute)) {
    renderer(elem, opts);
  }
}

export default function (opts) {
  let applyEvents = events(opts);
  let applyPrototype = prototype(opts);
  let propertyFunctions = ensurePropertyFunctions(opts);

  return function () {
    let info = data(this, `lifecycle/${opts.id}`);
    let propertyDefinitions;

    if (info.created) return;
    info.created = true;
    propertyDefinitions = ensurePropertyDefinitions(this, propertyFunctions);

    isBrowser && patchAttributeMethods(this, opts);
    isBrowser && applyPrototype(this);
    propertiesCreated(this, propertyDefinitions);
    isBrowser && applyEvents(this);
    opts.created && opts.created(this);
    isBrowser && renderIfNotResolved(this, opts);
    propertiesReady(this, propertyDefinitions);
    isBrowser && opts.ready && opts.ready(this);
    isBrowser && notifyReady(this);
    resolve(this, opts);
  };
}

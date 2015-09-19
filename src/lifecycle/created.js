import apiProperty from '../api/property';
import createdOnDescendants from './created-on-descendants';
import data from '../util/data';
import events from './events';
import patchAttributeMethods from './patch-attribute-methods';
import propertiesCreated from './properties-created';
import propertiesReady from './properties-ready';
import prototype from './prototype';
import renderer from './renderer';
import resolve from './resolve';

// TODO Remove this when we no longer support the legacy definitions and only
// support a superset of a native property definition.
function ensurePropertyFunctions (opts) {
  let props = opts.properties;
  let names = Object.keys(props || {});
  return names.reduce(function (prev, curr) {
    prev[curr] = opts.properties[curr];
    if (typeof prev[curr] !== 'function') {
      prev[curr] = apiProperty(prev[curr]);
    }
    return prev;
  }, {});
}

function ensurePropertyDefinitions (elem, propertyFunctions) {
  return Object.keys(propertyFunctions || {}).reduce(function (prev, curr) {
    prev[curr] = propertyFunctions[curr](curr);
    return prev;
  }, {});
}

export default function (opts) {
  let applyEvents = events(opts);
  let applyPrototype = prototype(opts);
  let created = opts.created || function () {};
  let propertyFunctions = ensurePropertyFunctions(opts);
  let ready = opts.ready || function () {};

  return function () {
    let info = data(this, `lifecycle/${opts.id}`);
    let propertyDefinitions;

    if (info.created) return;
    info.created = true;
    propertyDefinitions = ensurePropertyDefinitions(this, propertyFunctions);

    patchAttributeMethods(this, opts);
    applyPrototype(this);
    propertiesCreated(this, propertyDefinitions);
    applyEvents(this);
    created.call(this);
    renderer(this, opts);
    createdOnDescendants(this, opts);
    propertiesReady(this, propertyDefinitions);
    ready.call(this, opts);
    resolve(this, opts);
  };
}

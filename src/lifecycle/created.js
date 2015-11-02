import data from '../util/data';
import emit from '../api/emit';
import events from './events';
import patchAttributeMethods from './patch-attribute-methods';
import propsInit from './props-init';
import propsCreated from './props-created';
import propsReady from './props-ready';
import prototype from './prototype';
import resolve from './resolve';

// TODO Remove this when we no longer support the legacy definitions and only
// support a superset of a native property definition.
function ensurePropertyFunctions (opts) {
  let props = opts.props;
  let names = Object.keys(props || {});
  return names.reduce(function (descriptors, descriptorName) {
    descriptors[descriptorName] = opts.props[descriptorName];
    if (typeof descriptors[descriptorName] !== 'function') {
      descriptors[descriptorName] = propsInit(descriptors[descriptorName]);
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
  if (opts.render && !elem.hasAttribute(opts.resolvedAttribute)) {
    opts.render(elem);
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

    patchAttributeMethods(this, opts);
    applyPrototype(this);
    propsCreated(this, propertyDefinitions);
    applyEvents(this);
    opts.created && opts.created(this);
    renderIfNotResolved(this, opts);
    propsReady(this, propertyDefinitions);
    opts.ready && opts.ready(this);
    notifyReady(this);
    resolve(this, opts);
  };
}

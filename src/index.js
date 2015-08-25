import apiCreate from './api/create';
import apiEmit from './api/emit';
import apiFragment from './api/fragment';
import apiInit from './api/init';
import apiVersion from './api/version';
import assign from './util/assign';
import assignSafe from './util/assign-safe';
import attached from './lifecycle/attached';
import attribute from './lifecycle/attribute';
import created from './lifecycle/created';
import debounce from './util/debounce';
import defaults from './defaults';
import detached from './lifecycle/detached';
import documentObserver from './global/document-observer';
import elementConstructor from './util/element-constructor';
import registry from './global/registry';
import supportsCustomElements from './support/custom-elements';
import typeElement from './type/element';
import utilWalkTree from './util/walk-tree';
import validCustomElement from './support/valid-custom-element';

function makeOptions (userOptions) {
  var options = assignSafe({}, defaults);

  // Copy over all standard options if the user has defined them.
  for (let name in defaults) {
    if (userOptions[name] !== undefined) {
      options[name] = userOptions[name];
    }
  }

  // Copy over non-standard options.
  for (let name in userOptions) {
    options[name] = userOptions[name];
  }

  return options;
}

function makeNonNewableWrapper (Ctor) {
  var CtorWrapper = function (props = {}) {
    return assign(new Ctor(), props);
  };
  CtorWrapper.prototype = Ctor.prototype;
  return CtorWrapper;
}

var HTMLElement = window.HTMLElement;
var initDocument = debounce(function () {
  utilWalkTree(document.documentElement.childNodes, function (element) {
    var components = registry.find(element);
    var componentsLength = components.length;

    for (let a = 0; a < componentsLength; a++) {
      created(components[a]).call(element);
    }

    for (let a = 0; a < componentsLength; a++) {
      attached(components[a]).call(element);
    }
  });
});

function skate (id, userOptions) {
  var Ctor, CtorParent, isNative;
  var opts = makeOptions(userOptions);

  CtorParent = opts.extends ? document.createElement(opts.extends).constructor : HTMLElement;
  isNative = opts.type === typeElement && supportsCustomElements() && validCustomElement(id);

  // Inherit from parent prototype.
  if (!CtorParent.prototype.isPrototypeOf(opts.prototype)) {
    opts.prototype = assignSafe(Object.create(CtorParent.prototype), opts.prototype);
  }

  // Native doesn't like if you pass a falsy value. Must be undefined.
  opts.extends = opts.extends || undefined;

  // Extend behaviour of existing callbacks.
  opts.prototype.createdCallback = created(opts);
  opts.prototype.attachedCallback = attached(opts);
  opts.prototype.detachedCallback = detached(opts);
  opts.prototype.attributeChangedCallback = attribute(opts);

  // Ensure the ID can be retrieved from the options or constructor.
  opts.id = id;

  // Make a constructor for the definition.
  if (isNative) {
    Ctor = document.registerElement(id, opts);
  } else {
    Ctor = elementConstructor(opts);
    initDocument();
    documentObserver.register();
  }

  Ctor = makeNonNewableWrapper(Ctor);
  assignSafe(Ctor, opts);
  registry.set(id, Ctor);

  return Ctor;
}

skate.create = apiCreate;
skate.emit = apiEmit;
skate.fragment = apiFragment;
skate.init = apiInit;
skate.version = apiVersion;

// ES6
export default skate;

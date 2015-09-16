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
  let options = assignSafe({}, defaults);

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
  let CtorWrapper = function (props = {}) {
    return assign(new Ctor(), props);
  };
  CtorWrapper.prototype = Ctor.prototype;
  return CtorWrapper;
}

let HTMLElement = window.HTMLElement;
let initDocument = debounce(function () {
  utilWalkTree(document.documentElement.childNodes, function (element) {
    let components = registry.find(element);
    let componentsLength = components.length;

    for (let a = 0; a < componentsLength; a++) {
      created(components[a]).call(element);
    }

    for (let a = 0; a < componentsLength; a++) {
      attached(components[a]).call(element);
    }
  });
});

function skate (id, userOptions) {
  let Ctor, CtorParent;
  let opts = makeOptions(userOptions);

  opts.id = id;
  opts.isNative = opts.type === typeElement && supportsCustomElements() && validCustomElement(id);
  CtorParent = opts.extends ? document.createElement(opts.extends).constructor : HTMLElement;

  // Inherit from parent prototype.
  if (!CtorParent.prototype.isPrototypeOf(opts.prototype)) {
    opts.prototype = assignSafe(Object.create(CtorParent.prototype), opts.prototype);
  }

  // Extend behaviour of existing callbacks.
  opts.prototype.createdCallback = created(opts);
  opts.prototype.attachedCallback = attached(opts);
  opts.prototype.detachedCallback = detached(opts);
  opts.prototype.attributeChangedCallback = attribute(opts);

  // Make a constructor for the definition.
  if (opts.isNative) {
    Ctor = document.registerElement(id, {
      extends: opts.extends || undefined,
      prototype: opts.prototype
    });
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

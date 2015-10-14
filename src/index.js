import apiCreate from './api/create';
import apiEmit from './api/emit';
import apiFragment from './api/fragment';
import apiInit from './api/init';
import apiProperty from './api/property/index';
import apiReady from './api/ready';
import apiRender from './api/render';
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
import global from './util/global';
import registry from './global/registry';
import supportsCustomElements from './support/custom-elements';
import typeElement from './type/element';
import walkTree from './util/walk-tree';
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
  function CtorWrapper (props = {}) {
    return assign(new Ctor(), props);
  }

  // Copy prototype.
  CtorWrapper.prototype = Ctor.prototype;

  // Ensure a non-enumerable constructor property exists.
  Object.defineProperty(Ctor.prototype, 'constructor', {
    enumerable: false,
    value: CtorWrapper
  });

  return CtorWrapper;
}

function polyfillElementConstructor (opts) {
  const type = opts.type;
  function CustomElement () {
    const element = type.create(opts);
    opts.prototype.createdCallback.call(element);
    return element;
  }
  CustomElement.prototype = opts.prototype;
  return CustomElement;
}

let HTMLElement = global.HTMLElement;
let initDocument = debounce(function () {
  walkTree(document.documentElement.childNodes, function (element) {
    let components = registry.find(element);
    let componentsLength = components.length;

    for (let a = 0; a < componentsLength; a++) {
      components[a].prototype.createdCallback.call(element);
    }

    for (let a = 0; a < componentsLength; a++) {
      components[a].prototype.attachedCallback.call(element);
    }
  });
});

function getParentPrototype (name) {
  if (global.document) {
    return (name ? document.createElement(name).constructor : HTMLElement).prototype;
  }
}

function skate (id, userOptions) {
  let Ctor, parentProto;
  let opts = makeOptions(userOptions);

  opts.id = id;
  opts.isNative = opts.type === typeElement && supportsCustomElements() && validCustomElement(id);
  parentProto = getParentPrototype(opts.extends);

  // Inherit from parent prototype.
  if (parentProto && !parentProto.isPrototypeOf(opts.prototype)) {
    opts.prototype = assignSafe(Object.create(parentProto), opts.prototype);
  }

  // Make custom definition conform to native.
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
    Ctor = polyfillElementConstructor(opts);

    if (global.document) {
      initDocument();
      documentObserver.register();
    }
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
skate.property = apiProperty;
skate.ready = apiReady;
skate.render = apiRender;
skate.version = apiVersion;

export default skate;

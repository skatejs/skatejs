import apiCreate from './api/create';
import apiEmit from './api/emit';
import apiFragment from './api/fragment';
import apiInit from './api/init';
import apiProperties from './api/properties/index';
import apiReady from './api/ready';
import apiRender from './api/render/index';
import apiVersion from './api/version';
import assign from 'object-assign';
import assignSafe from './util/assign-safe';
import attached from './lifecycle/attached';
import attribute from './lifecycle/attribute';
import created from './lifecycle/created';
import debounce from './util/debounce';
import defaults from './defaults';
import detached from './lifecycle/detached';
import documentObserver from './global/document-observer';
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

function makeNonNewableWrapper (Ctor, opts) {
  function CtorWrapper (properties = {}) {
    return assign(new Ctor(), properties);
  }

  // Copy prototype.
  CtorWrapper.prototype = Ctor.prototype;

  // Ensure a non-enumerable constructor property exists.
  Object.defineProperty(CtorWrapper.prototype, 'constructor', {
    configurable: true,
    enumerable: false,
    value: CtorWrapper,
    writable: false
  });

  // Make Function.prototype.name behave like native custom elements but only
  // if it's allowed (i.e. not Safari).
  const nameProp = Object.getOwnPropertyDescriptor(CtorWrapper, 'name');
  if (nameProp && nameProp.configurable) {
    Object.defineProperty(CtorWrapper, 'name', {
      configurable: true,
      enumerable: false,
      value: opts.id,
      writable: false
    });
  }

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

let HTMLElement = window.HTMLElement;
let initDocument = debounce(function () {
  utilWalkTree(document.documentElement.childNodes, function (element) {
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

function skate (name, userOptions) {
  let Ctor, parentProto;
  let opts = makeOptions(userOptions);

  opts.id = name;
  opts.isNative = opts.type === typeElement && supportsCustomElements() && validCustomElement(name);
  parentProto = (opts.extends ? document.createElement(opts.extends).constructor : HTMLElement).prototype;

  // Inherit from parent prototype.
  if (!parentProto.isPrototypeOf(opts.prototype)) {
    opts.prototype = assignSafe(Object.create(parentProto), opts.prototype);
  }

  // Make custom definition conform to native.
  opts.prototype.createdCallback = created(opts);
  opts.prototype.attachedCallback = attached(opts);
  opts.prototype.detachedCallback = detached(opts);
  opts.prototype.attributeChangedCallback = attribute(opts);

  // Make a constructor for the definition.
  if (opts.isNative) {
    const nativeDefinition = {
      prototype: opts.prototype
    };
    if (opts.extends) {
      nativeDefinition.extends = opts.extends;
    }
    Ctor = document.registerElement(name, nativeDefinition);
  } else {
    Ctor = polyfillElementConstructor(opts);
    initDocument();
    documentObserver.register();
  }

  Ctor = makeNonNewableWrapper(Ctor, opts);
  assignSafe(Ctor, opts);
  registry.set(name, Ctor);

  return Ctor;
}

skate.create = apiCreate;
skate.emit = apiEmit;
skate.fragment = apiFragment;
skate.init = apiInit;
skate.properties = apiProperties;
skate.ready = apiReady;
skate.render = apiRender;
skate.version = apiVersion;

export default skate;

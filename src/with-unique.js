import { customElements, dashCase, HTMLElement, keys, sym } from './util';
import { define } from './define';

const _is = sym();
const _isCached = sym();

const baseFunctionStatics = keys(function () {});
const hasReflect = typeof Reflect === 'object';

let suffix = 0;

function extendStatics (Ctor, Base) {
  keys(Base).forEach(name => {
    if (baseFunctionStatics.indexOf(name) > -1) {
      return;
    }
    const descriptor = Object.getOwnPropertyDescriptor(Base, name);
    if (descriptor) {
      Object.defineProperty(Ctor, name, descriptor);
    }
  });
}

function formatName (prefix, suffix) {
  return (
    prefix.indexOf('-') === -1 ? `x-${prefix}` : prefix
  ) + (
    suffix ? `-${suffix}` : ''
  );
}

function generateName (Ctor) {
  const prefix = Ctor[_is] || dashCase(Ctor.name) || 'element';
  while (customElements.get(formatName(prefix, suffix))) {
    suffix++;
  }
  return formatName(prefix, suffix++);
}

export function withUnique (Base = HTMLElement) {
  function Ctor () {
    const { constructor } = this;
    define(constructor);
    // Reflect.construct(Base, [], constructor);
    return Base.call(this);
  }
  Object.defineProperty(Ctor, 'is', {
    get () {
      return this[_isCached] || (this[_isCached] = generateName(this));
    },
    set (is) {
      this[_is] = is;
    }
  });
  Ctor.prototype = Object.create(Base.prototype);
  Ctor.prototype.constructor = Ctor;
  extendStatics(Ctor, Base);
  return Ctor;
}

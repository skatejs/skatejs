import { customElements, dashCase, HTMLElement, keys, sym } from './util';
import { define } from './define';

const _is = sym();
const baseFunctionStatics = keys(function () {});

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

function generateName (Ctor, hint) {
  const prefix = hint || dashCase(Ctor.name) || 'element';
  while (customElements.get(formatName(prefix, suffix))) {
    suffix++;
  }
  return formatName(prefix, suffix++);
}

export function withUnique (Base = HTMLElement) {
  function Ctor () {
    const { constructor } = this;
    define(constructor);
    return Base.call(this);
  }
  Object.defineProperty(Ctor, 'is', {
    get () {
      return this[_is] || (this[_is] = generateName(this));
    },
    set (is) {
      this[_is] = generateName(this, is);
      define(this);
    }
  });
  Ctor.prototype = Object.create(Base.prototype);
  Ctor.prototype.constructor = Ctor;
  extendStatics(Ctor, Base);
  return Ctor;
}

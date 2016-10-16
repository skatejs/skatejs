import assign from '../util/assign';
import createSymbol from '../util/create-symbol';
import empty from '../util/empty';

const alwaysUndefinedIfNotANumberOrNumber = val => (isNaN(val) ? undefined : Number(val));
const alwaysUndefinedIfEmptyOrString = val => (empty(val) ? undefined : String(val));

export function create (def) {
  return (...args) => {
    args.unshift({}, def);
    return assign(...args);
  };
}



// array

export const array = create({
  coerce: val => (Array.isArray(val) ? val : [val]),
  default: () => [],
  deserialize: JSON.parse,
  serialize: JSON.stringify
});



// boolean

export const boolean = create({
  coerce: value => !!value,
  default: false,
  deserialize: value => !(value === null),
  serialize: value => (value ? '' : undefined)
});



// number

export const number = create({
  default: 0,
  coerce: alwaysUndefinedIfNotANumberOrNumber,
  deserialize: alwaysUndefinedIfNotANumberOrNumber,
  serialize: alwaysUndefinedIfNotANumberOrNumber
});



// slot

const { MutationObserver } = window;
const attrSlot = 'slot';
const symCache = createSymbol();
const symDefault = createSymbol();
const symMap = createSymbol();
const symMo = createSymbol();
const symProps = createSymbol();

function distribute (cache, child) {
  const slot = child.getAttribute(attrSlot) || symDefault;
  cache[slot] = cache[slot] || [];
  cache[slot].push(child);
  return cache;
}

function distributed ({ children }) {
  return [...children].reduce(distribute, {});
}

function slotMap (elem, name) {
  return elem[symMap][name] || symDefault;
}

function updateProp (elem, name, distributed) {
  elem[name] = distributed[slotMap(elem, name)];
}

function updateProps ({ target: elem }) {
  const dist = distributed(elem);
  elem[symProps].forEach(name => updateProp(elem, name, dist));
}

export const slot = create({
  name: null,
  get (elem, { name }) {
    if (!elem[symCache]) {
      const mo = new MutationObserver(muts => muts.forEach(updateProps));
      mo.observe(elem, { childList: true });
      elem[symCache] = distributed(elem);
      elem[symMo] = mo;
      elem[symMap] = {};
      elem[symProps] = [];
    }
    elem[symMap][name] = this.name;
    elem[symProps].push(name);
    return elem[symCache][slotMap(elem, name)] || [];
  },
  set (elem, { name, newValue }) {
    elem[symCache][slotMap(elem, name)] = newValue;
  }
});



// string

export const string = create({
  default: '',
  coerce: alwaysUndefinedIfEmptyOrString,
  deserialize: alwaysUndefinedIfEmptyOrString,
  serialize: alwaysUndefinedIfEmptyOrString
});

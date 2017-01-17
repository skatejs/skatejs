/* eslint no-plusplus: 0 */

import {
  applyProp,
  attributes,
  elementClose,
  elementOpen as idomElementOpen,
  skip as idomSkip,
  symbols,
  text
} from 'incremental-dom';
import { name as $name, ref as $ref } from '../util/symbols';
import propContext from '../util/prop-context';
import root from '../util/root';

const { customElements, HTMLElement } = root;
const applyDefault = attributes[symbols.default];

// A stack of children that corresponds to the current function helper being
// executed.
const stackChren = [];

const $skip = '__skip';
const $currentEventHandlers = '__events';
const $stackCurrentHelperProps = '__props';

// The current function helper in the stack.
let stackCurrentHelper;

// This is used for the Incremental DOM overrides to keep track of what args
// to pass the main elementOpen() function.
let overrideArgs;

// The number of levels deep after skipping a tree.
let skips = 0;

const noop = () => {};

// Adds or removes an event listener for an element.
function applyEvent (elem, ename, newFunc) {
  let events = elem[$currentEventHandlers];

  if (!events) {
    events = elem[$currentEventHandlers] = {};
  }

  // Undefined indicates that there is no listener yet.
  if (typeof events[ename] === 'undefined') {
    // We only add a single listener once. Originally this was a workaround for
    // the Webcomponents ShadyDOM polyfill not removing listeners, but it's
    // also a simpler model for binding / unbinding events because you only
    // have a single handler you need to worry about and a single place where
    // you only store one event handler
    elem.addEventListener(ename, function (e) {
      if (events[ename]) {
        events[ename].call(this, e);
      }
    });
  }

  // Not undefined indicates that we have set a listener, so default to null.
  events[ename] = typeof newFunc === 'function' ? newFunc : null;
}

const attributesContext = propContext(attributes, {
  // Attributes that shouldn't be applied to the DOM.
  key: noop,
  statics: noop,

  // Attributes that *must* be set via a property on all elements.
  checked: applyProp,
  className: applyProp,
  disabled: applyProp,
  value: applyProp,

  // Ref handler.
  ref (elem, name, value) {
    elem[$ref] = value;
  },

  // Skip handler.
  skip (elem, name, value) {
    if (value) {
      elem[$skip] = true;
    } else {
      delete elem[$skip];
    }
  },

  // Default attribute applicator.
  [symbols.default] (elem, name, value) {
    const ce = customElements.get(elem.localName);
    const props = ce && ce.props || {};
    const prototype = ce && ce.prototype || {};

    // TODO when refactoring properties to not have to workaround the old
    // WebKit bug we can remove the "name in props" check below.
    //
    // NOTE: That the "name in elem" check won't work for polyfilled custom
    // elements that set a property that isn't explicitly specified in "props"
    // or "prototype" unless it is added to the element explicitly as a
    // property prior to passing the prop to the vdom function. For example, if
    // it were added in a lifecycle callback because it wouldn't have been
    // upgraded yet.
    //
    // We prefer setting props, so we do this if there's a property matching
    // name that was passed. However, certain props on SVG elements are
    // readonly and error when you try to set them.
    if ((name in props || name in elem || name in prototype) && !('ownerSVGElement' in elem)) {
      applyProp(elem, name, value);
      return;
    }

    // Explicit false removes the attribute.
    if (value === false) {
      applyDefault(elem, name);
      return;
    }

    // Handle built-in and custom events.
    if (name.indexOf('on') === 0) {
      const firstChar = name[2];
      let eventName;

      if (firstChar === '-') {
        eventName = name.substring(3);
      } else if (firstChar === firstChar.toUpperCase()) {
        eventName = firstChar.toLowerCase() + name.substring(3);
      }

      if (eventName) {
        applyEvent(elem, eventName, value);
        return;
      }
    }

    applyDefault(elem, name, value);
  }
});

function resolveTagName (name) {
  // We return falsy values as some wrapped IDOM functions allow empty values.
  if (!name) {
    return name;
  }

  // We try and return the cached tag name, if one exists. This will work with
  // *any* web component of any version that defines a `static is` property.
  if (name.is) {
    return name.is;
  }

  // Get the name for the custom element by constructing it and using the
  // localName property. Cache it and lookup the cached value for future calls.
  if (name.prototype instanceof HTMLElement) {
    if (name[$name]) {
      return name[$name];
    }

    // eslint-disable-next-line
    const elem = new name();
    return (elem[$name] = elem.localName);
  }

  // Pass all other values through so IDOM gets what it's expecting.
  return name;
}

// Incremental DOM's elementOpen is where the hooks in `attributes` are applied,
// so it's the only function we need to execute in the context of our attributes.
const elementOpen = attributesContext(idomElementOpen);

function elementOpenStart (tag, key = null, statics = null) {
  overrideArgs = [tag, key, statics];
}

function elementOpenEnd () {
  const node = newElementOpen(...overrideArgs); // eslint-disable-line no-use-before-define
  overrideArgs = null;
  return node;
}

function wrapIdomFunc (func, tnameFuncHandler = noop) {
  return function wrap (...args) {
    args[0] = resolveTagName(args[0]);
    stackCurrentHelper = null;
    if (typeof args[0] === 'function') {
      // If we've encountered a function, handle it according to the type of
      // function that is being wrapped.
      stackCurrentHelper = args[0];
      return tnameFuncHandler(...args);
    } else if (stackChren.length) {
      // We pass the wrap() function in here so that when it's called as
      // children, it will queue up for the next stack, if there is one.
      stackChren[stackChren.length - 1].push([wrap, args]);
    } else {
      if (func === elementOpen) {
        if (skips) {
          return ++skips;
        }

        const elem = func(...args);

        if (elem[$skip]) {
          ++skips;
        }

        return elem;
      }

      if (func === elementClose) {
        if (skips === 1) {
          idomSkip();
        }

        // We only want to skip closing if it's not the last closing tag in the
        // skipped tree because we keep the element that initiated the skpping.
        if (skips && --skips) {
          return;
        }

        const elem = func(...args);
        const ref = elem[$ref];

        // We delete so that it isn't called again for the same element. If the
        // ref changes, or the element changes, this will be defined again.
        delete elem[$ref];

        // Execute the saved ref after esuring we've cleand up after it.
        if (typeof ref === 'function') {
          ref(elem);
        }

        return elem;
      }

      // We must call elementOpenStart and elementOpenEnd even if we are
      // skipping because they queue up attributes and then call elementClose.
      if (!skips || (func === elementOpenStart || func === elementOpenEnd)) {
        return func(...args);
      }
    }
  };
}

function newAttr (...args) {
  if (stackCurrentHelper) {
    stackCurrentHelper[$stackCurrentHelperProps][args[0]] = args[1];
  } else if (stackChren.length) {
    stackChren[stackChren.length - 1].push([newAttr, args]);
  } else {
    overrideArgs.push(args[0]);
    overrideArgs.push(args[1]);
  }
}

function stackOpen (tname, key, statics, ...attrs) {
  const props = { key, statics };
  for (let a = 0; a < attrs.length; a += 2) {
    props[attrs[a]] = attrs[a + 1];
  }
  tname[$stackCurrentHelperProps] = props;
  stackChren.push([]);
}

function stackClose (tname) {
  const chren = stackChren.pop();
  const props = tname[$stackCurrentHelperProps];
  delete tname[$stackCurrentHelperProps];
  const elemOrFn = tname(props, () => chren.forEach(args => args[0](...args[1])));
  return typeof elemOrFn === 'function' ? elemOrFn() : elemOrFn;
}

// Incremental DOM overrides
// -------------------------

// We must override internal functions that call internal Incremental DOM
// functions because we can't override the internal references. This means
// we must roughly re-implement their behaviour. Luckily, they're fairly
// simple.
const newElementOpenStart = wrapIdomFunc(elementOpenStart, stackOpen);
const newElementOpenEnd = wrapIdomFunc(elementOpenEnd);

// Standard open / closed overrides don't need to reproduce internal behaviour
// because they are the ones referenced from *End and *Start.
const newElementOpen = wrapIdomFunc(elementOpen, stackOpen);
const newElementClose = wrapIdomFunc(elementClose, stackClose);

// Ensure we call our overridden functions instead of the internal ones.
function newElementVoid (tag, ...args) {
  newElementOpen(tag, ...args);
  return newElementClose(tag);
}

// Text override ensures their calls can queue if using function helpers.
const newText = wrapIdomFunc(text);

// Convenience function for declaring an Incremental DOM element using
// hyperscript-style syntax.
export function element (tname, attrs, ...chren) {
  const atype = typeof attrs;

  // If attributes are a function, then they should be treated as children.
  if (atype === 'function' || atype === 'string' || atype === 'number') {
    chren.unshift(attrs);
  }

  // Ensure the attributes are an object. Null is considered an object so we
  // have to test for this explicitly.
  if (attrs === null || atype !== 'object') {
    attrs = {};
  }

  // We open the element so we can set attrs after.
  newElementOpenStart(tname, attrs.key, attrs.statics);

  // Delete so special attrs don't actually get set.
  delete attrs.key;
  delete attrs.statics;

  // Set attributes.
  Object.keys(attrs).forEach(name => newAttr(name, attrs[name]));

  // Close before we render the descendant tree.
  newElementOpenEnd(tname);

  chren.forEach((ch) => {
    const ctype = typeof ch;
    if (ctype === 'function') {
      ch();
    } else if (ctype === 'string' || ctype === 'number') {
      newText(ch);
    } else if (Array.isArray(ch)) {
      ch.forEach(sch => sch());
    }
  });

  return newElementClose(tname);
}

// Even further convenience for building a DSL out of JavaScript functions or hooking into standard
// transpiles for JSX (React.createElement() / h).
export function builder (...tags) {
  if (tags.length === 0) {
    return (...args) => element.bind(null, ...args);
  }
  return tags.map(tag =>
    (...args) =>
      element.bind(null, tag, ...args)
  );
}

// We don't have to do anything special for the text function; it's just a
// straight export from Incremental DOM.
export {
  newAttr as attr,
  newElementClose as elementClose,
  newElementOpen as elementOpen,
  newElementOpenEnd as elementOpenEnd,
  newElementOpenStart as elementOpenStart,
  newElementVoid as elementVoid,
  newText as text
};

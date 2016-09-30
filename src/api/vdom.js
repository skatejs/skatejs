/* eslint no-plusplus: 0 */

import {
  applyProp,
  attributes,
  elementClose,
  elementOpen as idomElementOpen,
  skip as idomSkip,
  symbols,
  text,
} from 'incremental-dom';
import { name as $name, ref as $ref } from '../util/symbols';
import { shadowDomV0, shadowDomV1 } from '../util/support';
import propContext from '../util/prop-context';

const applyDefault = attributes[symbols.default];
const fallbackToV0 = !shadowDomV1 && shadowDomV0;

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
function applyEvent(elem, ename, newFunc) {
  let events = elem[$currentEventHandlers];

  if (!events) {
    events = elem[$currentEventHandlers] = {};
  }

  const oldFunc = events[ename];

  // Remove old listener so they don't double up.
  if (oldFunc) {
    elem.removeEventListener(ename, oldFunc);
  }

  // Bind new listener.
  if (newFunc) {
    elem.addEventListener(ename, events[ename] = newFunc);
  }
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

  // V0 Shadow DOM to V1 normalisation.
  name(elem, name, value) {
    if (elem.tagName === 'CONTENT') {
      name = 'select';
      value = `[slot="${value}"]`;
    }
    applyDefault(elem, name, value);
  },

  // Ref handler.
  ref(elem, name, value) {
    elem[$ref] = value;
  },

  // Skip handler.
  skip(elem, name, value) {
    if (value) {
      elem[$skip] = true;
    } else {
      delete elem[$skip];
    }
  },

  // Default attribute applicator.
  [symbols.default](elem, name, value) {
    // Custom element properties should be set as properties.
    const props = elem.constructor.props;
    if (props && name in props) {
      return applyProp(elem, name, value);
    }

    // Boolean false values should not set attributes at all.
    if (value === false) {
      return applyDefault(elem, name);
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

    // Set defined props on the element directly. This ensures properties like
    // "value" on <input> elements get set correctly. Setting those as attributes
    // doesn't always work and setting props is faster than attributes.
    //
    // However, certain props on SVG elements are readonly and error when you try
    // to set them.
    if (name in elem && !('ownerSVGElement' in elem)) {
      applyProp(elem, name, value);
      return;
    }

    // Fallback to default IncrementalDOM behaviour.
    applyDefault(elem, name, value);
  },
});

function resolveTagName(tname) {
  // If the tag name is a function, a Skate constructor or a standard function
  // is supported.
  //
  // - If a Skate constructor, the tag name is extracted from that.
  // - If a standard function, it is used as a helper.
  if (typeof tname === 'function') {
    return tname[$name] || tname;
  }

  // Skate allows the consumer to use <slot /> and it will translate it to
  // <content /> if Shadow DOM V0 is preferred.
  if (tname === 'slot' && fallbackToV0) {
    return 'content';
  }

  // All other tag names are just passed through.
  return tname;
}

// Incremental DOM's elementOpen is where the hooks in `attributes` are applied,
// so it's the only function we need to execute in the context of our attributes.
const elementOpen = attributesContext(idomElementOpen);

function elementOpenStart(tag, key = null, statics = null) {
  overrideArgs = [tag, key, statics];
}

function elementOpenEnd() {
  const node = newElementOpen(...overrideArgs); // eslint-disable-line no-use-before-define
  overrideArgs = null;
  return node;
}

function wrapIdomFunc(func, tnameFuncHandler = noop) {
  return function wrap(...args) {
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

function newAttr(...args) {
  if (stackCurrentHelper) {
    stackCurrentHelper[$stackCurrentHelperProps][args[0]] = args[1];
  } else if (stackChren.length) {
    stackChren[stackChren.length - 1].push([newAttr, args]);
  } else {
    overrideArgs.push(args[0]);
    overrideArgs.push(args[1]);
  }
}

function stackOpen(tname, key, statics, ...attrs) {
  const props = { key, statics };
  for (let a = 0; a < attrs.length; a += 2) {
    props[attrs[a]] = attrs[a + 1];
  }
  tname[$stackCurrentHelperProps] = props;
  stackChren.push([]);
}

function stackClose(tname) {
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
function newElementVoid(tag, ...args) {
  newElementOpen(tag, ...args);
  return newElementClose(tag);
}

// Text override ensures their calls can queue if using function helpers.
const newText = wrapIdomFunc(text);

// Convenience function for declaring an Incremental DOM element using
// hyperscript-style syntax.
export function element(tname, attrs, ...chren) {
  const atype = typeof attrs;

  // If attributes are a function, then they should be treated as children.
  if (atype === 'function' || atype === 'string' || atype === 'number') {
    chren = [attrs];
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
    }
  });

  return newElementClose(tname);
}

// Even further convenience for building a DSL out of JavaScript functions or hooking into standard
// transpiles for JSX (React.createElement() / h).
export function builder(...tags) {
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
  newText as text,
};

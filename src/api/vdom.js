import {
  applyProp,
  attributes,
  currentElement,
  elementClose,
  elementOpen,
  elementVoid,
  skip,
  symbols,
  text,
} from 'incremental-dom';
import { name as $name, ref as $ref } from '../util/symbols';
import { shadowDomV0, shadowDomV1 } from '../util/support';

const applyDefault = attributes[symbols.default];
const fallbackToV0 = !shadowDomV1 && shadowDomV0;

// A stack of children that corresponds to the current function helper being
// executed.
const stackChren = [];

const $skipCurrentElement = '__skip';
const $currentEventHandlers = '__events';
const $stackCurrentHelperProps = '__props';

// The current function helper in the stack.
let stackCurrentHelper;

// This is used for the Incremental DOM overrides to keep track of what args
// to pass the main elementOpen() function.
let overrideArgs;

// Whether or not to skip the current rendering tree.
let skipCurrentTree = false;

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

// Attributes that are not handled by Incremental DOM.
attributes.key = attributes.statics = function () {};

// Attributes that *must* be set via a property on all elements.
attributes.checked = attributes.className = attributes.disabled = attributes.value = applyProp;

// V0 Shadow DOM to V1 normalisation.
attributes.name = function (elem, name, value) {
  if (elem.tagName === 'CONTENT') {
    name = 'select';
    value = `[slot="${value}"]`;
  }
  applyDefault(elem, name, value);
};

// Ref handler.
attributes.ref = function (elem, name, value) {
  elem[$ref] = value;
};

// Skip handler.
attributes.skip = function (elem, name, value) {
  if (value) {
    skip();
    elem[$skipCurrentElement] = true;
  } else {
    delete elem[$skipCurrentElement];
  }
};

// Default attribute applicator.
attributes[symbols.default] = function (elem, name, value) {
  // Custom element properties should be set as properties.
  const props = elem.constructor.props;
  if (props && name in props) {
    return applyProp(elem, name, value);
  }

  // Boolean false values should not set attributes at all.
  if (value === false) {
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
};

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

function wrapIdomFunc(func, tnameFuncHandler = () => {}) {
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
      const isElementClosing = func === elementClose;
      const isElementOpening = func === elementOpen;

      // If we're skipping the tree, we must skip everything except for the
      // closing of the element that originally started the skipping.
      if (skipCurrentTree && !isElementClosing && !currentElement()[$skipCurrentElement]) {
        return;
      }

      const elem = func(...args);

      if (isElementOpening && elem[$skipCurrentElement]) {
        skipCurrentTree = true;
      } else if (isElementClosing) {
        const eref = elem[$ref];

        // We delete so that it isn't called again for the same element. If the
        // ref changes, or the element changes, this will be defined again.
        delete elem[$ref];

        // Execute the saved ref after esuring we've cleand up after it.
        if (typeof eref === 'function') {
          eref(elem);
        }

        // If this element was skipped, we should stop skipping the tree since
        // the element is now closing.
        if (elem[$skipCurrentElement]) {
          skipCurrentTree = false;
        }
      }

      return elem;
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
  return tname(props, () => chren.forEach(args => args[0](...args[1])));
}

function stackVoid(...args) {
  stackOpen(...args);
  return stackClose(args[0]);
}



// Incremental DOM overrides
// -------------------------

// We must override internal functions that call internal Incremental DOM
// functions because we can't override the internal references. This means
// we must roughly re-implement their behaviour. Luckily, they're fairly
// simple.
const newElementOpenEnd = wrapIdomFunc(() => {
  const node = newElementOpen(...overrideArgs);
  overrideArgs = null;
  return node;
});
const newElementOpenStart = wrapIdomFunc((...args) => {
  overrideArgs = args;
}, stackOpen);

// Standard open / closed overrides don't need to reproduce internal behaviour
// because they are the ones referenced from *End and *Start.
const newElementOpen = wrapIdomFunc(elementOpen, stackOpen);
const newElementClose = wrapIdomFunc(elementClose, stackClose);

// Ensure we call our overridden functions instead of the internal ones.
const newElementVoid = wrapIdomFunc(elementVoid, stackVoid);

// Text override ensures their calls can queue if using function helpers.
const newText = wrapIdomFunc(text);



// Convenience function for declaring an Incremental DOM element using
// hyperscript-style syntax.
export function element(tname, attrs, chren) {
  const atype = typeof attrs;

  // If attributes are a function, then they should be treated as children.
  if (atype === 'function' || atype === 'string') {
    chren = attrs;
  }

  // Ensure the attributes are an object.
  if (atype !== 'object') {
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

  const ctype = typeof chren;
  if (ctype === 'function') {
    chren();
  } else if (ctype === 'string' || ctype === 'number') {
    newText(chren);
  }

  return newElementClose(tname);
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

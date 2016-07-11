import {
  applyProp,
  attr,
  attributes,
  elementClose,
  elementOpen,
  elementOpenEnd,
  elementOpenStart,
  elementVoid,
  skip,
  symbols,
  text,
} from 'incremental-dom';
import * as skateSymbols from './symbols';
import { shadowDomV0, shadowDomV1 } from '../util/support';

const fallbackToV0 = !shadowDomV1 && shadowDomV0;
const applyDefault = attributes[symbols.default];

// Attributes that are not handled by Incremental DOM.
attributes.key = attributes.skip = attributes.statics = function () {};

// Attributes that *must* be set via a property on all elements.
attributes.checked = attributes.className = attributes.disabled = attributes.value = applyProp;

// Default attribute applicator.
attributes[symbols.default] = function (elem, name, value) {
  // If the skip attribute was specified, skip
  if (name === 'skip' && value) {
    return skip();
  }

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
    return name in elem ? applyProp(elem, name, value) : applyEvent(elem, name.substring(2), name, value);
  }

  // Set the select attribute instead of name if it was a <slot> translated to 
  // a <content> for v0.
  if (name === 'name' && elem.tagName === 'CONTENT') {
    name = 'select';
    value = `[slot="${value}"]`;
  }

  // Fallback to default IncrementalDOM behaviour.
  applyDefault(elem, name, value);
};

// Adds or removes an event listener for an element.
function applyEvent (elem, ename, name, value) {
  let events = elem.__events;

  if (!events) {
    events = elem.__events = {};
  }

  const eFunc = events[ename];

  // Remove old listener so they don't double up.
  if (eFunc) {
    elem.removeEventListener(ename, eFunc);
  }

  // Bind new listener.
  if (value) {
    elem.addEventListener(ename, events[ename] = value);
  }
}

// Returns the tag name of the element if a custom element constructor was
// provided instead of a string.
function decideIfConstructorOrNot (tname) {
  return typeof tname === 'function' ? tname[skateSymbols.name] : tname;
}

// Returns the correct tag name so we can use <content> instead of <slot> if we
// need to use Shadow DOM V0.
function decideIfContentTagOrNot (tname) {
  return tname === 'slot' && fallbackToV0 ? 'content' : tname;
}

// Patch elementOpen() so that anything that compiles down to Incremental DOM
// gets the special behaviour.
function newElementOpen (...args) {
  args[0] = decideIfConstructorOrNot(decideIfContentTagOrNot(args[0]));
  return elementOpen.apply(null, args);
}

// Patch elementOpenStart() for the same reason we patched elementOpen().
function newElementOpenStart (...args) {
  args[0] = decideIfConstructorOrNot(decideIfContentTagOrNot(args[0]));
  return elementOpenStart.apply(null, args);
}

// Patch elementVoid() for the same reason we patched elementOpen().
function newElementVoid (...args) {
  args[0] = decideIfConstructorOrNot(decideIfContentTagOrNot(args[0]));
  return elementVoid.apply(null, args);
}

// Convenience function for declaring an Incremental DOM element using
// hyperscript-style syntax.
export function element (tname, attrs, chren) {
  const atype = typeof attrs;

  if (atype === 'function' || atype === 'string') {
    chren = attrs;
  }
  
  if (atype !== 'object') {
    attrs = {};
  }

  // We open the element so we can set attrs after.
  newElementOpenStart(tname, attrs.key, attrs.statics);

  // Delete so special attrs don't actually get set.
  delete attrs.key;
  delete attrs.statics;

  // Set attributes.
  Object.keys(attrs).forEach(name => attr(name, attrs[name]));

  // Close before we render the descendant tree.
  elementOpenEnd();
  
  const ctype = typeof chren;
  if (ctype === 'function') {
    chren();
  } else if (ctype === 'string' || ctype === 'number') {
    text(chren);
  }

  return elementClose(tname);
}

// We don't have to do anything special for the text function; it's just a 
// straight export from Incremental DOM.
export {
  attr,
  elementClose,
  elementOpenEnd,
  newElementOpen as elementOpen,
  newElementOpenStart as elementOpenStart,
  newElementVoid as elementVoid, 
  text,
};

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
  // Boolean false values should not set attributes at all.
  if (value === false) {
    return;
  }

  // If the skip attribute was specified, skip
  if (name === 'skip' && value) {
    return skip();
  }

  // Custom element properties should be set as properties.
  const props = elem.constructor.props;
  if (props && name in props) {
    return applyProp(elem, name, value);
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
function resolveTagName (tname) {
  if (typeof tname === 'function') {
    return tname[skateSymbols.name] || tname;
  }
  if (tname === 'slot' && fallbackToV0) {
    return 'content';
  }
  return tname;
}

let buildQueueChren;
let buildQueueProps;

function buildQueueEmpty () {
  buildQueueChren = null;
  buildQueueProps = null;
}

function buildQueueInit () {
  buildQueueChren = [];
  buildQueueProps = {};
}

function buildQueueRender (chren) {
  chren.forEach(item => item[0].apply(null, item[1]));
}

// Wraps an Incremental DOM function with one wrapped with Skate's opinionated
// functionality.
function wrapIdomFunc (func) {
  return function (...args) {
    const tname = args[0] = resolveTagName(args[0]);
    if (typeof tname === 'function') {
      buildQueueInit();
    } else if (buildQueueChren) {
      buildQueueChren.push([func, args]);
    } else {
      return func.apply(null, args);
    }
  };
}

function newAttr (key, val) {
  if (buildQueueChren) {
    buildQueueProps[key] = val;
  } else {
    return attr(key, val);
  }
}

// Patch element factories.
const newElementOpen = wrapIdomFunc(elementOpen);
const newElementOpenEnd = wrapIdomFunc(elementOpenEnd);
const newElementOpenStart = wrapIdomFunc(elementOpenStart);
const newElementVoid = wrapIdomFunc(elementVoid);

// Patch elementClose() to only execute if a string is passed.
function newElementClose (...args) {
  const tname = args[0] = resolveTagName(args[0]);
  if (typeof tname === 'function') {
    // Reference queues so we can clear before executing tname()
    const chren = buildQueueChren;
    const props = buildQueueProps;

    // Clear the build queue so when we execute tname() the children get
    // executed rather than appended to the queue.
    buildQueueEmpty();

    // Execute after clearing passing in the references.
    tname(props, buildQueueRender(chren));
  } else if (buildQueueChren) {
    buildQueueChren.push([elementClose, args]);
  } else {
    return elementClose.apply(null, args);
  }
}

function newText (textContent) {
  if (buildQueueChren) {
    buildQueueChren.push([text, [textContent]]);
  } else {
    text(textContent);
  }
}

// Convenience function for declaring an Incremental DOM element using
// hyperscript-style syntax.
export function element (tname, attrs, chren) {
  const atype = typeof attrs;

  // If attributes are a function, then they should be treated as children.
  if (atype === 'function') {
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

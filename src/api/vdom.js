import * as IncrementalDOM from 'incremental-dom';
import * as skateSymbols from './symbols';
import { shadowDomV0, shadowDomV1 } from '../util/support';

// Could import these, but we have to import all of IncrementalDOM anyways so
// that we can export our configured IncrementalDOM.
const {
  applyProp,
  attr,
  attributes,
  elementClose,
  elementOpen,
  elementOpenEnd,
  elementOpenStart,
  skip,
  symbols,
  text
} = IncrementalDOM;

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

  // Custom element properties should be set as properties.
  const props = elem.constructor.props;
  if (props && name in props) {
    return applyProp(elem, name, value);
  }

  // Handle built-in and custom events.
  if (name.indexOf('on') === 0) {
    return name in elem ? applyProp(elem, name, value) : applyEvent(elem, name.substring(2), name, value);
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
    elem.addEventListener(ename, events[ename] = function (e) {
      if (this === e.target) {
        value.call(this, e);
      }
    });
  }
}

export function element (tname, attrs, chren) {
  // Allow a component constructor to be passed in.
  if (typeof tname === 'function') {
    tname = tname[skateSymbols.name];
  }

  const shouldBeContentTag = tname === 'slot' && !shadowDomV1 && shadowDomV0;

  // Abstract Shadow DOM V0 <content> behind Shadow DOM V1 <slot>.
  if (shouldBeContentTag) {
    tname = 'content';
  }

  if (attrs && typeof attrs === 'object') {
    // Abstract Shadow DOM V0 <content> behind Shadow DOM V1 <slot>.
    if (shouldBeContentTag && attrs.name) {
      attrs.select = `[slot="${attrs.name}"]`;
      delete attrs.slot;
    }

    elementOpenStart(tname, attrs.key, attrs.statics);
    for (let a in attrs) {
      attr(a, attrs[a]);
    }
    elementOpenEnd();
  } else {
    elementOpen(tname);
    chren = attrs;
    attrs = {};
  }

  if (attrs.skip) {
    skip();
  } else {
    const chrenType = typeof chren;
    if (chrenType === 'function') {
      chren();
    } else if (chrenType === 'string' || chrenType === 'number') {
      text(chren);
    }
  }

  return elementClose(tname);
}

// Export the Incremental DOM text() function directly as we don't need to do
// any special processing for it.
export { text };

// We export IncrementalDOM in its entirety because we want the user to be able
// to user our configured version while still being able to use various other
// templating languages and techniques that compile down to it.
export { IncrementalDOM };

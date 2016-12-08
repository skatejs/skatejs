import toNullOrString from './to-null-or-string';
import { isUndefined } from './is-type';

/**
 * @internal
 * Attributes Manager
 *
 * Postpones attributes updates until when connected.
 */
class AttributesManager {
  constructor (elem) {
    this.elem = elem;
    this.connected = false;
    this.pendingValues = {};
    this.lastSetValues = {};
  }

  /**
   * Called from disconnectedCallback
   */
  suspendAttributesUpdates () {
    this.connected = false;
  }

  /**
   * Called from connectedCallback
   */
  resumeAttributesUpdates () {
    this.connected = true;
    const names = Object.keys(this.pendingValues);
    names.forEach(name => {
      const value = this.pendingValues[name];
      // Skip if already cleared
      if (!isUndefined(value)) {
        delete this.pendingValues[name];
        this._syncAttrValue(name, value);
      }
    });
  }

  /**
   * Returns true if the value is different from the one set internally
   * using setAttrValue()
   */
  onAttributeChanged (name, value) {
    value = toNullOrString(value);

    // A new attribute value voids the pending one
    this._clearPendingValue(name);

    const changed = this.lastSetValues[name] !== value;
    this.lastSetValues[name] = value;
    return changed;
  }

  /**
   * Updates or removes the attribute if value === null.
   *
   * When the component is not connected the value is saved and
   * the attribute is only updated when the component is re-connected.
   */
  setAttrValue (name, value) {
    value = toNullOrString(value);

    this.lastSetValues[name] = value;

    if (this.connected) {
      this._clearPendingValue(name);
      this._syncAttrValue(name, value);
    } else {
      this.pendingValues[name] = value;
    }
  }

  _syncAttrValue (name, value) {
    const currAttrValue = toNullOrString(this.elem.getAttribute(name));
    if (value !== currAttrValue) {
      if (value === null) {
        this.elem.removeAttribute(name);
      } else {
        this.elem.setAttribute(name, value);
      }
    }
  }

  _clearPendingValue (name) {
    if (name in this.pendingValues) {
      delete this.pendingValues[name];
    }
  }
}

// Only used by getAttrMgr
const $attributesMgr = '____skate_attributesMgr';

/**
 * @internal
 * Returns attribute manager instance for the given Component
 */
export default function getAttrMgr (elem) {
  let mgr = elem[$attributesMgr];
  if (!mgr) {
    mgr = new AttributesManager(elem);
    elem[$attributesMgr] = mgr;
  }
  return mgr;
}

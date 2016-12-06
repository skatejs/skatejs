import empty from './empty';
import { isUndefined } from './isType';
import { rendering as $rendering } from './symbols';

const $attributesMgr = '____skate_attributesMgr';

// Attributes value can only be null or string;
const nullIfEmptyOrString = val => (empty(val) ? null : String(val));

/**
 * @internal
 * Attributes Manager
 *
 * Postpones attributes updates when connected.
 */
class AttributesManager {

  constructor (elem) {
    this.elem = elem;
    this.connected = false;
    this.pendingValues = {};
    this.lastSetValues = {};
  }

  // Returns true if value is different then previous set one.
  onAttributeChanged (name, value) {
    value = nullIfEmptyOrString(value);
    const changed = this.lastSetValues[name] !== value;
    this.lastSetValues[name] = value;
    return changed;
  }

  /**
   * Updates or removes the attribute if value === null.
   * When the component is not connected the value is saved and the attribute
   * is then only updated when the component is re-connected.
   * Returns true if value is different then previous set one.
   */
  setAttrValue (name, value) {
    value = nullIfEmptyOrString(value);

    const changed = this.lastSetValues[name] !== value;
    this.lastSetValues[name] = value;

    if (!this.connected || this.elem[$rendering]) {
      this.pendingValues[name] = value;
    } else {
      // Clear any pending value just in case
      // todo: is this even possible?
      if (name in this.pendingValues) {
        delete this.pendingValues[name];
      }
      this._syncAttrValue(name, value);
    }
    return changed;
  }

  _syncAttrValue (name, value) {
    if (value !== this._getCurrAttrValue(name)) {
      if (value === null) {
        this.elem.removeAttribute(name);
      } else {
        this.elem.setAttribute(name, value);
      }
    }
  }

  _getCurrAttrValue (name) {
    return nullIfEmptyOrString(this.elem.getAttribute(name));
  }

  /**
   * Called from connectedCallback and disconnectedCallback
   */
  syncAttributes (connected) {
    this.connected = connected;
    if (connected) {
      const names = Object.keys(this.pendingValues);
      names.forEach(name => {
        const value = this.pendingValues[name];
        if (!isUndefined(value)) {
          delete this.pendingValues[name];
          this._syncAttrValue(name, value);
        }
      });
    }
  }
}

/**
 * @internal
 * Memoizes the attribute manager for the given Component
 */
export default function getAttrMgr (elem) {
  let mgr = elem[$attributesMgr];
  if (!mgr) {
    mgr = new AttributesManager(elem);
    elem[$attributesMgr] = mgr;
  }
  return mgr;
}

/**
 * todo: We could expose this API?
 *
 * Updates or removes the attribute if value === null.
 * When the component is not connected or rendering the value is
 * saved and the attribute is then only updated when the component
 * is re-connected or completed rendering.
 * Returns true if value is different then previous set one.
 */
export function setAttributeWhenConnected (elem, name, value) {
  return getAttrMgr(elem).setAttrValue(name, value);
}

export default function patchAttributeMethods (elem, opts) {
  if (opts.isNative) {
    return;
  }

  let { removeAttribute, setAttribute } = elem;

  elem.removeAttribute = function (name) {
    let oldValue = this.getAttribute(name);
    removeAttribute.call(elem, name);
    elem.attributeChangedCallback(name, oldValue, null);
  };

  elem.setAttribute = function (name, newValue) {
    let oldValue = this.getAttribute(name);
    setAttribute.call(elem, name, newValue);
    elem.attributeChangedCallback(name, oldValue, String(newValue));
  };
}

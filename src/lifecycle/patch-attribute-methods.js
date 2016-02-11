export default function patchAttributeMethods (elem) {
  let { removeAttribute, setAttribute } = elem;

  elem.removeAttribute = function (name) {
    let oldValue = this.getAttribute(name);
    removeAttribute.call(elem, name);
    if (elem.attributeChangedCallback) {
      elem.attributeChangedCallback(name, oldValue, null);
    }
  };

  elem.setAttribute = function (name, newValue) {
    let oldValue = this.getAttribute(name);
    setAttribute.call(elem, name, newValue);
    if (elem.attributeChangedCallback) {
      elem.attributeChangedCallback(name, oldValue, String(newValue));
    }
  };
}

export default {
  create (opts) {
    var elem = document.createElement(opts.extends || opts.id);
    opts.extends && elem.setAttribute('is', opts.id);
    return elem;
  },
  filter (elem, defs) {
    var attrs = elem.attributes;
    var isAttr = attrs.is;
    var isAttrValue = isAttr && (isAttr.value || isAttr.nodeValue);
    var tagName = (elem.tagName || elem.localName).toLowerCase();
    var definition = defs[isAttrValue || tagName];

    if (!definition) {
      return;
    }

    var tagToExtend = definition.extends;
    if (isAttrValue) {
      if (tagName === tagToExtend) {
        return [definition];
      }
    } else if (!tagToExtend) {
      return [definition];
    }
  }
};

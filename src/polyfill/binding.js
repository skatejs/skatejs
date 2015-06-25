export default {
  /* jshint expr: true */
  create (opts) {
    var elem = document.createElement(opts.extends || opts.id);
    opts.extends && elem.setAttribute('is', opts.id);
    return elem;
  },
  find (elem, defs) {
    var attrs = elem.attributes;
    var definitions = [];
    var isAttr = attrs.is;
    var isAttrValue = isAttr && (isAttr.value || isAttr.nodeValue);
    var tag = elem.tagName.toLowerCase();
    var definition = defs[isAttrValue || tag];

    if (definition && definition.type === this) {
      let tagToExtend = definition.extends;

      if (isAttrValue) {
        if (tag === tagToExtend) {
          definitions.push(definition);
        }
      } else if (!tagToExtend) {
        definitions.push(definition);
      }
    }

    return definitions;
  }
};

function getClassList (element) {
  var classList = element.classList;

  if (classList) {
    return classList;
  }

  var attrs = element.attributes;

  return (attrs['class'] && attrs['class'].nodeValue.split(/\s+/)) || [];
}

export default {
  ATTRIBUTE: {
    create (opts) {
      var elem = document.createElement(opts.extends || 'div');
      elem.setAttribute(opts.id, '');
      return elem;
    },
    find (elem, defs) {
      var attrs = elem.attributes;
      var attrsLen = attrs.length;
      var definitions = [];
      var tag = elem.tagName.toLowerCase();

      for (let a = 0; a < attrsLen; a++) {
        let attr = attrs[a].nodeName;
        let definition = defs[attr];

        if (definition && definition.type === this) {
          let tagToExtend = definition.extends;
          if (!tagToExtend || tag === tagToExtend) {
            definitions.push(definition);
          }
        }
      }

      return definitions;
    }
  },
  CLASSNAME: {
    create (opts) {
      var elem = document.createElement(opts.extends || 'div');
      elem.className = opts.id;
      return elem;
    },
    find (elem, defs) {
      var classList = getClassList(elem);
      var classListLen = classList.length;
      var definitions = [];
      var tag = elem.tagName.toLowerCase();

      for (let a = 0; a < classListLen; a++) {
        let className = classList[a];
        let definition = defs[className];

        if (definition && definition.type === this) {
          let tagToExtend = definition.extends;
          if (!tagToExtend || tag === tagToExtend) {
            definitions.push(definition);
          }
        }
      }

      return definitions;
    }
  },
  ELEMENT: {
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
  }
};

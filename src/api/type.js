import binding from '../polyfill/binding';

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
    filterDefinitions (elem, defs) {
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
    },
    selector (opts) {
      return `${opts.extends}.${opts.id}`;
    }
  },
  CLASSNAME: {
    create (opts) {
      var elem = document.createElement(opts.extends || 'div');
      elem.className = opts.id;
      return elem;
    },
    filterDefinitions (elem, defs) {
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
    },
    selector (opts) {
      return `${opts.extends}[${opts.id}]`;
    }
  },
  ELEMENT: binding
};

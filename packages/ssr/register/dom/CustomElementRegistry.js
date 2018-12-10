// const outdent = require('outdent');
const { prop } = require('../util');

class CustomElementRegistry {
  constructor() {
    this.promises = {};
    this.registry = {};
  }
  define(name, func) {
    // We must invoke the getter for observedAttributes to mimic the spec'd
    // behaviour just in case consumer getters require side-effects happen
    // within it.
    func.observedAttributes;
    prop(func.prototype, 'nodeName', { value: name });
    this.registry[name] = func;
    if (this.promises[name]) {
      this.promises[name]();
      delete this.promises[name];
    }
  }
  get(name) {
    return this.registry[name];
  }
  whenDefined(name) {
    return new Promise(yay => {
      if (this.registry[name]) {
        yay();
      } else {
        this.promises[name] = yay;
      }
    });
  }
  __fixLostNodeNameForElement(elem) {
    for (let name in this.registry) {
      const test = this.registry[name];

      // `elem instanceof test` did NOT work. The constructor must be being
      // rewritten somehow.
      if (new test() instanceof elem.constructor) {
        const ucName = name.toUpperCase();
        prop(test.prototype, 'nodeName', { value: ucName });
        return ucName;
      }
    }

    // TODO further investigate and report to Webpack.
    // throw new Error(outdent`
    //   Could not fix lost nodeName for constructor: ${elem.constructor.name}.
    //
    //   It's likely you just haven't defined this element yet. Try running:
    //
    //   customElements.define('name-for-your-element', ${elem.constructor.name});
    //
    //   We define the nodeName on the prototype, but there's some weird instances
    //   where it gets removed after being defined. For example, when you use
    //   Webpack's dynamic imports (like the spec'd import() function), it returns
    //   the export as Export.default, instead of just Export. In this process,
    //   the nodeName property somehow gets removed.
    // `);
  }
}

module.exports = CustomElementRegistry;

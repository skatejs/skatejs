/* eslint-env jasmine, mocha */
/** @jsx boreH */

import * as IncrementalDOM from 'incremental-dom';
import { Component, define, h, prop, props, vdom } from '../../../src/index';
import afterMutations from '../../lib/after-mutations';
import fixture from '../../lib/fixture';
import { h as boreH, mount } from 'bore';

describe('vdom/properties', () => {
  it('class -> className', () => {
    const Elem = define(class extends Component {
      renderCallback () {
        vdom.element('div', { class: 'test' });
      }
    });
    return mount(<Elem />).wait()
      .then(w => expect(w.has('.test')).to.equal(true));
  });

  it('applies custom semantics to the className attribute when used in a stack context', () => {
    const helper = (_, children) => children();
    const Elem = define(class extends Component {
      renderCallback () {
        vdom.elementOpen(helper);
        vdom.elementOpen('div', null, null, 'className', 'inner');
        vdom.elementClose('div');
        vdom.elementClose(helper);
      }
    });
    return mount(<Elem />).wait()
      .then(w => expect(w.has('.inner')).to.equal(true));
  });

  it('false should remove the attribute', done => {
    const elem = new (define(class extends Component {
      static get props () {
        return {
          test: prop.boolean
        };
      }
      renderCallback () {
        vdom.element('div', { test: this.test });
      }
    }))();
    fixture(elem);
    let div;
    afterMutations(
      () => (div = elem.shadowRoot.firstChild),
      () => (elem.test = true),
      () => expect(div.hasAttribute('test')).to.equal(true),
      () => (elem.test = false),
      () => expect(div.hasAttribute('test')).to.equal(false),
      done
    );
  });

  it('should not set properties on SVG elements', done => {
    expect(() => {
      const Test = define(class extends Component {
        renderCallback () {
          vdom.element('svg', { width: 100 });
        }
      });
      fixture(new Test());
      afterMutations(done);
    }).to.not.throw(Error);
  });

  it('should set props as properties instead of attributes on ctor references', () => {
    let fixture = document.createElement('div');
    const Elem = define(class extends Component {
      static get props () {
        return {
          foo: {}
        };
      }
    });

    IncrementalDOM.patch(fixture, () => {
      vdom.element(Elem, { foo: 'bar', bar: 'baz' });
      const elem = fixture.firstChild;
      expect(elem.foo).to.equal('bar');
      expect(elem.bar).to.equal(undefined);
      expect(elem.getAttribute('foo')).to.be.null;
      expect(elem.getAttribute('bar')).to.equal('baz');
    });
  });

  describe('re-rendering', () => {
    let Elem1;
    let Elem2;

    beforeEach(() => {
      Elem1 = define(class extends Component {
        static get props () {
          return {
            open: prop.boolean
          };
        }
        renderCallback () {
          vdom.element(Elem2, { open: this.open });
        }
      });
      Elem2 = define(class extends Component {
        static get props () {
          return {
            open: prop.boolean
          };
        }
        renderCallback () {
          vdom.text(this.open ? 'open' : 'closed');
        }
      });
    });

    function text (elem) {
      return elem.shadowRoot.firstChild.shadowRoot.textContent;
    }

    it('boolean: false -> true -> false', done => {
      const elem = new Elem1();
      fixture(elem);
      afterMutations(
        () => expect(text(elem)).to.equal('closed', 'init'),
        () => props(elem, { open: true }),
        () => expect(text(elem)).to.equal('open', 'false -> true'),
        () => props(elem, { open: false }),
        () => expect(text(elem)).to.equal('closed', 'true -> false'),
        done
      );
    });
  });

  it('#876 - Apply properties and attributes in a polyfill environment', (done) => {
    const Elem1 = define(class extends Component {
      renderCallback () {
        return h(Elem2, { foo: true, bar: true, baz: true });
      }
    });
    const Elem2 = define(class extends Component {
      static get props () {
        return {
          foo: {}
        };
      }
      renderCallback () {
        expect(this.foo).to.be.equal(true);
        expect(this.bar).to.be.equal(undefined);
        expect(this.baz).to.equal(true);
        expect(this.hasAttribute('foo')).to.equal(false);
        expect(this.getAttribute('bar')).to.equal('true');
        expect(this.hasAttribute('baz')).to.equal(false);
        done();
      }
      get baz () {
        return this._baz;
      }
      set baz (val) {
        this._baz = val;
      }
    });
    const elem = new Elem1();
    fixture(elem);
  });
});

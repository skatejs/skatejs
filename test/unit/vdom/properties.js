/* eslint-env jasmine, mocha */

import afterMutations from '../../lib/after-mutations';
import fixture from '../../lib/fixture';
import { Component, define, h, prop, props, vdom } from '../../../src/index';

describe('vdom/properties', () => {
  it('class -> className', done => {
    const elem = new (define('x-test', {
      render () {
        vdom.element('div', { class: 'test' });
      }
    }))();
    fixture(elem);
    afterMutations(
      () => {}, // x-test.render()
      () => expect(elem.shadowRoot.firstChild.className).to.equal('test'),
      done
    );
  });

  it('applies custom semantics to the className attribute when used in a stack context', done => {
    const helper = (_, children) => children();

    const elem = new (define('x-test', {
      render () {
        vdom.elementOpen(helper);
        vdom.elementOpen('div', null, null, 'className', 'inner');
        vdom.elementClose('div');
        vdom.elementClose(helper);
      }
    }))();

    fixture(elem);

    afterMutations(
      () => {}, // x-test.render()
      () => expect(elem.shadowRoot.firstChild.getAttribute('class')).to.equal('inner'),
      done
    );
  });

  it('false should remove the attribute', done => {
    const elem = new (define('x-test', {
      props: {
        test: prop.boolean()
      },
      render (e) {
        vdom.element('div', { test: e.test });
      }
    }))();
    fixture(elem);
    let div;
    afterMutations(
      () => {}, // x-test.render()
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
      const Test = define('x-test', {
        render () {
          vdom.element('svg', { width: 100 });
        }
      });
      fixture(new Test());
      afterMutations(done);
    }).to.not.throw(Error);
  });

  describe('re-rendering', () => {
    let Elem1;
    let Elem2;

    beforeEach(() => {
      Elem1 = define('x-test', {
        props: {
          open: prop.boolean()
        },
        render (elem) {
          vdom.element(Elem2, { open: elem.open });
        }
      });
      Elem2 = define('x-test', {
        props: {
          open: prop.boolean()
        },
        render (elem) {
          vdom.text(elem.open ? 'open' : 'closed');
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
        () => {}, // Elem1.render()
        () => {}, // Elem2.render()
        () => {}, // ...
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
    const Elem1 = define('x-test', {
      render (elem) {
        return h(Elem2, { foo: true, bar: true, baz: true });
      }
    });
    const Elem2 = define('x-test', {
      props: {
        foo: {}
      },
      render(elem) {
        expect(elem.foo).to.be.equal(true);
        expect(elem.bar).to.be.equal(undefined);
        expect(elem.baz).to.equal(true);
        expect(elem.hasAttribute('foo')).to.equal(false);
        expect(elem.getAttribute('bar')).to.equal('true');
        expect(elem.hasAttribute('baz')).to.equal(false);
        done();
      },
      prototype: {
        get baz () {
          return this._baz;
        },
        set baz (val) {
          this._baz = val;
        }
      },
    });
    const elem = new Elem1();
    fixture(elem);
  });
});

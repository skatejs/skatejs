/* eslint-env jasmine, mocha */

import { define, h, vdom } from '../../../src';
import fixture from '../../lib/fixture';

const { customElements, HTMLElement } = window;

describe('builder()', () => {
  const { builder } = vdom;

  describe('no arguments', () => {
    it('should return a function', () => {
      expect(builder()).to.be.a('function');
    });
  });

  describe('more than one argument', () => {
    it('there should be one array item for each argument passed in', () => {
      expect(builder('a')).to.have.length(1);
      expect(builder('a', 'b')).to.have.length(2);
      expect(builder('a', 'b', 'c')).to.have.length(3);
    });

    it('should return an array of functions that create corresponding elements', (done) => {
      const [a, b, c] = builder('a', 'b', 'c');
      fixture(new (define('x-test', {
        render () {
          return [
            a(),
            b(),
            c(),
            a({ a: 'a' },
              b({ b: 'b' },
                c({ c: 'c' }),
                c({ d: 'd' })
              )
            )
          ];
        },
        rendered ({ shadowRoot }) {
          const [elA, elB, elC, elD] = [].slice.call(shadowRoot.children);
          expect(elA.tagName).to.equal('A');
          expect(elB.tagName).to.equal('B');
          expect(elC.tagName).to.equal('C');
          expect(elD.outerHTML).to.equal('<a a="a"><b b="b"><c c="c"></c><c d="d"></c></b></a>');
          done();
        }
      }))());
    });

    it('should work with stateless functions', (done) => {
      const [e1, e2] = builder(
        (props, chren) => vdom.element('a', props, chren),
        (props, chren) => builder('a')[0](props, chren)
      );
      fixture(new (define('x-test', {
        render () {
          return [
            e1({ a1: 'a1' }, 'a1'),
            e2({ a2: 'a2' }, 'a2')
          ];
        },
        rendered ({ shadowRoot }) {
          const [el1, el2] = [].slice.call(shadowRoot.children);
          expect(shadowRoot.children.length).to.equal(2);
          expect(el1.outerHTML).to.equal('<a a1="a1">a1</a>');
          expect(el2.outerHTML).to.equal('<a a2="a2">a2</a>');
          done();
        }
      }))());
    });

    it('should work with all web component constructors', (done) => {
      class RawWc extends HTMLElement {}
      customElements.define('x-test-raw-wc', RawWc);
      const [xTest] = builder(RawWc);
      fixture(new (define('x-test', {
        render () {
          return xTest();
        },
        rendered ({ shadowRoot }) {
          const [elXTest] = [].slice.call(shadowRoot.children);
          expect(elXTest.tagName).to.match(/^X-TEST/);
          done();
        }
      }))());
    });

    it('should allow arrays as children', (done) => {
      fixture(new (define('x-test', {
        render () {
          return (
            h('div',
              h('span', { id: 1 }),
              [h('span', { id: 2 }), h('span', { id: 3 })],
              [h('span', { id: 4 }), h('span', { id: 5 }), h('span', { id: 6 })]
            )
          );
        },
        rendered ({ shadowRoot }) {
          expect(shadowRoot.innerHTML).to.equal(
            '<div>' +
              '<span id="1"></span>' +
              '<span id="2"></span>' +
              '<span id="3"></span>' +
              '<span id="4"></span>' +
              '<span id="5"></span>' +
              '<span id="6"></span>' +
            '</div>'
          );
          done();
        }
      }))());
    });
  });
});

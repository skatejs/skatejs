import { define, vdom } from '../../../src';
import fixture from '../../lib/fixture';

describe('create()', () => {
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
        render() {
          return [
            a(),
            b(),
            c(),
            a({ a: 'a' },
              b({ b: 'b' },
                c({ c: 'c' }),
                c({ d: 'd' })
              )
            ),
          ];
        },
        rendered({ shadowRoot }) {
          const [elA, elB, elC, elD] = [].slice.call(shadowRoot.children);
          expect(elA.tagName).to.equal('A');
          expect(elB.tagName).to.equal('B');
          expect(elC.tagName).to.equal('C');
          expect(elD.outerHTML).to.equal('<a a="a"><b b="b"><c c="c"></c><c d="d"></c></b></a>');
          done();
        },
      }))());
    });

    it('should work with stateless functions', (done) => {
      const [e] = builder(() => vdom.element('a'));
      fixture(new (define('x-test', {
        render() {
          return e();
        },
        rendered({ shadowRoot }) {
          const [elE] = [].slice.call(shadowRoot.children);
          expect(elE.tagName).to.equal('A');
          done();
        },
      }))());
    });

    it('should work with web component constructors', (done) => {
      const [xTest] = builder(define('x-test', {}));
      fixture(new (define('x-test', {
        render() {
          return xTest();
        },
        rendered({ shadowRoot }) {
          const [elXTest] = [].slice.call(shadowRoot.children);
          expect(elXTest.tagName).to.match(/^X-TEST/);
          done();
        },
      }))());
    });
  });
});
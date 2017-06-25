/* eslint-env jest */

import { h as preactH } from 'preact';
import {
  define,
  h,
  prop,
  props,
  withProps,
  withUnique
} from '../../src';
import { sym } from '../../src/util';

import afterMutations from '../lib/after-mutations';
import fixture from '../lib/fixture';
import hasSymbol from '../lib/has-symbol';

function create (propLocal) {
  const el = new (define(class extends withUnique(withProps()) {
    static props = {
      test: { ...propLocal, ...{ attribute: true } }
    };
  }))();
  document.body.appendChild(el);
  return el;
}

function testTypeValues (type, values, done) {
  const elem = create(props[type]);
  afterMutations(() => {
    values.forEach((value) => {
      elem.test = value[0];
      expect(elem.test).toEqual(value[1], `prop ${value[0]}: ${elem.test} != ${value[1]}`);
      expect(elem.getAttribute('test')).toEqual(value[2], `attr ${value[0]}: ${elem.getAttribute('test')} != ${value[2]}`);
    });
    done();
  }, 1);
}

describe('withProps', () => {
  describe('array', () => {
    let elem;

    beforeEach((done) => {
      elem = create(props.array);
      afterMutations(done);
    });

    afterEach(() => document.body.removeChild(elem));

    it('default', () => {
      const elem2 = create(props.array);

      expect(typeof elem.test).toBe('object');
      expect(elem.test).toEqual(elem2.test, 'should be shared');
      expect(Object.isFrozen(elem.test)).toEqual(true, 'should be frozen');
      expect(elem.test.length).toEqual(0, 'should not contain any items');
      expect(elem.getAttribute('test')).toEqual(null, 'should not set the attribute');
    });

    describe('coerce', () => {
      it('set array', () => {
        const arr = ['something'];
        elem.test = arr;
        expect(elem.test).toEqual(arr);
      });

      it('set non-array', () => {
        elem.test = 'something';
        expect(typeof elem.test).toBe('object');
        expect(elem.test.length).toEqual(1);
        expect(elem.test[0]).toEqual('something');
      });
    });

    it('deserialize', (done) => {
      elem.setAttribute('test', '["val1","val2"]');
      afterMutations(
        () => expect(typeof elem.test).toBe('object'),
        () => expect(elem.test.length).toBe(2),
        () => expect(elem.test[0]).toEqual('val1'),
        () => expect(elem.test[1]).toEqual('val2'),
        done
      );
    });

    it('serialize', () => {
      elem.test = ['val1', 'val2'];
      expect(elem.getAttribute('test')).toEqual('["val1","val2"]');
    });
  });

  describe('boolean', () => {
    it('default', () => {
      const elem = create(props.boolean);
      expect(elem.test).toEqual(false);
      expect(elem.getAttribute('test')).toEqual(null);
    });

    [undefined, null, false, 0, '', 'something'].forEach((value) => {
      value = String(value);
      it(`setting attribute to ${JSON.stringify(value)}`, (done) => {
        const elem = create(props.boolean);
        afterMutations(() => {
          elem.setAttribute('test', value);
          afterMutations(() => {
            expect(elem.test).toEqual(true, 'property');
            expect(elem.getAttribute('test')).toEqual(value, 'attribute');
            done();
          }, 1);
        });
      });
      it(`setting property to ${JSON.stringify(value)}`, (done) => {
        const elem = create(props.boolean);
        afterMutations(() => {
          elem.test = value;
          expect(elem.test).toEqual(Boolean(value), 'property');
          expect(elem.getAttribute('test')).toEqual(elem.test ? '' : null, 'attribute');
          done();
        });
      });
    });

    it('removing attribute', (done) => {
      const elem = create(props.boolean);
      afterMutations(
        () => elem.setAttribute('test', ''),
        () => expect(elem.test).toEqual(true),
        () => expect(elem.getAttribute('test')).toEqual(''),
        () => elem.removeAttribute('test'),
        () => expect(elem.test).toEqual(false),
        () => expect(elem.getAttribute('test')).toEqual(null),
        done
      );
    });
  });

  describe('number', () => {
    let elem;

    beforeEach((done) => {
      elem = create(props.number);
      afterMutations(done);
    });

    it('default', () => {
      expect(typeof elem.test).toBe('number');
      expect(elem.test).toEqual(0);
      expect(elem.getAttribute('test')).toEqual(null);
    });

    it('values', (done) => {
      testTypeValues('number', [
        [false, 0, '0'],
        [true, 1, '1'],
        [null, 0, null],
        [undefined, 0, null],
        [0.1, 0.1, '0.1'],
        ['test', NaN, 'NaN'],
        ['', 0, '0']
      ], done);
    });

    it('removing attribute', (done) => {
      afterMutations(
        () => elem.setAttribute('test', ''),
        () => expect(elem.test).toEqual(0),
        () => expect(elem.getAttribute('test')).toEqual(''),
        () => elem.removeAttribute('test'),
        () => expect(elem.test).toEqual(0),
        () => expect(elem.getAttribute('test')).toEqual(null),
        done
      );
    });
  });

  describe('object', () => {
    let elem;

    beforeEach((done) => {
      elem = create(props.object);
      afterMutations(done);
    });

    it('default', () => {
      const elem2 = create(props.object);

      expect(typeof elem.test).toBe('object');
      expect(elem.test).toEqual(elem2.test, 'should be shared');
      expect(Object.isFrozen(elem.test)).toEqual(true, 'should be frozen');
      expect(elem.getAttribute('test')).toEqual(null, 'should not set the attribute');
    });

    it('deserialize', (done) => {
      elem.setAttribute('test', '{"one": 1, "two": 2}');
      afterMutations(
        () => expect(typeof elem.test).toBe('object'),
        () => expect(elem.test.one).toEqual(1),
        () => expect(elem.test.two).toEqual(2),
        done
      );
    });

    it('serialize', () => {
      elem.test = {one: 1, two: 2};
      expect(typeof elem.getAttribute('test')).toBe('string');
      expect(elem.getAttribute('test')).toEqual('{"one":1,"two":2}');
    });
  });

  describe('string', () => {
    it('values', (done) => {
      const elem = create(props.string);
      afterMutations(() => {
        expect(elem.test).toEqual('');
        expect(elem.getAttribute('test')).toEqual(null);
        testTypeValues('string', [
          [false, 'false', 'false'],
          [null, 'null', null],
          [undefined, 'undefined', null],
          [0, '0', '0'],
          ['', '', '']
        ], done);
      });
    });
  });

  describe('sanity', () => {
    const types = ['array', 'boolean', 'number', 'object', 'string'];

    describe('default one-way attribute -> prop reflection', () => {
      const attribute = { source: true };
      types.forEach(type => {
        it(type, () => {
          expect(props[type].attribute).toMatchObject(attribute);
        });
      });
    });
  });

  describe('*Props()', () => {
    if (!hasSymbol()) {
      return;
    }

    let elem;
    const secret1 = sym('secret1');
    const secret2 = sym('secret2');

    beforeEach(done => {
      elem = new (define(class extends withUnique(withProps()) {
        static props = {
          [secret1]: null,
          [secret2]: null,
          public1: null,
          public2: null
        };
        constructor () {
          super();
          this._rendered = 0;
          this[secret1] = 'secretKey1';
          this[secret2] = 'secretKey2';
          this.public1 = 'publicKey1';
          this.public2 = 'publicKey2';
          this.undeclaredProp = 'undeclaredKey1';
        }
        propsSetCallback () {
          this._rendered++;
        }
      }))();
      fixture(elem);
      afterMutations(done);
    });

    describe('static props', () => {
      it('should not merge super props', () => {
        const one = {};
        const two = {};
        class One extends withProps() {
          static props = { one }
        }
        class Two extends One {
          static props = { two }
        }
        expect(One.props).toMatchObject({ one });
        expect(Two.props).toMatchObject({ two });
      });
    });

    describe('props', () => {
      it('should return only properties defined as props', () => {
        const curr = elem.props;

        expect(secret1 in curr).toEqual(true);
        expect(secret2 in curr).toEqual(true);
        expect('public1' in curr).toEqual(true);
        expect('public2' in curr).toEqual(true);

        expect(curr[secret1]).toEqual('secretKey1');
        expect(curr[secret2]).toEqual('secretKey2');
        expect(curr.public1).toEqual('publicKey1');
        expect(curr.public2).toEqual('publicKey2');

        expect(curr.undeclaredProp).toEqual(undefined);
      });

      describe('setter', () => {
        it('should set props', () => {
          elem.props = { public1: 'updated' };
          expect(elem.public1).toBe('updated');
        });

        it('should set symbols', () => {
          elem.props = { [secret1]: 'updated' };
          expect(elem[secret1]).toBe('updated');
        });

        it('should not affect unpassed props', () => {
          elem.props = { public1: 'updated' };
          expect(elem.public2).toBe('publicKey2');
        });

        it('should not affect undeclared props', () => {
          elem.props = { undeclared: 'yay' };
          expect(elem.undeclared).toBe(undefined);
        });
      });
    });
  });

  it('should directly export h from preact', () => {
    expect(h).toEqual(preactH);
  });

  describe('{ prop }', function () {
    it('should define a property on an element', () => {
      const elem = new (class extends withProps() {})();

      prop({ ...props.string, ...{ attribute: true } })(elem, 'test');

      expect(elem.test).toBe('');
      expect(elem.hasAttribute('test')).toEqual(false);

      elem.test = true;

      expect(elem.test).toBe('true');
      expect(elem.hasAttribute('test')).toEqual(true);
    });
  });
});

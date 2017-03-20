/* eslint-env mocha */

import expect from 'expect';

import {
  define,
  h,
  props,
  withProps
} from 'src';
import { h as preactH } from 'preact';
import { sym } from 'src/util';

import afterMutations from '../lib/after-mutations';
import fixture from '../lib/fixture';
import hasSymbol from '../lib/has-symbol';

function create (propLocal) {
  const el = new (define(class extends withProps() {
    static get props () {
      return {
        test: { ...propLocal, ...{ attribute: true } }
      };
    }
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

      expect(elem.test).toBeAn('array');
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
        expect(elem.test).toBeAn('array');
        expect(elem.test.length).toEqual(1);
        expect(elem.test[0]).toEqual('something');
      });
    });

    it('deserialize', (done) => {
      elem.setAttribute('test', '["val1","val2"]');
      afterMutations(
        () => expect(elem.test).toBeAn('array'),
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
      expect(elem.test).toBeA('number');
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

      expect(elem.test).toBeAn('object');
      expect(elem.test).toEqual(elem2.test, 'should be shared');
      expect(Object.isFrozen(elem.test)).toEqual(true, 'should be frozen');
      expect(elem.getAttribute('test')).toEqual(null, 'should not set the attribute');
    });

    it('deserialize', (done) => {
      elem.setAttribute('test', '{"one": 1, "two": 2}');
      afterMutations(
        () => expect(elem.test).toBeAn('object'),
        () => expect(elem.test.one).toEqual(1),
        () => expect(elem.test.two).toEqual(2),
        done
      );
    });

    it('serialize', () => {
      elem.test = {one: 1, two: 2};
      expect(elem.getAttribute('test')).toBeA('string');
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
          expect(prop[type].attribute).toContain(attribute);
        });
      });
    });
  });

  describe('*Props()', () => {
    if (!hasSymbol()) {
      return;
    }

    let elem;
    const secret1 = sym();
    const secret2 = sym();

    beforeEach(done => {
      elem = new (define(class extends withProps() {
        static get props () {
          return {
            [secret1]: null,
            [secret2]: null,
            public1: null,
            public2: null
          };
        }
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

    describe('elem.props', () => {
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
    });

    describe('elem.props = {}', () => {
      it('should set all properties', () => {
        elem.props = {
          [secret1]: 'newSecretKey1',
          public1: 'newPublicKey1',
          undeclaredProp: 'newUndeclaredKey1'
        };
        expect(elem[secret1]).toEqual('newSecretKey1');
        expect(elem[secret2]).toEqual('secretKey2');
        expect(elem.public1).toEqual('newPublicKey1');
        expect(elem.public2).toEqual('publicKey2');
        expect(elem.undeclaredProp).toEqual('newUndeclaredKey1');
      });

      it('should asynchronously render if declared properties are set', done => {
        expect(elem._rendered).toEqual(1);
        elem.props = { [secret1]: 'updated1' };
        afterMutations(
          () => expect(elem._rendered).toEqual(2),
          done
        );
      });

      it('should not render if undeclared properties are set', done => {
        expect(elem._rendered).toEqual(1);
        elem.props = { undeclaredProp: 'updated3' };
        afterMutations(
          () => expect(elem._rendered).toEqual(1),
          done
        );
      });

      it('should allow you to pass a function so you can get the previous state', done => {
        elem.props = prev => {
          expect(prev).toBeAn('object');
          expect(prev).toContain({
            [secret1]: 'secretKey1',
            [secret2]: 'secretKey2',
            public1: 'publicKey1',
            public2: 'publicKey2'
          });
          expect(prev.undeclaredProp).toBe(undefined);
          return {
            [secret1]: prev[secret1] + '!',
            public1: prev.public1 + '!',
            undeclaredProp: prev.undeclaredProp + '!'
          };
        };
        afterMutations(
          () => {
            expect(elem.props).toContain({
              [secret1]: 'secretKey1!',
              [secret2]: 'secretKey2',
              public1: 'publicKey1!',
              public2: 'publicKey2'
            });
            expect(elem.undeclaredProp).toBe('undefined!');
          },
          done
        );
      });
    });
  });

  it('should directly export h from preact', () => {
    expect(h).toEqual(preactH);
  });
});

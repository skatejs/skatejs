/* eslint-env mocha */

import { define, Mixins, prop } from 'src';
import afterMutations from '../lib/after-mutations';
import expect from 'expect';

function create (propLocal) {
  const el = new (define(class extends Mixins.Props() {
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
  const elem = create(prop[type]);
  afterMutations(() => {
    values.forEach((value) => {
      elem.test = value[0];
      // for number comparison use Object.is where NaN is equal NaN
      if (type !== 'number' || !Object.is(elem.test, value[1])) {
        expect(elem.test).toEqual(value[1], 'prop value after prop set');
      }
      expect(elem.getAttribute('test')).toEqual(value[2], 'attr value after prop set');
    });
    done();
  }, 1);
}

describe('api/prop', () => {
  describe('array', () => {
    let elem;

    beforeEach((done) => {
      elem = create(prop.array);
      afterMutations(done);
    });

    afterEach(() => document.body.removeChild(elem));

    it('default', () => {
      const elem2 = create(prop.array);

      expect(elem.test).toBeAn('array');
      expect(elem.test).toEqual(elem2.test, 'should be shared');
      expect(Object.isFrozen(elem.test)).toEqual(true, 'should be frozen');
      expect(elem.test.length).toEqual(0, 'should not contain any items');
      expect(elem.getAttribute('test')).toEqual('[]', 'should set the attribute');
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
      expect(elem.getAttribute('test')).toBeA('string');
      expect(elem.getAttribute('test')).toEqual('["val1","val2"]');
    });
  });

  describe('boolean', () => {
    it('initial value', () => {
      const elem = create(prop.boolean);
      expect(elem.test).toEqual(false);
      expect(elem.getAttribute('test')).toEqual(null);
    });

    [undefined, null, false, 0, '', 'something'].forEach((value) => {
      value = String(value);
      it(`setting attribute to ${JSON.stringify(value)}`, (done) => {
        const elem = create(prop.boolean);
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
        const elem = create(prop.boolean);
        afterMutations(() => {
          elem.test = value;
          expect(elem.test).toEqual(!!value, 'property');
          expect(elem.getAttribute('test')).toEqual(value ? '' : null, 'attribute');
          done();
        });
      });
    });

    it('removing attribute', (done) => {
      const elem = create(prop.boolean);
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
      elem = create(prop.number);
      afterMutations(done);
    });

    it('default', () => {
      expect(elem.test).toBeA('number');
      expect(elem.test).toEqual(0);
      expect(elem.getAttribute('test')).toEqual('0');
    });

    it('values', (done) => {
      expect(elem.test).toEqual(0);
      expect(elem.getAttribute('test')).toEqual('0');
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

  describe('string', () => {
    it('values', (done) => {
      const elem = create(prop.string);
      afterMutations(() => {
        expect(elem.test).toEqual('');
        expect(elem.getAttribute('test')).toEqual('');
        testTypeValues('string', [
          [false, 'false', 'false'],
          [null, '', null],
          [undefined, '', null],
          [0, '0', '0'],
          ['', '', '']
        ], done);
      });
    });
  });

  describe('object', () => {
    let elem;

    beforeEach((done) => {
      elem = create(prop.object);
      afterMutations(done);
    });

    it('default', () => {
      const elem2 = create(prop.object);

      expect(elem.test).toBeAn('object');
      expect(elem.test).toEqual(elem2.test, 'should be shared');
      expect(Object.isFrozen(elem.test)).toEqual(true, 'should be frozen');
      expect(elem.getAttribute('test')).toEqual('{}', 'should set the attribute');
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
});

/* eslint-env jasmine, mocha */

import { Component, define, prop } from '../../../src/index';
import afterMutations from '../../lib/after-mutations';

function create (propLocal) {
  const el = new (define(class extends Component {
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
        expect(elem.test).to.equal(value[1], 'prop value after prop set');
      }
      expect(elem.getAttribute('test')).to.equal(value[2], 'attr value after prop set');
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
      expect(elem.test).to.be.an('array');
      expect(elem.test.length).to.equal(0);
      expect(elem.getAttribute('test')).to.equal('[]');
    });

    describe('coerce', () => {
      it('set array', () => {
        const arr = ['something'];
        elem.test = arr;
        expect(elem.test).to.equal(arr);
      });

      it('set non-array', () => {
        elem.test = 'something';
        expect(elem.test).to.be.an('array');
        expect(elem.test.length).to.equal(1);
        expect(elem.test[0]).to.equal('something');
      });
    });

    it('deserialize', (done) => {
      elem.setAttribute('test', '["val1","val2"]');
      afterMutations(
        () => expect(elem.test).to.be.an('array'),
        () => expect(elem.test).to.be.length(2),
        () => expect(elem.test[0]).to.equal('val1'),
        () => expect(elem.test[1]).to.equal('val2'),
        done
      );
    });

    it('serialize', () => {
      elem.test = ['val1', 'val2'];
      expect(elem.getAttribute('test')).to.be.a('string');
      expect(elem.getAttribute('test')).to.equal('["val1","val2"]');
    });
  });

  describe('boolean', () => {
    it('initial value', () => {
      const elem = create(prop.boolean);
      expect(elem.test).to.equal(false);
      expect(elem.getAttribute('test')).to.equal(null);
    });

    [undefined, null, false, 0, '', 'something'].forEach((value) => {
      value = String(value);
      it(`setting attribute to ${JSON.stringify(value)}`, (done) => {
        const elem = create(prop.boolean);
        afterMutations(() => {
          elem.setAttribute('test', value);
          afterMutations(() => {
            expect(elem.test).to.equal(true, 'property');
            expect(elem.getAttribute('test')).to.equal(value, 'attribute');
            done();
          }, 1);
        });
      });
      it(`setting property to ${JSON.stringify(value)}`, (done) => {
        const elem = create(prop.boolean);
        afterMutations(() => {
          elem.test = value;
          expect(elem.test).to.equal(!!value, 'property');
          expect(elem.getAttribute('test')).to.equal(value ? '' : null, 'attribute');
          done();
        });
      });
    });

    it('removing attribute', (done) => {
      const elem = create(prop.boolean);
      afterMutations(
        () => elem.setAttribute('test', ''),
        () => expect(elem.test).to.equal(true),
        () => expect(elem.getAttribute('test')).to.equal(''),
        () => elem.removeAttribute('test'),
        () => expect(elem.test).to.equal(false),
        () => expect(elem.getAttribute('test')).to.equal(null),
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
      expect(elem.test).to.be.a('number');
      expect(elem.test).to.equal(0);
      expect(elem.getAttribute('test')).to.equal('0');
    });

    it('values', (done) => {
      expect(elem.test).to.equal(0);
      expect(elem.getAttribute('test')).to.equal('0');
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
        () => expect(elem.test).to.equal(0),
        () => expect(elem.getAttribute('test')).to.equal(''),
        () => elem.removeAttribute('test'),
        () => expect(elem.test).to.equal(0),
        () => expect(elem.getAttribute('test')).to.equal(null),
        done
      );
    });
  });

  describe('string', () => {
    it('values', (done) => {
      const elem = create(prop.string);
      afterMutations(() => {
        expect(elem.test).to.equal('');
        expect(elem.getAttribute('test')).to.equal('');
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

      expect(elem.test).to.be.an('object');
      expect(elem.test).not.to.equal(elem2.test);
      expect(elem.getAttribute('test')).to.equal('{}');
    });

    it('deserialize', (done) => {
      elem.setAttribute('test', '{"one": 1, "two": 2}');
      afterMutations(
        () => expect(elem.test).to.be.an('object'),
        () => expect(elem.test.one).to.equal(1),
        () => expect(elem.test.two).to.equal(2),
        done
      );
    });

    it('serialize', () => {
      elem.test = {one: 1, two: 2};
      expect(elem.getAttribute('test')).to.be.a('string');
      expect(elem.getAttribute('test')).to.equal('{"one":1,"two":2}');
    });
  });

  describe('sanity', () => {
    const types = ['array', 'boolean', 'number', 'object', 'string'];

    describe('default one-way attribute -> prop reflection', () => {
      const attribute = { source: true };
      types.forEach(type => {
        it(type, () => {
          expect(prop[type].attribute).to.deep.equal(attribute);
        });
      });
    });
  });
});

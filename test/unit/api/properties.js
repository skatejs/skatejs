import { define, prop } from '../../../src/index';
import afterMutations from '../../lib/after-mutations';
import assign from '../../../src/util/assign';

function create(propLocal) {
  const el = new (define('x-test', {
    props: {
      test: assign({ attribute: true }, propLocal),
    },
  }))();
  document.body.appendChild(el);
  return el;
}

function testTypeValues(type, values, done) {
  const elem = create(prop[type]());
  afterMutations(() => {
    values.forEach((value) => {
      elem.test = value[0];
      expect(elem.test).to.equal(value[1], 'prop value after prop set');
      expect(elem.getAttribute('test')).to.equal(value[2], 'attr value after prop set');
    });
    done();
  }, 1);
}

describe('api/prop', () => {
  describe('array', () => {
    let elem;

    beforeEach((done) => {
      elem = create(prop.array());
      afterMutations(done, 1);
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
      const elem = create(prop.boolean());
      expect(elem.test).to.equal(false);
      expect(elem.getAttribute('test')).to.equal(null);
    });

    [undefined, null, false, 0, '', 'something'].forEach((value) => {
      value = String(value);
      it(`setting attribute to ${JSON.stringify(value)}`, (done) => {
        const elem = create(prop.boolean());
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
        const elem = create(prop.boolean());
        afterMutations(() => {
          elem.test = value;
          expect(elem.test).to.equal(!!value, 'property');
          expect(elem.getAttribute('test')).to.equal(value ? '' : null, 'attribute');
          done();
        });
      });
    });

    it('removing attribute', (done) => {
      const elem = create(prop.boolean());
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
      elem = create(prop.number());
      afterMutations(done, 1);
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
        ['test', undefined, null],
        ['', 0, '0'],
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
      const elem = create(prop.string());
      afterMutations(() => {
        expect(elem.test).to.equal('');
        expect(elem.getAttribute('test')).to.equal('');
        testTypeValues('string', [
          [false, 'false', 'false'],
          [null, '', null],
          [undefined, '', null],
          [0, '0', '0'],
          ['', '', ''],
        ], done);
      });
    });
  });

  describe('overriding', () => {
    it('boolean', () => {
      expect(prop.boolean({ default: true }).default).to.equal(true);
    });

    it('number', () => {
      expect(prop.number({ default: 1 }).default).to.equal(1);
    });

    it('string', () => {
      expect(prop.string({ default: 'test' }).default).to.equal('test');
    });
  });
});

import assign from 'object-assign';
import element from '../../lib/element';
import properties from '../../../src/api/properties';

function create (prop) {
  return element().skate({
    properties: {
      test: assign({ attribute: true }, prop)
    }
  })();
}

function testTypeValues (type, values) {
  const elem = create(properties[type]());
  values.forEach(function (value) {
    elem.test = value[0];
    expect(elem.test).to.equal(value[1], 'property');
    expect(elem.getAttribute('test')).to.equal(value[2], 'attribute');
  });
}

describe('api/properties', function () {
  describe('array', function () {
    let elem;

    beforeEach(function () {
      elem = create(properties.array());
    });

    it('default', function () {
      expect(elem.test).to.be.an('array');
      expect(elem.test.length).to.equal(0);
      expect(elem.getAttribute('test')).to.be.a('string');
      expect(elem.getAttribute('test')).to.equal('');
    });

    describe('coerce', function () {
      it('set array', function () {
        const arr = ['something'];
        elem.test = arr;
        expect(elem.test).to.equal(arr);
      });

      it('set non-array', function () {
        elem.test = 'something';
        expect(elem.test).to.be.an('array');
        expect(elem.test.length).to.equal(1);
        expect(elem.test[0]).to.equal('something');
      });
    });

    it('deserialize', function () {
      elem.setAttribute('test', 'val1,val2');
      expect(elem.test).to.be.an('array');
      expect(elem.test).to.be.length(2);
      expect(elem.test[0]).to.equal('val1');
      expect(elem.test[1]).to.equal('val2');
    });

    it('serialize', function () {
      elem.test = ['val1', 'val2'];
      expect(elem.getAttribute('test')).to.be.a('string');
      expect(elem.getAttribute('test')).to.equal('val1,val2');
    });
  });

  describe('boolean', function () {
    it('initial value', function () {
      let elem = create(properties.boolean());
      expect(elem.test).to.equal(false);
      expect(elem.getAttribute('test')).to.equal(null);
    });

    [undefined, null, false, 0, '', 'something'].forEach(function (value) {
      value = JSON.stringify(value);
      it('setting attribute to ' + value, function () {
        let elem = create(properties.boolean());
        elem.setAttribute('test', value);
        expect(elem.test).to.equal(true, 'property');
        expect(elem.getAttribute('test')).to.equal(String(value), 'attribute');
      });
      it('setting property to ' + value, function () {
        let elem = create(properties.boolean());
        elem.test = value;
        expect(elem.test).to.equal(!!value, 'property');
        expect(elem.getAttribute('test')).to.equal(value ? '' : null, 'attribute');
      });
    });

    it('removing attribute', function () {
      let elem = create(properties.boolean());

      elem.setAttribute('test', '');
      expect(elem.test).to.equal(true);
      expect(elem.getAttribute('test')).to.equal('');

      elem.removeAttribute('test');
      expect(elem.test).to.equal(false);
      expect(elem.getAttribute('test')).to.equal(null);
    });
  });

  describe('number', function () {
    it('values', function () {
      let elem = create(properties.number());
      expect(elem.test).to.equal(undefined);
      expect(elem.getAttribute('test')).to.equal(null);
      testTypeValues('number', [
        [false, 0, '0'],
        [null, undefined, null],
        [undefined, undefined, null],
        [0.1, 0.1, '0.1'],
        ['', 0, '0']
      ]);
    });
  });

  describe('string', function () {
    it('values', function () {
      let elem = create(properties.string());
      expect(elem.test).to.equal(undefined);
      expect(elem.getAttribute('test')).to.equal(null);
      testTypeValues('string', [
        [false, 'false', 'false'],
        [null, undefined, null],
        [undefined, undefined, null],
        [0, '0', '0'],
        ['', '', '']
      ]);
    });
  });

  describe('overriding', function () {
    it('boolean', function () {
      expect(properties.boolean({ default: true }).default).to.equal(true);
    });

    it('number', function () {
      expect(properties.number({ default: 1 }).default).to.equal(1);
    });

    it('string', function () {
      expect(properties.string({ default: 'test' }).default).to.equal('test');
    });
  });
});

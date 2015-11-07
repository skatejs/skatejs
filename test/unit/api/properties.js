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
      elem.removeAttribute('test');
      expect(elem.test).to.equal(false);
    });
  });

  describe('number', function () {
    it('default', function () {
      let elem = create(properties.number());
      expect(elem.test).to.equal(undefined);
      expect(elem.getAttribute('test')).to.equal(null);
      testTypeValues('number', [
        [false, 0, '0'],
        [null, 0, '0'],
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
        [null, 'null', 'null'],
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

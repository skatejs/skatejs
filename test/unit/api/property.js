import property from '../../../src/api/property';
import propertiesCreated from '../../../src/lifecycle/properties-created';
import propertiesReady from '../../../src/lifecycle/properties-ready';

function create (definition) {
  let elem = document.createElement('div');
  let prop = { test: definition('test') };
  propertiesCreated(elem, prop);
  propertiesReady(elem, prop);
  return elem;
}

describe('api/property', function () {
  describe('boolean', function () {
    it('serialize and deserialize', function () {
      let elem = create(property.boolean());

      // Initial values.
      expect(elem.test).to.equal(false);
      expect(elem.getAttribute('test')).to.equal(null);

      // Setting from property.
      elem.test = true;
      expect(elem.test).to.equal(true);
      expect(elem.getAttribute('test')).to.equal('');

      elem.test = false;
      expect(elem.test).to.equal(false);
      expect(elem.getAttribute('test')).to.equal(null);

      // Setting to undefined.
      elem.setAttribute('test', undefined);
      expect(elem.test).to.equal(true);

      // Setting to null.
      elem.setAttribute('test', null);
      expect(elem.test).to.equal(true);

      // Setting to false.
      elem.setAttribute('test', false);
      expect(elem.test).to.equal(true);

      // Setting to 0.
      elem.setAttribute('test', 0);
      expect(elem.test).to.equal(true);

      // Setting to an empty string.
      elem.setAttribute('test', '');
      expect(elem.test).to.equal(true);

      // Setting to a non-empty string.
      elem.setAttribute('test', 'something');
      expect(elem.test).to.equal(true);

      // Removing the attribute.
      elem.removeAttribute('test');
      expect(elem.test).to.equal(false);
    });
  });

  describe('float', function () {
    it('default', function () {
      let elem = create(property.float());
      expect(elem.test).to.equal(0);
      expect(elem.getAttribute('test')).to.equal('0');
    });
  });

  describe('number', function () {
    it('default', function () {
      let elem = create(property.number());
      expect(elem.test).to.equal(0);
      expect(elem.getAttribute('test')).to.equal('0');
    });
  });

  describe('string', function () {
    it('default', function () {
      let elem = create(property.string());
      expect(elem.test).to.equal('');
      expect(elem.getAttribute('test')).to.equal('');
    });
  });
});

import props from '../../../src/api/props';
import propsCreated from '../../../src/lifecycle/props-created';
import propsReady from '../../../src/lifecycle/props-ready';
import skate from '../../../src/index';

function create (definition) {
  let elem = document.createElement('div');
  let prop = { test: definition('test') };
  propsCreated(elem, prop);
  propsReady(elem, prop);
  return elem;
}

describe('api/property', function () {
  it('skate.props', function () {
    expect(skate.props).to.be.an('object');
    expect(skate.props.boolean).to.be.a('function');
    expect(skate.props.float).to.be.a('function');
    expect(skate.props.number).to.be.a('function');
    expect(skate.props.string).to.be.a('function');
  });

  describe('boolean', function () {
    it('initial value', function () {
      let elem = create(props.boolean());
      expect(elem.test).to.equal(false);
      expect(elem.getAttribute('test')).to.equal(null);
    });

    [undefined, null, false, 0, '', 'something'].forEach(function (value) {
      value = JSON.stringify(value);
      it('setting attribute to ' + value, function () {
        let elem = create(props.boolean());
        elem.setAttribute('test', value);
        expect(elem.test).to.equal(true, 'property');
        expect(elem.getAttribute('test')).to.equal(String(value), 'attribute');
      });
      it('setting property to ' + value, function () {
        let elem = create(props.boolean());
        elem.test = value;
        expect(elem.test).to.equal(!!value, 'property');
        expect(elem.getAttribute('test')).to.equal(value ? '' : null, 'attribute');
      });
    });

    it('removing attribute', function () {
      let elem = create(props.boolean());
      elem.setAttribute('test', '');
      expect(elem.test).to.equal(true);
      elem.removeAttribute('test');
      expect(elem.test).to.equal(false);
    });
  });

  describe('float', function () {
    it('default', function () {
      let elem = create(props.float());
      expect(elem.test).to.equal(0);
      expect(elem.getAttribute('test')).to.equal('0');
    });
  });

  describe('number', function () {
    it('default', function () {
      let elem = create(props.number());
      expect(elem.test).to.equal(0);
      expect(elem.getAttribute('test')).to.equal('0');
    });
  });

  describe('string', function () {
    it('default', function () {
      let elem = create(props.string());
      expect(elem.test).to.equal('');
      expect(elem.getAttribute('test')).to.equal('');
    });
  });
});

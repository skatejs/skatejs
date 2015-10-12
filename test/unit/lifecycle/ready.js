import helperElement from '../../lib/element';
import skate from '../../../src/index';

describe('lifecycle/ready', function () {
  var tag;

  beforeEach(function () {
    tag = helperElement();
    skate(tag.safe, {
      ready: function (elem) {
        elem.innerHTML = 'templated';
      }
    });
  });

  it('should be called', function () {
    var el = tag.create();
    expect(el.textContent).to.equal('templated');
  });

  it('should be called after created is called', function () {
    var { safe: tagName } = helperElement('my-el');
    var MyEl = skate(tagName, {
      created: function (elem) {
        elem.textContent = 'test';
      },
      ready: function (elem) {
        expect(elem.textContent).to.equal('test');
      }
    });

    new MyEl();
  });

  it('should have access to the extended prototype', function () {
    var { safe: tagName } = helperElement('my-el');
    var MyEl = skate(tagName, {
      prototype: {
        myfunc: function () {}
      },
      ready: function (elem) {
        expect(elem.myfunc).to.be.a('function');
      }
    });

    new MyEl();
  });
});

import helperElement from '../../lib/element';
import skate from '../../../src/index';

describe('lifecycle/ready', function () {
  let tag;

  beforeEach(function () {
    tag = helperElement();
    skate(tag.safe, {
      ready: function (elem) {
        elem.innerHTML = 'templated';
      }
    });
  });

  it('should be called', function () {
    const el = tag.create();
    expect(el.textContent).to.equal('templated');
  });

  it('should be called after created is called', function () {
    const { safe: tagName } = helperElement('my-el');
    const MyEl = skate(tagName, {
      created (elem) {
        elem.created = true;
      },
      ready (elem) {
        expect(elem.created).to.equal(true);
      }
    });

    new MyEl();
  });

  it('should have access to the extended prototype', function () {
    const { safe: tagName } = helperElement('my-el');
    const MyEl = skate(tagName, {
      prototype: {
        myfunc () {}
      },
      ready (elem) {
        expect(elem.myfunc).to.be.a('function');
      }
    });

    new MyEl();
  });
});

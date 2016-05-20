import helperElement from '../../lib/element';
import helperFixture from '../../lib/fixture';
import skate, { create, init, symbols } from '../../../src/index';
import vdom from '../../../src/api/vdom';

describe('api/init', function () {
  let tagName;

  beforeEach(function () {
    tagName = helperElement('my-el');
    skate(tagName.safe, {
      created: function (elem) {
        elem.textContent = 'test';
      }
    });
    helperFixture(`<${tagName.safe}></${tagName.safe}>`);
  });

  it('should accept a node', function () {
    const elem = helperFixture().querySelector(tagName.safe);
    init(elem);
    expect(elem.textContent).to.equal('test');
  });

  describe('sync', function () {
    it('should take an element', function () {
      var initialised = false;
      var { safe: tagName } = helperElement('div');

      skate(tagName, {
        attached: function () {
          initialised = true;
        }
      });

      init(helperFixture(`<${tagName}></${tagName}>`).querySelector(tagName));
      expect(initialised).to.equal(true);
    });
  });

  describe('duplication', function () {
    it('should not initialise a single component more than once on a single element', function () {
      var calls = 0;
      var {safe: tagName} = helperElement('my-element');

      skate(tagName, {
        created: function () {
          ++calls;
        }
      });

      var el = create(tagName);
      expect(calls).to.equal(1);
      init(el);
      expect(calls).to.equal(1);
    });
  });

  describe('forms', function () {
    it('#110 - should initialise forms properly', function () {
      skate('x-form', {
        properties: {
          initialised: {
            get (elem) {
              return elem[symbols.shadowRoot].querySelector('form').initialised;
            }
          }
        },
        render () {
          vdom('form');
        },
        ready (elem) {
          elem[symbols.shadowRoot].querySelector('form').initialised = true;
        }
      });

      const form = document.createElement('x-form');
      init(form);
      expect(form.initialised).to.equal(true);
    });
  });
});

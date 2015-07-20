import helperElement from '../../lib/element';
import helperFixture from '../../lib/fixture';
import skate from '../../../src/index';
import typeAttribute from 'skatejs-type-attribute';
import typeClass from 'skatejs-type-class';
import typeElement from '../../../src/type/element';

describe('api/init', function () {
  var MyEl;
  var tagName;

  beforeEach(function () {
    tagName = helperElement('my-el');
    MyEl = skate(tagName.safe, {
      created: function () {
        this.textContent = 'test';
      }
    });

    helperFixture(`<${tagName.safe}></${tagName.safe}>`);
  });

  it('should accept a node', function () {
    expect(skate.init(helperFixture().querySelector(tagName.safe)).textContent).to.equal('test');
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

      skate.init(helperFixture(`<${tagName}></${tagName}>`).querySelector(tagName));
      expect(initialised).to.equal(true);
    });
  });

  describe('duplication', function () {
    function assertType (type, expected, tagToExtend) {
      it(type + (tagToExtend ? `:${tagToExtend}` : ''), function () {
        var { safe: tagName } = helperElement();
        var calls = 0;

        skate(tagName, {
          type: type,
          extends: tagToExtend,
          created () { ++calls; }
        });

        calls = 0;
        var el1 = document.createElement(tagName);
        skate.init(el1);
        expect(calls).to.equal(expected[0], tagName);

        calls = 0;
        var el2 = document.createElement('div');
        el2.setAttribute('is', tagName);
        skate.init(el2);
        expect(calls).to.equal(expected[1], `div[is="${tagName}"]`);

        calls = 0;
        var el3 = document.createElement('div');
        el3.setAttribute(tagName, '');
        skate.init(el3);
        expect(calls).to.equal(expected[2], `div[${tagName}]`);

        calls = 0;
        var el4 = document.createElement('div');
        el4.className = tagName;
        skate.init(el4);
        expect(calls).to.equal(expected[3], `div.${tagName}`);
      });
    }

    describe(':', function () {
      assertType(typeElement,   [1, 0, 0, 0]);
      assertType(typeAttribute, [0, 0, 1, 0]);
      assertType(typeClass,     [0, 0, 0, 1]);
      assertType(typeElement,   [0, 1, 0, 0], 'div');
      assertType(typeAttribute, [0, 0, 1, 0], 'div');
      assertType(typeClass,     [0, 0, 0, 1], 'div');
      assertType(typeElement,   [0, 0, 0, 0], 'span');
      assertType(typeAttribute, [0, 0, 0, 0], 'span');
      assertType(typeClass,     [0, 0, 0, 0], 'span');

      it('should not initialise a single component more than once on a single element', function () {
        var calls = 0;
        var {safe: tagName} = helperElement('my-element');

        skate(tagName, {
          created: function () {
            ++calls;
          }
        });

        var el = skate.create(tagName);
        el.setAttribute(tagName, '');
        el.className = tagName;
        expect(calls).to.equal(1);
      });
    });
  });

  describe('forms', function () {
    it('#110 - should initialise forms properly', function () {
      var form = document.createElement('form');
      skate('form', {
        created: function () {
          this.initialised = true;
        }
      });

      skate.init(form);
      expect(form.initialised).to.equal(true);
    });
  });
});

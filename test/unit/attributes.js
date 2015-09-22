import helperElement from '../lib/element';
import skate from '../../src/index';

describe('lifecycle/attribute', function () {
  describe('Callback', function () {
    it('should call the callback just like attributeChangedCallback', function () {
      var data;
      let elem = helperElement().skate({
        attribute (elem, change) {
          data = change;
        }
      })();

      elem.setAttribute('name', 'created');
      expect(data.name).to.equal('name');
      expect(data.newValue).to.equal('created');
      expect(data.oldValue).to.equal(undefined);

      elem.setAttribute('name', 'updated');
      expect(data.name).to.equal('name');
      expect(data.newValue).to.equal('updated');
      expect(data.oldValue).to.equal('created');

      elem.removeAttribute('name');
      expect(data.name).to.equal('name');
      expect(data.newValue).to.equal(undefined);
      expect(data.oldValue).to.equal('updated');
    });
  });

  describe('Attributes added via HTML', function () {
    it('should ensure the callback is called for attributes already on the element when it is initialised', function () {
      var called = false;
      var tag = helperElement();

      skate(tag.safe, {
        attribute: () => called = true
      });

      tag.create();
      expect(called).to.equal(true);
    });
  });
});

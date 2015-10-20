import helperElement from '../lib/element';
import helperReady from '../lib/ready';
import skate from '../../src/index';

describe('lifecycle/attribute', function () {
  describe('Callback', function () {
    let myToggle;
    let spy;
    beforeEach(() => {
      let tag = helperElement('test-toggle');
      spy = sinon.spy();
      let MyToggle = skate(tag.safe, {
        attribute: spy
      });
      myToggle = new MyToggle();
    });

    it('should properly call the attribute callback for resolved', function(done) {
      let resolvedSpy = spy.withArgs(myToggle, sinon.match({name: 'resolved', newValue: ''}));

      helperReady(function() {
        expect(resolvedSpy.calledOnce).to.be.true;
        done();
      });
    });

    it('should call the callback just like attributeChangedCallback', function(done) {
      let newValueSpy = spy.withArgs(myToggle, sinon.match({name: 'name', newValue: 'created', oldValue: undefined}));
      let updatedValueSpy = spy.withArgs(myToggle, sinon.match({name: 'name', newValue: 'updated', oldValue: 'created'}));
      let removeValueSpy = spy.withArgs(myToggle, sinon.match({name: 'name', newValue: undefined, oldValue: 'updated'}));

      myToggle.setAttribute('name', 'created');
      myToggle.setAttribute('name', 'updated');
      myToggle.removeAttribute('name');

      helperReady(() => {
        expect(newValueSpy.calledOnce).to.be.true;
        expect(updatedValueSpy.calledOnce).to.be.true;
        expect(removeValueSpy.calledOnce).to.be.true;
        sinon.assert.callOrder(newValueSpy, updatedValueSpy, removeValueSpy);
        done();
      });
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

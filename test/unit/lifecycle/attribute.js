import element from '../../lib/element';
import fixture from '../../lib/fixture';
import ready from '../../src/api/ready';
import skate from '../../src/index';

describe('lifecycle/attribute', function () {
  it('should be invoked for attributes that exist on the element when it is created', function (done) {
    const tag = element();
    const elem = document.createElement(tag.safe);
    fixture(elem);
    elem.setAttribute('test', 'testing');
    expect(elem.hasAttribute('defined')).to.equal(false);
    tag.skate({
      attribute (elem, data) {
        if (data.name === 'defined') {
          return;
        }
        expect(data.name).to.equal('test');
        expect(data.oldValue).to.equal(undefined);
        expect(data.newValue).to.equal('testing');
        done();
      }
    });
  });

  describe('observed attributes', function () {
    it('should allow an array as attributes', function (done) {
      const calls = [];
      const elem = element().skate({
        attributes: ['test-attr'],
        attribute (elem, data) {
          calls.push(data.name);
        }
      })();

      fixture(elem);

      ready(elem, function () {
        elem.setAttribute('test-attr', '');
        elem.setAttribute('test-prop', '');
        expect(calls.length).to.equal(1);
        expect(calls[0]).to.equal('test-attr');
        done();
      });
    });

    it('should automatically observe linked attributes', function (done) {
      const calls = [];
      const elem = element().skate({
        properties: {
          testProp: { attribute: true }
        },
        attribute (elem, data) {
          calls.push(data.name);
        }
      })();

      fixture(elem);

      ready(elem, function () {
        elem.setAttribute('test-attr', '');
        elem.setAttribute('test-prop', '');
        expect(calls.length).to.equal(1);
        expect(calls[0]).to.equal('test-prop');
        done();
      });
    });

    it('should fire for both attributes added to the array and linked attributes', function (done) {
      const calls = [];
      const elem = element().skate({
        attributes: ['test-attr'],
        properties: {
          testProp: { attribute: true }
        },
        attribute (elem, data) {
          calls.push(data.name);
        }
      })();

      fixture(elem);

      ready(elem, function () {
        elem.setAttribute('test-attr', '');
        elem.setAttribute('test-prop', '');
        expect(calls.length).to.equal(2);
        expect(calls[0]).to.equal('test-attr');
        expect(calls[0]).to.equal('test-prop');
        done();
      });
    });

    it('should fire for both attributes and properties even if the property is the same as an attribute added manually', function (done) {
      const calls = [];
      const elem = element().skate({
        attributes: ['test-attr'],
        properties: {
          testAttr: { attribute: true }
        },
        attribute (elem, data) {
          calls.push(data.name);
        }
      })();

      fixture(elem);

      ready(elem, function () {
        elem.setAttribute('test-attr', '');
        elem.setAttribute('test-prop', '');
        expect(calls.length).to.equal(1);
        expect(calls[0]).to.equal('test-attr');
        done();
      });
    });
  });

  describe('Callback', function () {
    let myToggle;
    let spy;

    beforeEach(function () {
      spy = sinon.spy();
      let MyToggle = element().skate({
        attribute: spy
      });
      myToggle = new MyToggle();
    });

    it('should properly call the attribute callback for defined', function(done) {
      let resolvedSpy = spy.withArgs(myToggle, sinon.match({name: 'defined', newValue: '' }));

      ready(myToggle, function() {
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

      ready(myToggle, () => {
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
      var tag = element();

      skate(tag.safe, {
        attribute: () => called = true
      });

      tag.create();
      expect(called).to.equal(true);
    });
  });
});

import helpers from '../lib/helpers';
import skate from '../../src/skate';

describe('Attribute listeners', function () {
  it('should listen to changes in specified attributes', function (done) {
    var inserted = false;
    var updated = false;

    skate('div', {
      attributes: {
        open: {
          insert: function (element, data) {
            inserted = true;
            data.newValue.should.equal('insert');
            element.setAttribute('open', 'update');
          },
          update: function (element, data) {
            updated = true;
            data.oldValue.should.equal('insert');
            data.newValue.should.equal('update');
            element.removeAttribute('open');
          },
          remove: function (element, data) {
            inserted.should.equal(true);
            updated.should.equal(true);
            data.oldValue.should.equal('update');
            done();
          }
        }
      }
    });

    helpers.fixture('<div open="insert"></div>');
  });

  it('should accept a function insead of an object for a particular attribute definition.', function (done) {
    skate('div', {
      attributes: {
        open: function (element, data) {
          if (data.type === 'insert') {
            element.setAttribute('open', 'update');
          } else if (data.type === 'update') {
            element.removeAttribute('open');
          } else if (data.type === 'remove') {
            assert(true);
            done();
          }
        }
      }
    });

    helpers.fixture('<div id="attrtest" open="insert"></div>');
  });

  it('should accept a function insead of an object for the entire attribute definition.', function (done) {
    skate('div', {
      attributes: function (element, data) {
        if (data.type === 'insert') {
          setTimeout(function () {
            element.setAttribute('open', 'update');
          });
        } else if (data.type === 'update') {
          setTimeout(function () {
            element.removeAttribute('open');
          });
        } else if (data.type === 'remove') {
          assert(true);
          done();
        }
      }
    });

    helpers.fixture('<div id="attrtest" open="insert"></div>');
  });

  it('should ensure an attribute exists before trying to action it just in case another attribute handler removes it', function () {
    skate('div', {
      attributes: function (element, data) {
        if (data.name === 'first') {
          element.removeAttribute('second');
        }
      }
    });

    document.body.innerHTML = '<div first="first" second="second"></div>';
    var div = skate.init(document.body.querySelector('div'));
    div.hasAttribute('first').should.equal(true);
    div.hasAttribute('second').should.equal(false);
  });

  it('should ensure attributes are initialised', function () {
    var called = false;
    skate('my-el', {
      attributes: function (element, data) {
        called = true;
      }
    });

    skate.init(helpers.fixture('<my-el some-attr></my-el>'));
    expect(called).to.equal(true);
  });
});

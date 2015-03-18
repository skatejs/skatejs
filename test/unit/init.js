'use strict';

import helpers from '../lib/helpers';
import skate from '../../src/skate';

describe('skate.init', function () {
  var Div;

  beforeEach(function () {
    Div = skate('div', {
      created: function (element) {
        element.textContent = 'test';
      }
    });

    helpers.fixture('<div></div>');
  });

  it('should accept a selector', function () {
    expect(skate.init('#' + helpers.fixture().id + ' div').item(0).textContent).to.equal('test');
  });

  it('should accept a node', function () {
    expect(skate.init(helpers.fixture().querySelector('div')).textContent).to.equal('test');
  });

  it('should accept a node list', function () {
    expect(skate.init(helpers.fixture().querySelectorAll('div')).item(0).textContent).to.equal('test');
  });
});

describe('Synchronous initialisation', function () {
  it('should take an element', function () {
    var initialised = false;
    var { safe: tagName } = helpers.safeTagName('div');

    skate(tagName, {
      attached: function () {
        initialised = true;
      }
    });

    skate.init(helpers.fixture(`<${tagName}></${tagName}>`).querySelector(tagName));
    expect(initialised).to.equal(true);
  });
});

describe('Instantiation', function () {
  it('should return a constructor', function () {
    expect(skate('div', {})).to.be.a('function');
  });

  it('should return a new element when constructed.', function () {
    var Div = skate('div', {});
    var div = new Div();
    expect(div.nodeName).to.equal('DIV');
  });

  it('should synchronously initialise the new element.', function () {
    var called = false;
    var Div = skate('div', {
      prototype: {
        someMethod: function () {
          called = true;
        }
      }
    });

    new Div().someMethod();
    expect(called).to.equal(true);
  });

  it('should call lifecycle callbacks at appropriate times.', function (done) {
    var created = false;
    var attached = false;
    var detached = false;
    var Div = skate('div', {
      created: function () {
        created = true;
      },
      attached: function () {
        attached = true;
      },
      detached: function () {
        detached = true;
      }
    });

    var div = new Div();
    expect(created).to.equal(true, 'Should call created');
    expect(attached).to.equal(false, 'Should not call attached');
    expect(detached).to.equal(false, 'Should not call detached');

    document.body.appendChild(div);
    skate.init(div);
    expect(attached).to.equal(true, 'Should call attached');
    expect(detached).to.equal(false, 'Should not call remove');

    div.parentNode.removeChild(div);

    // Mutation Observers are async.
    setTimeout(function () {
      expect(detached).to.equal(true, 'Should call detached');
      done();
    }, 1);
  });

  it('should initialise multiple instances of the same type of element (possible bug).', function (done) {
    var numCreated = 0;
    var numAttached = 0;
    var numDetached = 0;
    var Div = skate('div', {
      created: function () {
        ++numCreated;
      },
      attached: function () {
        ++numAttached;
      },
      detached: function () {
        ++numDetached;
      }
    });

    var div1 = new Div();
    var div2 = new Div();

    document.body.appendChild(div1);
    document.body.appendChild(div2);

    skate.init(div1);
    skate.init(div2);

    expect(numCreated).to.equal(2, 'created');
    expect(numAttached).to.equal(2, 'attached');

    div1.parentNode.removeChild(div1);
    div2.parentNode.removeChild(div2);

    // Mutation Observers are async.
    helpers.afterMutations(function () {
      expect(numDetached).to.equal(2, 'detached');
      done();
    });
  });

  it('should not throw an error if using an id with the same name as a method / property on the Object prototype', function () {
    var idsToSkate = ['hasOwnProperty', 'watch'];
    var idsToCheck = [];

    var div = document.createElement('div');
    div.className = idsToSkate.join(' ');

    idsToSkate.forEach(function (id) {
      skate(id, {
        type: skate.type.CLASSNAME,
        created: function () {
          idsToCheck.push(id);
        }
      });
    });

    skate.init(div);
  });

  it('should use a tag name equal to the provided one', function () {
    var {safe: tagName} = helpers.safeTagName('my-element');
    var MyElement = skate(tagName, {
      type: skate.type.ELEMENT,
      prototype: {
        returnSelf: function () {
          return this;
        }
      }
    });

    var el = new MyElement();
    expect(el.tagName).to.equal(tagName.toUpperCase());
  });
});

describe('Forms', function () {
  it('#110 - should initialise forms properly', function () {
    var form = document.createElement('form');
    skate('form', {
      created: function (el) {
        el.initialised = true;
      }
    });

    skate.init(form);
    expect(form.initialised).to.equal(true);
  });
});

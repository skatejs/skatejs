import property from '../../../src/lifecycle/property';
import propertiesCreated from '../../../src/lifecycle/properties-created';
import propertiesReady from '../../../src/lifecycle/properties-ready';

describe('lifecycle/property', function () {
  it('should accept zero arguments', function () {
    property();
  });

  it('should return an function', function () {
    expect(property()).to.be.a('function');
  });

  describe('property definition', function () {
    function create () {
      return property()();
    }

    describe('native', function () {
      it('should define a getter', function () {
        expect(create().get).to.be.a('function');
      });

      it('should define a setter', function () {
        expect(create().set).to.be.a('function');
      });

      it('should be enumerable', function () {
        expect(create().enumerable).to.equal(true);
      });

      it('should be configurable', function () {
        expect(create().configurable).to.equal(true);
      });

      it('should not contain a value', function () {
        expect(create().value).to.equal(undefined);
      });
    });

    describe('custom', function () {
      it('should define a created() callback', function () {
        expect(create().created).to.be.a('function');
      });
    });
  });

  describe('api', function () {
    function initProperty (elem, definition, name = 'test') {
      let prop = { [name]: property(definition)(name) };
      propertiesCreated(elem, prop);
      propertiesReady(elem, prop);
      return elem;
    }

    function create (definition, name) {
      return initProperty(document.createElement('div'), definition, name);
    }

    function createFromHtml (html, definition, name) {
      let elem = document.createElement('div');
      elem.innerHTML = html;
      elem = elem.childNodes[0];
      return initProperty(elem, definition, name);
    }

    describe('attribute', function () {
      it('when true, links an attribute of the name (dash-cased)', function () {
        let elem = createFromHtml('<span test-name="something"></span>', { attribute: true }, 'testName');

        expect(elem.testName).to.equal('something');
        expect(elem.getAttribute('test-name')).to.equal('something');

        elem.testName = 'something else';
        expect(elem.testName).to.equal('something else');
        expect(elem.getAttribute('test-name')).to.equal('something else');
      });

      it('when a string, the value is used as the attribute name', function () {
        let elem = create({ attribute: 'test-name' });
        elem.test = 'something';
        expect(elem.getAttribute('test-name')).to.equal('something');
      });

      describe('deserialize()', function () {
        it('only works with attribute present', function () {
          let called = false;
          let elem = create({ deserialize: () => called = true });
          elem.test = true;
          expect(called).to.equal(false);
        });

        it('coerces the value from the attribute to the property', function () {
          let elem = create({
            attribute: true,
            deserialize: value => value.split(':').map(Number)
          });
          elem.setAttribute('test', '1:2:3');
          expect(elem.test).to.be.an('array');
          expect(elem.test).to.have.length(3);
          expect(elem.test[0]).to.equal(1);
          expect(elem.test[1]).to.equal(2);
          expect(elem.test[2]).to.equal(3);
        });

        // This test is a
        it('coerces the initial value if serialized from an attribute', function () {
          let elem = createFromHtml('<span test=""></span>', {
            attribute: true,
            deserialize: value => value.split(':').map(Number)
          });
          elem.setAttribute('test', '1:2:3');
          expect(elem.test).to.be.an('array');
          expect(elem.test).to.have.length(3);
          expect(elem.test[0]).to.equal(1);
          expect(elem.test[1]).to.equal(2);
          expect(elem.test[2]).to.equal(3);
        });
      });

      describe('serialize()', function () {
        it('only works with attribute present', function () {
          let called = false;
          let elem = create({ serialize: () => called = true });
          elem.test = true;
          expect(called).to.equal(false);
        });

        it('coerces the value from the property to the attribute', function () {
          let elem = create({
            attribute: true,
            default: () => [],
            serialize: value => value.join(':')
          });
          elem.test = [1, 2, 3];
          expect(elem.getAttribute('test')).to.equal('1:2:3');
        });

        it('removes the attribute if undefined is returned', function () {
          let elem = create({
            attribute: true,
            serialize: value => value ? '' : undefined
          });
          elem.test = true;
          expect(elem.getAttribute('test')).to.equal('');
          elem.test = false;
          expect(elem.getAttribute('test')).to.equal(null);
        });
      });
    });

    describe('default', function () {
      describe('when a function', function () {
        it('returns the default value that the property should be initialised with', function () {
          let elem = create({ default: () => 'something' });
          expect(elem.test).to.equal('something');
        });

        it('is returned by get() when the property is not defined', function () {
          let elem = create({ default: () => 'something' });
          elem.test = 'something else';
          expect(elem.test).to.equal('something else');
          elem.test = undefined;
          expect(elem.test).to.equal('something');
        });
      });

      describe('when not a function', function () {
        it('it is the default value that the property should be initialised with', function () {
          let elem = create({ default: 'something' });
          expect(elem.test).to.equal('something');
        });

        it('is returned by get() when the property is not defined', function () {
          let elem = create({ default: 'something' });
          elem.test = 'something else';
          expect(elem.test).to.equal('something else');
          elem.test = undefined;
          expect(elem.test).to.equal('something');
        });
      });

      it('context and arguments', function (done) {
        let opts = {
          default () {
            expect(this).to.equal(opts);
            expect(arguments.length).to.equal(0);
            done();
          }
        };
        create(opts);
      });
    });

    describe('emit', function () {
      it('when true, emits a skate.property event', function (done) {
        let elem = create({ emit: true });
        elem.addEventListener('skate.property', () => done());
        elem.test = true;
      });

      it('when a string, the value is used as the attribute name', function (done) {
        let elem = create({ emit: 'some.prop.event' });
        elem.addEventListener('some.prop.event', () => done());
        elem.test = true;
      });

      it('when an array, the values are the events that are emitted', function (done) {
        let elem = create({ emit: ['some.prop.event'] });
        elem.addEventListener('some.prop.event', () => done());
        elem.test = true;
      });
    });

    describe('get()', function () {
      it('returns the value of the property', function () {
        let elem = create({ get: () => 'something' });
        expect(elem.test).to.equal('something');
      });

      it('context and arguments', function () {
        let opts = {
          get () {
            expect(this).to.equal(opts);
            expect(arguments.length).to.equal(1);
          }
        };
        create(opts);
      });
    });

    describe('set()', function () {
      it('is called once if the value does not exist on the element when it is initialised', function () {
        let calls = 0;
        create({
          set (elem, data) {
            expect(data.newValue).to.equal(undefined);
            ++calls;
          }
        });
        expect(calls).to.equal(1);
      });

      it('is called once if the value exists on the element when it is initialised', function () {
        let calls = 0;
        createFromHtml('<span test="something"></span>', {
          attribute: true,
          set (elem, data) {
            expect(data.newValue).to.equal('something');
            ++calls;
          }
        });
        expect(calls).to.equal(1);
      });

      it('is called when the property is updated', function () {
        let calls = 0;
        let elem = create({ set: () => ++calls });
        elem.test = true;
        expect(calls).to.equal(2);
      });

      it('is called even if the property is set to the same value that it already is', function () {
        let calls = 0;
        let elem = create({ set: () => ++calls });
        elem.test = true;
        elem.test = true;
        expect(calls).to.equal(3);
      });

      it('context and arguments', function (done) {
        let opts = {
          set (elem, data) {
            expect(this).to.equal(opts);
            expect(arguments.length).to.equal(2);
            expect(elem.tagName).to.equal('DIV');
            expect(data).to.contain({
              name: 'test',
              newValue: undefined,
              oldValue: undefined
            });
            done();
          }
        };
        create(opts);
      });
    });

    describe('type', function () {
      it('is an arbitrary function that has no return value (the user can do whatever type checking they want here)', function () {
        let called = false;
        let elem = create({
          type: () => called = true
        });
        elem.test = 'something';
        expect(called).to.equal(true);
      });

      it('is called before set()', function () {
        let order = [];
        let elem = create({
          set: () => order.push('set'),
          type: () => order.push('type')
        });
        elem.test = 'something';
        expect(order[0]).to.equal('type');
        expect(order[1]).to.equal('set');
      });

      it('context and arguments', function (done) {
        let opts = {
          default: 'something',
          type (value) {
            expect(this).to.equal(opts);
            expect(arguments.length).to.equal(1);
            expect(value).to.equal('something');
            done();
          }
        };
        create(opts);
      });
    });
  });
});

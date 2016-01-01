import element from '../../lib/element';
import propertiesInit from '../../../src/lifecycle/properties-init';
import propertiesCreated from '../../../src/lifecycle/properties-created';
import propertiesReady from '../../../src/lifecycle/properties-ready';

describe('lifecycle/properties', function () {
  function initProperty (elem, definition, name = 'test') {
    const prop = { [name]: propertiesInit(definition)(name) };
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

  it('should accept zero arguments', function () {
    propertiesInit();
  });

  it('should return an function', function () {
    expect(propertiesInit()).to.be.a('function');
  });

  it('should not leak options to other definitions', function () {
    const elem = element().skate({
      properties: {
        test1: {
          attribute: true,
          default: 'test1',
          deserialize: () => 'test1',
          serialize: () => 'test1'
        },
        test2: {
          attribute: true,
          default: 'test2',
          deserialize: () => 'test2',
          serialize: () => 'test2'
        }
      }
    })();

    expect(elem.test1).to.equal('test1');
    expect(elem.test2).to.equal('test2');

    elem.test1 = undefined;
    elem.test2 = undefined;
    expect(elem.test1).to.equal('test1');
    expect(elem.test2).to.equal('test2');
    expect(elem.getAttribute('test1')).to.equal('test1');
    expect(elem.getAttribute('test2')).to.equal('test2');

    elem.removeAttribute('test1');
    elem.removeAttribute('test2');
    expect(elem.test1).to.equal('test1');
    expect(elem.test2).to.equal('test2');
    expect(elem.getAttribute('test1')).to.equal('test1');
    expect(elem.getAttribute('test2')).to.equal('test2');
  });

  it('should not set a linked attribute to "undefined" if the prop is set to undefined', function () {
    const elem = create({ attribute: true });

    expect(elem.test).to.equal(undefined);
    expect(elem.getAttribute('test')).to.equal(null);

    elem.test = undefined;
    expect(elem.test).to.equal(undefined);
    expect(elem.getAttribute('test')).to.equal(null);
  });

  it('should not set a linked attribute to "undefined" if the attribute is removed', function () {
    const elem = create({ attribute: true });

    expect(elem.test).to.equal(undefined);
    expect(elem.getAttribute('test')).to.equal(null);

    elem.removeAttribute('test');
    expect(elem.test).to.equal(undefined);
    expect(elem.getAttribute('test')).to.equal(null);
  });

  describe('property definition', function () {
    function create () {
      return propertiesInit()();
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
    describe('attribute', function () {
      it('when true, links an attribute of the name (lower-cased)', function () {
        let elem = createFromHtml('<span testname="something"></span>', { attribute: true }, 'testName');

        expect(elem.testName).to.equal('something');
        expect(elem.getAttribute('testname')).to.equal('something');

        elem.testName = 'something else';
        expect(elem.testName).to.equal('something else');
        expect(elem.getAttribute('testname')).to.equal('something else');
      });

      describe('undefined and null', function () {
        it('when a string, the value is used as the attribute name', function () {
          let elem = create({ attribute: 'test-name' });
          elem.test = 'something';
          expect(elem.getAttribute('test-name')).to.equal('something');
        });

        it('when a property is set to undefined, the attribute should not be set', function () {
          let elem = create({ attribute: true });
          elem.test = undefined;
          expect(elem.hasAttribute('test')).to.equal(false);
        });

        it('when a property is set to null, the attribute should not be set', function () {
          let elem = create({ attribute: true });
          elem.test = null;
          expect(elem.hasAttribute('test')).to.equal(false);
        });

        it('when an attribute is set to a string, the property should be set to an empty string', function () {
          let elem = create({ attribute: true });
          elem.setAttribute('test', '');
          expect(elem.test).to.equal('');
        });

        it('when an attribute is removed, the property should be set to undefined', function () {
          let elem = create({ attribute: true });
          elem.setAttribute('test', 'test');
          expect(elem.test).to.equal('test');
          elem.removeAttribute('test');
          expect(elem.test).to.equal(undefined);
        });
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

        it('is returned by get() when the property is undefined', function () {
          let elem = create({ default: () => 'something' });
          elem.test = 'something else';
          expect(elem.test).to.equal('something else');
          elem.test = undefined;
          expect(elem.test).to.equal('something');
        });

        it('is returned by get() when the property is null', function () {
          let elem = create({ default: () => 'something' });
          elem.test = 'something else';
          expect(elem.test).to.equal('something else');
          elem.test = null;
          expect(elem.test).to.equal('something');
        });

        it('is normalized to undefined if null is passed', function () {
          let elem = create({ default: null });
          expect(elem.test).to.equal(undefined);
        });

        it('should return the default value if a linked attribute is removed', function () {
          const elem = create({ attribute: true, default: 'something' });

          // Ensure defaults are there.
          expect(elem.test).to.equal('something');
          expect(elem.getAttribute('test')).to.equal('something');

          // Remove.
          elem.removeAttribute('test');

          // Should be in the same state because the default is "something".
          expect(elem.test).to.equal('something');
          expect(elem.getAttribute('test')).to.equal('something');
        });

        it('context and arguments', function (done) {
          let opts = {
            default (elem) {
              expect(this.default).to.equal(opts.default);
              expect(arguments.length).to.equal(1);
              expect(elem.tagName).to.equal('DIV');
              done();
            }
          };
          create(opts);
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
    });

    describe('get()', function () {
      it('returns the value of the property', function () {
        const elem = create({ get: () => 'something' });
        expect(elem.test).to.equal('something');
      });

      it('context and arguments', function (done) {
        const opts = {
          attribute: true,
          get (elem, data) {
            expect(this.get).to.equal(opts.get);
            expect(arguments.length).to.equal(2);
            expect(elem.tagName).to.equal('DIV');
            expect(data).to.contain({
              name: 'test',
              internalValue: 'initial'
            });
            done();
          }
        };

        // We create from HTML so that we can set the initial value and see if
        // that gets passed as the internal value.
        const elem = createFromHtml('<div test="initial"></div>', opts);

        // Trigger the getter.
        elem.test;
      });
    });

    describe('set()', function () {
      it('is called once if the value does not exist on the element when it is initialised', function () {
        let calls = 0;
        create({
          set (elem, data) {
            expect(data.newValue).to.equal(undefined);
            expect(data.oldValue).to.equal(undefined);
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
            expect(data.oldValue).to.equal(undefined);
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
            expect(this.set).to.equal(opts.set);
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

    describe('coerce', function () {
      it('is an arbitrary function that has no return value (the user can do whatever type checking they want here)', function () {
        let called = false;
        let elem = create({
          coerce: () => called = true
        });
        elem.test = 'something';
        expect(called).to.equal(true);
      });

      it('is called before set()', function () {
        let order = [];
        let elem = create({
          coerce: () => order.push('coerce'),
          set: () => order.push('set')
        });

        elem.test = 'something';

        // Called to coerce the initial value in created.
        expect(order[0]).to.equal('coerce');

        // Called just before set, after ready.
        expect(order[1]).to.equal('coerce');

        // Called after coerce, after ready.
        expect(order[2]).to.equal('set');

        // Called before set upon manual setting.
        expect(order[3]).to.equal('coerce');

        // Called after coerce upon manual setting.
        expect(order[4]).to.equal('set');
      });

      it('context and arguments', function (done) {
        let opts = {
          coerce (value) {
            expect(this.type).to.equal(opts.type);
            expect(arguments.length).to.equal(1);
            expect(value).to.equal('something');
            done();
          },
          default: 'something'
        };
        create(opts);
      });
    });

    describe('created', function () {
      it('is called right when the element is set up', function () {
        const order = [];
        create({
          created: () => order.push('created'),
          set: () => order.push('set')
        });
        expect(order[0]).to.equal('created');
        expect(order[1]).to.equal('set');
      });

      it('is called once', function () {
        let called = 0;
        const elem = create({
          created: () => ++called
        });
        elem.test = 'something else';
        expect(called).to.equal(1);
      });
    });
  });

  describe('patterns', function () {
    it('should allow you to do something with a set value but return a completely different value', function () {
      let set;
      const elem = createFromHtml('<div test="initial"></div>', {
        attribute: true,
        set: (elem, data) => set = data.newValue,
        get: () => 'get'
      });

      expect(set).to.equal('initial');
      expect(elem.test).to.equal('get');
      elem.test = 'set';
      expect(set).to.equal('set');
      expect(elem.test).to.equal('get');
    });
  });
});

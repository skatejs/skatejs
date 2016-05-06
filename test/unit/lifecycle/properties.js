import element from '../../lib/element';
import propertiesInit from '../../../src/lifecycle/properties-init';

describe('lifecycle/property', function () {
  function create (definition, name = 'testName', value = null) {
    return element().skate({
      properties: {
        [name]: definition
      }
    })({
      [name]: value
    });
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
  });

  describe('api', function () {
    describe('attribute', function () {
      it('when true, links an attribute of the name (dash-cased)', function () {
        let elem = create({ attribute: true }, 'testName', 'something');

        expect(elem.testName).to.equal('something');
        expect(elem.getAttribute('test-name')).to.equal('something');

        elem.testName = 'something else';
        expect(elem.testName).to.equal('something else');
        expect(elem.getAttribute('test-name')).to.equal('something else');
      });

      describe('undefined and null', function () {
        it('when a string, the value is used as the attribute name', function () {
          let elem = create({ attribute: 'test-name' });
          elem.testName = 'something';
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
          elem.setAttribute('test-name', '');
          expect(elem.testName).to.equal('');
        });

        it('when an attribute is removed, the property should be set to undefined', function () {
          let elem = create({ attribute: true });
          elem.setAttribute('test-name', 'test');
          expect(elem.testName).to.equal('test');
          elem.removeAttribute('test-name');
          expect(elem.testName).to.equal(undefined);
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
          elem.setAttribute('test-name', '1:2:3');
          expect(elem.testName).to.be.an('array');
          expect(elem.testName).to.have.length(3);
          expect(elem.testName[0]).to.equal(1);
          expect(elem.testName[1]).to.equal(2);
          expect(elem.testName[2]).to.equal(3);
        });

        it('coerces the initial value if serialized from an attribute', function () {
          let elem = create({
            attribute: true,
            deserialize: value => value.split(':').map(Number)
          });
          elem.setAttribute('test-name', '1:2:3');
          expect(elem.testName).to.be.an('array');
          expect(elem.testName).to.have.length(3);
          expect(elem.testName[0]).to.equal(1);
          expect(elem.testName[1]).to.equal(2);
          expect(elem.testName[2]).to.equal(3);
        });
      });

      describe('serialize()', function () {
        it('only works with attribute present', function () {
          let called = false;
          const elem = create({ serialize: () => called = true });
          elem.testName = true;
          expect(called).to.equal(false);
        });

        it('coerces the value from the property to the attribute', function () {
          const elem = create({
            attribute: true,
            default () { return []; },
            deserialize: value => value.split(':'),
            serialize: value => value.join(':')
          }, 'testName', [1, 2, 3]);
          expect(elem.getAttribute('test-name')).to.equal('1:2:3');
        });

        it('removes the attribute if undefined is returned', function () {
          let elem = create({
            attribute: true,
            serialize: value => value ? '' : undefined
          });
          elem.testName = true;
          expect(elem.getAttribute('test-name')).to.equal('');
          elem.testName = false;
          expect(elem.getAttribute('test-name')).to.equal(null);
        });
      });
    });

    describe('default', function () {
      describe('when a function', function () {
        it('returns the default value that the property should be initialised with', function () {
          let elem = create({ default: () => 'something' });
          expect(elem.testName).to.equal('something');
        });

        it('is returned by get() when the property is undefined', function () {
          let elem = create({ default: () => 'something' });
          elem.testName = 'something else';
          expect(elem.testName).to.equal('something else');
          elem.testName = undefined;
          expect(elem.testName).to.equal('something');
        });

        it('is returned by get() when the property is null', function () {
          let elem = create({ default: () => 'something' });
          elem.testName = 'something else';
          expect(elem.testName).to.equal('something else');
          elem.testName = null;
          expect(elem.testName).to.equal('something');
        });

        it('is normalized to undefined if null is passed', function () {
          let elem = create({ default: null });
          expect(elem.test).to.equal(undefined);
        });

        it('should return the default value if a linked attribute is removed', function () {
          const elem = create({ attribute: true, default: 'something' });

          // Ensure defaults are there.
          expect(elem.testName).to.equal('something');
          expect(elem.getAttribute('test-name')).to.equal('something');

          // Remove.
          elem.removeAttribute('test-name');

          // Should be in the same state because the default is "something".
          expect(elem.testName).to.equal('something');
          expect(elem.getAttribute('test-name')).to.equal('something');
        });

        it('context and arguments', function (done) {
          let opts = {
            default (elem, data) {
              expect(this.default).to.equal(opts.default);
              expect(arguments.length).to.equal(2);
              expect(elem.nodeType).to.equal(1);
              expect(data.name).to.equal('testName');
              done();
            }
          };
          create(opts);
        });
      });

      describe('when not a function', function () {
        it('it is the default value that the property should be initialised with', function () {
          let elem = create({ default: 'something' });
          expect(elem.testName).to.equal('something');
        });

        it('is returned by get() when the property is not defined', function () {
          let elem = create({ default: 'something' });
          elem.testName = 'something else';
          expect(elem.testName).to.equal('something else');
          elem.testName = undefined;
          expect(elem.testName).to.equal('something');
        });
      });
    });

    describe('get()', function () {
      it('returns the value of the property', function () {
        let elem = create({ get: () => 'something' });
        expect(elem.testName).to.equal('something');
      });

      it('context and arguments', function (done) {
        let opts = {
          attribute: true,
          get (elem, data) {
            expect(this.get).to.equal(opts.get);
            expect(arguments.length).to.equal(2);
            expect(elem.nodeType).to.equal(1);
            expect(data).to.contain({
              name: 'testName',
              internalValue: 'initial'
            });
            done();
          }
        };

        // We create from HTML so that we can set the initial value and see if
        // that gets passed as the internal value.
        const elem = create(opts, 'testName', 'initial');

        // Trigger the getter.
        elem.testName;
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
        create({
          attribute: true,
          set (elem, data) {
            expect(data.newValue).to.equal('something');
            expect(data.oldValue).to.equal(undefined);
            ++calls;
          }
        }, 'test-name', 'something');
        expect(calls).to.equal(1);
      });

      it('is called when the property is updated', function () {
        let calls = 0;
        let elem = create({ set: () => ++calls });
        elem.testName = true;
        expect(calls).to.equal(2);
      });

      it('is called even if the property is set to the same value that it already is', function () {
        let calls = 0;
        let elem = create({ set: () => ++calls });
        elem.testName = true;
        elem.testName = true;
        expect(calls).to.equal(3);
      });

      it('context and arguments', function (done) {
        let opts = {
          set (elem, data) {
            expect(this.set).to.equal(opts.set);
            expect(arguments.length).to.equal(2);
            expect(elem.nodeType).to.equal(1);
            expect(data).to.contain({
              name: 'testName',
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
        elem.testName = 'something';
        expect(called).to.equal(true);
      });

      it('is called before set()', function () {
        let order = [];
        let elem = create({
          coerce: () => order.push('coerce'),
          set: () => order.push('set')
        });

        elem.testName = 'something';

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

    describe('initial', function () {
      it('is called once', function () {
        let called = 0;
        const elem = create({
          initial: () => ++called
        });
        elem.testName = 'something else';
        expect(called).to.equal(1);
      });

      it('context and arguments', function (done) {
        const opts = {
          initial (elem, data) {
            expect(this.initial).to.equal(opts.initial);
            expect(arguments.length).to.equal(2);
            expect(elem.nodeType).to.equal(1);
            expect(data.name).to.equal('testName');
            expect(data.internalValue).to.equal(undefined);
            done();
          }
        };
        create(opts);
      });
    });
  });

  describe('patterns', function () {
    it('should allow you to do something with a set value but return a completely different value', function () {
      let set;
      const elem = create({
        attribute: true,
        set: (elem, data) => set = data.newValue,
        get: () => 'get'
      }, 'testName', 'initial');

      expect(set).to.equal('initial');
      expect(elem.testName).to.equal('get');
      elem.testName = 'set';
      expect(set).to.equal('set');
      expect(elem.testName).to.equal('get');
    });
  });
});

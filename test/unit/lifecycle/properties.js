import afterMutations from '../../lib/after-mutations';
import element from '../../lib/element';
import { classStaticsInheritance } from '../../lib/support';
import fixture from '../../lib/fixture';
import propsInit from '../../../src/lifecycle/props-init';
import { Component } from '../../../src';

describe('lifecycle/property', () => {
  function create(definition = {}, name = 'testName', value) {
    const elem = new (element().skate({
      props: {
        [name]: definition,
      },
    }));
    if (arguments.length === 3) { // eslint-disable-line prefer-rest-params
      elem[name] = value;
    }
    return elem;
  }

  it('should accept zero arguments', () => {
    propsInit();
  });

  it('should return a function', () => {
    expect(propsInit()).to.be.a('function');
  });

  describe('props declared as attributes with ES2015 classes are linked', () => {
    const skip = !classStaticsInheritance();

    it('uses the same attribute and property name for lower-case names', function test(done) {
      if (skip) this.skip();

      const elem = new (element().skate(class extends Component {
        static get props() {
          return { testprop: { attribute: true } };
        }
      }));

      afterMutations(
        () => elem.setAttribute('testprop', 'foo'),
        () => expect(elem.testprop).to.equal('foo'),
        done
      );
    });

    it('uses the same attribute and property name for dashed-names names', function test(done) {
      if (skip) this.skip();

      const elem = new (element().skate(class extends Component {
        static get props() {
          return { 'test-prop': { attribute: true } };
        }
      }));

      afterMutations(
        () => elem.setAttribute('test-prop', 'foo'),
        () => expect(elem['test-prop']).to.equal('foo'),
        done
      );
    });

    it('uses a dash-cased attribute name for camel-case property names', function test(done) {
      if (skip) this.skip();

      const elem = new (element().skate(class extends Component {
        static get props() {
          return { testProp: { attribute: true } };
        }
      }));

      afterMutations(
        () => elem.setAttribute('test-prop', 'foo'),
        () => expect(elem.testProp).to.equal('foo'),
        done
      );
    });
  });

  describe('props declared as attributes with object are linked', () => {
    it('uses the same attribute and property name for lower-case names', (done) => {
      const elem = new (element().skate({
        props: {
          testprop: { attribute: true },
        },
      }));

      afterMutations(
        () => elem.setAttribute('testprop', 'foo'),
        () => expect(elem.testprop).to.equal('foo'),
        done
      );
    });

    it('uses the same attribute and property name for dashed-names names', (done) => {
      const elem = new (element().skate({
        props: { 'test-prop': { attribute: true } },
      }));

      afterMutations(
        () => elem.setAttribute('test-prop', 'foo'),
        () => expect(elem['test-prop']).to.equal('foo'),
        done
      );
    });

    it('uses a dash-cased attribute name for camel-case property names', (done) => {
      const elem = new (element().skate({
        props: {
          testProp: { attribute: true },
        },
      }));

      afterMutations(
        () => elem.setAttribute('test-prop', 'foo'),
        () => expect(elem.testProp).to.equal('foo'),
        done
      );
    });
  });

  it('should not leak options to other definitions', () => {
    const elem = new (element().skate({
      props: {
        test1: {
          attribute: true,
          default: 'test1',
          deserialize: () => 'test1',
          serialize: () => 'test1',
        },
        test2: {
          attribute: true,
          default: 'test2',
          deserialize: () => 'test2',
          serialize: () => 'test2',
        },
      },
    }));

    ['test1', 'test2'].forEach((value) => {
      expect(elem[value]).to.equal(value);
      elem[value] = null;
      expect(elem[value]).to.equal(value);
      expect(elem.getAttribute(value)).to.equal(null);
      elem.removeAttribute(value);
      expect(elem[value]).to.equal(value);
      expect(elem.getAttribute(value)).to.equal(null);
    });
  });

  describe('property definition', () => {
    function create2() {
      return propsInit()();
    }

    describe('native', () => {
      it('should define a getter', () => {
        expect(create2().get).to.be.a('function');
      });

      it('should define a setter', () => {
        expect(create2().set).to.be.a('function');
      });

      it('should be enumerable', () => {
        expect(create2().enumerable).to.equal(true);
      });

      it('should be configurable', () => {
        expect(create2().configurable).to.equal(true);
      });

      it('should not contain a value', () => {
        expect(create2().value).to.equal(undefined);
      });
    });
  });

  describe('api', () => {
    describe('attribute', () => {
      it('setting the attribute updates the property value', (done) => {
        const fixtureArea = fixture();
        const elem = create({ attribute: true }, 'testName');
        fixtureArea.appendChild(elem);
        afterMutations(() => {
          elem.testName = 'something';
          expect(elem.getAttribute('test-name')).to.equal('something', 'attr val');

          elem.setAttribute('test-name', 'something else');
          afterMutations(() => {
            expect(elem.testName).to.equal('something else');
            expect(elem.getAttribute('test-name')).to.equal('something else');
            fixtureArea.removeChild(elem);
            done();
          });
        });
      });

      describe('undefined and null', () => {
        it('when a string, the value is used as the attribute name', (done) => {
          const fixtureArea = fixture();
          const elem = create({ attribute: 'test-name' });
          fixtureArea.appendChild(elem);
          afterMutations(() => {
            elem.testName = 'something';
            expect(elem.getAttribute('test-name')).to.equal('something');
            fixtureArea.removeChild(elem);
            done();
          });
        });

        it('when a property is set to undefined, the attribute should not be set', () => {
          const elem = create({ attribute: true });
          elem.test = undefined;
          expect(elem.hasAttribute('test')).to.equal(false);
        });

        it('when a property is set to null, the attribute should not be set', () => {
          const elem = create({ attribute: true });
          elem.test = null;
          expect(elem.hasAttribute('test')).to.equal(false);
        });

        it('when an attribute is set to a string, the property should be set to an empty string', (done) => {
          const fixtureArea = fixture();
          const elem = create({ attribute: true });
          fixtureArea.appendChild(elem);
          elem.setAttribute('test-name', '');
          afterMutations(
            () => expect(elem.testName).to.equal(''),
            () => fixtureArea.removeChild(elem),
            done
          );
        });

        it('when an attribute is removed, the property should be set to undefined', (done) => {
          const fixtureArea = fixture();
          const elem = create({ attribute: true });
          fixtureArea.appendChild(elem);
          afterMutations(() => {
            elem.setAttribute('test-name', 'test');
            afterMutations(() => {
              expect(elem.testName).to.equal('test');
              elem.removeAttribute('test-name');
              afterMutations(() => {
                expect(elem.testName).to.equal(null);
                fixtureArea.removeChild(elem);
                done();
              }, 1);
            });
          });
        });
      });

      describe('deserialize()', () => {
        it('only works with attribute present', () => {
          let called = false;
          const elem = create({ deserialize: () => {
            called = true;
          } });
          elem.test = true;
          expect(called).to.equal(false);
        });

        it('coerces the value from the attribute to the property', (done) => {
          const elem = create({
            attribute: true,
            deserialize: value => value.split(':').map(Number),
          });
          elem.setAttribute('test-name', '1:2:3');
          afterMutations(
            () => expect(elem.testName).to.be.an('array'),
            () => expect(elem.testName).to.have.length(3),
            () => expect(elem.testName[0]).to.equal(1),
            () => expect(elem.testName[1]).to.equal(2),
            () => expect(elem.testName[2]).to.equal(3),
            done
          );
        });

        it('coerces the initial value if serialized from an attribute', (done) => {
          const elem = create({
            attribute: true,
            deserialize: value => value.split(':').map(Number),
          });
          elem.setAttribute('test-name', '1:2:3');
          afterMutations(
            () => expect(elem.testName).to.be.an('array'),
            () => expect(elem.testName).to.have.length(3),
            () => expect(elem.testName[0]).to.equal(1),
            () => expect(elem.testName[1]).to.equal(2),
            () => expect(elem.testName[2]).to.equal(3),
            done
          );
        });
      });

      describe('serialize()', () => {
        it('only works with attribute present', () => {
          let called = false;
          const elem = create({ serialize: () => {
            called = true;
          } });
          elem.testName = true;
          expect(called).to.equal(false);
        });

        it('coerces the value from the property to the attribute', (done) => {
          const fixtureArea = fixture();
          const elem = create({
            attribute: true,
            default() { return []; },
            deserialize: value => value.split(':'),
            serialize: value => value.join(':'),
          }, 'testName');
          elem.testName = [1, 2, 3];
          fixtureArea.appendChild(elem);
          afterMutations(() => {
            expect(elem.getAttribute('test-name')).to.equal('1:2:3');
            fixtureArea.removeChild(elem);
            done();
          }, 1);
        });

        it('removes the attribute if null is returned', (done) => {
          const fixtureArea = fixture();
          const elem = create({
            attribute: true,
            serialize: value => (value ? '' : null),
          });
          elem.testName = true;
          fixtureArea.appendChild(elem);
          afterMutations(() => {
            expect(elem.getAttribute('test-name')).to.equal('');
            elem.testName = false;
            expect(elem.getAttribute('test-name')).to.equal(null);
            fixtureArea.removeChild(elem);
            done();
          });
        });

        it('removes the attribute if undefined is returned', (done) => {
          const fixtureArea = fixture();
          const elem = create({
            attribute: true,
            serialize: value => (value ? '' : undefined),
          });
          elem.testName = true;
          fixtureArea.appendChild(elem);
          afterMutations(() => {
            expect(elem.getAttribute('test-name')).to.equal('');
            elem.testName = false;
            afterMutations(() => {
              expect(elem.getAttribute('test-name')).to.equal(null);
              fixtureArea.removeChild(elem);
              done();
            });
          });
        });
      });
    });


    describe('default', () => {
      it('null by default', () => {
        const elem = create();
        expect(elem.testName).to.equal(null);
      });

      it('should accept a function', () => {
        const opts = {
          default(elem, data) {
            expect(this.default).to.equal(opts.default);
            expect(arguments.length).to.equal(2); // eslint-disable-line prefer-rest-params
            expect(elem.nodeType).to.equal(1);
            expect(data.name).to.equal('testName');
            return 'testValue';
          },
        };
        const elem = create(opts);
        expect(elem.testName).to.equal('testValue');
      });

      it('should accept a non-function', () => {
        const elem = create({ default: 'testValue' });
        expect(elem.testName).to.equal('testValue');
      });

      it('should be the property value if property is set to null', () => {
        const elem = create({ default: 'testValue' });
        elem.testName = 'updatedValue';
        expect(elem.testName).to.equal('updatedValue');
        elem.testName = null;
        expect(elem.testName).to.equal('testValue');
      });

      it('should be the property value if property is set to undefined', () => {
        const elem = create({ default: 'testValue' });
        elem.testName = 'updatedValue';
        expect(elem.testName).to.equal('updatedValue');
        elem.testName = undefined;
        expect(elem.testName).to.equal('testValue');
      });

      it('should not set the attribute on init', () => {
        const elem = create({ attribute: true, default: 'testValue' });
        expect(elem.getAttribute('test-name')).to.equal(null);
      });

      it('should not set the attribute on update', (done) => {
        const fixtureArea = fixture();
        const elem = create({ attribute: true, default: 'testValue' });
        fixtureArea.appendChild(elem);
        afterMutations(() => {
          elem.testName = 'updatedValue';
          expect(elem.getAttribute('test-name')).to.equal('updatedValue');
          elem.testName = null;
          expect(elem.getAttribute('test-name')).to.equal(null);
          fixtureArea.removeChild(elem);
          done();
        });
      });
    });

    describe('get()', () => {
      it('returns the value of the property', () => {
        const elem = create({ get: () => 'something' });
        expect(elem.testName).to.equal('something');
      });

      it('context and arguments', (done) => {
        const opts = {
          attribute: true,
          get(elem, data) {
            expect(this.get).to.equal(opts.get);
            expect(arguments.length).to.equal(2); // eslint-disable-line prefer-rest-params
            expect(elem.nodeType).to.equal(1);
            expect(data).to.contain({
              name: 'testName',
              internalValue: 'initial',
            });
            done();
          },
        };

        // We create from HTML so that we can set the initial value and see if
        // that gets passed as the internal value.
        const elem = create(opts, 'testName', 'initial');

        // Trigger the getter.
        elem.testName;  // eslint-disable-line no-unused-expressions
      });
    });

    describe('set()', () => {
      it('is not called if no value is on the element when it is initialised', () => {
        let calls = 0;
        create({
          set(elem, data) {
            expect(data.newValue).to.equal(undefined);
            expect(data.oldValue).to.equal(undefined);
            ++calls;
          },
        });
        expect(calls).to.equal(0);
      });

      it('is called once if the value exists on the element when it is initialised', () => {
        let calls = 0;
        create({
          attribute: true,
          set(elem, data) {
            expect(data.newValue).to.equal('something');
            expect(data.oldValue).to.equal(null);
            ++calls;
          },
        }, 'testName', 'something');
        expect(calls).to.equal(1);
      });

      it('is called when the property is updated', () => {
        let calls = 0;
        const elem = create({ set: () => ++calls });
        elem.testName = true;
        expect(calls).to.equal(1);
      });

      it('is called even if the property is set to the same value that it already is', () => {
        let calls = 0;
        const elem = create({ set: () => ++calls });
        elem.testName = true;
        elem.testName = true;
        expect(calls).to.equal(2);
      });

      it('context and arguments', (done) => {
        const opts = {
          set(elem, data) {
            expect(this.set).to.equal(opts.set);
            expect(arguments.length).to.equal(2); // eslint-disable-line prefer-rest-params
            expect(elem.nodeType).to.equal(1);
            expect(data).to.contain({
              name: 'testName',
              newValue: null,
              oldValue: null,
            });
            done();
          },
        };
        create(opts, 'testName', undefined);
      });
    });

    describe('coerce', () => {
      it('is an arbitrary function that has no return value (the user can do whatever type checking they want here)', () => {
        let called = false;
        const elem = create({
          coerce: () => {
            called = true;
          },
        });
        elem.testName = 'something';
        expect(called).to.equal(true);
      });

      it('is called before set()', () => {
        const order = [];
        const elem = create({
          coerce: () => order.push('coerce'),
          set: () => order.push('set'),
        });

        elem.testName = 'something';

        // Called to coerce the initial value.
        expect(order[0]).to.equal('coerce');

        // Called to coerce the manual set().
        expect(order[1]).to.equal('coerce');

        // Called after coercing the manual value.
        expect(order[2]).to.equal('set');
      });

      it('context and arguments', (done) => {
        const opts = {
          coerce(value) {
            expect(this.type).to.equal(opts.type);
            expect(arguments.length).to.equal(1); // eslint-disable-line prefer-rest-params
            expect(value).to.equal('something');
            done();
          },
          default: 'something',
        };
        create(opts);
      });
    });

    describe('initial', () => {
      it('should accept a function', () => {
        const opts = {
          initial(elem, data) {
            expect(this.initial).to.equal(opts.initial);
            expect(arguments.length).to.equal(2); // eslint-disable-line prefer-rest-params
            expect(elem.nodeType).to.equal(1);
            expect(data.name).to.equal('testName');
            return 'testValue';
          },
        };
        const elem = create(opts);
        expect(elem.testName).to.equal('testValue');
      });

      it('should accept a non-function', () => {
        const elem = create({ initial: 'testValue' });
        expect(elem.testName).to.equal('testValue');
      });

      it('should not be the property value if property is set to null', () => {
        const elem = create({ initial: 'testValue' });
        elem.testName = 'updatedValue';
        expect(elem.testName).to.equal('updatedValue');
        elem.testName = null;
        expect(elem.testName).to.equal(null);
      });

      it('should not be the property value if property is set to undefined', () => {
        const elem = create({ initial: 'testValue' });
        elem.testName = 'updatedValue';
        expect(elem.testName).to.equal('updatedValue');
        elem.testName = undefined;
        expect(elem.testName).to.equal(null);
      });

      it('should set the attribute on init', (done) => {
        const fixtureArea = fixture();
        const elem = create({ attribute: true, initial: 'testValue' });
        fixtureArea.appendChild(elem);
        afterMutations(() => {
          expect(elem.getAttribute('test-name')).to.equal('testValue');
          fixtureArea.removeChild(elem);
          done();
        });
      });

      it('should set the attribute on update', (done) => {
        const fixtureArea = fixture();
        const elem = create({ attribute: true, initial: 'testValue' });
        fixtureArea.appendChild(elem);
        afterMutations(() => {
          elem.testName = 'updatedValue';
          expect(elem.getAttribute('test-name')).to.equal('updatedValue');
          elem.testName = null;
          expect(elem.getAttribute('test-name')).to.equal(null);
          fixtureArea.removeChild(elem);
          done();
        });
      });
    });
  });

  describe('patterns', () => {
    it('should allow you to do something with a set value but return a completely different value', () => {
      let set;
      const elem2 = create({
        attribute: true,
        set: (elem, data) => {
          set = data.newValue;
        },
        get: () => 'get',
      }, 'testName', 'initial');

      expect(set).to.equal('initial');
      expect(elem2.testName).to.equal('get');
      elem2.testName = 'set';
      expect(set).to.equal('set');
      expect(elem2.testName).to.equal('get');
    });

    describe('setting the attribute updates the property correctly after the property is set', () => {
      it('to an existing value', (done) => {
        const fixtureArea = fixture();
        const elem = create({ attribute: true }, 'testName', 'something');
        elem.testName = 'something';
        expect(elem.testName).to.equal('something');
        fixtureArea.appendChild(elem);
        afterMutations(() => {
          expect(elem.getAttribute('test-name')).to.equal('something');

          elem.setAttribute('test-name', 'something else');
          afterMutations(() => {
            expect(elem.testName).to.equal('something else');
            expect(elem.getAttribute('test-name')).to.equal('something else');
            fixtureArea.removeChild(elem);
            done();
          });
        });
      });

      it('to an existing null value', (done) => {
        const elem = create({ attribute: true });
        elem.testName = null;

        elem.setAttribute('test-name', 'something');
        afterMutations(() => {
          expect(elem.testName).to.equal('something');
          expect(elem.getAttribute('test-name')).to.equal('something');
          done();
        });
      });

      it('to an existing serialized value', (done) => {
        const elem = create(({
          attribute: true,
          serialize: value => (value ? '' : undefined),
          deserialize: value => (value !== null),
        }));

        elem.testName = false;
        expect(elem.testName).to.equal(false);
        expect(elem.getAttribute('test-name')).to.equal(null);

        elem.setAttribute('test-name', '');
        afterMutations(() => {
          expect(elem.testName).to.equal(true);
          expect(elem.getAttribute('test-name')).to.equal('');
          done();
        });
      });
    });
  });
});

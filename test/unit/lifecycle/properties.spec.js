/* eslint-env jest */

import { classStaticsInheritance } from '../../lib/support';
import afterMutations from '../../lib/after-mutations';
import fixture from '../../lib/fixture';

import { define, props, withProps, withUnique } from '../../../src';

function withPropsUnique (Base = HTMLElement) {
  return withProps(withUnique(Base));
}

describe('lifecycle/properties', () => {
  function create (definition = {}, name = 'testName', value) {
    const elem = new (define(class extends withPropsUnique() {
      static props = { [name]: definition };
    }))();
    if (arguments.length === 3) { // eslint-disable-line prefer-rest-params
      elem[name] = value;
    }
    return elem;
  }

  describe('props declared as attributes with ES2015 classes are linked', () => {
    const skip = !classStaticsInheritance();

    it('uses the same attribute and property name for lower-case names', (done) => {
      if (skip) this.skip();

      const elem = new (define(class extends withPropsUnique() {
        static props = { testprop: { attribute: true } };
      }))();

      afterMutations(
        () => elem.setAttribute('testprop', 'foo'),
        () => expect(elem.testprop).toEqual('foo'),
        done
      );
    });

    it('uses the same attribute and property name for dashed-names names', (done) => {
      if (skip) this.skip();

      const elem = new (define(class extends withPropsUnique() {
        static props = { 'test-prop': { attribute: true } };
      }))();

      afterMutations(
        () => elem.setAttribute('test-prop', 'foo'),
        () => expect(elem['test-prop']).toEqual('foo'),
        done
      );
    });

    it('uses a dash-cased attribute name for camel-case property names', (done) => {
      if (skip) this.skip();

      const elem = new (define(class extends withPropsUnique() {
        static props = { testProp: { attribute: true } };
      }))();

      afterMutations(
        () => elem.setAttribute('test-prop', 'foo'),
        () => expect(elem.testProp).toEqual('foo'),
        done
      );
    });
  });

  describe('props declared as attributes with object are linked', () => {
    it('uses the same attribute and property name for lower-case names', (done) => {
      const elem = new (define(class extends withPropsUnique() {
        static props = { testprop: { attribute: true } };
      }))();

      afterMutations(
        () => elem.setAttribute('testprop', 'foo'),
        () => expect(elem.testprop).toEqual('foo'),
        done
      );
    });

    it('uses the same attribute and property name for dashed-names names', (done) => {
      const elem = new (define(class extends withPropsUnique() {
        static props = { 'test-prop': { attribute: true } };
      }))();

      afterMutations(
        () => elem.setAttribute('test-prop', 'foo'),
        () => expect(elem['test-prop']).toEqual('foo'),
        done
      );
    });

    it('uses a dash-cased attribute name for camel-case property names', (done) => {
      const elem = new (define(class extends withPropsUnique() {
        static props = { testProp: { attribute: true } };
      }))();

      afterMutations(
        () => elem.setAttribute('test-prop', 'foo'),
        () => expect(elem.testProp).toEqual('foo'),
        done
      );
    });
  });

  it('should not leak options to other definitions', () => {
    const elem = new (define(class extends withPropsUnique() {
      static props = {
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
      };
    }))();

    ['test1', 'test2'].forEach((value) => {
      expect(elem[value]).toEqual(value);

      elem[value] = null;
      expect(elem[value]).toEqual(value);
      expect(elem.getAttribute(value)).toEqual(value);

      elem.removeAttribute(value);
      expect(elem[value]).toEqual(value);
      expect(elem.getAttribute(value)).toEqual(null);
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
          expect(elem.getAttribute('test-name')).toEqual('something', 'attr val');

          elem.setAttribute('test-name', 'something else');
          afterMutations(() => {
            expect(elem.testName).toEqual('something else');
            expect(elem.getAttribute('test-name')).toEqual('something else');
            fixtureArea.removeChild(elem);
            done();
          });
        });
      });

      it('1st mutation updates prop', (done) => {
        const Elem = define(class extends withPropsUnique() {
          static props = {
            foo: {
              attribute: true
            }
          }
        });
        const elem = fixture(`<${Elem.is} foo="bar" />`).firstChild;
        afterMutations(
          () => (elem.foo = 'bar'),
          () => expect(elem.getAttribute('foo')).toEqual('bar'),
          () => (elem.setAttribute('foo', 'bar1')),
          () => expect(elem.foo).toEqual('bar1'),
          done
        );
      });

      it('2nd mutation updates prop', (done) => {
        const Elem = define(class extends withPropsUnique() {
          static props = {
            foo: {
              attribute: true
            }
          }
        });
        const elem = fixture(`<${Elem.is} foo="bar" />`).firstChild;
        afterMutations(
          () => (elem.foo = 'bar'),
          () => expect(elem.getAttribute('foo')).toEqual('bar'),
          () => (elem.setAttribute('foo', 'bar1')),
          () => (elem.setAttribute('foo', 'bar2')),
          () => expect(elem.foo).toEqual('bar2'),
          done
        );
      });

      describe('undefined and null', () => {
        it('when a string, the value is used as the attribute name', (done) => {
          const fixtureArea = fixture();
          const elem = create({ attribute: 'test-name' });
          fixtureArea.appendChild(elem);
          afterMutations(() => {
            elem.testName = 'something';
            expect(elem.getAttribute('test-name')).toEqual('something');
            fixtureArea.removeChild(elem);
            done();
          });
        });

        it('when a property is set to undefined, the attribute should not be set', () => {
          const elem = create({ attribute: true });
          elem.test = undefined;
          expect(elem.hasAttribute('test')).toEqual(false);
        });

        it('when a property is set to null, the attribute should not be set', () => {
          const elem = create({ attribute: true });
          elem.test = null;
          expect(elem.hasAttribute('test')).toEqual(false);
        });

        it('when an attribute is set to a string, the property should be set to an empty string', (done) => {
          const fixtureArea = fixture();
          const elem = create({ attribute: true });
          fixtureArea.appendChild(elem);
          elem.setAttribute('test-name', '');
          afterMutations(
            () => expect(elem.testName).toEqual(''),
            () => fixtureArea.removeChild(elem),
            done
          );
        });

        it('when an attribute is removed, the property should be set to null', (done) => {
          const fixtureArea = fixture();
          const elem = create({ attribute: true });
          fixtureArea.appendChild(elem);
          afterMutations(() => {
            elem.setAttribute('test-name', 'test');
            afterMutations(() => {
              expect(elem.testName).toEqual('test');
              elem.removeAttribute('test-name');
              afterMutations(() => {
                expect(elem.testName).toEqual(undefined);
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
          expect(called).toEqual(false);
        });

        it('coerces the value from the attribute to the property', (done) => {
          const elem = create({
            attribute: true,
            deserialize: value => value.split(':').map(Number),
            serialize: value => value.join(':')
          });
          elem.setAttribute('test-name', '1:2:3');
          afterMutations(
            () => expect(typeof elem.testName).toBe('object'),
            () => expect(elem.testName.length).toBe(3),
            () => expect(elem.testName[0]).toEqual(1),
            () => expect(elem.testName[1]).toEqual(2),
            () => expect(elem.testName[2]).toEqual(3),
            done
          );
        });

        it('coerces the initial value if serialized from an attribute', (done) => {
          const elem = create({
            attribute: true,
            deserialize: value => value.split(':').map(Number),
            serialize: value => value.join(':')
          });
          elem.setAttribute('test-name', '1:2:3');
          afterMutations(
            () => expect(typeof elem.testName).toBe('object'),
            () => expect(elem.testName.length).toBe(3),
            () => expect(elem.testName[0]).toEqual(1),
            () => expect(elem.testName[1]).toEqual(2),
            () => expect(elem.testName[2]).toEqual(3),
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
          expect(called).toEqual(false);
        });

        it('coerces the value from the property to the attribute', (done) => {
          const fixtureArea = fixture();
          const elem = create({
            ...props.array,
            ...{
              attribute: true,
              deserialize: value => value.split(':'),
              serialize: value => value.join(':')
            }
          }, 'testName');
          elem.testName = [1, 2, 3];
          fixtureArea.appendChild(elem);
          afterMutations(() => {
            expect(elem.getAttribute('test-name')).toEqual('1:2:3');
            fixtureArea.removeChild(elem);
            done();
          }, 1);
        });

        it('removes the attribute if null is returned', (done) => {
          const fixtureArea = fixture();
          const elem = create({ ...props.boolean, ...{ attribute: true } });
          elem.testName = true;
          fixtureArea.appendChild(elem);
          afterMutations(() => {
            expect(elem.getAttribute('test-name')).toEqual('');
            elem.testName = false;
            expect(elem.getAttribute('test-name')).toEqual(null);
            fixtureArea.removeChild(elem);
            done();
          });
        });

        it('removes the attribute if undefined is returned', (done) => {
          const fixtureArea = fixture();
          const elem = create({ ...props.boolean, ...{ attribute: true } });
          elem.testName = true;
          fixtureArea.appendChild(elem);
          afterMutations(() => {
            expect(elem.getAttribute('test-name')).toEqual('');
            elem.testName = false;
            afterMutations(() => {
              expect(elem.getAttribute('test-name')).toEqual(null);
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
        expect(elem.testName).toEqual(undefined);
      });

      it('should accept a value', () => {
        const elem = create({ default: 'testValue' });
        expect(elem.testName).toEqual('testValue');
      });

      it('should be the property value if property is set to null', () => {
        const elem = create({ default: 'testValue' });
        elem.testName = 'updatedValue';
        expect(elem.testName).toEqual('updatedValue');
        elem.testName = null;
        expect(elem.testName).toEqual('testValue');
      });

      it('should be the property value if property is set to undefined', () => {
        const elem = create({ default: 'testValue' });
        elem.testName = 'updatedValue';
        expect(elem.testName).toEqual('updatedValue');
        elem.testName = undefined;
        expect(elem.testName).toEqual('testValue');
      });

      it('should not set the attribute on init', () => {
        const elem = create({ attribute: true, default: 'testValue' });
        expect(elem.getAttribute('test-name')).toEqual(null);
      });

      it('should not set the attribute on update', (done) => {
        const fixtureArea = fixture();
        const elem = create({ attribute: true, default: 'testValue' });
        fixtureArea.appendChild(elem);
        afterMutations(() => {
          elem.testName = 'updatedValue';
          expect(elem.getAttribute('test-name')).toEqual('updatedValue');
          elem.testName = null;
          expect(elem.getAttribute('test-name')).toEqual(null);
          fixtureArea.removeChild(elem);
          done();
        });
      });
    });

    describe('coerce', () => {
      it('is an arbitrary function that returns the coerced value', () => {
        const elem = create({
          coerce (...args) {
            expect(args.length).toEqual(1);
            expect(args[0]).toEqual('something');
            return 'coerced';
          }
        });
        elem.testName = 'something';
        expect(elem.testName).toEqual('coerced');
      });
    });
  });

  describe('patterns', () => {
    describe('setting the attribute updates the property correctly after the property is set', () => {
      it('to an existing value', (done) => {
        const fixtureArea = fixture();
        const elem = create({ attribute: true }, 'testName', 'something');

        elem.testName = 'something';
        expect(elem.testName).toEqual('something');

        fixtureArea.appendChild(elem);
        afterMutations(() => {
          expect(elem.getAttribute('test-name')).toEqual('something');

          elem.setAttribute('test-name', 'something else');
          afterMutations(() => {
            expect(elem.testName).toEqual('something else');
            expect(elem.getAttribute('test-name')).toEqual('something else');

            fixtureArea.removeChild(elem);
            done();
          });
        });
      });

      it('to an existing null value', (done) => {
        const elem = create({ attribute: true });

        // The setting to `null` triggers a removal sync, but before it can be
        // sync'd, the setAttribute fires and attempts to resync the prop. This
        // test ensures that the prop resync properly happens.
        elem.testName = null;
        elem.setAttribute('test-name', 'something');

        afterMutations(() => {
          expect(elem.testName).toEqual('something');
          expect(elem.getAttribute('test-name')).toEqual('something');
          done();
        });
      });

      it('to an existing serialized value', (done) => {
        const elem = create(({
          attribute: true,
          serialize: value => (value ? '' : undefined),
          deserialize: value => (value !== null)
        }));

        elem.testName = false;
        expect(elem.testName).toEqual(false);
        expect(elem.getAttribute('test-name')).toEqual(null);

        elem.setAttribute('test-name', '');
        afterMutations(() => {
          expect(elem.testName).toEqual(true);
          expect(elem.getAttribute('test-name')).toEqual('');
          done();
        });
      });
    });
  });

  describe('attribute one-way', () => {
    it('source is not updated', (done) => {
      const Elem = define(class extends withPropsUnique() {
        static props = {
          prop: {
            attribute: { source: 'in' }
          }
        }
      });
      const elem = fixture(`<${Elem.is} in="val" />`).firstChild;
      afterMutations(() => {
        expect(elem.getAttribute('in')).toEqual('val', 'attr initial value');
        expect(elem.prop).toEqual('val', 'property initial value');
        elem.prop = 'val1';
        afterMutations(() => {
          expect(elem.getAttribute('in')).toEqual('val', 'attr updated value');
          expect(elem.prop).toEqual('val1', 'property updated value');
          done();
        });
      });
    });

    it('source change, updates prop', (done) => {
      const Elem = define(class extends withPropsUnique() {
        static props = {
          prop: {
            attribute: { source: 'in' }
          }
        }
      });
      const elem = fixture(`<${Elem.is} in="val" />`).firstChild;
      afterMutations(() => {
        expect(elem.getAttribute('in')).toEqual('val');
        expect(elem.prop).toEqual('val');
        elem.setAttribute('in', 'val1');
        expect(elem.prop).toEqual('val1');
        expect(elem.getAttribute('in')).toEqual('val1');
        done();
      });
    });

    it('prop change, updates target', (done) => {
      const Elem = define(class extends withPropsUnique() {
        static props = {
          prop: {
            attribute: { source: 'in', target: 'out' }
          }
        }
      });
      const elem = fixture(`<${Elem.is} in="val" out="abc"/>`).firstChild;
      afterMutations(() => {
        expect(elem.getAttribute('in')).toEqual('val', 'attr in');
        expect(elem.prop).toEqual('val', 'prop out');
        expect(elem.getAttribute('out')).toEqual('abc', 'attr out');
        elem.prop = 'val1';
        afterMutations(() => {
          expect(elem.getAttribute('in')).toEqual('val', 'attr in');
          expect(elem.prop).toEqual('val1', 'prop out');
          expect(elem.getAttribute('out')).toEqual('val1', 'attr in');
          done();
        });
      });
    });

    it('source change, updates target', (done) => {
      const Elem = define(class extends withPropsUnique() {
        static props = {
          prop: {
            attribute: { source: 'in', target: 'out' },
            default: 'def'
          }
        }
      });
      const elem = fixture(`<${Elem.is} />`).firstChild;
      afterMutations(() => {
        expect(elem.getAttribute('in')).toEqual(null);
        expect(elem.getAttribute('out')).toEqual(null);
        expect(elem.prop).toEqual('def');
        elem.setAttribute('in', 'val');
        afterMutations(() => {
          expect(elem.getAttribute('in')).toEqual('val');
          expect(elem.getAttribute('out')).toEqual('val');
          expect(elem.prop).toEqual('val');
          elem.setAttribute('in', 'val1');
          afterMutations(() => {
            expect(elem.getAttribute('in')).toEqual('val1');
            expect(elem.getAttribute('out')).toEqual('val1');
            expect(elem.prop).toEqual('val1');
            elem.removeAttribute('in');
            afterMutations(() => {
              expect(elem.getAttribute('in')).toEqual(null);
              expect(elem.getAttribute('out')).toEqual(null);
              expect(elem.prop).toEqual('def');
              done();
            });
          });
        });
      });
    });

    it('target change is ignored', (done) => {
      const Elem = define(class extends withPropsUnique() {
        static props = {
          prop: {
            attribute: { source: 'in', target: 'out' }
          }
        }
      });
      const elem = fixture(`<${Elem.is} out="abc"/>`).firstChild;
      afterMutations(() => {
        expect(elem.prop).toEqual(undefined);
        expect(elem.getAttribute('out')).toEqual('abc');
        elem.setAttribute('out', 'val');
        afterMutations(() => {
          expect(elem.prop).toEqual(undefined);
          expect(elem.getAttribute('out')).toEqual('val');
          done();
        });
      });
    });
  });
});

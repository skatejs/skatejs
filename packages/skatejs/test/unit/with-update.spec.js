/* eslint-env jest */

import { mount } from '@skatejs/bore';
import { h as preactH } from 'preact';
import { define, name, prop, props, withUpdate } from '../../src';
import { sym } from '../../src/util';

import afterMutations from '../lib/after-mutations';
import fixture from '../lib/fixture';

function create(propLocal) {
  const el = new (define(class extends withUpdate() {
    static is = name();
    static props = {
      test: { ...propLocal, ...{ attribute: true } }
    };
  }))();
  document.body.appendChild(el);
  return el;
}

function testTypeValues(type, values, done) {
  const elem = create(props[type]);
  afterMutations(() => {
    values.forEach(value => {
      elem.test = value[0];
      expect(elem.test).toEqual(
        value[1],
        `prop ${value[0]}: ${elem.test} != ${value[1]}`
      );
      expect(elem.getAttribute('test')).toEqual(
        value[2],
        `attr ${value[0]}: ${elem.getAttribute('test')} != ${value[2]}`
      );
    });
    done();
  }, 1);
}

test('static props = {}', () => {
  @define
  class Test extends withUpdate() {
    static props = {
      test: props.string
    };
  }
  const test = new Test();
  expect('test' in test).toBe(true);
});

test('static props = {} should define observedAttributes', () => {
  @define
  class Test extends withUpdate() {
    static props = {
      test: props.string
    };
  }
  expect(Test.observedAttributes.indexOf('test')).toBe(0);
});

test('static get props() {} should define props', () => {
  @define
  class Test extends withUpdate() {
    static is = 'omg-yay';
    static get props() {
      return {
        test: props.string
      };
    }
  }
  const test = new Test();
  expect('test' in test).toBe(true);
  test.setAttribute('test', 'yay');
  expect(test.test).toBe('yay');
});

test('static get props() {} should define observedAttributes', () => {
  @define
  class Test extends withUpdate() {
    static get props() {
      return {
        test: props.string
      };
    }
  }
  expect(Test.observedAttributes.indexOf('test')).toBe(0);
});

describe('withUpdate', () => {
  it('should not share _props instance', () => {
    class Test1 extends withUpdate() {
      static props = {
        test1: {}
      };
    }
    class Test2 extends Test1 {
      static props = {
        test2: {}
      };
    }
    class Test3 extends Test1 {
      static props = {
        ...Test1.props,
        ...{ test3: {} }
      };
    }
    class Test4 extends Test1 {}

    expect(typeof Test1.props.test1).toBe('object');
    expect(typeof Test1.props.test2).toBe('undefined');
    expect(typeof Test1.props.test3).toBe('undefined');
    expect(typeof Test2.props.test1).toBe('undefined');
    expect(typeof Test2.props.test2).toBe('object');
    expect(typeof Test2.props.test3).toBe('undefined');
    expect(typeof Test3.props.test1).toBe('object');
    expect(typeof Test3.props.test2).toBe('undefined');
    expect(typeof Test3.props.test3).toBe('object');
    expect(typeof Test4.props.test1).toBe('object');
    expect(typeof Test4.props.test2).toBe('undefined');
    expect(typeof Test4.props.test3).toBe('undefined');
  });

  describe('array', () => {
    let elem;

    beforeEach(done => {
      elem = create(props.array);
      afterMutations(done);
    });

    afterEach(() => document.body.removeChild(elem));

    it('default', () => {
      const elem2 = create(props.array);

      expect(typeof elem.test).toBe('object');
      expect(elem.test).toEqual(elem2.test, 'should be shared');
      expect(Object.isFrozen(elem.test)).toEqual(true, 'should be frozen');
      expect(elem.test.length).toEqual(0, 'should not contain any items');
      expect(elem.getAttribute('test')).toEqual(
        null,
        'should not set the attribute'
      );
    });

    describe('coerce', () => {
      it('set array', () => {
        const arr = ['something'];
        elem.test = arr;
        expect(elem.test).toEqual(arr);
      });

      it('set non-array', () => {
        elem.test = 'something';
        expect(typeof elem.test).toBe('object');
        expect(elem.test.length).toEqual(1);
        expect(elem.test[0]).toEqual('something');
      });
    });

    it('deserialize', done => {
      elem.setAttribute('test', '["val1","val2"]');
      afterMutations(
        () => expect(typeof elem.test).toBe('object'),
        () => expect(elem.test.length).toBe(2),
        () => expect(elem.test[0]).toEqual('val1'),
        () => expect(elem.test[1]).toEqual('val2'),
        done
      );
    });

    it('serialize', () => {
      elem.test = ['val1', 'val2'];
      expect(elem.getAttribute('test')).toEqual('["val1","val2"]');
    });
  });

  describe('boolean', () => {
    it('default', () => {
      const elem = create(props.boolean);
      expect(elem.test).toEqual(false);
      expect(elem.getAttribute('test')).toEqual(null);
    });

    [undefined, null, false, 0, '', 'something'].forEach(value => {
      value = String(value);
      it(`setting attribute to ${JSON.stringify(value)}`, done => {
        const elem = create(props.boolean);
        afterMutations(() => {
          elem.setAttribute('test', value);
          afterMutations(() => {
            expect(elem.test).toEqual(true, 'property');
            expect(elem.getAttribute('test')).toEqual(value, 'attribute');
            done();
          }, 1);
        });
      });
      it(`setting property to ${JSON.stringify(value)}`, done => {
        const elem = create(props.boolean);
        afterMutations(() => {
          elem.test = value;
          expect(elem.test).toEqual(Boolean(value), 'property');
          expect(elem.getAttribute('test')).toEqual(
            elem.test ? '' : null,
            'attribute'
          );
          done();
        });
      });
    });

    it('removing attribute', done => {
      const elem = create(props.boolean);
      afterMutations(
        () => elem.setAttribute('test', ''),
        () => expect(elem.test).toEqual(true),
        () => expect(elem.getAttribute('test')).toEqual(''),
        () => elem.removeAttribute('test'),
        () => expect(elem.test).toEqual(false),
        () => expect(elem.getAttribute('test')).toEqual(null),
        done
      );
    });
  });

  describe('number', () => {
    let elem;

    beforeEach(done => {
      elem = create(props.number);
      afterMutations(done);
    });

    it('default', () => {
      expect(typeof elem.test).toBe('number');
      expect(elem.test).toEqual(0);
      expect(elem.getAttribute('test')).toEqual(null);
    });

    it('values', done => {
      testTypeValues(
        'number',
        [
          [false, 0, '0'],
          [true, 1, '1'],
          [null, 0, null],
          [undefined, 0, null],
          [0.1, 0.1, '0.1'],
          ['test', NaN, 'NaN'],
          ['', 0, '0']
        ],
        done
      );
    });

    it('removing attribute', done => {
      afterMutations(
        () => elem.setAttribute('test', ''),
        () => expect(elem.test).toEqual(0),
        () => expect(elem.getAttribute('test')).toEqual(''),
        () => elem.removeAttribute('test'),
        () => expect(elem.test).toEqual(0),
        () => expect(elem.getAttribute('test')).toEqual(null),
        done
      );
    });
  });

  describe('object', () => {
    let elem;

    beforeEach(done => {
      elem = create(props.object);
      afterMutations(done);
    });

    it('default', () => {
      const elem2 = create(props.object);

      expect(typeof elem.test).toBe('object');
      expect(elem.test).toEqual(elem2.test, 'should be shared');
      expect(Object.isFrozen(elem.test)).toEqual(true, 'should be frozen');
      expect(elem.getAttribute('test')).toEqual(
        null,
        'should not set the attribute'
      );
    });

    it('deserialize', done => {
      elem.setAttribute('test', '{"one": 1, "two": 2}');
      afterMutations(
        () => expect(typeof elem.test).toBe('object'),
        () => expect(elem.test.one).toEqual(1),
        () => expect(elem.test.two).toEqual(2),
        done
      );
    });

    it('serialize', () => {
      elem.test = { one: 1, two: 2 };
      expect(typeof elem.getAttribute('test')).toBe('string');
      expect(elem.getAttribute('test')).toEqual('{"one":1,"two":2}');
    });
  });

  describe('string', () => {
    it('values', done => {
      const elem = create(props.string);
      afterMutations(() => {
        expect(elem.test).toEqual('');
        expect(elem.getAttribute('test')).toEqual(null);
        testTypeValues(
          'string',
          [
            [false, 'false', 'false'],
            [null, 'null', null],
            [undefined, 'undefined', null],
            [0, '0', '0'],
            ['', '', '']
          ],
          done
        );
      });
    });
  });

  describe('sanity', () => {
    const types = ['array', 'boolean', 'number', 'object', 'string'];

    describe('default one-way attribute -> prop reflection', () => {
      const attribute = { source: true };
      types.forEach(type => {
        it(type, () => {
          expect(props[type].attribute).toMatchObject(attribute);
        });
      });
    });
  });

  describe('*Props()', () => {
    if (typeof Symbol === 'undefined') {
      return;
    }

    let elem;
    const secret1 = sym('secret1');
    const secret2 = sym('secret2');

    beforeEach(done => {
      elem = new (define(class extends withUpdate() {
        static is = name();
        static props = {
          [secret1]: null,
          [secret2]: props.any,
          public1: null,
          public2: null
        };
        constructor() {
          super();
          this._rendered = 0;
          this[secret1] = 'secretKey1';
          this[secret2] = 'secretKey2';
          this.public1 = 'publicKey1';
          this.public2 = 'publicKey2';
          this.undeclaredProp = 'undeclaredKey1';
        }
        updating() {
          this._rendered++;
        }
      }))();
      fixture(elem);
      afterMutations(done);
    });

    describe('static props', () => {
      it('should not merge super props', () => {
        const one = {};
        const two = {};
        class One extends withUpdate() {
          static props = { one };
        }
        class Two extends One {
          static props = { two };
        }
        expect(One.props).toMatchObject({ one });
        expect(Two.props).toMatchObject({ two });
      });
    });

    describe('props', () => {
      it('should return only properties defined as props', () => {
        const curr = elem.props;

        expect(secret1 in curr).toEqual(true);
        expect(secret2 in curr).toEqual(true);
        expect('public1' in curr).toEqual(true);
        expect('public2' in curr).toEqual(true);

        expect(curr[secret1]).toEqual('secretKey1');
        expect(curr[secret2]).toEqual('secretKey2');
        expect(curr.public1).toEqual('publicKey1');
        expect(curr.public2).toEqual('publicKey2');

        expect(curr.undeclaredProp).toEqual(undefined);
      });

      describe('setter', () => {
        it('should set props', () => {
          elem.props = { public1: 'updated' };
          expect(elem.public1).toBe('updated');
        });

        it('should set symbols', () => {
          elem.props = { [secret1]: 'updated' };
          expect(elem[secret1]).toBe('updated');
        });

        it('should not affect unpassed props', () => {
          elem.props = { public1: 'updated' };
          expect(elem.public2).toBe('publicKey2');
        });

        it('should not affect undeclared props', () => {
          elem.props = { undeclared: 'yay' };
          expect(elem.undeclared).toBe(undefined);
        });
      });
    });
  });

  describe('{ prop }', function() {
    it('should define a property on an element', () => {
      class Elem extends withUpdate() {}
      const elem = new Elem();

      prop({ ...props.string, ...{ attribute: true } })(elem, 'test');

      expect(elem.test).toBe('');
      expect(elem.hasAttribute('test')).toEqual(false);

      elem.test = true;

      expect(elem.test).toBe('true');
      expect(elem.hasAttribute('test')).toEqual(true);
    });
  });

  it('triggerUpdate', () => {
    let updated;
    const elem = new class extends withUpdate() {
      updated() {
        updated = true;
      }
    }();
    elem.triggerUpdate();
    return mount(elem).waitFor(() => updated);
  });
});

describe('state', () => {
  const Base = class extends withUpdate() {
    static is = name();
  };

  it('should set state', () => {
    const Test = define(class extends Base {});
    const test = new Test();
    const newState = { test1: true, test2: false };
    expect(test.state).toMatchObject({});
    test.state = newState;
    expect(test.state).toMatchObject(newState);
  });

  it('should call triggerUpdate', () => {
    let updated;
    const Test = define(class extends Base {
      triggerUpdate() {
        updated = true;
      }
    });
    const test = new Test();
    test.state = {};
    expect(updated).toBe(true);
  });
});

test('setting attributes should call updated()', done => {
  const Test = define(class extends withUpdate() {
    static is = name();
    static props = {
      test: props.string
    };
    updated() {
      expect(this.getAttribute('test')).toBe('something');
      expect(this.test).toBe('something');
      done();
    }
  });

  const test = new Test();
  test.setAttribute('test', 'something');
});

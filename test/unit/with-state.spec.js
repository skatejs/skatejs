import { define, withState, withUnique } from '../../src';

const Base = withState(withUnique());

describe('withState', () => {
  it('should set state', () => {
    const Test = define(class extends Base {});
    const test = new Test();
    const newState = { test1: true, test2: false };
    expect(test.state).toMatchObject({});
    test.state = newState;
    expect(test.state).toMatchObject(newState);
  });

  it('should call triggerUpdateCallback', () => {
    let updated;
    const Test = define(
      class extends Base {
        triggerUpdateCallback() {
          updated = true;
        }
      }
    );
    const test = new Test();
    test.state = {};
    expect(updated).toBe(true);
  });
});

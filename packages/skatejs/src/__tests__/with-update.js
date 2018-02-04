import { mount } from '@skatejs/bore';
import { props, withUpdate } from '..';

class Elem extends withUpdate() {
  static props = {
    test: props.string
  };
}

test('attrs call triggerUpdate()', () => {
  const mock = jest.fn();
  const elem = new Elem();

  return mount(test).wait(w => {
    expect(mock).toHaveBeenCalledTimes(1);
  });
});

test('props call triggerUpdate()', () => {});

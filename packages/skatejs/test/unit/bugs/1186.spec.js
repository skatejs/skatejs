// @jsx h

import { define, name, props, withComponent } from 'skatejs';
import { mount } from '@skatejs/bore';
import { h } from '@skatejs/val';

const Elem = define(
  class extends withComponent() {
    static is = name();
    static get props() {
      return {
        aB: { ...props.string, ...{ attribute: true } },
        cD: { ...props.string, ...{ attribute: true } }
      };
    }
    render({ aB, cD }) {
      return `
        <div>
          <p>${aB}</p>
          <p>${cD}</p>
        </div>
      `;
    }
  }
);

test('https://github.com/skatejs/skatejs/issues/1186', () => {
  const elem = mount(<Elem />);
  elem.node.setAttribute('a-b', 'test 1');
  elem.node.setAttribute('c-d', 'test 2');
  return elem.wait(() => {
    expect(elem.has(<p>test 1</p>)).toBe(true);
    expect(elem.has(<p>test 2</p>)).toBe(true);
  });
});

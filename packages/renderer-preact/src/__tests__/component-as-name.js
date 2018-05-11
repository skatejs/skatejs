/** @jsx h */

import { h } from 'preact';
import { withComponent } from 'skatejs';
import withRenderer from '..';

class Comp1 extends withComponent(withRenderer()) {
  render() {
    return (
      <div>
        Hello,{' '}
        <Comp2>
          <slot />
        </Comp2>!
      </div>
    );
  }
}

class Comp2 extends withComponent(withRenderer()) {
  render() {
    return (
      <b>
        <slot />
      </b>
    );
  }
}

test('component as tag name / auto-defining', done => {
  const comp1 = new Comp1();
  document.body.appendChild(comp1);
  setTimeout(() => {
    const comp2 = comp1.shadowRoot.children[0].children[0];
    expect(comp2.nodeName).toMatch(new RegExp('^x-comp2'));
    done();
  });
});

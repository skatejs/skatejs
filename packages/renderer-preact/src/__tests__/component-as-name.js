/** @jsx h */

import { h } from 'preact';
import { withComponent } from 'skatejs';
import withRenderer from '..';

class MainComp extends withComponent(withRenderer()) {
  render() {
    return (
      <div>
        Hello,{' '}
        <ChildComp>
          <slot />
        </ChildComp>
        <ChildComp />
      </div>
    );
  }
}

class ChildComp extends withComponent(withRenderer()) {
  render() {
    return (
      <b>
        <slot />
      </b>
    );
  }
}

test('component as tag name / auto-defining', done => {
  const mainComp = new MainComp();
  document.body.appendChild(mainComp);
  setTimeout(() => {
    const childComp1 = mainComp.shadowRoot.children[0].children[0];
    expect(childComp1.nodeName).toMatch(new RegExp('^child-comp'));
    const childComp2 = mainComp.shadowRoot.children[0].children[1];
    expect(childComp2.nodeName).toBe(childComp1.nodeName);
    done();
  });
});

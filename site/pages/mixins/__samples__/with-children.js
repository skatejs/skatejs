import { withChildren } from '../../../../src';

class WithChildren extends withChildren() {
  childrenDidUpdate() {
    const len = this.children.length;
    this.attachShadow({
      mode: 'open'
    }).innerHTML = `This element has ${len} ${len === 1
      ? 'child'
      : 'children'}!`;
  }
}

customElements.define('with-children', WithChildren);

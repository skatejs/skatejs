import { withComponent } from 'skatejs';

class WithChildren extends withComponent() {
  props = {
    children: null
  };
  render() {
    const len = this.children.length;
    return `This element has ${len} ${len === 1 ? 'child' : 'children'}!`;
  }
}

customElements.define('with-children2', WithChildren);

import Element from '@skatejs/element';

class ElementDefault extends Element {
  static props = {
    name: String
  };
  name = 'World';
  render() {
    return `Hello, ${this.name}!`;
  }
}

customElements.define('element-default', ElementDefault);

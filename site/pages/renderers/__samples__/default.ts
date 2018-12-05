import Component from '@skatejs/component';

class RendererDefault extends Component {
  static props = {
    name: String
  };
  name = 'World';
  render() {
    return `Hello, ${this.name}!`;
  }
}

customElements.define('renderer-default', RendererDefault);

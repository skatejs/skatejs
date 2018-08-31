import Component from 'skatejs';

class RendererDefault extends Component {
  name: string = 'World';
  render() {
    return `Hello, ${this.name}!`;
  }
}

customElements.define('renderer-default', RendererDefault);

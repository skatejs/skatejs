import Component from '@skatejs/component';
import { render } from 'react-dom';

export default class extends Component {
  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    render(null, this.renderRoot);
  }
  renderer() {
    render(this.render(), this.renderRoot);
  }
}

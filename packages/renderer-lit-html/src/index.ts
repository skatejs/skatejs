import Component from '@skatejs/component';
import { render } from 'lit-html';

export default class extends Component {
  renderer() {
    return render(this.render(), this.renderRoot);
  }
}

export { html } from 'lit-html';

import { CustomElement } from '@skatejs/component';
import { render } from 'react-dom';

export default function(elem: CustomElement) {
  render(elem.isConnected ? elem.render() : null, elem.renderRoot);
}

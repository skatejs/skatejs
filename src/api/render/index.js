import html from './html';
import registry from '../../global/registry';

function render (elem) {
  registry.find(elem).forEach(component => component.render && component.render(elem));
}

render.html = html;

export default render;

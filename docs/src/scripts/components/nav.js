import skate from '../../../../src/skate';
import template from 'skatejs-template-html';

export default skate('skate-nav', {
  template: template(`
    <nav>
      <content select="skate-item"></content>
    </nav>
  `)
});

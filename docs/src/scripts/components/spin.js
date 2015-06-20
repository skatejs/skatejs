import Icon from './icon';
import skate from '../../../../src/index';

export default skate('fa-spin', class extends Icon {
  static created () {
    super.created();
    this.className += 'fa-spin';
    this.type = 'circle-o-notch';
  }
});

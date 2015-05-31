import Classname from './classname';

export default class extends Classname {
  constructor (opts) {
    super(opts);
    this.value = opts.value || 'left';
  }
}

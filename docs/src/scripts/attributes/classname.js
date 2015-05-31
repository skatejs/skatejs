import Attr from './attr';

export default class extends Attr {
  constructor (opts) {
    super();
    this.prefix = opts.prefix || '';
    this.selector = opts.selector;
    this.suffix = opts.suffix || '';
  }

  'created updated' (elem, diff) {
    this._classManip(elem, 'add', diff.newValue);
  }

  'updated removed' (elem, diff) {
    this._classManip(elem, 'remove', diff.oldValue);
  }

  _classManip (elem, name, value) {
    super.find(elem, this.selector).forEach(item =>
      item.classList[name](this._wrap(value)));
  }

  _wrap (value) {
    return this.prefix + value + this.suffix;
  }
}

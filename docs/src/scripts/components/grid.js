import skate from '../../../../src/index';

const GRID_SIZE = 12;

export default skate('skate-grid', {
  created () {
    this.className += ' row';
  },
  properties: {
    type: {
      attr: true,
      set () { this.init(); },
      value: 'md'
    }
  },
  prototype: {
    init () {
      skate.ready(() => {
        var items = [].slice.call(this.children);
        var multiple = GRID_SIZE / items.length;
        items.forEach(item => item.className = `col-${this.type}-${multiple}`);
      });
    }
  }
});

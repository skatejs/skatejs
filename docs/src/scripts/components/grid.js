import skate from '../../../../src/index';

const GRID_SIZE = 12;

function sum (nums) {
  return nums.length ? nums.reduce((prev, curr) => prev + curr) : 0;
}

export default skate('sk-grid', {
  created () {
    this.className += ' row';
  },
  properties: {
    fixed: {
      attr: true,
      init: '',
      set () { this.init(); }
    },
    type: {
      attr: true,
      init: 'md',
      set () { this.init(); }
    }
  },
  prototype: {
    init () {
      var items = [].slice.call(this.children);
      var fixed = (this.fixed || '').split(' ').filter(Boolean).map(Number);
      var multiple = (GRID_SIZE - sum(fixed)) / (items.length - fixed.length);
      items.forEach((item, index) => {
        let size = fixed[index] || multiple;
        item.className = `col-${this.type}-${size}`;
      });
    }
  }
});

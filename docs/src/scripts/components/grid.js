import skate from '../../../../src/index';

function init () {
  var items = [].slice.call(this.children);
  var fixed = (this.fixed || '').split(' ').filter(Boolean).map(Number);
  var multiple = (this.size - sum(fixed)) / (items.length - fixed.length);
  items.forEach((item, index) => {
    let size = fixed[index] || multiple;
    item.className = `col-${this.type}-${size}`;
  });
}

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
      set: init
    },
    size: {
      attr: true,
      init: 12,
      type: Number,
      set: init
    },
    type: {
      attr: true,
      init: 'md',
      set: init
    }
  }
});

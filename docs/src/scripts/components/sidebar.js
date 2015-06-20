import skate from '../../../../src/index';

function windowEvents (evts = {}, func = function(){}) {
  if (typeof evts === 'string') {
    evts = { [evts]: func };
  }

  return function () {
    Object.keys(evts).forEach(name => {
      let func = skate.chain(evts[name]).bind(this);
      this.constructor.attached = skate.chain(
        this.constructor.attached,
        () => window.addEventListener(name, func)
      );
      this.constructor.detached = skate.chain(
        this.constructor.detached,
        () => window.removeEventListener(name, func)
      );
    });
  };
}

export default skate('sk-sidebar', {
  created: windowEvents('resize', 'init'),
  attached: skate.chain('init'),
  prototype: {
    init () {
      var parent = this.parentNode;
      this.style.height = parent.offsetHeight + 'px';
    }
  }
});

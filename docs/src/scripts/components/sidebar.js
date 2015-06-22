import skate from '../../../../src/index';

export default skate('sk-sidebar', {
  created () {
    this.resizeHandler = this.resizeHandler.bind(this);
    this.style.position = 'fixed';
  },
  attached () {
    window.addEventListener('resize', this.resizeHandler);
    skate.ready(this.resizeHandler);
    this.selectCurrentItem();
  },
  detached () {
    window.removeEventListener('resize', this.resizeHandler);
  },
  events: {
    'click a' () {
      setTimeout(() => this.selectCurrentItem());
    }
  },
  prototype: {
    resizeHandler () {
      var offsetHeight = window.innerHeight;
      var offsetWidth = this.parentNode.offsetWidth;
      var offsetLeft = this.offsetLeft;
      var offsetTop = this.parentNode.offsetTop;

      this.style.height = (offsetHeight - offsetTop - offsetLeft) + 'px';
      this.style.width = (offsetWidth - offsetLeft) + 'px';
    },
    selectCurrentItem () {
      var loc = window.location;
      var cur = this.querySelector('a[selected]');
      var item = this.querySelector(`a[href$="${loc.pathname}${loc.hash}"]`);
      cur && cur.removeAttribute('selected');
      item && item.setAttribute('selected', '');
    }
  }
});

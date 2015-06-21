import skate from '../../../../src/index';

export default skate('sk-sidebar', {
  created () {
    this.resizeHandler = this.resizeHandler.bind(this);
    this.style.position = 'fixed';
  },
  attached () {
    window.addEventListener('resize', this.resizeHandler);
    skate.ready(this.resizeHandler);
  },
  detached () {
    window.removeEventListener('resize', this.resizeHandler);
  },
  prototype: {
    resizeHandler () {
      var offsetHeight = this.parentNode.offsetHeight;
      var offsetWidth = this.parentNode.offsetWidth;
      var offsetLeft = this.offsetLeft;
      var offsetTop = this.parentNode.offsetTop;

      if (this.offsetHeight < offsetHeight) {
        this.style.height = (offsetHeight - offsetTop - offsetLeft) + 'px';
      }

      if (this.offsetWidth < offsetWidth) {
        this.style.width = (offsetWidth - offsetLeft) + 'px';
      }
    }
  }
});

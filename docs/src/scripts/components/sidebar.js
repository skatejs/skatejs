import skate from '../../../../src/index';

export default skate('sk-sidebar', {
  created () {
    this.resizeHandler = this.resizeHandler.bind(this);
    this.scrollHandler = this.scrollHandler.bind(this);
    this.style.position = 'fixed';
  },
  attached () {
    window.addEventListener('resize', this.resizeHandler);
    window.addEventListener('scroll', this.scrollHandler);
    skate.ready(this.resizeHandler);
    skate.ready(this.scrollHandler);
    this.selectCurrentItem();
  },
  detached () {
    window.removeEventListener('resize', this.resizeHandler);
    window.removeEventListener('scroll', this.scrollHandler);
  },
  events: {
    'click a' () {
      setTimeout(() => this.selectCurrentItem());
    }
  },
  properties: {
    headings: {
      get () {
        return [].slice.call(
          this.querySelectorAll('a[href*="#"]')
        ).map(item => {
          var hash = item.href.split('#')[1];
          return {
            anchor: item,
            heading: document.getElementById(hash)
          };
        }).filter(item => {
          return item.heading;
        });
      }
    },
    footer: {
      set () {},
      value: function () {
        return document.querySelector('footer');
      }
    }
  },
  prototype: {
    resizeHandler () {
      var offsetHeight = window.innerHeight;
      var offsetWidth = this.parentNode.offsetWidth;
      var offsetLeft = this.offsetLeft;
      var offsetTop = this.parentNode.offsetTop;
      var windowBottom = window.scrollY + offsetHeight;
      var calculatedHeight = offsetHeight - offsetTop - offsetLeft;
      var visibleFooterHeight = windowBottom - this.footer.offsetTop;

      // If the footer is visible, then subtract its visible height from the sidebar.
      if (visibleFooterHeight > 0) {
        calculatedHeight -= visibleFooterHeight;
      }

      this.style.height = calculatedHeight + 'px';
      this.style.width = (offsetWidth - offsetLeft) + 'px';
    },
    scrollHandler () {
      this.resizeHandler();

      // This could be optimised to use .some() and go backward.
      // Could also optimise the property to cache the items.
      this.headings.every(item => {
        var wTop = window.scrollY;
        var wBot = wTop + window.innerHeight;
        var hTop = item.heading.offsetTop;

        if (hTop < wBot) {
          this.select(item.anchor);
          return true;
        }
      });
    },
    select (anchor) {
      var cur = this.querySelector('a[selected]');
      cur && cur.removeAttribute('selected');
      anchor && anchor.setAttribute('selected', '');

      var hasSelected = this.querySelectorAll('[has-selected]');
      for (let a = 0; a < hasSelected.length; a++) {
        hasSelected[a].removeAttribute('has-selected');
      }

      var parent = anchor && anchor.parentNode;
      while (parent && parent !== this) {
        parent.setAttribute('has-selected', '');
        parent = parent.parentNode;
      }
    },
    selectCurrentItem () {
      var loc = window.location;
      var sel = this.querySelectorAll(`a[href$="${loc.pathname}${loc.hash}"]`);
      this.select(sel[sel.length - 1]);
    }
  }
});

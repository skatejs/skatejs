import shade from '../../../../node_modules/shadejs/src/index';
import skate from '../../../../src/index';

class Attr {
  find (elem, selector) {
    return selector ? [].slice.call(elem.querySelectorAll(selector)) : [elem];
  }
}

class AttrClassname extends Attr {
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

class AttrPosition extends AttrClassname {
  constructor (opts) {
    super(opts);
    this.value = 'left';
  }
}

skate('skate-navbar-brand', {
  template: shade(`
    <a class="navbar-brand" href="#"><content name="textContent">Brand</content></a>
  `)
});

skate('skate-navbar-form', {
  attributes: {
    position: new AttrPosition({ prefix: 'navbar-' })
  },
  template: shade(`
    <form class="navbar-form navbar-left" role="search">
      <div class="form-group">
        <content name="field">
          <input type="text" class="form-control" placeholder="Search">
        </content>
      </div>
      <content name="button" select="button">
        <button type="submit" class="btn btn-default">Submit</button>
      </content>
    </form>
  `)
});

skate('skate-navbar-header', {
  template: shade(`
    <div class="navbar-header">
      <content name="brand" select="skate-navbar-brand">
        <skate-navbar-brand></skate-navbar-brand>
      </content>
      <content name="toggle" select="skate-navbar-toggle">
        <skate-navbar-toggle></skate-navbar-toggle>
      </content>
    </div>
  `)
});

skate('skate-navbar-nav', {
  attributes: {
    position: new AttrPosition({ prefix: 'navbar-' })
  },
  template: shade(`
    <ul class="nav navbar-nav">
      <content name="items" select="a" wrap="li" multiple></content>
    </ul>
  `)
});

skate('skate-navbar-toggle', {
  template: shade(`
    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
      <span class="sr-only"><content name="textContent">Toggle navigation</content></span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
    </button>
  `)
});

skate('skate-navbar', {
  attributes: {
    brand: function (elem, diff) {
      elem.header.brand.textContent = diff.newValue;
    }
  },
  template: shade(`
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <content name="header" select="skate-navbar-header">
          <skate-navbar-header></skate-navbar-header>
        </content>
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <content name="content">
            <skate-navbar-nav>
              <a href="#">Home</a>
            </skate-navbar-nav>
          </content>
        </div>
      </div>
    </nav>
  `)
});

import helperElement from '../../lib/element';
import skate from '../../../src/index';

describe('lifecycle/template', function () {
  var tag;

  beforeEach(function () {
    tag = helperElement();
    skate(tag.safe, {
      template: function () {
        this.innerHTML = 'templated';
      }
    });
  });

  it('should template', function () {
    var el = tag.create();
    expect(el.textContent).to.equal('templated');
  });

  it('should not template if the element has the "resolved" attribute', function () {
    var el = skate.create(`<${tag.safe} resolved>original</${tag.safe}>`);
    expect(el.textContent).to.equal('original');
  });
});

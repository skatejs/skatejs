import element from '../../lib/element';
import resolved from '../../lib/resolved';
import skate from '../../../src/index';
import typeAttribute from 'skatejs-type-attribute';

describe('api/fragment', function () {
  var tagName;

  beforeEach(function () {
    tagName = element().safe;
  });

  it('should return an empty fragment if no argument specified', function () {
    var frag = skate.fragment();
    expect(frag instanceof DocumentFragment).to.equal(true);
    expect(frag.childNodes.length).to.equal(0);
  });

  describe('overriden methods', function () {
    var frag;
    var el1;
    var el2;
    beforeEach(function () {
      skate(tagName, {});
      frag = skate.fragment();
      el1 = document.createElement(tagName);
      el2 = document.createElement(tagName);
    });

    it('should init elements added via appendChild', function () {
      frag.appendChild(el1);
      expect(frag.childNodes.length).to.equal(1);
      expect(resolved(el1)).to.equal(true);
    });

    it('should init elements added via insertBefore', function () {
      frag.appendChild(el1);
      frag.insertBefore(el2, el1);
      expect(frag.childNodes.length).to.equal(2);
      expect(resolved(el2)).to.equal(true);
    });

    it('should init elements added via replaceChild', function () {
      frag.appendChild(el1);
      frag.replaceChild(el2, el1);
      expect(frag.childNodes.length).to.equal(1);
      expect(resolved(el2)).to.equal(true);
    });

    it('should return an empty fragment if shallow cloning', function () {
      var clone = frag.cloneNode(false);
      expect(clone.childNodes.length).to.equal(0);
    });

    it('should init cloned elements if deep cloning', function () {
      tagName = element().safe;
      var created = 0;
      skate(tagName, {
        created: function () {
          // Can't use the "resolved" attr in assertions about the clone since cloning will copy
          // the attr but not init the cloned element's lifecycle.
          created++;
        }
      });

      var html = `<${tagName}></${tagName}>`;
      var clone = skate.fragment(html).cloneNode(true);
      expect(clone.childNodes.length).to.equal(1);
      expect(created).to.equal(2);
    });

    it('should init elements added after cloning', function () {
      var clone = frag.cloneNode(false);
      clone.appendChild(el1);
      expect(clone.childNodes.length).to.equal(1);
      expect(resolved(clone.childNodes[0])).to.equal(true);
    })
  });

  describe('html', function () {
    it('should not init an element without a definition', function () {
      var html = `<${tagName}></${tagName}>`;
      var frag = skate.fragment(html);
      expect(resolved(frag.childNodes[0])).to.equal(false);
    });

    it('should init a single element', function () {
      skate(tagName, {});
      var html = `<${tagName}></${tagName}>`;
      var frag = skate.fragment(html);
      expect(resolved(frag.childNodes[0])).to.equal(true);
    });

    it('should init multiple elements', function () {
      skate(tagName, {});
      var html = `<${tagName}></${tagName}>`;
      var frag = skate.fragment(html + html);
      expect(frag.childNodes.length).to.equal(2);
      expect(resolved(frag.childNodes[0])).to.equal(true);
      expect(resolved(frag.childNodes[1])).to.equal(true);
    });

    it('should init an element and its descendents', function () {
      var descendantTagName = element().safe;
      skate(tagName, {});
      skate(descendantTagName, { type: typeAttribute });

      var html = `<${tagName}><div ${descendantTagName}></div></${tagName}>`;
      var frag = skate.fragment(html);
      expect(resolved(frag.childNodes[0])).to.equal(true, 'host');
      expect(resolved(frag.childNodes[0].firstElementChild)).to.equal(true, 'descendent');
    });

    it('should work with special tags', function () {
      var html = '<td></td><td></td>';
      var frag = skate.fragment(html);
      expect(frag.childNodes.length).to.equal(2);
      expect(frag.childNodes[0].tagName).to.equal('TD');
      expect(frag.childNodes[1].tagName).to.equal('TD');
    });
  });
});

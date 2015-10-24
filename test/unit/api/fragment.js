import element from '../../lib/element';
import resolved from '../../lib/resolved';
import skate from '../../../src/index';
import { attribute as typeAttribute } from 'skatejs-types';

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

    it('should work with normal tags', function () {
      const html = '<form><input></form>';
      const frag = skate.fragment(html);
      expect(frag.childNodes[0].tagName).to.equal('FORM');
      expect(frag.childNodes[0].childNodes[0].tagName).to.equal('INPUT');
    });

    it('should treat as html even if it starts with text', function () {
      const html = 'test<form><input></form>';
      const frag = skate.fragment(html);
      expect(frag.childNodes[0].textContent).to.equal('test');
      expect(frag.childNodes[1].tagName).to.equal('FORM');
      expect(frag.childNodes[1].childNodes[0].tagName).to.equal('INPUT');
    });
  });

  describe('text', function () {
    it('works with text that has no parent element', function () {
      const text = 'some text';
      const frag = skate.fragment(text);
      expect(frag.childNodes[0].textContent).to.equal('some text');
    });
  });

  describe('node', function () {
    it('should work with element nodes', function () {
      const node = document.createElement('div');
      const frag = skate.fragment(node);
      expect(frag.childNodes[0]).to.equal(node);
    });

    it('should work with text nodes', function () {
      const node = document.createTextNode('');
      const frag = skate.fragment(node);
      expect(frag.childNodes[0]).to.equal(node);
    });

    it('should work with comment nodes', function () {
      const node = document.createComment('');
      const frag = skate.fragment(node);
      expect(frag.childNodes[0]).to.equal(node);
    });

    it('should work with document fragments', function () {
      const frag = document.createDocumentFragment();
      const elem = document.createElement('div');
      frag.appendChild(elem);
      expect(skate.fragment(frag).childNodes[0]).to.equal(elem);
    });

    it('should initialise element nodes that are custom elements', function () {
      const elem = skate(element().safe, {});
      const node = document.createElement(elem.id);
      const frag = skate.fragment(node);
      expect(frag.childNodes[0]).to.equal(node);
      expect(resolved(frag.childNodes[0])).to.equal(true);
    });
  });
});

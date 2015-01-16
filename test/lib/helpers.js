'use strict';

var tagNameCounter = 1;

export default {
  /**
   * Generate a unique tag name to avoid errors due to re-registering a tag
   * name.
   *
   * Returns an object that can be looked up using the provided id to obtain
   * a unique tag name to use with skate() and fixture().
   *
   * @param id the identifier for the tag
   * @returns {Object.<string, string>} an object with the key 'id' mapped to
   *   the value of the id and the value of the id mapped to a unique tag name
   */
  uniqueTagName: function (id) {
    var safeId = id + '-' + (tagNameCounter++).toString();
    var tagName = {id: id};
    tagName[id] = safeId;
    return tagName;
  },

  add: function (name, tagName) {
    var safeTagName = typeof tagName === 'undefined' ? name : tagName[name];
    return this.fixture('<' + safeTagName + '></' + safeTagName + '>').querySelector(safeTagName);
  },

  remove: function (element) {
    element.parentNode.removeChild(element);
    return element;
  },

  fixture: function (html, tagName) {
    var fixture = document.getElementById('fixture');
    if (!fixture) {
      fixture = document.createElement('div');
      fixture.id = 'fixture';
      document.body.appendChild(fixture);
    }

    if (arguments.length) {
      fixture.innerHTML = '';

      if (typeof html === 'string') {
        if (typeof tagName !== 'undefined') {
          var unsafeTagName = tagName.id;
          var openTagRegex = new RegExp('<' + unsafeTagName + '\\b', 'g');
          var closeTagRegex = new RegExp('</' + unsafeTagName + '>', 'g');

          html = html
            .replace(openTagRegex, '<' + tagName[unsafeTagName])
            .replace(closeTagRegex, '</' + tagName[unsafeTagName] + '>');
        }

        fixture.innerHTML = html;
      } else if (typeof html === 'object') {
        fixture.appendChild(html);
      }
    }

    return fixture;
  },

  afterMutations: function (callback) {
    setTimeout(callback, 1);
  },

  dispatchEvent: function (name, element) {
    var e = document.createEvent('CustomEvent');
    e.initCustomEvent(name, true, true, {});
    element.dispatchEvent(e);
  }
};

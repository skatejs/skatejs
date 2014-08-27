define(function () {
  'use strict';

  return {
    add: function (name) {
      return this.fixture('<' + name + '></' + name + '>').querySelector(name);
    },

    remove: function (element) {
      element.parentNode.removeChild(element);
      return element;
    },

    fixture: function (html) {
      var fixture = document.getElementById('fixture');

      if (!fixture) {
        fixture = document.createElement('div');
        fixture.id = 'fixture';
        document.body.appendChild(fixture);
      }

      if (typeof html === 'string') {
        fixture.innerHTML = html;
      }

      return fixture;
    },

    dispatchEvent: function (name, element) {
      var e = document.createEvent('CustomEvent');
      e.initCustomEvent(name, true, true, {});
      element.dispatchEvent(e);
    }
  };
});

skate('x-append-button', {
  template: '<button data-skate-content></button>',
  events: {
    'click button': function (element, e) {
      document.getElementById(element.getAttribute('to')).appendChild(newTestElement(container.children.length + 1));
    }
  }
});

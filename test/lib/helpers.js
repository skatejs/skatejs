export function add (name) {
  return fixture('<' + name + '></' + name + '>').querySelector(name);
};

export function remove (element) {
  element.parentNode.removeChild(element);
  return element;
};

export function fixture (html) {
  var fixture = document.getElementById('fixture');

  if (!fixture) {
    fixture = document.createElement('div');
    fixture.id = 'fixture';
    document.body.appendChild(fixture);
  }

  if (arguments.length) {
    fixture.innerHTML = '';

    if (typeof html === 'string') {
      fixture.innerHTML = html;
    } else if (typeof html === 'object') {
      fixture.appendChild(html);
    }
  }

  return fixture;
};

export function afterMutations (callback) {
  setTimeout(callback, 1);
};

export function dispatchEvent (name, element) {
  var e = document.createEvent('CustomEvent');
  e.initCustomEvent(name, true, true, {});
  element.dispatchEvent(e);
};

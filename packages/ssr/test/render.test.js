require('./_');

const render = require('..');

function dom(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.firstElementChild;
}

class Hello extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' }).appendChild(
      dom(`
        <span>
          Hello,
          <x-yell>
            <slot></slot>
          </x-yell>!
          <x-yell>!</x-yell>
        </span>
      `)
    );
  }
}
class Yell extends HTMLElement {
  connectedCallback() {
    Promise.resolve().then(() => {
      this.attachShadow({ mode: 'open' }).innerHTML = `
        <style>.test1,.test2 { font-weight: bold; }</style>
        <span class="test1"><slot></slot></span>
      `;
    });
  }
}
customElements.define('x-hello', Hello);
customElements.define('x-yell', Yell);

test('serialization: should call the connected callback', () => {
  const node = new CustomElement();
  return render(node).then(() => {
    expect(node.connectedCallback.mock.calls.length).toEqual(1);
  });
});

test('serialization: should disconnect it after serialising', () => {
  const node = new CustomElement();
  return render(node).then(() => {
    expect(node.disconnectedCallback.mock.calls.length).toEqual(1);
  });
});

test('rendering: node', () => {
  const hello = new Hello();
  hello.appendChild(document.createTextNode('World'));
  return render(hello).then(r => {
    expect(r).toMatchSnapshot();
  });
});

test('rendering: document', () => {
  const hello = new Hello();
  hello.appendChild(document.createTextNode('World'));
  document.body.innerHTML = '';
  document.head.innerHTML = '';
  document.body.appendChild(hello);
  return render(document).then(r => {
    document.body.removeChild(hello);
    expect(r).toMatchSnapshot();
  });
});

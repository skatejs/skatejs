if (typeof HTMLElement === 'undefined') {
  // @ts-ignore
  HTMLElement = class {};
}

export default class Shadow extends HTMLElement {
  get parentElementRoot() {
    const { parentElement } = this;
    return parentElement ? parentElement.shadowRoot : null;
  }
  get childNodes() {
    const root = this.parentElementRoot;
    return root ? root.childNodes : super.childNodes;
  }
  get children() {
    const root = this.parentElementRoot;
    return root ? root.children : super.children;
  }
  get innerHTML() {
    const root = this.parentElementRoot;
    return root ? root.innerHTML : super.innerHTML;
  }
  set innerHTML(html) {
    const root = this.parentElementRoot;
    if (root) {
      root.innerHTML = html;
    } else {
      super.innerHTML = html;
    }
  }
  get textContent() {
    const root = this.parentElementRoot;
    return root ? root.textContent : super.textContent;
  }
  set textContent(text) {
    const root = this.parentElementRoot;
    if (root) {
      root.textContent = text;
    } else {
      super.textContent = text;
    }
  }
  appendChild<T extends Node>(node: T): T {
    const root = this.parentElementRoot;
    return root ? root.appendChild(node) : super.appendChild(node);
  }
  insertBefore<T extends Node>(node: T, referenceNode: Node): T {
    const root = this.parentElementRoot;
    return root
      ? root.insertBefore(node, referenceNode)
      : super.insertBefore(node, referenceNode);
  }
  removeChild<T extends Node>(node: T): T {
    const root = this.parentElementRoot;
    return root ? root.removeChild(node) : super.removeChild(node);
  }
  replaceChild<T extends Node>(node: Node, referenceNode: T): T {
    const root = this.parentElementRoot;
    return root
      ? root.replaceChild(node, referenceNode)
      : super.replaceChild(node, referenceNode);
  }
  connectedCallback() {
    const { parentElement } = this;

    // Ensure it doesn't take up any space.
    this.style.display = 'contents';

    // Errors happen if you attach multiple shadow roots. This also allows
    // detachment and reattachment.
    if (parentElement && !parentElement.shadowRoot) {
      parentElement.attachShadow({ mode: 'open' });
    }

    const { parentElementRoot } = this;

    Array.from(super.childNodes).forEach(node => {
      parentElementRoot.appendChild(node as Node);
    });

    // We could use querySelectorAll(), but undom and skatejs/ssr don't
    // implement it yet.
    const walker = document.createTreeWalker(parentElementRoot);
    while (walker.currentNode) {
      const { currentNode } = walker;
      if (currentNode instanceof HTMLSlotElement) {
        if (currentNode.hasAttribute('default')) {
          currentNode.removeAttribute('default');
        }
        while (currentNode.hasChildNodes()) {
          parentElement.appendChild(currentNode.firstChild);
        }
      }
      walker.nextNode();
    }
  }
}

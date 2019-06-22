// On the server, we have to create a dummy HTMLElement so we don't get
// any errors. We don't need any of the core functionality.
if (typeof HTMLElement === "undefined") {
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
    this.style.display = "contents";

    // Errors happen if you attach multiple shadow roots, so we must guard
    // against that. This also allows detachment and reattachment.
    if (parentElement && !parentElement.shadowRoot) {
      parentElement.attachShadow({ mode: "open" });
    }

    const { parentElementRoot } = this;

    // This takes all the content in the declared shadow root, and puts
    // them in the real shadow root. This is rehydration on the client.
    Array.from(super.childNodes).forEach(node => {
      parentElementRoot.appendChild(node as Node);
    });

    // We could use querySelectorAll(), but undom and skatejs/ssr don't
    // implement it yet.
    const walker = document.createTreeWalker(parentElementRoot);
    while (walker.currentNode) {
      const { currentNode } = walker;

      // We only need to reverse-engineer slotted content.
      if (currentNode instanceof HTMLSlotElement) {
        // The "default" attribute is non-standard but we need a way to
        // declare if the slot's content is the default state or not. If
        // it has the "default" attribute, we leave content in the slot
        // alone. If not, we move the content into the parent element so
        // it gets native slotting.
        if (currentNode.hasAttribute("default")) {
          currentNode.removeAttribute("default");
        } else {
          while (currentNode.hasChildNodes()) {
            parentElement.appendChild(currentNode.firstChild);
          }
        }
      }

      walker.nextNode();
    }
  }
}

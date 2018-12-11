import eventMap from './util/event-map';
import nodeMap from './util/node-map';
import root from './util/root';

// @ts-ignore
const { Node } = root;

function createElement(node) {
  const { attributes, childNodes, events, properties } = node;
  const realNode = document.createElement(node.localName);
  const eventHandlers = eventMap(realNode);

  if (attributes) {
    for (let name in attributes) {
      realNode.setAttribute(name, attributes[name]);
    }
  }

  if (childNodes) {
    childNodes.forEach(ch => realNode.appendChild(render(ch)));
  }

  if (events) {
    for (let name in events) {
      realNode.addEventListener(name, (eventHandlers[name] = events[name]));
    }
  }

  if (properties) {
    for (let name in properties) {
      realNode[name] = properties[name];
    }
  }

  return realNode;
}

function createText(el) {
  return document.createTextNode(el.textContent);
}

export default function render(node) {
  if (node instanceof Node) {
    return node;
  }
  if (Array.isArray(node)) {
    const frag = document.createDocumentFragment();
    node.forEach(item => frag.appendChild(render(item)));
    return frag;
  }
  const realNode = node.localName ? createElement(node) : createText(node);
  nodeMap[node.__id] = realNode;
  return realNode;
}

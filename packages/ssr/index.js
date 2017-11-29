const { walk } = require('./register/util');

const shadowRootScript = `<script>function __ssr(){var s=document.currentScript,r=s.previousElementSibling,h=r.parentNode;h.removeChild(s);h.removeChild(r);r.parentNode.attachShadow({mode:f.getAttribute('mode')||'open'}).innerHTML=r.innerHTML;}</script>`;
const shadowRootScriptCall = `<script>__ssr()</script>`;

const defaultResolver = node => yup => setTimeout(() => yup(node));

function stringify(node) {
  let str = '';

  if (node.nodeName === '#document') {
    node = node.documentElement;
    str += '<!doctype html>';
  }

  if (node.nodeName === '#text') {
    return node.textContent;
  }

  str += `<${node.localName}${(node.attributes || [])
    .map(a => ` ${a.name}="${a.value}"`)
    .join('')}>`;

  if (node.nodeName === 'BODY') {
    str += shadowRootScript;
  }

  if (node.shadowRoot) {
    str += `<shadowroot>${node.shadowRoot.childNodes
      .map(stringify)
      .join('')}</shadowroot>${shadowRootScriptCall}`;
  }

  if (node.childNodes) {
    str += node.childNodes.map(stringify).join('');
  }

  str += `</${node.localName}>`;

  return str;
}

module.exports = (node = document, resolver = defaultResolver) => {
  node.connectedCallback && node.connectedCallback();
  return new Promise(resolver(node)).then(root => {
    const str = stringify(root);
    root.disconnectedCallback && root.disconnectedCallback();
    return str;
  });
};

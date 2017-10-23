// Special thanks to Jason Miller (@_developit) for this idea.
// Link: https://jsfiddle.net/developit/vLzdhcg0/

import { h } from './component';
import { isBrowser } from './env';

const _mo = Symbol();
const _scopeExists = Symbol();
const _scopeName = Symbol();
const _scopes = Symbol();

const scopes = {};

function walk(root, call) {
  const chs = root.children;
  const chsLen = chs.length;
  call(root);
  for (let a = 0; a < chsLen; a++) {
    walk(chs[a], call);
  }
}

function getScopeName(css) {
  return (
    scopes[css] ||
    (scopes[css] = Math.random()
      .toString(36)
      .substring(2, 8))
  );
}

function scopeHost(host, scopeNames) {
  scopeNames.forEach(scopeName => host.setAttribute(`host-${scopeName}`, ''));
}

function scopeSlot(node, scopeNames) {
  if (node.nodeName === 'SLOT') {
    scopeNames.forEach(scopeName => node.setAttribute(`slot-${scopeName}`, ''));
  }
}

export function scopeCss(host, css) {
  if (isBrowser) {
    return css;
  }

  css = '' + css;
  const scopeName = getScopeName(css);
  const hostSelector = `[host-${scopeName}]`;
  const slotSelector = `[slot-${scopeName}]`;
  return css
    .replace(/:host/g, hostSelector)
    .replace(/::slotted\(([^)]+)\)/g, slotSelector)
    .replace(/(\.[^{]+)/g, `${hostSelector} $1`);
}

export function scopeNode(host, css) {
  if (isBrowser) {
    return;
  }

  const scopeName = getScopeName(css);

  if (!host[_scopes]) {
    host[_scopes] = [];
  }

  if (host[_scopes].indexOf(scopeName) === -1) {
    host[_scopes].push(scopeName);
  }

  // Only add a single mutation observer to scope a shadow root.
  if (!host[_mo]) {
    host[_mo] = new MutationObserver(muts => {
      muts.addedNodes &&
        muts.addedNodes.forEach(node => scopeSlot(node, host[_scopes]));
    });
    host[_mo].observe(host.shadowRoot, {
      childList: true,
      subtree: true
    });
  }

  // Apply initial scoping.
  scopeHost(host, host[_scopes]);
  walk(host.shadowRoot, node => scopeSlot(node, host[_scopes]));
}

export function style(host, css) {
  // No host means global styles.
  if (!host.nodeType) {
    css = host;
    host = null;
  }

  // Simply return if running client side or dedupe head styles and only scope if not global if on the server.
  if (host && isBrowser) {
    return <style>{css}</style>;
  } else {
    const newStyle = document.createElement('style');
    newStyle.textContent = host ? scopeCss(host, css) : css;
    document.head.appendChild(newStyle);
  }

  // Only scope if there's a host.
  if (host) {
    scopeNode(host, css);
  }
}

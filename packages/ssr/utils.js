const { minify } = require('uglify-es');
const cache = {};

// Rehydrates the host element with a shadow root.
function rehydrate() {
  var script = document.currentScript;
  var fakeShadowRoot = script.parentNode;
  var host = fakeShadowRoot.parentNode;
  var move = function(from, to) {
    while (from && from.firstChild) {
      to.appendChild(from.firstChild);
    }
  };

  // This cleans up the resulting DOM but also seems to have a positive impact on performance.
  fakeShadowRoot.removeChild(script);

  // First thing we do is remove the fake shadow root so we can attach a shadow root safely.
  host.removeChild(fakeShadowRoot);

  // Create the real shadow root once we've cleaned up.
  var realShadowRoot = host.attachShadow({ mode: 'open' });

  // Then we can move stuff over from the fake root to the real one.
  move(fakeShadowRoot, realShadowRoot);

  // We must find the slots *after* the shadow root is hydrated so we don't get any unwanted ones.
  var slots = realShadowRoot.querySelectorAll('slot');

  // At each Shadow Root, we only care about its slots, not composed slots,
  // therefore we need to move the children of top level slots, but not others
  // Also can't 'move' in loop as that will mutate the DOM and ruin the
  // 'contains' checks for subsequent slots.
  var topLevelSlots = (function() {
    var top = [],
      ref;

    for (var i = 0, k = slots.length; i < k; i++) {
      var slot = slots[i];

      // Ref is last known top level slot, if current slot is contained by it,
      // then that slot is nested and can be ignored
      if (!(ref && ref.contains(slot))) {
        top.push(slot);
        ref = slot;
      }
    }

    return top;
  })();

  topLevelSlots.forEach(function(slot) {
    move(slot, host);
  });
}

// Replaces a script tag with the corresponding style tag.
function restyle() {
  var script = document.currentScript;
  var style = document.createElement('style');
  style.textContent = document.getElementById(
    script.getAttribute('data-style-id')
  ).textContent;
  script.parentNode.replaceChild(style, script);
}

const funcs = { rehydrate, restyle };
module.exports = function(func, name) {
  return (
    cache[func] ||
    (cache[func] = minify(funcs[func].toString()).code.replace(
      `function ${func}`,
      `function ${name}_${func}`
    ))
  );
};

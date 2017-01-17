import native from './native';
import root from './root';

const { MutationObserver } = root;

function microtaskDebounce (cbFunc) {
  let scheduled = false;
  let i = 0;
  let cbArgs = [];
  const elem = document.createElement('span');
  const observer = new MutationObserver(() => {
    cbFunc(...cbArgs);
    scheduled = false;
    cbArgs = null;
  });

  observer.observe(elem, { childList: true });

  return (...args) => {
    cbArgs = args;
    if (!scheduled) {
      scheduled = true;
      elem.textContent = `${i}`;
      i += 1;
    }
  };
}

// We have to use setTimeout() for IE9 and 10 because the Mutation Observer
// polyfill requires that the element be in the document to trigger Mutation
// Events. Mutation Events are also synchronous and thus wouldn't debounce.
//
// The soonest we can set the timeout for in IE is 1 as they have issues when
// setting to 0.
function taskDebounce (cbFunc) {
  let scheduled = false;
  let cbArgs = [];
  return (...args) => {
    cbArgs = args;
    if (!scheduled) {
      scheduled = true;
      setTimeout(() => {
        scheduled = false;
        cbFunc(...cbArgs);
      }, 1);
    }
  };
}
export default native(MutationObserver) ? microtaskDebounce : taskDebounce;

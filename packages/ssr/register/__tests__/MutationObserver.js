const { wait } = require('@skatejs/bore');
const MutationObserver = require('../dom/MutationObserver');

test('associates multiple records to a single parent', done => {
  const mo = new MutationObserver(r => {
    expect(r.length).toBe(1);
    expect(r[0].addedNodes.length).toBe(2);
    expect(r[0].addedNodes[0]).toBe(childNode1);
    expect(r[0].addedNodes[1]).toBe(childNode2);
    done();
  });
  const parentNode = document.createElement('div');
  const childNode1 = document.createElement('div');
  const childNode2 = document.createElement('div');
  mo.observe(parentNode, { childList: true });
  parentNode.appendChild(childNode1);
  parentNode.appendChild(childNode2);
});

const { Event } = require('./Event');
const { MutationRecord } = require('./MutationRecord');

function triggerMutation(
  mutationType,
  parentNode,
  childNode,
  attributeName = null,
  oldValue = null
) {
  const { previousSibling, nextSibling } = parentNode;
  if (parentNode && parentNode.dispatchEvent) {
    parentNode.dispatchEvent(
      new Event('__MutationObserver', {
        bubbles: true,
        mutationType,
        childNode,
        parentNode,
        previousSibling,
        nextSibling,
        attributeName,
        oldValue
      })
    );
  }
}

function promise(done) {
  let cancelled = false;
  Promise.resolve().then(() => {
    if (!cancelled) {
      done();
    }
  });
  return () => {
    cancelled = true;
  };
}

class MutationObserver {
  constructor(callback) {
    this._callback = callback;
    this._cancel = () => {};
    this._element = null;
    this._enqueue = this._enqueue.bind(this);
    this._records = new Map();
  }
  disconnect() {
    this._cleanup();
    this._element.removeEventListener('__MutationObserver', this._enqueue);
  }
  observe(element) {
    this._element = element;
    this._element.addEventListener('__MutationObserver', this._enqueue);
  }
  takeRecords() {
    const entries = this._records.entries();
    this._cleanup();
    return Array.from(entries).map(map => map[1]);
  }
  _cleanup() {
    this._cancel();
    this._records.clear();
  }
  _enqueue(e) {
    let record = this._records.get(e.parentNode);

    if (!record) {
      this._records.set(e.parentNode, (record = new MutationRecord()));
    }

    if (e.mutationType === 'add') {
      record.type = 'childList';
      record.target = e.parentNode;
      record.addedNodes.push(e.childNode);
    } else if (e.mutationType === 'remove') {
      record.type = 'childList';
      record.target = e.parentNode;
      record.removedNodes.push(e.childNode);
    } else if (e.mutationType === 'attribute') {
      record.type = 'attributes';
      record.target = e.parentNode;
      record.attributeName = e.attributeName;
      record.oldValue = e.oldvalue;
    } else if (e.mutationType === 'cdata') {
      record.type = 'characterData';
      record.oldValue = e.oldvalue;
    }

    this._cancel();
    this._cancel = promise(() => this._callback(this.takeRecords()));
  }
}

module.exports = {
  MutationObserver,
  MutationRecord,
  triggerMutation
};

import emit from '../../../src/api/emit';
import fixture from '../../lib/fixture';

describe('api/emit', () => {
  let child;
  let parent;
  let triggered;

  beforeEach(() => {
    child = document.createElement('child');
    parent = document.createElement('parent');
    parent.appendChild(child);

    triggered = 0;

    // All listeners should increment triggered.
    // Child should always prevent default.
    child.addEventListener('test', () => ++triggered);
    child.addEventListener('test', e => e.preventDefault());
    parent.addEventListener('test', () => ++triggered);

    // It's not spec'd whether or not detached elements should bubble. In some
    // they do, in some they don't. We ensure they do by adding the nodes to
    // the document.
    fixture(parent);
  });

  it('string eventName', () => {
    emit(parent, 'test');
    expect(triggered).to.equal(1);
  });

  it('undefined eventOptions', () => {
    const canceled = !emit(child, 'test');
    expect(triggered).to.equal(2);
    expect(canceled).to.equal(true);
  });

  it('{ bubbles: false } eventOptions', () => {
    const canceled = !emit(child, 'test', { bubbles: false });
    expect(triggered).to.equal(1);
    expect(canceled).to.equal(true);
  });

  it('{ cancelable: false } eventOptions', () => {
    const canceled = !emit(child, 'test', { cancelable: false });
    expect(triggered).to.equal(2);
    expect(canceled).to.equal(false);
  });

  it('stopPropagation()', () => {
    child.addEventListener('test', e => e.stopPropagation());
    parent.addEventListener('test', () => assert(false, 'propagation should have been stopped'));
    const canceled = !emit(child, 'test');
    expect(canceled).to.equal(true);
  });
});

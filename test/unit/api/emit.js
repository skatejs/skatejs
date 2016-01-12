import emit from '../../../src/api/emit';

describe('api/emit', function () {
  var child;
  var parent;
  var disabled;
  var triggered;

  beforeEach(function () {
    child = document.createElement('child');
    disabled = document.createElement('button');
    disabled.setAttribute('disabled', '');
    parent = document.createElement('parent');
    parent.appendChild(child);
    parent.appendChild(disabled);

    triggered = 0;

    child.addEventListener('test', () => ++triggered);
    child.addEventListener('test', e => e.preventDefault());
    parent.addEventListener('test', () => ++triggered);
    disabled.addEventListener('test', () => ++triggered);
  });

  it('string eventName', function () {
    emit(parent, 'test');
    expect(triggered).to.equal(1);
  });

  it('string eventName (space separated)', function () {
    emit(parent, 'test test');
    expect(triggered).to.equal(2);
  });

  it('array eventName', function () {
    emit(parent, [ 'test', 'test' ]);
    expect(triggered).to.equal(2);
  });

  it('disabled element', function () {
    emit(disabled, 'test');
    expect(triggered).to.equal(0);
  });

  it('{ bubbles: true } disabled element', function () {
    emit(disabled, 'test', {bubbles: true});
    expect(triggered).to.equal(0);
  });

  it('undefined eventOptions', function () {
    var canceled = emit(child, 'test');
    expect(triggered).to.equal(2);
    expect(canceled).to.have.length(1);
    expect(canceled).to.include('test');
  });

  it('{ bubbles: false } eventOptions', function () {
    var canceled = emit(child, 'test', { bubbles: false });
    expect(triggered).to.equal(1);
    expect(canceled).to.have.length(1);
    expect(canceled).to.include('test');
  });

  it('{ cancelable: false } eventOptions', function () {
    var canceled = emit(child, 'test', { cancelable: false });
    expect(triggered).to.equal(2);
    expect(canceled).to.have.length(0);
  });

  it('stopPropagation()', function () {
    child.addEventListener('test', e => e.stopPropagation());
    parent.addEventListener('test', () => assert(false, 'propagation should have been stopped'));
    emit(child, 'test');
  });
});

import emit from '../../../src/api/emit';
import fixture from '../../lib/fixture';

describe('api/emit', function () {
  var child;
  var parent;
  var triggered;

  beforeEach(function () {
    fixture('<div><span></span></div>');

    child = fixture().querySelector('span');
    parent = fixture().querySelector('div');

    triggered = 0;

    child.addEventListener('test', () => ++triggered);
    child.addEventListener('test', e => e.preventDefault());
    parent.addEventListener('test', () => ++triggered);
    parent.addEventListener('test', e => e.preventDefault());
  });

  describe('(targetElement, eventName, eventOptions)', function () {
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
  });

  describe('(eventName, eventOptions)', function () {
    it('undefined eventOptions', function () {

    });
  });
});

import { define } from '../../../src/index';
import fixture from '../../lib/fixture';
import afterMutations from '../../lib/after-mutations';

describe('lifecycle/defined', () => {
  it('should not already have the defined attribute on undefined elements', () => {
    expect(document.createElement('some-undefined-element').hasAttribute('defined')).to.equal(false);
  });

  it('should add the [defined] attribute when the element is upgraded', (done) => {
    const Elem = define('x-test', {});
    const elem = new Elem();

    // Sanity check for non-native (native would throw).
    expect(elem.hasAttribute('defined')).to.equal(false, 'should not have defined before attached');

    const fixtureArea = fixture();

    fixtureArea.appendChild(elem);
    afterMutations(() => {
      expect(elem.hasAttribute('defined')).to.equal(true);
      fixtureArea.removeChild(elem);
      done();
    }, 1);
  });
});

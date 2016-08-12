import { define } from '../../../src/index';

describe('lifecycle/defined', () => {
  it('should not already have the defined attribute on undefined elements', () => {
    expect(document.createElement('some-undefined-element').hasAttribute('defined')).to.equal(false);
  });

  it('should add the [defined] attribute when the element is upgraded', () => {
    const Elem = define('x-test', {});
    const elem = new Elem();
    expect(elem.hasAttribute('defined')).to.equal(true);
  });
});

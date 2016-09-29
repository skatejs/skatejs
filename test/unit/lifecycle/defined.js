import { define } from '../../../src/index';

describe('lifecycle/defined', () => {
  it('should not already have the defined attribute on undefined elements', () => {
    expect(document.createElement('some-undefined-element').hasAttribute('defined')).to.equal(false);
  });

  it('should add the [defined] attribute when the element is upgraded', (done) => {
    const Elem = define('x-test', {});
    const elem = new Elem();

    document.body.appendChild(elem);

    setTimeout(() => {
      expect(elem.hasAttribute('defined')).to.equal(true);
      document.body.removeChild(elem);
      done();
    }, 1);
  });
});

import { define } from '../../../src/index';

describe('lifecycle/defined', () => {
  it('should add the [defined] attribute when the element is upgraded', () => {
    const Elem = define('x-test', {});
    const elem = new Elem();
    expect(elem.hasAttribute('defined')).to.equal(true);
  });
});

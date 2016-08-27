import propContext from '../../../src/util/prop-context';

describe('utils/prop-context:', () => {
  it('should return a function', () => {
    expect(propContext({}, {})).is.a('function');
  });

  it('should not mutate the object initially', () => {
    const object = { a: 'a' };
    propContext(object, { a: 'b' });
    expect(object.a).to.equal('a');
  });

  it('should mutate the object during the returned function execution', () => {
    const object = { a: 'a' };
    const context = propContext(object, { a: 'b' });
    context(() => expect(object.a).to.equal('b'))();
  });

  it('should restore the object after the returned function execution', () => {
    const object = { a: 'a' };
    const context = propContext(object, { a: 'b' });
    context(() => {})();
    expect(object.a).to.equal('a');
  });

  it('should support nesting', () => {
    const object = { a: 'a' };
    const context = propContext(object, { a: 'b' });
    context(context(() => expect(object.a).to.equal('b')))();
    expect(object.a).to.equal('a');
  });

  it('should restore missing keys', () => {
    const object = {};
    const context = propContext(object, { a: 'b' });
    context(() => expect(object.a).to.equal('b'))();
    expect(object.a).to.equal(undefined);
  });
});

import skate from '../../src/index';

describe('exports', function () {
  it('skate', function () {
    expect(skate).to.be.a('function');
  });

  it('skate.create', function () {
    expect(skate.create).to.be.a('function');
  });

  it('skate.emit', function () {
    expect(skate.emit).to.be.a('function');
  });

  it('skate.fragment', function () {
    expect(skate.fragment).to.be.a('function');
  });

  it('skate.init', function () {
    expect(skate.init).to.be.a('function');
  });

  it('skate.properties', function () {
    expect(skate.properties.boolean).to.be.an('object', 'boolean');
    expect(skate.properties.float).to.be.an('object', 'float');
    expect(skate.properties.number).to.be.an('object', 'number');
    expect(skate.properties.string).to.be.an('object', 'string');
  });

  it('skate.ready', function () {
    expect(skate.ready).to.be.a('function');
  });

  it('skate.render', function () {
    expect(skate.render).to.be.a('function');
  });

  it('skate.version', function () {
    expect(skate.version).to.be.a('string');
  });
});

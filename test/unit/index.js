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

  it('skate.property', function () {
    expect(skate.property.boolean).to.be.a('function', 'boolean');
    expect(skate.property.float).to.be.a('function', 'float');
    expect(skate.property.number).to.be.a('function', 'number');
    expect(skate.property.string).to.be.a('function', 'string');
  });

  it('skate.ready', function () {
    expect(skate.ready).to.be.a('function');
  });

  it('skate.version', function () {
    expect(skate.version).to.be.a('string');
  });
});

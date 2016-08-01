import { Component, define, symbols } from '../../../src/index';

const { name: $name } = symbols;

describe('api/define', () => {
  it('should not register without any properties', () => {

    // just trying to trigger a failure to make sure we get a red build
    expect(1).to.equal(2);

    expect(() => {
      define('x-test');
    }).to.throw(Error);
  });

  it('should register components with unique names', () => {
    const elem1 = define('x-test-api-define', {});
    const elem2 = define('x-test-api-define', {});
    const elem3 = define('x-test-api-define', {});

    // the first one is registered by its own name
    // the rest is registered by the name plus random string
    expect(elem1[$name]).to.equal('x-test-api-define');
    expect(elem2[$name]).not.to.equal('x-test-api-define');
    expect(elem2[$name].indexOf('x-test-api-define') === 0).to.equal(true);
    expect(elem3[$name]).not.to.equal('x-test-api-define');
    expect(elem3[$name].indexOf('x-test-api-define') === 0).to.equal(true);
  });

  it('should take an object and extend Component', () => {
    expect(define('x-test', {}).prototype).to.be.an.instanceof(Component);
  });

  it('should be able to take an ES5 extension of Component', () => {
    expect(define('x-test', Component.extend({})).prototype).to.be.an.instanceof(Component);
  });

  it('should take a constructor that extends Component', () => {
    expect(define('x-test', class extends Component {}).prototype).to.be.an.instanceof(Component);
  });
});

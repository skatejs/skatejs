import { Component, define, symbols } from '../../../src/index';

const { name: $name } = symbols;

describe('api/define', () => {
  it('should not register without any properties', () => {
    expect(() => {
      define('x-test');
    }).to.throw(Error);
  });

  it('should register components with unique names', () => {
    expect(define('x-test-api-define', {})[$name]).to.equal('x-test-api-define');
    expect(define('x-test-api-define', {})[$name]).to.equal('x-test-api-define-1');
    expect(define('x-test-api-define', {})[$name]).to.equal('x-test-api-define-2');

    expect(define('x-test-api-define-1', {})[$name]).to.equal('x-test-api-define-1-1');
    expect(define('x-test-api-define-1', {})[$name]).to.equal('x-test-api-define-1-2');
    expect(define('x-test-api-define-1', {})[$name]).to.equal('x-test-api-define-1-3');

    expect(define('x-test-api-define-1-3', {})[$name]).to.equal('x-test-api-define-1-3-1');
    expect(define('x-test-api-define-1-3', {})[$name]).to.equal('x-test-api-define-1-3-2');
    expect(define('x-test-api-define-1-3', {})[$name]).to.equal('x-test-api-define-1-3-3');
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

import { Component, define, symbols } from '../../../src/index';

const { $name } = symbols;

describe('api/define', () => {
  it('should register components with unique names', () => {
    expect(define('x-test-api-define', {})[$name]).to.equal('x-test-api-define');
    expect(define('x-test-api-define', {})[$name]).to.equal('x-test-api-define-1');
    expect(define('x-test-api-define', {})[$name]).to.equal('x-test-api-define-2');
  });

  it('should take an object and extend Component', () => {
    expect(define('x-test', {}).prototype).to.be.an.instanceof(Component);
  });

  it('should be able to take an ES5 extension of Comonent', () => {
    expect(define('x-test', {}).prototype).to.be.an.instanceof(Component);
  });

  it('should take a constructor that extends Component', () => {
    expect(define('x-test', class extends Component {}).prototype).to.be.an.instanceof(Component);
  });
});

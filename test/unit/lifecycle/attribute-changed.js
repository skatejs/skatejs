/* eslint-env jasmine, mocha */

import { define } from '../../../src';
import element from '../../lib/element';
import fixture from '../../lib/fixture';
import afterMutations from '../../lib/after-mutations';

describe('lifecycle/attribute-changed', () => {
  let fixtureArea;

  beforeEach(() => {
    fixtureArea = fixture();
  });

  afterEach(() => {
    fixtureArea.innerHTML = '';
  });

  it('should make arguments to attributeChanged consistent with the rest of the callbacks', (done) => {
    const Elem = define('x-test', {
      observedAttributes: ['test'],
      attributeChanged (e, data) {
        expect(e).to.equal(elem);
        expect(data.name).to.equal('test');
        expect(data.oldValue).to.equal(null);
        expect(data.newValue).to.equal('ing');
        done();
      }
    });
    const elem = new Elem();
    fixture(elem);
    elem.setAttribute('test', 'ing');
  });

  it('attributes that are defined as properties should call attributeChanged callback', (done) => {
    let counter = 0;
    const elem = new (element().skate({ // eslint-disable-line new-parens
      attributeChanged () {
        counter += 1;
      },
      props: {
        test: {
          attribute: true
        }
      }
    }));
    fixtureArea.appendChild(elem);
    afterMutations(
      () => expect(counter).to.equal(0),
      () => (elem.test = true),
      () => expect(counter).to.equal(1),
      () => (elem.test = false),
      () => expect(counter).to.equal(2),
      done
    );
  });
});

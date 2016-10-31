/* eslint-env jasmine, mocha */

import { Component, define } from '../../../src';
import element from '../../lib/element';
import fixture from '../../lib/fixture';
import afterMutations from '../../lib/after-mutations';

describe('deprecated/lifecycle/attribute-changed', () => {
  let fixtureArea;

  beforeEach(() => {
    fixtureArea = fixture();
  });

  afterEach(() => {
    fixtureArea.innerHTML = '';
  });

  it('should make arguments to attributeChanged consistent with the rest of the callbacks', (done) => {
    let test = false;
    const Elem = define('x-test', class extends Component {
      static get observedAttributes () {
        return ['test'];
      }
      static attributeChanged (elem, data) {
        // We have an issue right now where attributeChanged is fired twice in
        // polyfill - once for init and once for set - so we must only check
        // this after setting.
        if (test) {
          expect(elem.tagName).to.match(/^x-test/i);
          expect(data.name).to.equal('test');
          expect(data.oldValue).to.equal(null);
          expect(data.newValue).to.equal('ing');
          done();
        }
      }
    });
    const elem = new Elem();
    fixture(elem);
    afterMutations(
      () => (test = true),
      () => elem.setAttribute('test', 'ing')
    );
  });

  it('attributes that are defined as properties should call attributeChanged callback', (done) => {
    let counter = 0;
    const elem = new (element().skate(class extends Component {
      static get props () {
        return {
          test: {
            attribute: true
          }
        };
      }
      static attributeChanged () {
        counter += 1;
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

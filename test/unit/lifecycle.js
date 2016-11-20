/* eslint-env jasmine, mocha */

import { Component, define, ready } from '../../src/index';
import afterMutations from '../lib/after-mutations';
import fixture from '../lib/fixture';
import uniqueId from '../../src/util/unique-id';

describe('lifecycle', () => {
  let MyEl;
  let myEl;
  let created = false;
  let attached = false;
  let detached = false;

  beforeEach(() => {
    created = false;
    attached = false;
    detached = false;
    MyEl = define(class extends Component {
      constructor () {
        super();
        created = true;
      }
      connectedCallback () {
        super.connectedCallback();
        attached = true;
      }
      disconnectedCallback () {
        super.disconnectedCallback();
        detached = true;
      }
    });
    myEl = new MyEl();
  });

  it('should call the created() callback when the element is created', () => {
    expect(created).to.equal(true, 'created');
    expect(attached).to.equal(false, 'attached');
    expect(detached).to.equal(false, 'detached');
  });

  it('should call the attached() callback when the element is attached', (done) => {
    fixture().appendChild(myEl);
    afterMutations(
      () => expect(created).to.equal(true, 'created'),
      () => expect(attached).to.equal(true, 'attached'),
      () => expect(detached).to.equal(false, 'detached'),
      done
    );
  });

  it('should call the detached() callback when the element is detached', (done) => {
    fixture().appendChild(myEl);
    ready(myEl, () => {
      afterMutations(
        () => helperFixture().removeChild(myEl),
        () => expect(created).to.equal(true, 'created'),
        () => expect(attached).to.equal(true, 'attached'),
        () => expect(detached).to.equal(true, 'detached'),
        done
      );
    });
  });
});

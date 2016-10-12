/* eslint-env jasmine, mocha */

import afterMutations from '../lib/after-mutations';
import helperElement from '../lib/element';
import helperFixture from '../lib/fixture';
import { define, ready } from '../../src/index';

describe('lifecycle', () => {
  let MyEl;
  let myEl;
  let tagName;
  let created = false;
  let attached = false;
  let detached = false;

  beforeEach(() => {
    tagName = helperElement('my-el');
    created = false;
    attached = false;
    detached = false;
    MyEl = define(tagName.safe, {
      created: () => {
        created = true;
      },
      attached: () => {
        attached = true;
      },
      detached: () => {
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
    helperFixture().appendChild(myEl);
    afterMutations(
      () => expect(created).to.equal(true, 'created'),
      () => expect(attached).to.equal(true, 'attached'),
      () => expect(detached).to.equal(false, 'detached'),
      done
    );
  });

  it('should call the detached() callback when the element is detached', (done) => {
    helperFixture().appendChild(myEl);
    ready(myEl, () => {
      helperFixture().removeChild(myEl);
      afterMutations(
        () => expect(created).to.equal(true, 'created'),
        () => expect(attached).to.equal(true, 'attached'),
        () => expect(detached).to.equal(true, 'detached'),
        done
      );
    });
  });
});

/* eslint-env jasmine, mocha, chai */
/** @jsx h */

import { Component, define, prop, props, vdom } from '../../../src/index';
import afterMutations from '../../lib/after-mutations';
import fixture from '../../lib/fixture';
import { h, mount } from 'bore';

const { text, elementOpen, elementClose, elementOpenStart, elementOpenEnd, elementVoid } = vdom;

describe('vdom/skip', () => {
  it('should skip the element children', () => {
    const Elem = define(class extends Component {
      static get props () {
        return {
          num: prop.number
        };
      }
      /* eslint indent: 0 */
      renderCallback () {
        text('1 ');
        elementOpen('div');
          text('2 ');
          elementVoid('void');
          elementOpenStart('span'); elementOpenEnd();
            text('3 ');
          elementClose('span');
          elementOpen('div');
            text('4 ');
            elementOpen('span');
              text('5 ');
            elementClose('div');
          elementClose('div');
        elementClose('div');
        text('6 ');
        elementOpen('div', null, null, 'skip', true);
          text('7 ');
          elementVoid('void');
          elementOpenStart('span'); elementOpenEnd();
            text('8 ');
          elementClose('span');
          elementOpen('div');
            text('9 ');
            elementOpen('span');
              text('10 ');
            elementClose('span');
          elementClose('div');
        elementClose('div');
        text('11 ');
        elementOpen('div');
          text('12 ');
          elementVoid('void');
          elementOpenStart('span'); elementOpenEnd();
            text('13 ');
          elementClose('span');
          elementOpen('div');
            text('14 ');
            elementOpen('span');
              text('15');
            elementClose('span');
          elementClose('div');
        elementClose('div');
      }
    });
    return mount(<Elem />).wait()
      .then(w => expect(w.all('void')).to.have.length.of(2) && w)
      .then(w => expect(w.node.shadowRoot.textContent).to.equal('1 2 3 4 5 6 11 12 13 14 15') && w);
  });

  it('should allow conditional rendering', done => {
    function isEven (num) {
      return num % 2 === 0;
    }
    const Elem = define(class extends Component {
      static get props () {
        return {
          num: { ...prop.number, ...{ default: 2 } }
        };
      }
      renderCallback () {
        elementOpen('div', null, null, 'skip', !isEven(this.num));
          text(this.num);
          elementOpen('span');
            text(this.num.toString());
          elementClose('span');
          elementOpen('div');
            elementOpen('span');
              text(this.num.toString());
            elementClose('span');
          elementClose('div');
        elementClose('div');
      }
    });
    const elem = new Elem();
    fixture(elem);
    afterMutations(
      () => expect(elem.shadowRoot.textContent).to.equal('222'),
      () => props(elem, { num: elem.num + 1 }),
      () => expect(elem.shadowRoot.textContent).to.equal('222'),
      () => props(elem, { num: elem.num + 1 }),
      () => expect(elem.shadowRoot.textContent).to.equal('444'),
      () => props(elem, { num: elem.num + 1 }),
      () => expect(elem.shadowRoot.textContent).to.equal('444'),
      () => props(elem, { num: elem.num + 1 }),
      () => expect(elem.shadowRoot.textContent).to.equal('666'),
      done
    );
  });

  it('re-rendering an empty, skipped element should keep the mutated content', done => {
    const Elem = define(class extends Component {
      static get props () {
        return {
          test: {}
        };
      }
      renderCallback () {
        elementOpen('div', null, null, 'skip', true);
        elementClose('div');
      }
    });
    const elem = new Elem();
    fixture(elem);
    afterMutations(
      () => (elem.shadowRoot.firstElementChild.textContent = 'testing'),
      () => props(elem, { test: 0 }),
      () => expect(elem.shadowRoot.firstElementChild.textContent).to.equal('testing'),
      done
    );
  });

  it('re-rendering an void, skipped element should keep the mutated content', done => {
    const Elem = define(class extends Component {
      static get props () {
        return {
          test: {}
        };
      }
      renderCallback () {
        elementVoid('div', null, null, 'skip', true);
      }
    });
    const elem = new Elem();
    fixture(elem);
    afterMutations(
      () => (elem.shadowRoot.firstElementChild.textContent = 'testing'),
      () => props(elem, { test: 0 }),
      () => expect(elem.shadowRoot.firstElementChild.textContent).to.equal('testing'),
      done
    );
  });
});

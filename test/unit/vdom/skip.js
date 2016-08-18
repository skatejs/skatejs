import { define, prop, props, symbols, vdom } from '../../../src/index';
import afterMutations from '../../lib/after-mutations';
import fixture from '../../lib/fixture';

const { text, elementOpen, elementClose, elementOpenStart, elementOpenEnd, elementVoid } = vdom;
const sr = el => el[symbols.shadowRoot];

describe('vdom/skip', () => {
  it('should skip the element children', done => {
    const Elem = define('x-test', {
      props: { 
        num: prop.number() 
      },
      /* eslint indent: 0 */
      render() {
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
      },
    });
    const elem = new Elem();
    const html = '1 <div>2 <void></void><span>3 </span><div>4 <span>5 </span></div></div>6 <div></div>11 <div>12 <void></void><span>13 </span><div>14 <span>15</span></div></div>';
    fixture(elem);
    afterMutations(
      () => expect(sr(elem).innerHTML).to.equal(html),
      () => expect(sr(elem).querySelectorAll('void').length).to.equal(2),
      () => props(elem, { num: elem.num + 1 }),
      () => expect(sr(elem).innerHTML).to.equal(html),
      () => expect(sr(elem).querySelectorAll('void').length).to.equal(2),
      done
    );
  });

  it('should allow conditional rendering', done => {
    function isEven(num) {
      return num % 2 === 0;
    }
    const Elem = define('x-test', {
      props: {
        num: prop.number({ default: 2 })
      },
      render(elem) {
        elementOpen('div', null, null, 'skip', !isEven(elem.num));
          text(elem.num);
          elementOpen('span');
            text(elem.num.toString());
          elementClose('span');
          elementOpen('div');
            elementOpen('span');
              text(elem.num.toString());
            elementClose('span');
          elementClose('div');
        elementClose('div');
      },
    });
    const elem = new Elem();
    fixture(elem);
    afterMutations(
      () => expect(elem[symbols.shadowRoot].textContent).to.equal('222'),
      () => props(elem, { num: elem.num + 1 }),
      () => expect(elem[symbols.shadowRoot].textContent).to.equal('222'),
      () => props(elem, { num: elem.num + 1 }),
      () => expect(elem[symbols.shadowRoot].textContent).to.equal('444'),
      () => props(elem, { num: elem.num + 1 }),
      () => expect(elem[symbols.shadowRoot].textContent).to.equal('444'),
      () => props(elem, { num: elem.num + 1 }),
      () => expect(elem[symbols.shadowRoot].textContent).to.equal('666'),
      done
    );
  });
});

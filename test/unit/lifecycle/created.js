import helperElement from '../../lib/element';
import skate from '../../../src/index';

describe('lifecycle/created ordering parent -> descendants', function () {
  it('lifecycle feature ordering', function () {
    let order = [];
    helperElement().skate({
      prototype: {
        test () {
          order.push('prototype');
        }
      },
      created () {
        this.test();
        skate.emit(this, 'someNonStandardEvent');
        this.someNonStandardProperty = true;
        order.push('created');
      },
      events: {
        someNonStandardEvent () {
          order.push('events');
        }
      },
      properties: {
        someNonStandardProperty: {
          update () {
            order.push('properties');
          }
        }
      },
      template () {
        skate.emit(this, 'someNonStandardEvent');
        this.someNonStandardProperty = true;
        order.push('template');
      },
      ready () {
        order.push('ready');
      }
    })();

    expect(order).to.have.length(6);
    expect(order[0]).to.equal('prototype');
    expect(order[1]).to.equal('created');
    expect(order[2]).to.equal('events');
    expect(order[3]).to.equal('properties');
    expect(order[4]).to.equal('template');
    expect(order[5]).to.equal('ready');
  });
});

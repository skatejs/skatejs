import helperElement from '../../lib/element';
import skate from '../../../src/index';

function format (value, index) {
  return (index + 1) + '. ' + value + '\n';
}

describe('lifecycle/created ordering parent -> descendants', function () {
  it('lifecycle feature ordering', function () {
    let order = [];
    helperElement().skate({
      created () {
        // The prototype should already be set up.
        this.test();

        // This event should be triggered at this point.
        skate.emit(this, 'someNonStandardEvent');

        // This should cause "properties" to appear before "created".
        this.someNonStandardProperty = 'created';

        // Now push created onto the order stack.
        order.push('created');
      },
      events: {
        someNonStandardEvent () {
          order.push('events');
        }
      },
      prototype: {
        test () {
          order.push('prototype');
        }
      },
      properties: {
        someNonStandardProperty: {
          update (value) {
            order.push('properties.' + value);
          }
        }
      },
      ready () {
        this.someNonStandardProperty = 'ready';
        order.push('ready');
      },
      template () {
        skate.emit(this, 'someNonStandardEvent');
        this.someNonStandardProperty = 'template';
        order.push('template');
      }
    })();

    expect(order).to.have.length(8, order.map(format).join(''));
    expect(order[0]).to.equal('prototype');
    expect(order[1]).to.equal('created');
    expect(order[2]).to.equal('events');
    expect(order[3]).to.equal('properties.template');
    expect(order[4]).to.equal('template');
    expect(order[5]).to.equal('properties.template');
    expect(order[6]).to.equal('properties.ready');
    expect(order[7]).to.equal('ready');
  });
});

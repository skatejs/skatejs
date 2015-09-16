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
        this.someNonStandardProperty = 'create';

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
        this.someNonStandardProperty = 'update';
        order.push('ready');
      }
    })();

    expect(order).to.have.length(7, order.map(format).join(''));
    expect(order[0]).to.equal('prototype');
    expect(order[1]).to.equal('events');

    // This is from created setting the property.
    expect(order[2]).to.equal('properties.create');
    expect(order[3]).to.equal('created');

    // This is from calling update() once created is invoked on descendants.
    expect(order[4]).to.equal('properties.create');
    expect(order[5]).to.equal('properties.update');
    expect(order[6]).to.equal('ready');
  });
});

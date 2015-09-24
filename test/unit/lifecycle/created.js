import helperElement from '../../lib/element';
import skate from '../../../src/index';

function format (value, index) {
  return (index + 1) + '. ' + value + '\n';
}

describe('lifecycle/created ordering parent -> descendants', function () {
  it('lifecycle feature ordering', function () {
    let order = [];
    helperElement().skate({
      created (elem) {
        // The prototype should already be set up.
        elem.test();

        // This event should be triggered at this point.
        skate.emit(elem, 'someNonStandardEvent');

        // This should cause "properties" to appear before "created".
        elem.someNonStandardProperty = 'created';

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
          update (elem, data) {
            order.push('properties.' + data.newValue);
          }
        }
      },
      ready (elem) {
        elem.someNonStandardProperty = 'ready';
        order.push('ready');
      },
      render (elem) {
        skate.emit(elem, 'someNonStandardEvent');
        elem.someNonStandardProperty = 'render';
        order.push('render');
      }
    })();

    expect(order).to.have.length(8, order.map(format).join(''));
    expect(order[0]).to.equal('prototype');
    expect(order[1]).to.equal('created');
    expect(order[2]).to.equal('events');
    expect(order[3]).to.equal('properties.render');
    expect(order[4]).to.equal('render');
    expect(order[5]).to.equal('properties.render');
    expect(order[6]).to.equal('properties.ready');
    expect(order[7]).to.equal('ready');
  });
});

import helperElement from '../../lib/element';
import skate from '../../../src/index';

function format (value, index) {
  return (index + 1) + '. ' + value + '\n';
}

describe('lifecycle/created', function () {
  it('lifecycle feature ordering', function () {
    let order = [];

    function test (lifecycle) {
      return function (elem) {
        elem.test(lifecycle);
        skate.emit(elem, 'someNonStandardEvent', { detail: lifecycle });
        elem.someNonStandardProperty = lifecycle;
        order.push(`${lifecycle}.callback`);
      };
    }

    helperElement().skate({
      created: test('created'),
      events: {
        someNonStandardEvent (e) {
          order.push(`${e.detail}.event`);
        }
      },
      prototype: {
        test (lifecycle) {
          order.push(`${lifecycle}.prototype`);
        }
      },
      properties: {
        someNonStandardProperty: {
          set (name, data) {
            order.push(`${data.newValue}.property`);
          }
        }
      },
      ready: test('ready'),
      render: test('render')
    })();

    let formatted = order.map(format).join('');
    expect(order).to.have.length(13, formatted);
    expect(order[0]).to.equal('created.prototype');
    expect(order[1]).to.equal('created.event');
    expect(order[2]).to.equal('created.property');
    expect(order[3]).to.equal('created.callback');
    expect(order[4]).to.equal('render.prototype');
    expect(order[5]).to.equal('render.event');
    expect(order[6]).to.equal('render.property');
    expect(order[7]).to.equal('render.callback');
    expect(order[8]).to.equal('render.property');
    expect(order[9]).to.equal('ready.prototype');
    expect(order[10]).to.equal('ready.event');
    expect(order[11]).to.equal('ready.property');
    expect(order[12]).to.equal('ready.callback');
  });
});

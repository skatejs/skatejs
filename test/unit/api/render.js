import element from '../../lib/element';
import render from '../../../src/api/render';

describe('api/render', function () {
  let elem;

  beforeEach(function () {
    elem = element().skate({
      properties: {
        name: {
          attribute: true,
          default: 'default',
          set: render
        }
      },
      render: function (elem) {
        elem.innerHTML = `${elem.name}`;
      }
    })();
  });

  it('should render the component', function () {
    expect(elem.textContent).to.equal('default');
    elem.name = 'updated';
    expect(elem.textContent).to.equal('updated');
  });
});

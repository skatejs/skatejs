import element from '../../lib/element';
import render from '../../../src/api/render';
import { text } from '../../../src/api/vdom';

describe('api/render', function () {
  let elem;

  beforeEach(function () {
    elem = element().skate({
      properties: {
        test: {
          attribute: true,
          default: 'default'
        }
      },
      render (elem) {
        text(elem.test);
      }
    })();
  });

  it('should render the component', function () {
    expect(elem.shadowRoot.textContent).to.equal('default');
    elem.test = 'updated';
    render(elem);
    expect(elem.shadowRoot.textContent).to.equal('updated');
  });
});

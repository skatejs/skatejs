import element from '../../lib/element';
import fixture from '../../lib/fixture';

describe('lifecycle/attribute-changed', () => {
  it('should make arguments to attributeChanged consistent with the rest of the callbacks', (done) => {
    const tag = element();
    const div = document.createElement(tag.safe);
    div.setAttribute('test', 'ing');
    fixture().appendChild(div);
    tag.skate({
      observedAttributes: ['test'],
      attributeChanged(elem, data) {
        expect(elem.tagName).to.equal(tag.safe.toUpperCase());
        expect(data.name).to.equal('test');
        expect(data.oldValue).to.equal(null);
        expect(data.newValue).to.equal('ing');
        done();
      },
    });
  });
});

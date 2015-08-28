import createFromHtml from '../../../src/util/create-from-html';

describe('utils/create-from-html:', function () {
  it('td parent is tr attached to a table', function () {
    var parent = createFromHtml('<td></td>');
    expect(parent.tagName.toLowerCase()).to.equal('tr', 'parent');

    var tbody = parent.parentNode;
    expect(tbody.tagName.toLowerCase()).to.equal('tbody', 'grandparent');

    var table = tbody.parentNode;
    expect(table.tagName.toLowerCase()).to.equal('table', 'great-grandparent');
  });

  it('non-special tag parent is div with no other attached structure', function () {
    var parent = createFromHtml('<x-foo></x-foo>');
    expect(parent.tagName.toLowerCase()).to.equal('div', 'parent');
    expect(parent.parentNode).to.equal(null, 'no grand parent');
  });
});

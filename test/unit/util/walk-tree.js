import walkTree from '../../../src/util/walk-tree';

describe('utils/walk-tree', function () {
  it('should walk parents before walking descendants', function () {
    var order = [];
    var one = document.createElement('one');

    one.innerHTML = '<two><three></three></two>';

    walkTree(one, function (elem) {
      order.push(elem.tagName);
    });

    expect(order[0]).to.equal('ONE');
    expect(order[1]).to.equal('TWO');
    expect(order[2]).to.equal('THREE');
  });
});

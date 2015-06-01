import walkTree from '../../../src/util/walk-tree';

describe('utils/walk-tree', function () {
  var one, order;

  beforeEach(function () {
    order = [];
    one = document.createElement('one');
    one.innerHTML = '<two><three></three></two>';
  });

  it('should walk parents before walking descendants', function () {
    walkTree(one, function (elem) {
      order.push(elem.tagName);
    });

    expect(order.length).to.equal(3);
    expect(order[0]).to.equal('ONE');
    expect(order[1]).to.equal('TWO');
    expect(order[2]).to.equal('THREE');
  });

  it('should accept a filter that filters out a node removing it and its descendants', function () {
    walkTree(one, function (elem) {
      order.push(elem.tagName);
    }, function (elem) {
      return elem.tagName !== 'TWO';
    });

    expect(order.length).to.equal(1);
    expect(order[0]).to.equal('ONE');
  });
});

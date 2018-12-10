beforeEach(() => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
});

afterEach(() => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
});

test('createTreeWalker', () => {
  document.head.innerHTML = '<div id="one"></div>';
  document.body.innerHTML = '<div id="one"></div>';

  const list = [];
  const tree = document.createTreeWalker(document);

  while (tree.nextNode()) {
    list.push(tree.currentNode.nodeName);
  }

  expect(list).toMatchObject([
    '#document',
    'HTML',
    'HEAD',
    'DIV',
    'BODY',
    'DIV'
  ]);
});

describe('getElementById', () => {
  it('returns no elements on empty', () => {
    expect(document.getElementById('one')).toBe(null);
  });

  it('does not return unmatched elements', () => {
    document.head.innerHTML = '<div id="two"></div>';
    document.body.innerHTML = '<div id="two"></div>';
    expect(document.getElementById('one')).toBe(null);
  });

  it('returns the first matched element', () => {
    document.head.innerHTML = '<div id="one"></div>';
    document.body.innerHTML = '<div id="one"></div>';
    document.getElementById('one');
    expect(document.getElementById('one').parentNode.nodeName).toBe('HEAD');
  });
});

describe('getElementsByClassName', () => {
  it('returns no elements on empty', () => {
    expect(document.getElementsByClassName('one').length).toBe(0);
  });

  it('does not return unmatched elements', () => {
    document.head.innerHTML = '<div class="two"></div>';
    document.body.innerHTML = '<div class="two"></div>';
    expect(document.getElementsByClassName('one').length).toBe(0);
  });

  it('returns matched elements', () => {
    document.head.innerHTML = '<div class="one two"></div>';
    document.body.innerHTML = '<div class="one two"></div>';
    expect(document.getElementsByClassName('one').length).toBe(2);
  });
});

describe('getElementsByTagName', () => {
  it('returns no elements on empty', () => {
    expect(document.getElementsByTagName('span').length).toBe(0);
  });

  it('does not return unmatched elements', () => {
    document.head.innerHTML = '<div></div>';
    document.body.innerHTML = '<div></div>';
    expect(document.getElementsByTagName('span').length).toBe(0);
  });

  it('returns matched elements', () => {
    document.head.innerHTML = '<span></span>';
    document.body.innerHTML = '<span></span>';
    expect(document.getElementsByTagName('span').length).toBe(2);
  });
});

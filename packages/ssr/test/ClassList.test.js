describe('ClassList', () => {
  it('add', () => {
    const div = document.createElement('div');
    div.classList.add('foo');
    expect(div.className).toBe('foo');
  });
  it('remove', () => {
    const div = document.createElement('div');
    div.className = 'foo bar';
    div.classList.remove('foo');
    expect(div.className).toBe('bar');
  });
  it('contains', () => {
    const div = document.createElement('div');
    div.classList.add('foo');
    expect(div.classList.contains('foo')).toBe(true);
  });
});

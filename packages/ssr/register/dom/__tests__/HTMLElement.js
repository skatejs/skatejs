describe('Element', () => {
  it('setAttribute', () => {
    const div = document.createElement('div');
    div.setAttribute('test', 'value');
    div.setAttribute('test', 'updated');
  });

  it('removeAttribute', () => {
    const div = document.createElement('div');
    div.removeAttribute('test');
    div.removeAttribute('test');
  });

  it('getAttribute', () => {
    const div = document.createElement('div');
    expect(div.getAttribute('test')).toBe(null);
    div.setAttribute('test', 'value');
    expect(div.getAttribute('test')).toBe('value');
    div.setAttribute('test', 'updated');
    expect(div.getAttribute('test')).toBe('updated');
    div.removeAttribute('test');
    expect(div.getAttribute('test')).toBe(null);
  });

  it('hasAttribute', () => {
    const div = document.createElement('div');
    expect(div.hasAttribute('test')).toBe(false);
    div.setAttribute('test', 'value');
    expect(div.hasAttribute('test')).toBe(true);
    div.setAttribute('test', 'updated');
    expect(div.hasAttribute('test')).toBe(true);
    div.removeAttribute('test');
    expect(div.hasAttribute('test')).toBe(false);
  });

  it('hasAttributes', () => {
    const div = document.createElement('div');
    expect(div.hasAttributes()).toBe(false);
    div.setAttribute('test', 'value');
    expect(div.hasAttributes()).toBe(true);
    div.setAttribute('test', 'updated');
    expect(div.hasAttributes()).toBe(true);
    div.removeAttribute('test');
    expect(div.hasAttributes()).toBe(false);
  });

  describe('attachShadow', () => {
    it('should be patched on Element', () => {
      expect(HTMLElement.prototype.hasOwnProperty('attachShadow')).toEqual(
        true
      );
    });

    it('mode: open, should create a shadowRoot property', () => {});

    it('mode: closed, should not create a shadowRoot property', () => {});
  });

  describe('innerHTML', () => {
    it('should get innerHTML', () => {});

    it('should set innerHTML', () => {
      const div = document.createElement('div');
      const html = `<h1 id="yelling">Test</h1><section><p><span id="nested-span">Paragraph</span> 1.</p><p><span>Paragraph</span> 2.</p></section>`;
      div.innerHTML = html;
      expect(div.innerHTML).toEqual(html);
    });
  });
});

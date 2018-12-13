import define, { generateName, getName, setName } from '..';

test('generateName - default prefix', () => {
  expect(generateName()).toMatch(/x-element(-\d+)?/);
  expect(generateName()).toMatch(/x-element(-\d+)?/);
});

test('generateName - custom prefix (hyphenated)', () => {
  expect(generateName('custom-element')).toMatch(/custom-element(-\d+)?/);
  expect(generateName('custom-element')).toMatch(/custom-element(-\d+)?/);
});

test('generateName - custom prefix (not hyphenated)', () => {
  expect(generateName('custom')).toMatch(/x-custom(-\d+)?/);
  expect(generateName('custom')).toMatch(/x-custom(-\d+)?/);
});

test('getName - undefined element', () => {
  class Custom extends HTMLElement {}
  expect(getName(Custom)).toBe('');
});

test('getName - defined element', () => {
  class Custom extends HTMLElement {}
  const generatedName = generateName();
  customElements.define(generatedName, Custom);
  expect(getName(Custom)).toBe(generatedName);
});

test('setName - constructor conflict', () => {
  class Custom extends HTMLElement {}
  customElements.define(generateName(), Custom);
  expect(setName(generateName(), Custom)).not.toBe(Custom);
});

test('setName - name conflict', () => {
  class Custom1 extends HTMLElement {}
  class Custom2 extends HTMLElement {}
  const generatedName = generateName();
  customElements.define(generatedName, Custom1);
  expect(setName(generatedName, Custom2)).toBe(Custom2);
});

test('setName - constructor and name conflict', () => {
  class Custom extends HTMLElement {}
  const generatedName = generateName();
  customElements.define(generatedName, Custom);
  expect(setName(generatedName, Custom)).toBe(Custom);
});

test('define - undefined element', () => {
  class Custom extends HTMLElement {}
  expect(define(Custom)).toBe(Custom);
});

test('define - defined element', () => {
  class Custom extends HTMLElement {}
  customElements.define(generateName(), Custom);
  expect(define(Custom)).toBe(Custom);
});

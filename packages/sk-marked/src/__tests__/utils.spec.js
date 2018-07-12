import { format } from '../utils';

test('format text without indentation', () => {
  const text = `(line without indentantation)
(line without indentantation)

(line without indentantation)

`;
  const formatted = format(text);
  expect(formatted).toBe(text);
});

test('format text with mixed indentation but no baseline indentation', () => {
  const text = `  (line indented with 2 spaces)
 (line indented with 1 space)
\t\t(line indented with 2 tabs)

(line without indentantation)

`;
  const formatted = format(text);
  expect(formatted).toBe(text);
});

test('format text with baseline indentation of 2 spaces/tabs', () => {
  const text = `  (line indented with 2 spaces)
  (line indented with 2 spaces)
    (line indented with 4 spaces)
\t\t(line indented with 2 tabs)
  (line indented with 2 spaces)`;

  const expectedText = `(line indented with 2 spaces)
(line indented with 2 spaces)
  (line indented with 4 spaces)
(line indented with 2 tabs)
(line indented with 2 spaces)`;

  const formatted = format(text);
  expect(formatted).toBe(expectedText);
});

test('format text without indentation with carriage return + line feed', () => {
  const text = `  (line indented with 2 spaces)\r\n(line not indented)\r\n\t\t(line indented with 2 tabs)`;

  const expectedText = `  (line indented with 2 spaces)\r\n(line not indented)\r\n\t\t(line indented with 2 tabs)`;

  const formatted = format(text);
  expect(formatted).toBe(expectedText);
});

test('format text with indentation with carriage return + line feed', () => {
  const text = `  (line indented with 2 spaces)\r\n (line indented with 1 space)\r\n\t\t(line indented with 2 tabs)`;

  const expectedText = ` (line indented with 2 spaces)\r\n(line indented with 1 space)\r\n\t(line indented with 2 tabs)`;

  const formatted = format(text);
  expect(formatted).toBe(expectedText);
});

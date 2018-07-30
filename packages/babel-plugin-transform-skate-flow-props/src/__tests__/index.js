// @flow

const outdent = require('outdent');
const babel = require('babel-core');

const transform = code =>
  babel.transform(code, {
    parserOpts: { plugins: ['flow'] },
    plugins: [require('..')]
  }).code;

const enqueue = (name, input, output) => {
  const inputFormatted = `${input.join('; ')};`;
  const outputFormatted = `${output.join(',\n    ')}`;
  test(name, () => {
    expect(
      transform(outdent`
        class Test extends HTMLElement {
          props: {
            ${inputFormatted}
          };
        }
      `)
    ).toEqual(outdent`
      class Test extends HTMLElement {
        props: {
          ${inputFormatted}
        };
        static props = {
          ${outputFormatted}
        };
      }
    `);
  });
};

const enqueuePreBuilt = (name, input, output) => {
  enqueue(
    `${name} - ${input} -> ${output}`,
    [`one: ${input}`, `two?: ${input}`],
    [`one: props.${output}`, `two: props.${output}`]
  );
};

enqueuePreBuilt('ObjectTypeAnnotation', 'any', 'any');
enqueuePreBuilt('ObjectTypeAnnotation', 'mixed', 'any');
enqueuePreBuilt('ObjectTypeAnnotation', 'number', 'number');
enqueuePreBuilt('ObjectTypeAnnotation', 'string', 'string');
enqueuePreBuilt('ObjectTypeAnnotation', 'Array<any>', 'array');
enqueuePreBuilt('ObjectTypeAnnotation', 'Object', 'object');

test.only('Shared prop annotation', () => {
  expect(
    transform(outdent`
      type Props = {
        one: any;
        two?: any;
      };

      class Test extends HTMLElement {
        props: Props;
      }
    `)
  ).toEqual(outdent`
    type Props = {
      one: any;
      two?: any;
    };

    class Test extends HTMLElement {
      props: Props;
      static props = {
        one: props.any,
        two: props.any
      };
    }
  `);
});

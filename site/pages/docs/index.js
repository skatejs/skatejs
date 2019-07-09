import { md } from "../../util";

const packages = {
  classes: [
    "element",
    "element-hyperhtml",
    "element-preact",
    "element-react",
    "element-snabbdom"
  ],
  elements: ["sk-context", "sk-marked", "sk-router", "sk-shadow"],
  utilities: ["cli", "define", "globals", "jsx", "shadow-css"]
};

export default md`
  # Docs

  Skate is a set of composable packages designed to build web components using
  your framework of choice. Whether it be React, Preact or other libraries, you
  can use them to write components that work anywhere.

  ## Skate renderers

  Skate renderers are custom element base classes that allow you to use a
  particular view library to render your component. The usage of the view
  library is encapsulated to your component and not exposed to anything around
  it, which ensures that your element can be used anywhere.

  Skate renderers are prefixed with \`element-\`, not to be confused with
  Skate elements. They take on the element nomenclature as the recommended name
  for their default export is \`Element\`, which is to align with other custom
  element frameworks like \`lit-element\`.

  ${packages.classes.map(p => `- [${p}](/docs/${p})`)}

  ## Skate elements

  Skate elements are Skate-maintained custom elements that you can use
  standalone, or when building your custom elements. They are prefixed with
  \`sk-\`, similar to how Angular uses \`ng\`.

  All Skate elements are exported without being registered as a custom element.
  This means that you can give them your own name, if you want to. If you'd
  like to import a pre-registered \`sk-\` element, then you can import the
  \`register.js\` file that each Skate element has published.

  ${packages.elements.map(p => `- [${p}](/docs/${p})`)}

  ## Utilities

  There are various utilities you can use from helping to get you started to
  writing scoped CSS that works on the server and in the browser.

  ${packages.utilities.map(p => `- [${p}](/docs/${p})`)}
`;

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
  ## Docs

  Skate is a set of composable packages designed to build web components using
  your framework of choice. Whether it be React, Preact or other libraries, you
  can use them to write components that work anywhere.

  ### Renderers

  Renderers are custom element base classes that allow you to use a particular
  view library to render your component. The usage of the vidw library is
  encapsulated to your component and not exposed to anything around it, which
  ensures that your element can be used anywhere.

  ${packages.classes.map(p => `- [${p}](/docs/${p})`)}

  ### Elements

  Elements are pre-built custom elements that you can use standalone, or when
  building your custom elements.

  ${packages.elements.map(p => `- [${p}](/docs/${p})`)}

  ### Utilities

  There are various utilities you can use from helping to get you started to
  writing scoped CSS that works on the server and in the browser.

  ${packages.utilities.map(p => `- [${p}](/docs/${p})`)}
`;

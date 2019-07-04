import { md } from "../../util";

const packages = ["define", "element", "element-react", "shadow-css"];

export default md`
  ## Docs

  Skate is a set of packages designed to work well alone, or together, to give
  you everything you need to build small, scalable and user-friendly web
  components and applications.

  ${packages.map(p => `- [${p}](/docs/${p})`)}
`;

import Element, { React } from "@skatejs/element-react";
import { md } from "../util";
import readme from "raw-loader!../../README.md";

export default md(readme);

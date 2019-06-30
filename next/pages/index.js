/* @jsx h */

import Element, { h } from "@skatejs/element-react";
import css from "@skatejs/shadow-css";

const backgroundColor = "#262434";
const fontFamily = "helvetica";
const gridSize = 4;
const gridUnit = 5;
const pillColorStart = "F#DF96F";
const pillColorEnd = "#E94CA2";
const tabColorStart = "#EC56B0";
const tabColorEnd = "#6CE9F5";
const textColor = "#A6A3AB";

const style = css`
  body {
    background-color: ${backgroundColor};
    color: ${textColor};
    font-family: ${fontFamily};
    margin: 0;
    padding: ${gridSize * gridUnit};
  }
`;

export default () => (
  <div>
    <style>{style.toString()}</style>
    <h1>SkateJS</h1>
    <p>Hello!</p>
  </div>
);

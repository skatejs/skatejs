import * as types from "./types.js";
import appendChild from "./patch/append-child.js";
import removeChild from "./patch/remove-child.js";
import removeAttribute from "./patch/remove-attribute.js";
import replaceChild from "./patch/replace-child.js";
import setAttribute from "./patch/set-attribute.js";
import setEvent from "./patch/set-event.js";
import setProperty from "./patch/set-property.js";
import textContent from "./patch/text-content.js";

const patchers = {};
patchers[types.APPEND_CHILD] = appendChild;
patchers[types.REMOVE_CHILD] = removeChild;
patchers[types.REMOVE_ATTRIBUTE] = removeAttribute;
patchers[types.REPLACE_CHILD] = replaceChild;
patchers[types.SET_EVENT] = setEvent;
patchers[types.SET_ATTRIBUTE] = setAttribute;
patchers[types.SET_PROPERTY] = setProperty;
patchers[types.TEXT_CONTENT] = textContent;

function patch(instruction) {
  patchers[instruction.type](
    instruction.source,
    instruction.target,
    instruction.data
  );
}

export default function(instructions) {
  instructions.forEach(patch);
}

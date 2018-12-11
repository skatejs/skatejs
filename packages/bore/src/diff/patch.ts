import * as types from './types';
import appendChild from './patch/append-child';
import removeChild from './patch/remove-child';
import removeAttribute from './patch/remove-attribute';
import replaceChild from './patch/replace-child';
import setAttribute from './patch/set-attribute';
import setEvent from './patch/set-event';
import setProperty from './patch/set-property';
import textContent from './patch/text-content';

const patchers = {};
patchers[types.APPEND_CHILD] = appendChild;
patchers[types.REMOVE_CHILD] = removeChild;
patchers[types.REMOVE_ATTRIBUTE] = removeAttribute;
patchers[types.REPLACE_CHILD] = replaceChild;
patchers[types.SET_EVENT] = setEvent;
patchers[types.SET_ATTRIBUTE] = setAttribute;
patchers[types.SET_PROPERTY] = setProperty;
patchers[types.TEXT_CONTENT] = textContent;

function patch (instruction) {
  patchers[instruction.type](
    instruction.source,
    instruction.target,
    instruction.data
  );
}

export default function (instructions) {
  instructions.forEach(patch);
}

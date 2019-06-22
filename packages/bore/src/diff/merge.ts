import diff from "./diff.js";
import patch from "./patch.js";

// @ts-ignore
export default function(src, tar, { done } = {}) {
  if (done) {
    // @ts-ignore
    return diff(src, tar, {
      done(instructions) {
        patch(instructions);
        done(instructions);
      }
    });
  }
  const instructions = diff(src, tar);
  patch(instructions);
  return instructions;
}

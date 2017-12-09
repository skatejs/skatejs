import { html as lit } from 'lit-html/lib/lit-extended';

// This extends Lit to provide constructors as tag names. However, it's not
// fully working yet as there's some kings to work out, so we still export the
// standard html tagged literal for now.
export function htmlExtended(parts, ...args) {
  const newArgs = [];
  const newParts = parts.concat();
  const joinIndicies = [];
  for (let a = 0; a < args.length; a++) {
    const possibleCtor = args[a];
    if (possibleCtor && possibleCtor.is) {
      newParts[a] = newParts[a] + possibleCtor.is;
      joinIndicies.push(a);
    } else {
      newArgs.push(possibleCtor);
    }
  }
  for (let a = 0; a < joinIndicies.length; a++) {
    const join = joinIndicies[a] - a;
    newParts[join] = newParts[join] + newParts[join + 1];
    newParts.splice(join + 1, 1);
  }
  return lit(newParts, ...newArgs);
}

export { html } from 'lit-html/lib/lit-extended';

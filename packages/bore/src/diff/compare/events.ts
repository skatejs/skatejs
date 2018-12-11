import * as types from '../types';

export default function (src, tar) {
  const tarEvents = tar.events;
  const srcEvents = src.events;
  const instructions = [];

  // Remove any source events that aren't in the target before seeing if
  // we need to add any from the target.
  if (srcEvents) {
    for (let name in srcEvents) {
      const srcEvent = srcEvents[name];
      const tarEvent = tarEvents[name];
      if (!tarEvent || srcEvent !== tarEvent) {
        instructions.push({
          data: { name },
          target: tar,
          source: src,
          type: types.SET_EVENT
        });
      }
    }
  }

  // After instructing to remove any old events, we then can instruct to add
  // new events. This prevents the new events from being removed from earlier
  // instructions.
  if (tarEvents) {
    for (let name in tarEvents) {
      const srcEvent = srcEvents[name];
      const tarEvent = tarEvents[name];
      if (srcEvent !== tarEvent) {
        instructions.push({
          data: { name, value: tarEvent },
          target: tar,
          source: src,
          type: types.SET_EVENT
        });
      }
    }
  }

  return instructions;
}

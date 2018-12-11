import eventMap from '../util/event-map';
import nodeMap from '../util/node-map';

export default function (src, tar, data) {
  const realSrc = nodeMap[src.__id];
  const eventHandlers = eventMap(realSrc);
  const name = data.name;
  const prevHandler = eventHandlers[name];
  const nextHandler = data.value;

  if (typeof prevHandler === 'function') {
    delete eventHandlers[name];
    realSrc.removeEventListener(name, prevHandler);
  }

  if (typeof nextHandler === 'function') {
    eventHandlers[name] = nextHandler;
    realSrc.addEventListener(name, nextHandler);
  }
}

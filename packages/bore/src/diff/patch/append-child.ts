import nodeMap from "../util/node-map.js";
import toDom from "../to-dom.js";

export default function(src, tar) {
  nodeMap[src.__id].appendChild(toDom(tar));
}

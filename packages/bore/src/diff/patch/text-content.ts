import nodeMap from "../util/node-map.js";

export default function(src, tar) {
  nodeMap[src.__id].textContent = tar.textContent;
}

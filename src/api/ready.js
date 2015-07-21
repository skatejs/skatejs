import apiQuery from './query';
import utilData from '../util/data';

var MutationObserver = window.MutationObserver || window.SkateMutationObserver;

export default function (elem, name, func) {
  function mutationObserverHandler (mutations) {
    if (mutations && mutations[0].addedNodes && mutations[0].addedNodes.length) {
      apiQuery(elem, name, func);
    }
  }

  var data = utilData(elem);

  if (!data.readyObserver) {
    data.readyObserver = new MutationObserver(mutationObserverHandler);
    data.readyObserver.observe(elem, {
      childList: true,
      subtree: true
    });
  }

  apiQuery(elem, name, func);
}

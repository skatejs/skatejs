import utilData from '../util/data';

var MutationObserver = window.MutationObserver || window.SkateMutationObserver;

export default function (elem, func) {
  var data = utilData(elem);

  if (!data.elementObserverHandlers) {
    data.elementObserverHandlers = [];
    data.elementObserver = new MutationObserver(function mutationObserverHandler (mutations) {
      mutations.forEach(mutation =>
        data.elementObserverHandlers.forEach(mutationHandler =>
          mutationHandler(mutation.addedNodes || [], mutation.removedNodes || [])
        )
      );
    });
    data.elementObserver.observe(elem, {
      childList: true,
      subtree: true
    });
  }

  data.elementObserverHandlers.push(func);
}

import assignSafe from '../util/assign-safe';
import data from '../util/data';
import protos from '../util/protos';
import registry from '../global/registry';
import walkTree from '../util/walk-tree';

var elProto = window.Element.prototype;
var oldSetAttribute = elProto.setAttribute;
var oldRemoveAttribute = elProto.removeAttribute;

function fnOr (fn, otherwise = function () {}) {
  return typeof fn === 'function' ? fn : function () {
    return otherwise(this, fn);
  };
}

function applyPrototype (proto) {
  var prototypes = protos(proto);
  return function () {
    prototypes.forEach(proto => {
      if (!proto.isPrototypeOf(this)) {
        assignSafe(this, proto);
      }
    });
  };
}

function patchAttributeMethods (elem) {
  elem.setAttribute = function (name, newValue) {
    var oldValue = this.getAttribute(name);
    oldSetAttribute.call(elem, name, newValue);
    elem.attributeChangedCallback(name, oldValue, String(newValue));
  };

  elem.removeAttribute = function (name) {
    var oldValue = this.getAttribute(name);
    oldRemoveAttribute.call(elem, name);
    elem.attributeChangedCallback(name, oldValue, null);
  };
}

function callCreatedOnDescendants (elem, id) {
  walkTree(elem.childNodes, function (child) {
    registry.find(child).forEach(Ctor => Ctor.prototype.createdCallback.call(child));
  }, function (child) {
    return !data(child, id).created;
  });
}

function markAsResolved (elem, resolvedAttribute, unresolvedAttribute) {
  elem.removeAttribute(unresolvedAttribute);
  elem.setAttribute(resolvedAttribute, '');
}

export default function (opts) {
  let created = fnOr(opts.created);
  let prototype = applyPrototype(opts.prototype);
  let ready = fnOr(opts.ready);

  return function () {
    let info = data(this, opts.id);
    let isNative = this.createdCallback;
    let isResolved = this.hasAttribute(opts.resolvedAttribute);

    if (info.created) return;
    info.created = true;

    isNative || patchAttributeMethods(this);
    isNative || prototype.call(this);
    created.call(this);
    callCreatedOnDescendants(this, opts.id);
    ready.call(this);
    isResolved || markAsResolved(this, opts.resolvedAttribute, opts.unresolvedAttribute);
  };
}

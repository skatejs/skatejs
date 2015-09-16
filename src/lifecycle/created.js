import assignSafe from '../util/assign-safe';
import data from '../util/data';
import events from './events';
import properties from './properties';
import protos from '../util/protos';
import registry from '../global/registry';
import render from './render';
import walkTree from '../util/walk-tree';

let elProto = window.Element.prototype;
let oldSetAttribute = elProto.setAttribute;
let oldRemoveAttribute = elProto.removeAttribute;

function applyPrototype (proto) {
  let prototypes = protos(proto);
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
    let oldValue = this.getAttribute(name);
    oldSetAttribute.call(elem, name, newValue);
    elem.attributeChangedCallback(name, oldValue, String(newValue));
  };

  elem.removeAttribute = function (name) {
    let oldValue = this.getAttribute(name);
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

function createCallUpdateOnProperties (opts) {
  let props = opts.properties || {};
  let names = Object.keys(props);
  return function (elem) {
    names.forEach(function (name) {
      let prop = props[name];
      let update = prop && prop.update;
      let val = elem[name];
      if (prop && prop.type) {
        val = (prop.type === Boolean && elem.hasAttribute(typeof prop.attr === 'string' ? prop.attr : name)) || prop.type(val);
      }
      update && update.call(elem, val);
    });
  };
}

function markAsResolved (elem, resolvedAttribute, unresolvedAttribute) {
  elem.removeAttribute(unresolvedAttribute);
  elem.setAttribute(resolvedAttribute, '');
}

export default function (opts) {
  let created = opts.created;
  let isNative = opts.isNative;
  let callUpdateOnProperties = createCallUpdateOnProperties(opts);
  let prototype = applyPrototype(opts.prototype);
  let ready = opts.ready;

  return function () {
    let info = data(this, opts.id);
    let isResolved = this.hasAttribute(opts.resolvedAttribute);

    if (info.created) return;
    info.created = true;

    isNative || patchAttributeMethods(this);
    isNative || prototype.call(this);
    opts.created && created.call(this);
    properties.call(this, opts.properties);
    events.call(this, opts.events);
    render(this, opts);
    callCreatedOnDescendants(this, opts.id);
    callUpdateOnProperties(this);
    opts.ready && ready.call(this);
    isResolved || markAsResolved(this, opts.resolvedAttribute, opts.unresolvedAttribute);
  };
}

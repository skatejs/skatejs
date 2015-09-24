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

function applyPrototype (opts) {
  let prototypes = protos(opts.prototype);
  return function (elem) {
    prototypes.forEach(proto => {
      if (!proto.isPrototypeOf(elem)) {
        assignSafe(elem, proto);
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

function callCreatedOnDescendants (elem, opts) {
  let id = opts.id;
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
      update && update(elem, {
        name: name,
        newValue: val,
        oldValue: null
      });
    });
  };
}

function markAsResolved (elem, opts) {
  elem.removeAttribute(opts.unresolvedAttribute);
  elem.setAttribute(opts.resolvedAttribute, '');
}

export default function (opts) {
  let created = opts.created;
  let isNative = opts.isNative;
  let callUpdateOnProperties = createCallUpdateOnProperties(opts);
  let prototype = applyPrototype(opts);
  let ready = opts.ready;

  return function () {
    let info = data(this, opts.id);
    let isResolved = this.hasAttribute(opts.resolvedAttribute);

    if (info.created) return;
    info.created = true;

    isNative || patchAttributeMethods(this);
    isNative || prototype(this);
    created && created(this);
    properties(this, opts);
    events(this, opts);
    render(this, opts);
    callCreatedOnDescendants(this, opts);
    callUpdateOnProperties(this);
    ready && ready(this);
    isResolved || markAsResolved(this, opts);
  };
}

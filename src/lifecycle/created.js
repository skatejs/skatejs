import apiEvents from '../api/events';
import apiProperties from '../api/properties';
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
  var created = fnOr(opts.created);
  var events = fnOr(opts.events, apiEvents);
  var properties = fnOr(opts.properties, apiProperties);
  var prototype = applyPrototype(opts.prototype);
  var ready = fnOr(opts.ready);
  var template = fnOr(opts.template);

  /* jshint expr: true */
  return function () {
    var initProps;
    var info = data(this, opts.id);
    var isNative = this.createdCallback;

    // This ensures that this component cannot be triggered more than once on
    // this element. This is also for native so that we can force-init an
    // element and when the native callback is fired it can just be a no-op.
    if (info.created) return;
    info.created = true;

    // Ensure that attribute changes are propagated synchronously.
    isNative || patchAttributeMethods(this);

    // The inheriting of the prototype is the first thing to happen in native.
    isNative || prototype.call(this);

    // Bind events so we can catch them at the earliest point in the lifecycle.
    //
    // TODO Check to see if we need to delay execution of handlers until after
    // The ready lifecycle has been invoked so that we can make sure descendants
    // are initialised and ready just in case any code in the handlers tries to
    // pass on state.
    events.call(this);

    // Apply the template to the element.
    template.call(this);

    // The properties function returns a function that can be called to
    // initialise them on the element when appropriate.
    initProps = properties.call(this);

    // Call created() on the host. This may be called at any time, so no one
    // should not rely on descendants being initialised yet. This conforms with
    // native behaviour.
    created.call(this);

    // In both polyfill and native we force init all descendant components so
    // that we can ensure that created() and ready() have been called by the
    // time ready() is called on the parent / host.
    callCreatedOnDescendants(this, opts.id);

    // Now call ready. By this time, created() and ready () have been called on
    // all descendant components because we've forcefully done it above.
    ready.call(this);

    // We trigger all property handlers for properties that exist once all
    // descendants are ready for any incoming state updates. This will also
    // trigger changes for any attributes that are properties.
    initProps();

    // Resolve after everything in the created lifecycle has run. This is so
    // that whatever needs to be done before this can be done without FOUC.
    markAsResolved(this, opts.resolvedAttribute, opts.unresolvedAttribute);
  };
}

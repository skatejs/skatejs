import assignSafe from '../util/assign-safe';
import data from '../util/data';
import lifecycleEvents from './events';
import lifecycleProperties from './properties';
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
  var events = fnOr(opts.events, lifecycleEvents);
  var properties = fnOr(opts.properties, lifecycleProperties);
  var prototype = applyPrototype(opts.prototype);
  var template = fnOr(opts.template);

  /* jshint expr: true */
  return function () {
    var initEvents, initProps;
    var info = data(this, opts.id);
    var isNative = this.createdCallback;
    var isResolved = this.hasAttribute(opts.resolvedAttribute);

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
    // Any events that happen between here and when `initEvents()` is called
    // are queued up and not invoked until `initEvents()` is actually called.
    // This allows us to ensure that everything is set up before we actually
    // handle the events.
    initEvents = events.call(this);

    // The properties function returns a function that can be called to
    // initialise them on the element when appropriate. We bind property
    // handlers before calling any of the lifecycle handlers, but don't
    // actually initialise their values until after lifecycle callbacks have
    // been invoked.
    initProps = properties.call(this);

    // Apply the template to the element. In native, this may cause whatever
    // descendants are in the template (including existing innerHTML) to be
    // upgraded synchronously.
    //
    // We only template if the "resolved" attribute doesn't exist on the element
    // so that the developer can render server-side and only bind behaveiour
    // client-side.
    isResolved || template.call(this);

    // In both polyfill and native we force init all descendant components so
    // that we can ensure that created() has been called on all descendants
    // by the time it's called on the host.
    callCreatedOnDescendants(this, opts.id);

    // We trigger all property handlers for properties that exist once all
    // descendants are ready for any incoming state updates. This will also
    // trigger changes for any attributes that are properties.
    initProps();

    // Call created() on the host. If you properly declare your dependencies
    // (i.e., element-x needs element-y, you load element-y before element-x),
    // then you can assume that this created callback will be executed after
    // all descendant components' created callbacks have been executed.
    created.call(this);

    // We trigger all event handlers that have queued up so that nothing has
    // been lost since they were bound. This is done after initialising
    // properties because events may depend on initialised values. Any events
    // triggered from property initialisation will be queued up and initialised
    // here.
    initEvents();

    // Resolve after everything in the created lifecycle has run. This is so
    // that whatever needs to be done before this can be done without FOUC.
    //
    // We only need to do this if it's not resolved.
    isResolved || markAsResolved(this, opts.resolvedAttribute, opts.unresolvedAttribute);
  };
}

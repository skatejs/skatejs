(function() {
  'use strict';

  var HTMLElement = window.HTMLElement;
  var MutationObserver = window.MutationObserver;



  // Polyfill DOMAttrModified for PhantomJS
  // --------------------------------------

  if (!MutationObserver) {
    HTMLElement.prototype.__setAttribute = HTMLElement.prototype.setAttribute;
    HTMLElement.prototype.setAttribute = function(attrName, newVal)
    {
      var prevVal = this.getAttribute(attrName);
      this.__setAttribute(attrName, newVal);
      newVal = this.getAttribute(attrName);
      if (newVal !== prevVal)
      {
        var evt = document.createEvent('MutationEvent');
        evt.initMutationEvent(
          'DOMAttrModified',
          true,
          false,
          this,
          prevVal || '',
          newVal || '',
          attrName,
          (prevVal === null) ? evt.ADDITION : evt.MODIFICATION
        );
        this.dispatchEvent(evt);
      }
    };

    HTMLElement.prototype.__removeAttribute = HTMLElement.prototype.removeAttribute;
    HTMLElement.prototype.removeAttribute = function(attrName)
    {
      var prevVal = this.getAttribute(attrName);
      this.__removeAttribute(attrName);
      var evt = document.createEvent('MutationEvent');
      evt.initMutationEvent(
        'DOMAttrModified',
        true,
        false,
        this,
        prevVal,
        '',
        attrName,
        evt.REMOVAL
      );
      this.dispatchEvent(evt);
    };
  }



  // Function.prototype.bind
  // -----------------------

  if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
      if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5
        // internal IsCallable function
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
      }

      var aArgs = Array.prototype.slice.call(arguments, 1),
          fToBind = this,
          Fnop = function () {},
          fBound = function () {
            return fToBind.apply(this instanceof Fnop && oThis ? this : oThis,
              aArgs.concat(Array.prototype.slice.call(arguments)));
          };

      Fnop.prototype = this.prototype;
      fBound.prototype = new Fnop();

      return fBound;
    };
  }

}());

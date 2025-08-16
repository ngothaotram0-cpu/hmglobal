/*!
 * Bootstrap v4.3.1 (https://getbootstrap.com/)
 * Copyright 2011-2019 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * Modified by theJ (2019-07-01) - add modalOpen function (LGCOMUS-1209)
 */
(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? factory(exports, require("jquery"), require("popper.js"))
    : typeof define === "function" && define.amd
    ? define(["exports", "jquery", "popper.js"], factory)
    : ((global = global || self),
      factory((global.bootstrap = {}), global.jQuery, global.Popper));
})(this, function (exports, $, Popper) {
  "use strict";

  // theJ
  // 20200413 START 박지영 - modal 닫을 때, 스크롤 위치가 0이 되는 버그 수정
  var scrollTop;
  // 20200413 END
  function modalOpen(va) {
    // only safari
    if (va) {
      // true
      if ("ontouchstart" in window) {
        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = (document.compatMode || "") === "CSS1Compat";
        // 20200413 START 박지영 - modal 닫을 때, 스크롤 위치가 0이 되는 버그 수정
        scrollTop = supportPageOffset
          ? window.pageYOffset
          : isCSS1Compat
          ? document.documentElement.scrollTop
          : document.body.scrollTop;
        // 20200413 END
        document.body.style.top = scrollTop * -1 + "px";
        document.body.style.position = "fixed";
        document.body.style.width = window.outerWidth + "px"; // 20200402 김우람  || 모바일에서 모달이 나올때 width 값 틀어지는 부분 수정
      }
    } else {
      // false
      if ("ontouchstart" in window) {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = ""; // 20200402 김우람  || 모바일에서 모달이 나올때 width 값 틀어지는 부분 수정
        // 20200413 START 박지영 - modal 닫을 때, 스크롤 위치가 0이 되는 버그 수정
        window.scroll(0, scrollTop);
        // 20200413 END
      }
    }
  }

  $ = $ && $.hasOwnProperty("default") ? $["default"] : $;
  Popper =
    Popper && Popper.hasOwnProperty("default") ? Popper["default"] : Popper;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true,
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === "function") {
        ownKeys = ownKeys.concat(
          Object.getOwnPropertySymbols(source).filter(function (sym) {
            return Object.getOwnPropertyDescriptor(source, sym).enumerable;
          })
        );
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.3.1): util.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Private TransitionEnd Helpers
   * ------------------------------------------------------------------------
   */

  var TRANSITION_END = "transitionend";
  var MAX_UID = 1000000;
  var MILLISECONDS_MULTIPLIER = 1000; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

  function toType(obj) {
    return {}.toString
      .call(obj)
      .match(/\s([a-z]+)/i)[1]
      .toLowerCase();
  }

  function getSpecialTransitionEndEvent() {
    return {
      bindType: TRANSITION_END,
      delegateType: TRANSITION_END,
      handle: function handle(event) {
        if ($(event.target).is(this)) {
          return event.handleObj.handler.apply(this, arguments); // eslint-disable-line prefer-rest-params
        }

        return undefined; // eslint-disable-line no-undefined
      },
    };
  }

  function transitionEndEmulator(duration) {
    var _this = this;

    var called = false;
    $(this).one(Util.TRANSITION_END, function () {
      called = true;
    });
    setTimeout(function () {
      if (!called) {
        Util.triggerTransitionEnd(_this);
      }
    }, duration);
    return this;
  }

  function setTransitionEndSupport() {
    $.fn.emulateTransitionEnd = transitionEndEmulator;
    $.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
  }
  /**
   * --------------------------------------------------------------------------
   * Public Util Api
   * --------------------------------------------------------------------------
   */

  var Util = {
    TRANSITION_END: "bsTransitionEnd",
    getUID: function getUID(prefix) {
      do {
        // eslint-disable-next-line no-bitwise
        prefix += ~~(Math.random() * MAX_UID); // "~~" acts like a faster Math.floor() here
      } while (document.getElementById(prefix));

      return prefix;
    },
    getSelectorFromElement: function getSelectorFromElement(element) {
      var selector = element.getAttribute("data-target");

      if (!selector || selector === "#") {
        var hrefAttr = element.getAttribute("href");
        selector = hrefAttr && hrefAttr !== "#" ? hrefAttr.trim() : "";
      }

      try {
        return document.querySelector(selector) ? selector : null;
      } catch (err) {
        return null;
      }
    },
    getTransitionDurationFromElement: function getTransitionDurationFromElement(
      element
    ) {
      if (!element) {
        return 0;
      } // Get transition-duration of the element

      var transitionDuration = $(element).css("transition-duration");
      var transitionDelay = $(element).css("transition-delay");
      var floatTransitionDuration = parseFloat(transitionDuration);
      var floatTransitionDelay = parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

      if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
      } // If multiple durations are defined, take the first

      transitionDuration = transitionDuration.split(",")[0];
      transitionDelay = transitionDelay.split(",")[0];
      return (
        (parseFloat(transitionDuration) + parseFloat(transitionDelay)) *
        MILLISECONDS_MULTIPLIER
      );
    },
    reflow: function reflow(element) {
      return element.offsetHeight;
    },
    triggerTransitionEnd: function triggerTransitionEnd(element) {
      $(element).trigger(TRANSITION_END);
    },
    // TODO: Remove in v5
    supportsTransitionEnd: function supportsTransitionEnd() {
      return Boolean(TRANSITION_END);
    },
    isElement: function isElement(obj) {
      return (obj[0] || obj).nodeType;
    },
    typeCheckConfig: function typeCheckConfig(
      componentName,
      config,
      configTypes
    ) {
      for (var property in configTypes) {
        if (Object.prototype.hasOwnProperty.call(configTypes, property)) {
          var expectedTypes = configTypes[property];
          var value = config[property];
          var valueType =
            value && Util.isElement(value) ? "element" : toType(value);

          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error(
              componentName.toUpperCase() +
                ": " +
                ('Option "' +
                  property +
                  '" provided type "' +
                  valueType +
                  '" ') +
                ('but expected type "' + expectedTypes + '".')
            );
          }
        }
      }
    },
    findShadowRoot: function findShadowRoot(element) {
      if (!document.documentElement.attachShadow) {
        return null;
      } // Can find the shadow root otherwise it'll return the document

      if (typeof element.getRootNode === "function") {
        var root = element.getRootNode();
        return root instanceof ShadowRoot ? root : null;
      }

      if (element instanceof ShadowRoot) {
        return element;
      } // when we don't find a shadow root

      if (!element.parentNode) {
        return null;
      }

      return Util.findShadowRoot(element.parentNode);
    },
  };
  setTransitionEndSupport();

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$3 = "collapse";
  var VERSION$3 = "4.3.1";
  var DATA_KEY$3 = "bs.collapse";
  var EVENT_KEY$3 = "." + DATA_KEY$3;
  var DATA_API_KEY$3 = ".data-api";
  var JQUERY_NO_CONFLICT$3 = $.fn[NAME$3];
  var Default$1 = {
    toggle: true,
    parent: "",
  };
  var DefaultType$1 = {
    toggle: "boolean",
    parent: "(string|element)",
  };
  var Event$3 = {
    SHOW: "show" + EVENT_KEY$3,
    SHOWN: "shown" + EVENT_KEY$3,
    HIDE: "hide" + EVENT_KEY$3,
    HIDDEN: "hidden" + EVENT_KEY$3,
    CLICK_DATA_API: "click" + EVENT_KEY$3 + DATA_API_KEY$3,
  };
  var ClassName$3 = {
    SHOW: "show",
    COLLAPSE: "collapse",
    COLLAPSING: "collapsing",
    COLLAPSED: "collapsed",
  };
  var Dimension = {
    WIDTH: "width",
    HEIGHT: "height",
  };
  var Selector$3 = {
    ACTIVES: ".show, .collapsing",
    DATA_TOGGLE: '[data-toggle="collapse"]',
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
  };

  var Collapse =
    /*#__PURE__*/
    (function () {
      function Collapse(element, config) {
        this._isTransitioning = false;
        this._element = element;
        this._config = this._getConfig(config);
        this._triggerArray = [].slice.call(
          document.querySelectorAll(
            '[data-toggle="collapse"][href="#' +
              element.id +
              '"],' +
              ('[data-toggle="collapse"][data-target="#' + element.id + '"]')
          )
        );
        var toggleList = [].slice.call(
          document.querySelectorAll(Selector$3.DATA_TOGGLE)
        );

        for (var i = 0, len = toggleList.length; i < len; i++) {
          var elem = toggleList[i];
          var selector = Util.getSelectorFromElement(elem);
          var filterElement = [].slice
            .call(document.querySelectorAll(selector))
            .filter(function (foundElem) {
              return foundElem === element;
            });

          if (selector !== null && filterElement.length > 0) {
            this._selector = selector;

            this._triggerArray.push(elem);
          }
        }

        this._parent = this._config.parent ? this._getParent() : null;

        if (!this._config.parent) {
          this._addAriaAndCollapsedClass(this._element, this._triggerArray);
        }

        if (this._config.toggle) {
          this.toggle();
        }
      } // Getters

      var _proto = Collapse.prototype;

      // Public
      _proto.toggle = function toggle() {
        if ($(this._element).hasClass(ClassName$3.SHOW)) {
          this.hide();
        } else {
          this.show();
        }
      };

      _proto.show = function show() {
        var _this = this;

        if (
          this._isTransitioning ||
          $(this._element).hasClass(ClassName$3.SHOW)
        ) {
          return;
        }

        var actives;
        var activesData;

        if (this._parent) {
          actives = [].slice
            .call(this._parent.querySelectorAll(Selector$3.ACTIVES))
            .filter(function (elem) {
              if (typeof _this._config.parent === "string") {
                return (
                  elem.getAttribute("data-parent") === _this._config.parent
                );
              }

              return elem.classList.contains(ClassName$3.COLLAPSE);
            });

          if (actives.length === 0) {
            actives = null;
          }
        }

        if (actives) {
          activesData = $(actives).not(this._selector).data(DATA_KEY$3);

          if (activesData && activesData._isTransitioning) {
            return;
          }
        }

        var startEvent = $.Event(Event$3.SHOW);
        $(this._element).trigger(startEvent);

        if (startEvent.isDefaultPrevented()) {
          return;
        }

        if (actives) {
          Collapse._jQueryInterface.call(
            $(actives).not(this._selector),
            "hide"
          );

          if (!activesData) {
            $(actives).data(DATA_KEY$3, null);
          }
        }

        var dimension = this._getDimension();

        $(this._element)
          .removeClass(ClassName$3.COLLAPSE)
          .addClass(ClassName$3.COLLAPSING);
        this._element.style[dimension] = 0;

        if (this._triggerArray.length) {
          $(this._triggerArray)
            .removeClass(ClassName$3.COLLAPSED)
            .attr("aria-expanded", true);
        }

        this.setTransitioning(true);

        var complete = function complete() {
          $(_this._element)
            .removeClass(ClassName$3.COLLAPSING)
            .addClass(ClassName$3.COLLAPSE)
            .addClass(ClassName$3.SHOW);
          _this._element.style[dimension] = "";

          _this.setTransitioning(false);

          $(_this._element).trigger(Event$3.SHOWN);
        };

        var capitalizedDimension =
          dimension[0].toUpperCase() + dimension.slice(1);
        var scrollSize = "scroll" + capitalizedDimension;
        var transitionDuration = Util.getTransitionDurationFromElement(
          this._element
        );
        $(this._element)
          .one(Util.TRANSITION_END, complete)
          .emulateTransitionEnd(transitionDuration);
        this._element.style[dimension] = this._element[scrollSize] + "px";
      };

      _proto.hide = function hide() {
        var _this2 = this;

        if (
          this._isTransitioning ||
          !$(this._element).hasClass(ClassName$3.SHOW)
        ) {
          return;
        }

        var startEvent = $.Event(Event$3.HIDE);
        $(this._element).trigger(startEvent);

        if (startEvent.isDefaultPrevented()) {
          return;
        }

        var dimension = this._getDimension();

        this._element.style[dimension] =
          this._element.getBoundingClientRect()[dimension] + "px";
        Util.reflow(this._element);
        $(this._element)
          .addClass(ClassName$3.COLLAPSING)
          .removeClass(ClassName$3.COLLAPSE)
          .removeClass(ClassName$3.SHOW);
        var triggerArrayLength = this._triggerArray.length;

        if (triggerArrayLength > 0) {
          for (var i = 0; i < triggerArrayLength; i++) {
            var trigger = this._triggerArray[i];
            var selector = Util.getSelectorFromElement(trigger);

            if (selector !== null) {
              var $elem = $([].slice.call(document.querySelectorAll(selector)));

              if (!$elem.hasClass(ClassName$3.SHOW)) {
                $(trigger)
                  .addClass(ClassName$3.COLLAPSED)
                  .attr("aria-expanded", false);
              }
            }
          }
        }

        this.setTransitioning(true);

        var complete = function complete() {
          _this2.setTransitioning(false);

          $(_this2._element)
            .removeClass(ClassName$3.COLLAPSING)
            .addClass(ClassName$3.COLLAPSE)
            .trigger(Event$3.HIDDEN);
        };

        this._element.style[dimension] = "";
        var transitionDuration = Util.getTransitionDurationFromElement(
          this._element
        );
        $(this._element)
          .one(Util.TRANSITION_END, complete)
          .emulateTransitionEnd(transitionDuration);
      };

      _proto.setTransitioning = function setTransitioning(isTransitioning) {
        this._isTransitioning = isTransitioning;
      };

      _proto.dispose = function dispose() {
        $.removeData(this._element, DATA_KEY$3);
        this._config = null;
        this._parent = null;
        this._element = null;
        this._triggerArray = null;
        this._isTransitioning = null;
      }; // Private

      _proto._getConfig = function _getConfig(config) {
        config = _objectSpread({}, Default$1, config);
        config.toggle = Boolean(config.toggle); // Coerce string values

        Util.typeCheckConfig(NAME$3, config, DefaultType$1);
        return config;
      };

      _proto._getDimension = function _getDimension() {
        var hasWidth = $(this._element).hasClass(Dimension.WIDTH);
        return hasWidth ? Dimension.WIDTH : Dimension.HEIGHT;
      };

      _proto._getParent = function _getParent() {
        var _this3 = this;

        var parent;

        if (Util.isElement(this._config.parent)) {
          parent = this._config.parent; // It's a jQuery object

          if (typeof this._config.parent.jquery !== "undefined") {
            parent = this._config.parent[0];
          }
        } else {
          parent = document.querySelector(this._config.parent);
        }

        var selector =
          '[data-toggle="collapse"][data-parent="' + this._config.parent + '"]';
        var children = [].slice.call(parent.querySelectorAll(selector));
        $(children).each(function (i, element) {
          _this3._addAriaAndCollapsedClass(
            Collapse._getTargetFromElement(element),
            [element]
          );
        });
        return parent;
      };

      _proto._addAriaAndCollapsedClass = function _addAriaAndCollapsedClass(
        element,
        triggerArray
      ) {
        var isOpen = $(element).hasClass(ClassName$3.SHOW);

        if (triggerArray.length) {
          $(triggerArray)
            .toggleClass(ClassName$3.COLLAPSED, !isOpen)
            .attr("aria-expanded", isOpen);
        }
      }; // Static

      Collapse._getTargetFromElement = function _getTargetFromElement(element) {
        var selector = Util.getSelectorFromElement(element);
        return selector ? document.querySelector(selector) : null;
      };

      Collapse._jQueryInterface = function _jQueryInterface(config) {
        return this.each(function () {
          var $this = $(this);
          var data = $this.data(DATA_KEY$3);

          var _config = _objectSpread(
            {},
            Default$1,
            $this.data(),
            typeof config === "object" && config ? config : {}
          );

          if (!data && _config.toggle && /show|hide/.test(config)) {
            _config.toggle = false;
          }

          if (!data) {
            data = new Collapse(this, _config);
            $this.data(DATA_KEY$3, data);
          }

          if (typeof config === "string") {
            if (typeof data[config] === "undefined") {
              throw new TypeError('No method named "' + config + '"');
            }

            data[config]();
          }
        });
      };

      _createClass(Collapse, null, [
        {
          key: "VERSION",
          get: function get() {
            return VERSION$3;
          },
        },
        {
          key: "Default",
          get: function get() {
            return Default$1;
          },
        },
      ]);

      return Collapse;
    })();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(document).on(
    Event$3.CLICK_DATA_API,
    Selector$3.DATA_TOGGLE,
    function (event) {
      // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
      if (event.currentTarget.tagName === "A") {
        event.preventDefault();
      }

      var $trigger = $(this);
      var selector = Util.getSelectorFromElement(this);
      var selectors = [].slice.call(document.querySelectorAll(selector));
      $(selectors).each(function () {
        var $target = $(this);
        var data = $target.data(DATA_KEY$3);
        var config = data ? "toggle" : $trigger.data();

        Collapse._jQueryInterface.call($target, config);
      });
    }
  );
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$3] = Collapse._jQueryInterface;
  $.fn[NAME$3].Constructor = Collapse;

  $.fn[NAME$3].noConflict = function () {
    $.fn[NAME$3] = JQUERY_NO_CONFLICT$3;
    return Collapse._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$5 = "modal";
  var VERSION$5 = "4.3.1";
  var DATA_KEY$5 = "bs.modal";
  var EVENT_KEY$5 = "." + DATA_KEY$5;
  var DATA_API_KEY$5 = ".data-api";
  var JQUERY_NO_CONFLICT$5 = $.fn[NAME$5];
  var ESCAPE_KEYCODE$1 = 27; // KeyboardEvent.which value for Escape (Esc) key

  var Default$3 = {
    backdrop: true,
    keyboard: true,
    focus: true,
    show: true,
  };
  var DefaultType$3 = {
    backdrop: "(boolean|string)",
    keyboard: "boolean",
    focus: "boolean",
    show: "boolean",
  };
  var Event$5 = {
    HIDE: "hide" + EVENT_KEY$5,
    HIDDEN: "hidden" + EVENT_KEY$5,
    SHOW: "show" + EVENT_KEY$5,
    SHOWN: "shown" + EVENT_KEY$5,
    FOCUSIN: "focusin" + EVENT_KEY$5,
    RESIZE: "resize" + EVENT_KEY$5,
    CLICK_DISMISS: "click.dismiss" + EVENT_KEY$5,
    KEYDOWN_DISMISS: "keydown.dismiss" + EVENT_KEY$5,
    MOUSEUP_DISMISS: "mouseup.dismiss" + EVENT_KEY$5,
    MOUSEDOWN_DISMISS: "mousedown.dismiss" + EVENT_KEY$5,
    CLICK_DATA_API: "click" + EVENT_KEY$5 + DATA_API_KEY$5,
  };
  var ClassName$5 = {
    SCROLLABLE: "modal-dialog-scrollable",
    SCROLLBAR_MEASURER: "modal-scrollbar-measure",
    BACKDROP: "modal-backdrop",
    OPEN: "modal-open",
    FADE: "fade",
    SHOW: "show",
  };
  var Selector$5 = {
    DIALOG: ".modal-dialog",
    MODAL_BODY: ".modal-body",
    DATA_TOGGLE: '[data-toggle="modal"]',
    DATA_DISMISS: '[data-dismiss="modal"]',
    FIXED_CONTENT: ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",
    STICKY_CONTENT: ".sticky-top",
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
  };

  var Modal =
    /*#__PURE__*/
    (function () {
      function Modal(element, config) {
        this._config = this._getConfig(config);
        this._element = element;
        this._dialog = element.querySelector(Selector$5.DIALOG);
        this._backdrop = null;
        this._isShown = false;
        this._isBodyOverflowing = false;
        this._ignoreBackdropClick = false;
        this._isTransitioning = false;
        this._scrollbarWidth = 0;
      } // Getters

      var _proto = Modal.prototype;

      // Public
      _proto.toggle = function toggle(relatedTarget) {
        return this._isShown ? this.hide() : this.show(relatedTarget);
      };

      _proto.show = function show(relatedTarget) {
        var _this = this;

        if (this._isShown || this._isTransitioning) {
          return;
        }

        if ($(this._element).hasClass(ClassName$5.FADE)) {
          this._isTransitioning = true;
        }

        var showEvent = $.Event(Event$5.SHOW, {
          relatedTarget: relatedTarget,
        });
        $(this._element).trigger(showEvent);

        if (this._isShown || showEvent.isDefaultPrevented()) {
          return;
        }

        this._isShown = true;

        this._checkScrollbar();

        this._setScrollbar();

        this._adjustDialog();

        this._setEscapeEvent();

        this._setResizeEvent();

        $(this._element).on(
          Event$5.CLICK_DISMISS,
          Selector$5.DATA_DISMISS,
          function (event) {
            // 2019-12-04 | add data rft
            var rft = this.getAttribute("data-rft");
            if (rft && rft !== "") {
              document.querySelector(rft).focus();
            }
            return _this.hide(event);
          }
        );
        $(this._dialog).on(Event$5.MOUSEDOWN_DISMISS, function () {
          $(_this._element).one(Event$5.MOUSEUP_DISMISS, function (event) {
            if ($(event.target).is(_this._element)) {
              _this._ignoreBackdropClick = true;
            }
          });
        });

        this._showBackdrop(function () {
          return _this._showElement(relatedTarget);
        });
      };

      _proto.hide = function hide(event) {
        var _this2 = this;

        if (event) {
          event.preventDefault();
        }

        if (!this._isShown || this._isTransitioning) {
          return;
        }

        var hideEvent = $.Event(Event$5.HIDE);
        $(this._element).trigger(hideEvent);

        if (!this._isShown || hideEvent.isDefaultPrevented()) {
          return;
        }

        this._isShown = false;
        var transition = $(this._element).hasClass(ClassName$5.FADE);

        if (transition) {
          this._isTransitioning = true;
        }

        this._setEscapeEvent();

        this._setResizeEvent();

        $(document).off(Event$5.FOCUSIN);
        $(this._element).removeClass(ClassName$5.SHOW);
        $(this._element).off(Event$5.CLICK_DISMISS);
        $(this._dialog).off(Event$5.MOUSEDOWN_DISMISS);

        if (transition) {
          var transitionDuration = Util.getTransitionDurationFromElement(
            this._element
          );
          $(this._element)
            .one(Util.TRANSITION_END, function (event) {
              return _this2._hideModal(event);
            })
            .emulateTransitionEnd(transitionDuration);
        } else {
          this._hideModal();
        }
      };

      _proto.dispose = function dispose() {
        [window, this._element, this._dialog].forEach(function (htmlElement) {
          return $(htmlElement).off(EVENT_KEY$5);
        });
        /**
         * `document` has 2 events `Event.FOCUSIN` and `Event.CLICK_DATA_API`
         * Do not move `document` in `htmlElements` array
         * It will remove `Event.CLICK_DATA_API` event that should remain
         */

        $(document).off(Event$5.FOCUSIN);
        $.removeData(this._element, DATA_KEY$5);
        this._config = null;
        this._element = null;
        this._dialog = null;
        this._backdrop = null;
        this._isShown = null;
        this._isBodyOverflowing = null;
        this._ignoreBackdropClick = null;
        this._isTransitioning = null;
        this._scrollbarWidth = null;
      };

      _proto.handleUpdate = function handleUpdate() {
        this._adjustDialog();
      }; // Private

      _proto._getConfig = function _getConfig(config) {
        config = _objectSpread({}, Default$3, config);
        Util.typeCheckConfig(NAME$5, config, DefaultType$3);
        return config;
      };

      _proto._showElement = function _showElement(relatedTarget) {
        var _this3 = this;

        var transition = $(this._element).hasClass(ClassName$5.FADE);

        if (
          !this._element.parentNode ||
          this._element.parentNode.nodeType !== Node.ELEMENT_NODE
        ) {
          // Don't move modal's DOM position
          document.body.appendChild(this._element);
        }

        this._element.style.display = "block";

        this._element.removeAttribute("aria-hidden");

        // 20200316 START 박지영 : role이 dialog인 경우에는 (pdp summary only) aria-modal 추가하지 않음.
        if (
          !$(this._element).attr("role") ||
          $(this._element).attr("role") != "dialog"
        )
          this._element.setAttribute("aria-modal", true);
        // 20200316 END

        if ($(this._dialog).hasClass(ClassName$5.SCROLLABLE)) {
          this._dialog.querySelector(Selector$5.MODAL_BODY).scrollTop = 0;
        } else {
          this._element.scrollTop = 0;
        }

        if (transition) {
          Util.reflow(this._element);
        }

        $(this._element).addClass(ClassName$5.SHOW);

        if (this._config.focus) {
          this._enforceFocus();
        }

        var shownEvent = $.Event(Event$5.SHOWN, {
          relatedTarget: relatedTarget,
        });

        var transitionComplete = function transitionComplete() {
          if (_this3._config.focus) {
            _this3._element.focus();
          }

          _this3._isTransitioning = false;
          $(_this3._element).trigger(shownEvent);
        };

        if (transition) {
          var transitionDuration = Util.getTransitionDurationFromElement(
            this._dialog
          );
          $(this._dialog)
            .one(Util.TRANSITION_END, transitionComplete)
            .emulateTransitionEnd(transitionDuration);
        } else {
          transitionComplete();
        }
      };

      _proto._enforceFocus = function _enforceFocus() {
        var _this4 = this;

        $(document)
          .off(Event$5.FOCUSIN) // Guard against infinite focus loop
          .on(Event$5.FOCUSIN, function (event) {
            // 2019-12-04 | Exception processing data-rft
            if (
              document !== event.target &&
              _this4._element !== event.target &&
              $(_this4._element).has(event.target).length === 0 &&
              !$(_this4._element).find("[data-rft]").length
            ) {
              _this4._element.focus();
            }
          });
      };

      _proto._setEscapeEvent = function _setEscapeEvent() {
        var _this5 = this;

        if (this._isShown && this._config.keyboard) {
          $(this._element).on(Event$5.KEYDOWN_DISMISS, function (event) {
            if (event.which === ESCAPE_KEYCODE$1) {
              event.preventDefault();

              _this5.hide();
            }
          });
        } else if (!this._isShown) {
          $(this._element).off(Event$5.KEYDOWN_DISMISS);
        }
      };

      _proto._setResizeEvent = function _setResizeEvent() {
        var _this6 = this;

        if (this._isShown) {
          $(window).on(Event$5.RESIZE, function (event) {
            return _this6.handleUpdate(event);
          });
        } else {
          $(window).off(Event$5.RESIZE);
        }
      };

      _proto._hideModal = function _hideModal() {
        var _this7 = this;

        this._element.style.display = "none";

        this._element.setAttribute("aria-hidden", true);

        this._element.removeAttribute("aria-modal");

        this._isTransitioning = false;

        this._showBackdrop(function () {
          modalOpen(false); // theJ

          // 2019-12-04 | Another modal is on
          if (!$(document.body).find(".modal.show").length) {
            $(document.body).removeClass(ClassName$5.OPEN);
            _this7._resetAdjustments();
            _this7._resetScrollbar();
          }
          $(_this7._element).trigger(Event$5.HIDDEN);
        });
      };

      _proto._removeBackdrop = function _removeBackdrop() {
        if (this._backdrop) {
          $(this._backdrop).remove();
          this._backdrop = null;
        }
      };

      _proto._showBackdrop = function _showBackdrop(callback) {
        var _this8 = this;

        var animate = $(this._element).hasClass(ClassName$5.FADE)
          ? ClassName$5.FADE
          : "";

        if (this._isShown && this._config.backdrop) {
          this._backdrop = document.createElement("div");
          this._backdrop.className = ClassName$5.BACKDROP;

          if (animate) {
            this._backdrop.classList.add(animate);
          }

          $(this._backdrop).appendTo(document.body);
          $(this._element).on(Event$5.CLICK_DISMISS, function (event) {
            if (_this8._ignoreBackdropClick) {
              _this8._ignoreBackdropClick = false;
              return;
            }

            if (event.target !== event.currentTarget) {
              return;
            }

            if (_this8._config.backdrop === "static") {
              _this8._element.focus();
            } else {
              _this8.hide();
            }
          });

          if (animate) {
            Util.reflow(this._backdrop);
          }

          $(this._backdrop).addClass(ClassName$5.SHOW);

          if (!callback) {
            return;
          }

          if (!animate) {
            callback();
            return;
          }

          var backdropTransitionDuration =
            Util.getTransitionDurationFromElement(this._backdrop);
          $(this._backdrop)
            .one(Util.TRANSITION_END, callback)
            .emulateTransitionEnd(backdropTransitionDuration);
        } else if (!this._isShown && this._backdrop) {
          $(this._backdrop).removeClass(ClassName$5.SHOW);

          var callbackRemove = function callbackRemove() {
            _this8._removeBackdrop();

            if (callback) {
              callback();
            }
          };

          if ($(this._element).hasClass(ClassName$5.FADE)) {
            var _backdropTransitionDuration =
              Util.getTransitionDurationFromElement(this._backdrop);

            $(this._backdrop)
              .one(Util.TRANSITION_END, callbackRemove)
              .emulateTransitionEnd(_backdropTransitionDuration);
          } else {
            callbackRemove();
          }
        } else if (callback) {
          callback();
        }
      }; // ----------------------------------------------------------------------
      // the following methods are used to handle overflowing modals
      // todo (fat): these should probably be refactored out of modal.js
      // ----------------------------------------------------------------------

      _proto._adjustDialog = function _adjustDialog() {
        var isModalOverflowing =
          this._element.scrollHeight > document.documentElement.clientHeight;

        if (!this._isBodyOverflowing && isModalOverflowing) {
          this._element.style.paddingLeft = this._scrollbarWidth + "px";
        }

        if (this._isBodyOverflowing && !isModalOverflowing) {
          this._element.style.paddingRight = this._scrollbarWidth + "px";
        }
      };

      _proto._resetAdjustments = function _resetAdjustments() {
        this._element.style.paddingLeft = "";
        this._element.style.paddingRight = "";
      };

      _proto._checkScrollbar = function _checkScrollbar() {
        var rect = document.body.getBoundingClientRect();
        this._isBodyOverflowing = rect.left + rect.right < window.innerWidth;
        this._scrollbarWidth = this._getScrollbarWidth();
      };

      _proto._setScrollbar = function _setScrollbar() {
        var _this9 = this;

        if (this._isBodyOverflowing) {
          // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
          //   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set
          var fixedContent = [].slice.call(
            document.querySelectorAll(Selector$5.FIXED_CONTENT)
          );
          var stickyContent = [].slice.call(
            document.querySelectorAll(Selector$5.STICKY_CONTENT)
          ); // Adjust fixed content padding

          $(fixedContent).each(function (index, element) {
            var actualPadding = element.style.paddingRight;
            var calculatedPadding = $(element).css("padding-right");
            $(element)
              .data("padding-right", actualPadding)
              .css(
                "padding-right",
                parseFloat(calculatedPadding) + _this9._scrollbarWidth + "px"
              );
          }); // Adjust sticky content margin

          $(stickyContent).each(function (index, element) {
            var actualMargin = element.style.marginRight;
            var calculatedMargin = $(element).css("margin-right");
            $(element)
              .data("margin-right", actualMargin)
              .css(
                "margin-right",
                parseFloat(calculatedMargin) - _this9._scrollbarWidth + "px"
              );
          }); // Adjust body padding

          var actualPadding = document.body.style.paddingRight;
          var calculatedPadding = $(document.body).css("padding-right");
          $(document.body)
            .data("padding-right", actualPadding)
            .css(
              "padding-right",
              parseFloat(calculatedPadding) + this._scrollbarWidth + "px"
            );
        }

        $(document.body).addClass(ClassName$5.OPEN);
        /* 20190819 : LGEUS-11788 modify */
        if (_this9._element.id != "compare_alert") {
          modalOpen(true); // theJ
        }
        /* //20190819 : LGEUS-11788 modify */
      };

      _proto._resetScrollbar = function _resetScrollbar() {
        // Restore fixed content padding
        var fixedContent = [].slice.call(
          document.querySelectorAll(Selector$5.FIXED_CONTENT)
        );
        $(fixedContent).each(function (index, element) {
          var padding = $(element).data("padding-right");
          $(element).removeData("padding-right");
          element.style.paddingRight = padding ? padding : "";
        }); // Restore sticky content

        var elements = [].slice.call(
          document.querySelectorAll("" + Selector$5.STICKY_CONTENT)
        );
        $(elements).each(function (index, element) {
          var margin = $(element).data("margin-right");

          if (typeof margin !== "undefined") {
            $(element).css("margin-right", margin).removeData("margin-right");
          }
        }); // Restore body padding

        var padding = $(document.body).data("padding-right");
        $(document.body).removeData("padding-right");
        document.body.style.paddingRight = padding ? padding : "";
      };

      _proto._getScrollbarWidth = function _getScrollbarWidth() {
        // thx d.walsh
        var scrollDiv = document.createElement("div");
        scrollDiv.className = ClassName$5.SCROLLBAR_MEASURER;
        document.body.appendChild(scrollDiv);
        var scrollbarWidth =
          scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        return scrollbarWidth;
      }; // Static

      Modal._jQueryInterface = function _jQueryInterface(
        config,
        relatedTarget
      ) {
        return this.each(function () {
          var data = $(this).data(DATA_KEY$5);

          var _config = _objectSpread(
            {},
            Default$3,
            $(this).data(),
            typeof config === "object" && config ? config : {}
          );

          if (!data) {
            data = new Modal(this, _config);
            $(this).data(DATA_KEY$5, data);
          }

          if (typeof config === "string") {
            if (typeof data[config] === "undefined") {
              throw new TypeError('No method named "' + config + '"');
            }

            data[config](relatedTarget);
          } else if (_config.show) {
            data.show(relatedTarget);
          }
        });
      };

      _createClass(Modal, null, [
        {
          key: "VERSION",
          get: function get() {
            return VERSION$5;
          },
        },
        {
          key: "Default",
          get: function get() {
            return Default$3;
          },
        },
      ]);

      return Modal;
    })();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(document).on(
    Event$5.CLICK_DATA_API,
    Selector$5.DATA_TOGGLE,
    function (event) {
      var _this10 = this;

      var target;
      var selector = Util.getSelectorFromElement(this);

      if (selector) {
        target = document.querySelector(selector);
      }

      var config = $(target).data(DATA_KEY$5)
        ? "toggle"
        : _objectSpread({}, $(target).data(), $(this).data());

      if (this.tagName === "A" || this.tagName === "AREA") {
        event.preventDefault();
      }

      var $target = $(target).one(Event$5.SHOW, function (showEvent) {
        if (showEvent.isDefaultPrevented()) {
          // Only register focus restorer if modal will actually get shown
          return;
        }

        $target.one(Event$5.HIDDEN, function () {
          if ($(_this10).is(":visible")) {
            _this10.focus();
          }
        });
      });

      Modal._jQueryInterface.call($(target), config, this);
    }
  );
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$5] = Modal._jQueryInterface;
  $.fn[NAME$5].Constructor = Modal;

  $.fn[NAME$5].noConflict = function () {
    $.fn[NAME$5] = JQUERY_NO_CONFLICT$5;
    return Modal._jQueryInterface;
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.3.1): tools/sanitizer.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */
  var uriAttrs = [
    "background",
    "cite",
    "href",
    "itemtype",
    "longdesc",
    "poster",
    "src",
    "xlink:href",
  ];
  var ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
  var DefaultWhitelist = {
    // Global attributes allowed on any supplied element below.
    "*": ["class", "dir", "id", "lang", "role", ARIA_ATTRIBUTE_PATTERN],
    a: ["target", "href", "title", "rel"],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ["src", "alt", "title", "width", "height"],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: [],
    /**
     * A pattern that recognizes a commonly useful subset of URLs that are safe.
     *
     * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
     */
  };
  var SAFE_URL_PATTERN =
    /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi;
  /**
   * A pattern that matches safe data URLs. Only matches image, video and audio types.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */

  var DATA_URL_PATTERN =
    /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;

  function allowedAttribute(attr, allowedAttributeList) {
    var attrName = attr.nodeName.toLowerCase();

    if (allowedAttributeList.indexOf(attrName) !== -1) {
      if (uriAttrs.indexOf(attrName) !== -1) {
        return Boolean(
          attr.nodeValue.match(SAFE_URL_PATTERN) ||
            attr.nodeValue.match(DATA_URL_PATTERN)
        );
      }

      return true;
    }

    var regExp = allowedAttributeList.filter(function (attrRegex) {
      return attrRegex instanceof RegExp;
    }); // Check if a regular expression validates the attribute.

    for (var i = 0, l = regExp.length; i < l; i++) {
      if (attrName.match(regExp[i])) {
        return true;
      }
    }

    return false;
  }

  function sanitizeHtml(unsafeHtml, whiteList, sanitizeFn) {
    if (unsafeHtml.length === 0) {
      return unsafeHtml;
    }

    if (sanitizeFn && typeof sanitizeFn === "function") {
      return sanitizeFn(unsafeHtml);
    }

    var domParser = new window.DOMParser();
    var createdDocument = domParser.parseFromString(unsafeHtml, "text/html");
    var whitelistKeys = Object.keys(whiteList);
    var elements = [].slice.call(createdDocument.body.querySelectorAll("*"));

    var _loop = function _loop(i, len) {
      var el = elements[i];
      var elName = el.nodeName.toLowerCase();

      if (whitelistKeys.indexOf(el.nodeName.toLowerCase()) === -1) {
        el.parentNode.removeChild(el);
        return "continue";
      }

      var attributeList = [].slice.call(el.attributes);
      var whitelistedAttributes = [].concat(
        whiteList["*"] || [],
        whiteList[elName] || []
      );
      attributeList.forEach(function (attr) {
        if (!allowedAttribute(attr, whitelistedAttributes)) {
          el.removeAttribute(attr.nodeName);
        }
      });
    };

    for (var i = 0, len = elements.length; i < len; i++) {
      var _ret = _loop(i, len);

      if (_ret === "continue") continue;
    }

    return createdDocument.body.innerHTML;
  }

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$a = "toast";
  var VERSION$a = "4.3.1";
  var DATA_KEY$a = "bs.toast";
  var EVENT_KEY$a = "." + DATA_KEY$a;
  var JQUERY_NO_CONFLICT$a = $.fn[NAME$a];
  var Event$a = {
    CLICK_DISMISS: "click.dismiss" + EVENT_KEY$a,
    HIDE: "hide" + EVENT_KEY$a,
    HIDDEN: "hidden" + EVENT_KEY$a,
    SHOW: "show" + EVENT_KEY$a,
    SHOWN: "shown" + EVENT_KEY$a,
  };
  var ClassName$a = {
    FADE: "fade",
    HIDE: "hide",
    SHOW: "show",
    SHOWING: "showing",
  };
  var DefaultType$7 = {
    animation: "boolean",
    autohide: "boolean",
    delay: "number",
  };
  var Default$7 = {
    animation: true,
    autohide: true,
    delay: 500,
  };
  var Selector$a = {
    DATA_DISMISS: '[data-dismiss="toast"]',
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
  };

  var Toast =
    /*#__PURE__*/
    (function () {
      function Toast(element, config) {
        this._element = element;
        this._config = this._getConfig(config);
        this._timeout = null;

        this._setListeners();
      } // Getters

      var _proto = Toast.prototype;

      // Public
      _proto.show = function show() {
        var _this = this;

        $(this._element).trigger(Event$a.SHOW);

        if (this._config.animation) {
          this._element.classList.add(ClassName$a.FADE);
        }

        var complete = function complete() {
          _this._element.classList.remove(ClassName$a.SHOWING);

          _this._element.classList.add(ClassName$a.SHOW);

          $(_this._element).trigger(Event$a.SHOWN);

          if (_this._config.autohide) {
            _this.hide();
          }
        };

        this._element.classList.remove(ClassName$a.HIDE);

        this._element.classList.add(ClassName$a.SHOWING);

        if (this._config.animation) {
          var transitionDuration = Util.getTransitionDurationFromElement(
            this._element
          );
          $(this._element)
            .one(Util.TRANSITION_END, complete)
            .emulateTransitionEnd(transitionDuration);
        } else {
          complete();
        }
      };

      _proto.hide = function hide(withoutTimeout) {
        var _this2 = this;

        if (!this._element.classList.contains(ClassName$a.SHOW)) {
          return;
        }

        $(this._element).trigger(Event$a.HIDE);

        if (withoutTimeout) {
          this._close();
        } else {
          this._timeout = setTimeout(function () {
            _this2._close();
          }, this._config.delay);
        }
      };

      _proto.dispose = function dispose() {
        clearTimeout(this._timeout);
        this._timeout = null;

        if (this._element.classList.contains(ClassName$a.SHOW)) {
          this._element.classList.remove(ClassName$a.SHOW);
        }

        $(this._element).off(Event$a.CLICK_DISMISS);
        $.removeData(this._element, DATA_KEY$a);
        this._element = null;
        this._config = null;
      }; // Private

      _proto._getConfig = function _getConfig(config) {
        config = _objectSpread(
          {},
          Default$7,
          $(this._element).data(),
          typeof config === "object" && config ? config : {}
        );
        Util.typeCheckConfig(NAME$a, config, this.constructor.DefaultType);
        return config;
      };

      _proto._setListeners = function _setListeners() {
        var _this3 = this;

        $(this._element).on(
          Event$a.CLICK_DISMISS,
          Selector$a.DATA_DISMISS,
          function () {
            return _this3.hide(true);
          }
        );
      };

      _proto._close = function _close() {
        var _this4 = this;

        var complete = function complete() {
          _this4._element.classList.add(ClassName$a.HIDE);

          $(_this4._element).trigger(Event$a.HIDDEN);
        };

        this._element.classList.remove(ClassName$a.SHOW);

        if (this._config.animation) {
          var transitionDuration = Util.getTransitionDurationFromElement(
            this._element
          );
          $(this._element)
            .one(Util.TRANSITION_END, complete)
            .emulateTransitionEnd(transitionDuration);
        } else {
          complete();
        }
      }; // Static

      Toast._jQueryInterface = function _jQueryInterface(config) {
        return this.each(function () {
          var $element = $(this);
          var data = $element.data(DATA_KEY$a);

          var _config = typeof config === "object" && config;

          if (!data) {
            data = new Toast(this, _config);
            $element.data(DATA_KEY$a, data);
          }

          if (typeof config === "string") {
            if (typeof data[config] === "undefined") {
              throw new TypeError('No method named "' + config + '"');
            }

            data[config](this);
          }
        });
      };

      _createClass(Toast, null, [
        {
          key: "VERSION",
          get: function get() {
            return VERSION$a;
          },
        },
        {
          key: "DefaultType",
          get: function get() {
            return DefaultType$7;
          },
        },
        {
          key: "Default",
          get: function get() {
            return Default$7;
          },
        },
      ]);

      return Toast;
    })();
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$a] = Toast._jQueryInterface;
  $.fn[NAME$a].Constructor = Toast;

  $.fn[NAME$a].noConflict = function () {
    $.fn[NAME$a] = JQUERY_NO_CONFLICT$a;
    return Toast._jQueryInterface;
  };

  /* =========================================================
   * bootstrap-datepicker.js
   * Repo: https://github.com/uxsolutions/bootstrap-datepicker/
   * Demo: https://uxsolutions.github.io/bootstrap-datepicker/
   * Docs: https://bootstrap-datepicker.readthedocs.org/
   * =========================================================
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * https://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * ========================================================= */

  function UTCDate() {
    return new Date(Date.UTC.apply(Date, arguments));
  }
  function UTCToday() {
    var today = new Date();
    return UTCDate(today.getFullYear(), today.getMonth(), today.getDate());
  }
  function isUTCEquals(date1, date2) {
    return (
      date1.getUTCFullYear() === date2.getUTCFullYear() &&
      date1.getUTCMonth() === date2.getUTCMonth() &&
      date1.getUTCDate() === date2.getUTCDate()
    );
  }
  function alias(method, deprecationMsg) {
    return function () {
      if (deprecationMsg !== undefined) {
        $.fn.datePicker.deprecated(deprecationMsg);
      }

      return this[method].apply(this, arguments);
    };
  }
  function isValidDate(d) {
    return d && !isNaN(d.getTime());
  }

  var DateArray = (function () {
    var extras = {
      get: function (i) {
        return this.slice(i)[0];
      },
      contains: function (d) {
        // Array.indexOf is not cross-browser;
        // $.inArray doesn't work with Dates
        var val = d && d.valueOf();
        for (var i = 0, l = this.length; i < l; i++)
          // Use date arithmetic to allow dates with different times to match
          if (
            0 <= this[i].valueOf() - val &&
            this[i].valueOf() - val < 1000 * 60 * 60 * 24
          )
            return i;
        return -1;
      },
      remove: function (i) {
        this.splice(i, 1);
      },
      replace: function (new_array) {
        if (!new_array) return;
        if (!$.isArray(new_array)) new_array = [new_array];
        this.clear();
        this.push.apply(this, new_array);
      },
      clear: function () {
        this.length = 0;
      },
      copy: function () {
        var a = new DateArray();
        a.replace(this);
        return a;
      },
    };

    return function () {
      var a = [];
      a.push.apply(a, arguments);
      $.extend(a, extras);
      return a;
    };
  })();

  // Picker object

  var Datepicker = function (element, options) {
    $.data(element, "datepicker", this);

    this._events = [];
    this._secondaryEvents = [];

    this._process_options(options);

    this.dates = new DateArray();
    this.viewDate = this.o.defaultViewDate;
    this.focusDate = null;

    this.element = $(element);
    this.isInput = this.element.is("input");
    this.inputField = this.isInput ? this.element : this.element.find("input");
    this.component = this.element.hasClass("date")
      ? this.element.find(
          ".add-on, .input-group-addon, .input-group-append, .input-group-prepend, .btn"
        )
      : false;
    if (this.component && this.component.length === 0) {
      this.component = false;
    }

    if (this.o.isInline === null) {
      this.isInline = !this.component && !this.isInput;
    } else {
      this.isInline = this.o.isInline;
    }

    this.picker = $(DPGlobal.template);

    // Checking templates and inserting
    if (this._check_template(this.o.templates.leftArrow)) {
      this.picker.find(".prev").html(this.o.templates.leftArrow);
    }

    if (this._check_template(this.o.templates.rightArrow)) {
      this.picker.find(".next").html(this.o.templates.rightArrow);
    }

    this._buildEvents();
    this._attachEvents();

    if (this.isInline) {
      this.picker.addClass("datepicker-inline").appendTo(this.element);
    } else {
      this.picker.addClass("datepicker-dropdown dropdown-menu");
    }

    if (this.o.rtl) {
      this.picker.addClass("datepicker-rtl");
    }

    if (this.o.calendarWeeks) {
      this.picker
        .find(
          ".datepicker-years-days .datepicker-switch, thead .datepicker-title, tfoot .today, tfoot .clear"
        )
        .attr("colspan", function (i, val) {
          return Number(val) + 1;
        });
    }

    this._process_options({
      startDate: this._o.startDate,
      endDate: this._o.endDate,
      daysOfWeekDisabled: this.o.daysOfWeekDisabled,
      daysOfWeekHighlighted: this.o.daysOfWeekHighlighted,
      datesDisabled: this.o.datesDisabled,
    });

    this._allow_update = false;
    this.setViewMode(this.o.startView);
    this._allow_update = true;

    this.fillDow();
    this.fillMonths();

    this.update();

    if (this.isInline) {
      this.show();
    }
  };

  Datepicker.prototype = {
    constructor: Datepicker,

    _resolveViewName: function (view) {
      $.each(DPGlobal.viewModes, function (i, viewMode) {
        if (view === i || $.inArray(view, viewMode.names) !== -1) {
          view = i;
          return false;
        }
      });

      return view;
    },

    _resolveDaysOfWeek: function (daysOfWeek) {
      if (!$.isArray(daysOfWeek)) daysOfWeek = daysOfWeek.split(/[,\s]*/);
      return $.map(daysOfWeek, Number);
    },

    _check_template: function (tmp) {
      try {
        // If empty
        if (tmp === undefined || tmp === "") {
          return false;
        }
        // If no html, everything ok
        if ((tmp.match(/[<>]/g) || []).length <= 0) {
          return true;
        }
        // Checking if html is fine
        var jDom = $(tmp);
        return jDom.length > 0;
      } catch (ex) {
        return false;
      }
    },

    _process_options: function (opts) {
      // Store raw options for reference
      this._o = $.extend({}, this._o, opts);
      // Processed options
      var o = (this.o = $.extend({}, this._o));

      // Check if "de-DE" style date is available, if not language should
      // fallback to 2 letter code eg "de"
      var lang = o.language;
      if (!dates[lang]) {
        lang = lang.split("-")[0];
        if (!dates[lang]) lang = defaults.language;
      }
      o.language = lang;

      // Retrieve view index from any aliases
      o.startView = this._resolveViewName(o.startView);
      o.minViewMode = this._resolveViewName(o.minViewMode);
      o.maxViewMode = this._resolveViewName(o.maxViewMode);

      // Check view is between min and max
      o.startView = Math.max(
        this.o.minViewMode,
        Math.min(this.o.maxViewMode, o.startView)
      );

      // true, false, or Number > 0
      if (o.multidate !== true) {
        o.multidate = Number(o.multidate) || false;
        if (o.multidate !== false) o.multidate = Math.max(0, o.multidate);
      }
      o.multidateSeparator = String(o.multidateSeparator);

      o.weekStart %= 7;
      o.weekEnd = (o.weekStart + 6) % 7;

      var format = DPGlobal.parseFormat(o.format);
      if (o.startDate !== -Infinity) {
        if (!!o.startDate) {
          if (o.startDate instanceof Date)
            o.startDate = this._local_to_utc(this._zero_time(o.startDate));
          else
            o.startDate = DPGlobal.parseDate(
              o.startDate,
              format,
              o.language,
              o.assumeNearbyYear
            );
        } else {
          o.startDate = -Infinity;
        }
      }
      if (o.endDate !== Infinity) {
        if (!!o.endDate) {
          if (o.endDate instanceof Date)
            o.endDate = this._local_to_utc(this._zero_time(o.endDate));
          else
            o.endDate = DPGlobal.parseDate(
              o.endDate,
              format,
              o.language,
              o.assumeNearbyYear
            );
        } else {
          o.endDate = Infinity;
        }
      }

      o.daysOfWeekDisabled = this._resolveDaysOfWeek(
        o.daysOfWeekDisabled || []
      );
      o.daysOfWeekHighlighted = this._resolveDaysOfWeek(
        o.daysOfWeekHighlighted || []
      );

      o.datesDisabled = o.datesDisabled || [];
      if (!$.isArray(o.datesDisabled)) {
        o.datesDisabled = o.datesDisabled.split(",");
      }
      o.datesDisabled = $.map(o.datesDisabled, function (d) {
        return DPGlobal.parseDate(d, format, o.language, o.assumeNearbyYear);
      });

      var plc = String(o.orientation).toLowerCase().split(/\s+/g),
        _plc = o.orientation.toLowerCase();
      plc = $.grep(plc, function (word) {
        return /^auto|left|right|top|bottom$/.test(word);
      });
      o.orientation = { x: "auto", y: "auto" };
      if (!_plc || _plc === "auto");
      else if (plc.length === 1) {
        // no action
        switch (plc[0]) {
          case "top":
          case "bottom":
            o.orientation.y = plc[0];
            break;
          case "left":
          case "right":
            o.orientation.x = plc[0];
            break;
        }
      } else {
        _plc = $.grep(plc, function (word) {
          return /^left|right$/.test(word);
        });
        o.orientation.x = _plc[0] || "auto";

        _plc = $.grep(plc, function (word) {
          return /^top|bottom$/.test(word);
        });
        o.orientation.y = _plc[0] || "auto";
      }
      if (
        o.defaultViewDate instanceof Date ||
        typeof o.defaultViewDate === "string"
      ) {
        o.defaultViewDate = DPGlobal.parseDate(
          o.defaultViewDate,
          format,
          o.language,
          o.assumeNearbyYear
        );
      } else if (o.defaultViewDate) {
        var year = o.defaultViewDate.year || new Date().getFullYear();
        var month = o.defaultViewDate.month || 0;
        var day = o.defaultViewDate.day || 1;
        o.defaultViewDate = UTCDate(year, month, day);
      } else {
        o.defaultViewDate = UTCToday();
      }
    },
    _applyEvents: function (evs) {
      for (var i = 0, el, ch, ev; i < evs.length; i++) {
        el = evs[i][0];
        if (evs[i].length === 2) {
          ch = undefined;
          ev = evs[i][1];
        } else if (evs[i].length === 3) {
          ch = evs[i][1];
          ev = evs[i][2];
        }
        el.on(ev, ch);
      }
    },
    _unapplyEvents: function (evs) {
      for (var i = 0, el, ev, ch; i < evs.length; i++) {
        el = evs[i][0];
        if (evs[i].length === 2) {
          ch = undefined;
          ev = evs[i][1];
        } else if (evs[i].length === 3) {
          ch = evs[i][1];
          ev = evs[i][2];
        }
        el.off(ev, ch);
      }
    },
    _buildEvents: function () {
      var events = {
        keyup: $.proxy(function (e) {
          if ($.inArray(e.keyCode, [27, 37, 39, 38, 40, 32, 13, 9]) === -1)
            this.update();
        }, this),
        keydown: $.proxy(this.keydown, this),
        paste: $.proxy(this.paste, this),
      };

      if (this.o.showOnFocus === true) {
        events.focus = $.proxy(this.show, this);
      }

      if (this.isInput) {
        // single input
        this._events = [[this.element, events]];
      }
      // component: input + button
      else if (this.component && this.inputField.length) {
        this._events = [
          // For components that are not readonly, allow keyboard nav
          [this.inputField, events],
          [
            this.component,
            {
              click: $.proxy(this.show, this),
            },
          ],
        ];
      } else {
        this._events = [
          [
            this.element,
            {
              click: $.proxy(this.show, this),
              keydown: $.proxy(this.keydown, this),
            },
          ],
        ];
      }
      this._events.push(
        // Component: listen for blur on element descendants
        [
          this.element,
          "*",
          {
            blur: $.proxy(function (e) {
              this._focused_from = e.target;
            }, this),
          },
        ],
        // Input: listen for blur on element
        [
          this.element,
          {
            blur: $.proxy(function (e) {
              this._focused_from = e.target;
            }, this),
          },
        ]
      );

      if (this.o.immediateUpdates) {
        // Trigger input updates immediately on changed year/month
        this._events.push([
          this.element,
          {
            "changeYear changeMonth": $.proxy(function (e) {
              this.update(e.date);
            }, this),
          },
        ]);
      }

      this._secondaryEvents = [
        [
          this.picker,
          {
            click: $.proxy(this.click, this),
          },
        ],
        [
          this.picker,
          ".prev, .next",
          {
            click: $.proxy(this.navArrowsClick, this),
          },
        ],
        [
          this.picker,
          ".prev-year, .next-year",
          {
            click: $.proxy(this.navYearArrowsClick, this),
          },
        ],
        [
          this.picker,
          ".day:not(.disabled)",
          {
            click: $.proxy(this.dayCellClick, this),
          },
        ],
        [
          $(window),
          {
            resize: $.proxy(this.place, this),
          },
        ],
        [
          $(document),
          {
            "mousedown touchstart": $.proxy(function (e) {
              // Clicked outside the datepicker, hide it
              if (
                !(
                  this.element.is(e.target) ||
                  this.element.find(e.target).length ||
                  this.picker.is(e.target) ||
                  this.picker.find(e.target).length ||
                  this.isInline
                )
              ) {
                this.hide();
              }
            }, this),
          },
        ],
      ];
    },
    _attachEvents: function () {
      this._detachEvents();
      this._applyEvents(this._events);
    },
    _detachEvents: function () {
      this._unapplyEvents(this._events);
    },
    _attachSecondaryEvents: function () {
      this._detachSecondaryEvents();
      this._applyEvents(this._secondaryEvents);
    },
    _detachSecondaryEvents: function () {
      this._unapplyEvents(this._secondaryEvents);
    },
    _trigger: function (event, altdate) {
      var date = altdate || this.dates.get(-1),
        local_date = this._utc_to_local(date);

      this.element.trigger({
        type: event,
        date: local_date,
        viewMode: this.viewMode,
        dates: $.map(this.dates, this._utc_to_local),
        format: $.proxy(function (ix, format) {
          if (arguments.length === 0) {
            ix = this.dates.length - 1;
            format = this.o.format;
          } else if (typeof ix === "string") {
            format = ix;
            ix = this.dates.length - 1;
          }
          format = format || this.o.format;
          var date = this.dates.get(ix);
          return DPGlobal.formatDate(date, format, this.o.language);
        }, this),
      });
    },

    show: function () {
      if (
        this.inputField.is(":disabled") ||
        (this.inputField.prop("readonly") && this.o.enableOnReadonly === false)
      )
        return;
      if (!this.isInline) this.picker.appendTo(this.o.container);
      this.place();
      this.picker.show();
      this._attachSecondaryEvents();
      this._trigger("show");
      if (
        (window.navigator.msMaxTouchPoints || "ontouchstart" in document) &&
        this.o.disableTouchKeyboard
      ) {
        $(this.element).blur();
      }
      return this;
    },

    hide: function () {
      if (this.isInline || !this.picker.is(":visible")) return this;
      this.focusDate = null;
      this.picker.hide().detach();
      this._detachSecondaryEvents();
      this.setViewMode(this.o.startView);

      if (this.o.forceParse && this.inputField.val()) this.setValue();
      this._trigger("hide");
      return this;
    },

    destroy: function () {
      this.hide();
      this._detachEvents();
      this._detachSecondaryEvents();
      this.picker.remove();
      delete this.element.data().datepicker;
      if (!this.isInput) {
        delete this.element.data().date;
      }
      return this;
    },

    paste: function (e) {
      var dateString;
      if (
        e.originalEvent.clipboardData &&
        e.originalEvent.clipboardData.types &&
        $.inArray("text/plain", e.originalEvent.clipboardData.types) !== -1
      ) {
        dateString = e.originalEvent.clipboardData.getData("text/plain");
      } else if (window.clipboardData) {
        dateString = window.clipboardData.getData("Text");
      } else {
        return;
      }
      this.setDate(dateString);
      this.update();
      e.preventDefault();
    },

    _utc_to_local: function (utc) {
      if (!utc) {
        return utc;
      }

      var local = new Date(utc.getTime() + utc.getTimezoneOffset() * 60000);

      if (local.getTimezoneOffset() !== utc.getTimezoneOffset()) {
        local = new Date(utc.getTime() + local.getTimezoneOffset() * 60000);
      }

      return local;
    },
    _local_to_utc: function (local) {
      return (
        local && new Date(local.getTime() - local.getTimezoneOffset() * 60000)
      );
    },
    _zero_time: function (local) {
      return (
        local &&
        new Date(local.getFullYear(), local.getMonth(), local.getDate())
      );
    },
    _zero_utc_time: function (utc) {
      return (
        utc &&
        UTCDate(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate())
      );
    },

    getDates: function () {
      return $.map(this.dates, this._utc_to_local);
    },

    getUTCDates: function () {
      return $.map(this.dates, function (d) {
        return new Date(d);
      });
    },

    getDate: function () {
      return this._utc_to_local(this.getUTCDate());
    },

    getUTCDate: function () {
      var selected_date = this.dates.get(-1);
      if (selected_date !== undefined) {
        return new Date(selected_date);
      } else {
        return null;
      }
    },

    clearDates: function () {
      this.inputField.val("");
      this._trigger("changeDate");
      this.update();
      if (this.o.autoclose) {
        this.hide();
      }
    },

    setDates: function () {
      var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
      this.update.apply(this, args);
      this._trigger("changeDate");
      this.setValue();
      return this;
    },

    setUTCDates: function () {
      var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
      this.setDates.apply(this, $.map(args, this._utc_to_local));
      return this;
    },

    setDate: alias("setDates"),
    setUTCDate: alias("setUTCDates"),
    remove: alias(
      "destroy",
      "Method `remove` is deprecated and will be removed in version 2.0. Use `destroy` instead"
    ),

    setValue: function () {
      var formatted = this.getFormattedDate();
      this.inputField.val(formatted);
      return this;
    },

    getFormattedDate: function (format) {
      if (format === undefined) format = this.o.format;

      var lang = this.o.language;
      return $.map(this.dates, function (d) {
        return DPGlobal.formatDate(d, format, lang);
      }).join(this.o.multidateSeparator);
    },

    getStartDate: function () {
      return this.o.startDate;
    },

    setStartDate: function (startDate) {
      this._process_options({ startDate: startDate });
      this.update();
      this.updateNavArrows();
      return this;
    },

    getEndDate: function () {
      return this.o.endDate;
    },

    setEndDate: function (endDate) {
      this._process_options({ endDate: endDate });
      this.update();
      this.updateNavArrows();
      return this;
    },

    setDaysOfWeekDisabled: function (daysOfWeekDisabled) {
      this._process_options({ daysOfWeekDisabled: daysOfWeekDisabled });
      this.update();
      return this;
    },

    setDaysOfWeekHighlighted: function (daysOfWeekHighlighted) {
      this._process_options({ daysOfWeekHighlighted: daysOfWeekHighlighted });
      this.update();
      return this;
    },

    setDatesDisabled: function (datesDisabled) {
      this._process_options({ datesDisabled: datesDisabled });
      this.update();
      return this;
    },

    place: function () {
      if (this.isInline) return this;
      var calendarWidth = this.picker.outerWidth(),
        calendarHeight = this.picker.outerHeight(),
        visualPadding = 10,
        container = $(this.o.container),
        windowWidth = container.width(),
        scrollTop =
          this.o.container === "body"
            ? $(document).scrollTop()
            : container.scrollTop(),
        appendOffset = container.offset();

      var parentsZindex = [0];
      this.element.parents().each(function () {
        var itemZIndex = $(this).css("z-index");
        if (itemZIndex !== "auto" && Number(itemZIndex) !== 0)
          parentsZindex.push(Number(itemZIndex));
      });
      var zIndex = Math.max.apply(Math, parentsZindex) + this.o.zIndexOffset;
      var offset = this.component
        ? this.component.parent().offset()
        : this.element.offset();
      var height = this.component
        ? this.component.outerHeight(true)
        : this.element.outerHeight(false);
      var width = this.component
        ? this.component.outerWidth(true)
        : this.element.outerWidth(false);
      var left = offset.left - appendOffset.left;
      var top = offset.top - appendOffset.top;

      if (this.o.container !== "body") {
        top += scrollTop;
      }

      this.picker.removeClass(
        "datepicker-orient-top datepicker-orient-bottom " +
          "datepicker-orient-right datepicker-orient-left"
      );

      if (this.o.orientation.x !== "auto") {
        this.picker.addClass("datepicker-orient-" + this.o.orientation.x);
        if (this.o.orientation.x === "right") left -= calendarWidth - width;
      }
      // auto x orientation is best-placement: if it crosses a window
      // edge, fudge it sideways
      else {
        if (offset.left < 0) {
          // component is outside the window on the left side. Move it into visible range
          this.picker.addClass("datepicker-orient-left");
          left -= offset.left - visualPadding;
        } else if (left + calendarWidth > windowWidth) {
          // the calendar passes the widow right edge. Align it to component right side
          this.picker.addClass("datepicker-orient-right");
          left += width - calendarWidth;
        } else {
          if (this.o.rtl) {
            // Default to right
            this.picker.addClass("datepicker-orient-right");
          } else {
            // Default to left
            this.picker.addClass("datepicker-orient-left");
          }
        }
      }

      // auto y orientation is best-situation: top or bottom, no fudging,
      // decision based on which shows more of the calendar
      var yorient = this.o.orientation.y,
        top_overflow;
      if (yorient === "auto") {
        top_overflow = -scrollTop + top - calendarHeight;
        yorient = top_overflow < 0 ? "bottom" : "top";
      }

      this.picker.addClass("datepicker-orient-" + yorient);
      if (yorient === "top")
        top -= calendarHeight + parseInt(this.picker.css("padding-top"));
      else top += height;

      if (this.o.rtl) {
        var right = windowWidth - (left + width);
        this.picker.css({
          top: top,
          right: right,
          zIndex: zIndex,
        });
      } else {
        this.picker.css({
          top: top,
          left: left,
          zIndex: zIndex,
        });
      }
      return this;
    },

    _allow_update: true,
    update: function () {
      if (!this._allow_update) return this;

      var oldDates = this.dates.copy(),
        dates = [],
        fromArgs = false;
      if (arguments.length) {
        $.each(
          arguments,
          $.proxy(function (i, date) {
            if (date instanceof Date) date = this._local_to_utc(date);
            dates.push(date);
          }, this)
        );
        fromArgs = true;
      } else {
        dates = this.isInput
          ? this.element.val()
          : this.element.data("date") || this.inputField.val();
        if (dates && this.o.multidate)
          dates = dates.split(this.o.multidateSeparator);
        else dates = [dates];
        delete this.element.data().date;
      }

      dates = $.map(
        dates,
        $.proxy(function (date) {
          return DPGlobal.parseDate(
            date,
            this.o.format,
            this.o.language,
            this.o.assumeNearbyYear
          );
        }, this)
      );
      dates = $.grep(
        dates,
        $.proxy(function (date) {
          return !this.dateWithinRange(date) || !date;
        }, this),
        true
      );
      this.dates.replace(dates);

      if (this.o.updateViewDate) {
        if (this.dates.length) this.viewDate = new Date(this.dates.get(-1));
        else if (this.viewDate < this.o.startDate)
          this.viewDate = new Date(this.o.startDate);
        else if (this.viewDate > this.o.endDate)
          this.viewDate = new Date(this.o.endDate);
        else this.viewDate = this.o.defaultViewDate;
      }

      if (fromArgs) {
        // setting date by clicking
        this.setValue();
        this.element.change();
      } else if (this.dates.length) {
        // setting date by typing
        if (String(oldDates) !== String(this.dates) && fromArgs) {
          this._trigger("changeDate");
          this.element.change();
        }
      }
      if (!this.dates.length && oldDates.length) {
        this._trigger("clearDate");
        this.element.change();
      }

      this.fill();
      return this;
    },

    fillDow: function () {
      if (this.o.showWeekDays) {
        var dowCnt = this.o.weekStart,
          html = "<tr>";
        if (this.o.calendarWeeks) {
          html += '<th class="cw">&#160;</th>';
        }
        while (dowCnt < this.o.weekStart + 7) {
          html += '<th class="dow';
          if ($.inArray(dowCnt, this.o.daysOfWeekDisabled) !== -1)
            html += " disabled";
          html += '">' + dates[this.o.language].daysMin[dowCnt++ % 7] + "</th>";
        }
        html += "</tr>";
        this.picker.find(".datepicker-years-days thead").append(html);
      }
    },

    fillMonths: function () {
      var localDate = this._utc_to_local(this.viewDate);
      var html = "";
      var focused;
      for (var i = 0; i < 12; i++) {
        focused = localDate && localDate.getMonth() === i ? " focused" : "";
        html +=
          '<div class="month' +
          focused +
          '"><span>' +
          dates[this.o.language].monthsShort[i] +
          "</span></div>";
      }
      this.picker.find(".datepicker-months td").html(html);
    },

    setRange: function (range) {
      if (!range || !range.length) delete this.range;
      else
        this.range = $.map(range, function (d) {
          return d.valueOf();
        });
      this.fill();
    },

    getClassNames: function (date) {
      var cls = [],
        year = this.viewDate.getUTCFullYear(),
        month = this.viewDate.getUTCMonth(),
        today = UTCToday();
      if (
        date.getUTCFullYear() < year ||
        (date.getUTCFullYear() === year && date.getUTCMonth() < month)
      ) {
        cls.push("old");
      } else if (
        date.getUTCFullYear() > year ||
        (date.getUTCFullYear() === year && date.getUTCMonth() > month)
      ) {
        cls.push("new");
      }
      if (this.focusDate && date.valueOf() === this.focusDate.valueOf())
        cls.push("focused");
      // Compare internal UTC date with UTC today, not local today
      if (this.o.todayHighlight && isUTCEquals(date, today)) {
        cls.push("today");
      }
      if (this.dates.contains(date) !== -1) cls.push("active");
      if (!this.dateWithinRange(date)) {
        cls.push("disabled");
      }
      if (this.dateIsDisabled(date)) {
        cls.push("disabled", "disabled-date");
      }
      if ($.inArray(date.getUTCDay(), this.o.daysOfWeekHighlighted) !== -1) {
        cls.push("highlighted");
      }

      if (this.range) {
        if (date > this.range[0] && date < this.range[this.range.length - 1]) {
          cls.push("range");
        }
        if ($.inArray(date.valueOf(), this.range) !== -1) {
          cls.push("selected");
        }
        if (date.valueOf() === this.range[0]) {
          cls.push("range-start");
        }
        if (date.valueOf() === this.range[this.range.length - 1]) {
          cls.push("range-end");
        }
      }
      return cls;
    },

    _fill_yearsView: function (
      selector,
      cssClass,
      factor,
      year,
      startYear,
      endYear,
      beforeFn
    ) {
      var html = "";
      var step = factor / 10;
      var view = this.picker.find(selector);
      var startVal = Math.floor(year / factor) * factor;
      var endVal = startVal + step * 9;
      var focusedVal = Math.floor(this.viewDate.getFullYear() / step) * step;
      var selected = $.map(this.dates, function (d) {
        return Math.floor(d.getUTCFullYear() / step) * step;
      });

      var classes, tooltip, before;
      for (
        var currVal = startVal - step;
        currVal <= endVal + step;
        currVal += step
      ) {
        classes = [cssClass];
        tooltip = null;

        if (currVal === startVal - step) {
          classes.push("old");
        } else if (currVal === endVal + step) {
          classes.push("new");
        }
        if ($.inArray(currVal, selected) !== -1) {
          classes.push("active");
        }
        if (currVal < startYear || currVal > endYear) {
          classes.push("disabled");
        }
        if (currVal === focusedVal) {
          classes.push("focused");
        }

        if (beforeFn !== $.noop) {
          before = beforeFn(new Date(currVal, 0, 1));
          if (before === undefined) {
            before = {};
          } else if (typeof before === "boolean") {
            before = { enabled: before };
          } else if (typeof before === "string") {
            before = { classes: before };
          }
          if (before.enabled === false) {
            classes.push("disabled");
          }
          if (before.classes) {
            classes = classes.concat(before.classes.split(/\s+/));
          }
          if (before.tooltip) {
            tooltip = before.tooltip;
          }
        }

        html +=
          '<div class="' +
          classes.join(" ") +
          '"' +
          (tooltip ? ' title="' + tooltip + '"' : "") +
          "><span>" +
          currVal +
          "</span></div>";
      }

      view.find(".datepicker-switch").text(startVal + "-" + endVal);
      view.find("td").html(html);
    },

    fill: function () {
      var d = new Date(this.viewDate),
        year = d.getUTCFullYear(),
        month = d.getUTCMonth(),
        startYear =
          this.o.startDate !== -Infinity
            ? this.o.startDate.getUTCFullYear()
            : -Infinity,
        startMonth =
          this.o.startDate !== -Infinity
            ? this.o.startDate.getUTCMonth()
            : -Infinity,
        endYear =
          this.o.endDate !== Infinity
            ? this.o.endDate.getUTCFullYear()
            : Infinity,
        endMonth =
          this.o.endDate !== Infinity ? this.o.endDate.getUTCMonth() : Infinity,
        todaytxt = dates[this.o.language].today || dates["en"].today || "",
        cleartxt = dates[this.o.language].clear || dates["en"].clear || "",
        titleFormat =
          dates[this.o.language].titleFormat || dates["en"].titleFormat,
        todayDate = UTCToday(),
        titleBtnVisible =
          (this.o.todayBtn === true || this.o.todayBtn === "linked") &&
          todayDate >= this.o.startDate &&
          todayDate <= this.o.endDate &&
          !this.weekOfDateIsDisabled(todayDate),
        tooltip,
        before;
      if (isNaN(year) || isNaN(month)) return;
      this.picker
        .find(".datepicker-years-days .datepicker-switch")
        .text(DPGlobal.formatDate(d, titleFormat, this.o.language));
      this.picker
        .find("tfoot .today")
        .text(todaytxt)
        .css("display", titleBtnVisible ? "table-cell" : "none");
      this.picker
        .find("tfoot .clear")
        .text(cleartxt)
        .css("display", this.o.clearBtn === true ? "table-cell" : "none");
      this.picker
        .find("thead .datepicker-title")
        .text(this.o.title)
        .css(
          "display",
          typeof this.o.title === "string" && this.o.title !== ""
            ? "table-cell"
            : "none"
        );
      this.updateNavArrows();
      this.fillMonths();
      var prevMonth = UTCDate(year, month, 0),
        day = prevMonth.getUTCDate();
      prevMonth.setUTCDate(
        day - ((prevMonth.getUTCDay() - this.o.weekStart + 7) % 7)
      );
      var nextMonth = new Date(prevMonth);
      if (prevMonth.getUTCFullYear() < 100) {
        nextMonth.setUTCFullYear(prevMonth.getUTCFullYear());
      }
      nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
      nextMonth = nextMonth.valueOf();
      var html = [];
      var weekDay, clsName;
      while (prevMonth.valueOf() < nextMonth) {
        weekDay = prevMonth.getUTCDay();
        if (weekDay === this.o.weekStart) {
          html.push("<tr>");
          if (this.o.calendarWeeks) {
            // ISO 8601: First week contains first thursday.
            // ISO also states week starts on Monday, but we can be more abstract here.
            var // Start of current week: based on weekstart/current date
              ws = new Date(
                +prevMonth + ((this.o.weekStart - weekDay - 7) % 7) * 864e5
              ),
              // Thursday of this week
              th = new Date(
                Number(ws) + ((7 + 4 - ws.getUTCDay()) % 7) * 864e5
              ),
              // First Thursday of year, year from thursday
              yth = new Date(
                Number((yth = UTCDate(th.getUTCFullYear(), 0, 1))) +
                  ((7 + 4 - yth.getUTCDay()) % 7) * 864e5
              ),
              // Calendar week: ms between thursdays, div ms per day, div 7 days
              calWeek = (th - yth) / 864e5 / 7 + 1;
            html.push('<td class="cw">' + calWeek + "</td>");
          }
        }
        clsName = this.getClassNames(prevMonth);
        clsName.push("day");

        var content = prevMonth.getUTCDate();

        if (this.o.beforeShowDay !== $.noop) {
          before = this.o.beforeShowDay(this._utc_to_local(prevMonth));
          if (before === undefined) before = {};
          else if (typeof before === "boolean") before = { enabled: before };
          else if (typeof before === "string") before = { classes: before };
          if (before.enabled === false) clsName.push("disabled");
          if (before.classes)
            clsName = clsName.concat(before.classes.split(/\s+/));
          if (before.tooltip) tooltip = before.tooltip;
          if (before.content) content = before.content;
        }

        //Check if uniqueSort exists (supported by jquery >=1.12 and >=2.2)
        //Fallback to unique function for older jquery versions
        if ($.isFunction($.uniqueSort)) {
          clsName = $.uniqueSort(clsName);
        } else {
          clsName = $.unique(clsName);
        }

        html.push(
          '<td class="' +
            clsName.join(" ") +
            '"' +
            (tooltip ? ' title="' + tooltip + '"' : "") +
            ' data-date="' +
            prevMonth.getTime().toString() +
            '"><div>' +
            content +
            "</div></td>"
        );
        tooltip = null;
        if (weekDay === this.o.weekEnd) {
          html.push("</tr>");
        }
        prevMonth.setUTCDate(prevMonth.getUTCDate() + 1);
      }
      this.picker.find(".datepicker-years-days tbody").html(html.join(""));

      var monthsTitle =
        dates[this.o.language].monthsTitle ||
        dates["en"].monthsTitle ||
        "Months";
      var months = this.picker
        .find(".datepicker-months")
        .find(".datepicker-switch")
        .text(this.o.maxViewMode < 2 ? monthsTitle : year)
        .end()
        .find("tbody div")
        .removeClass("active");

      $.each(this.dates, function (i, d) {
        if (d.getUTCFullYear() === year)
          months.eq(d.getUTCMonth()).addClass("active");
      });

      if (year < startYear || year > endYear) {
        months.addClass("disabled");
      }
      if (year === startYear) {
        months.slice(0, startMonth).addClass("disabled");
      }
      if (year === endYear) {
        months.slice(endMonth + 1).addClass("disabled");
      }

      if (this.o.beforeShowMonth !== $.noop) {
        var that = this;
        $.each(months, function (i, month) {
          var moDate = new Date(year, i, 1);
          var before = that.o.beforeShowMonth(moDate);
          if (before === undefined) before = {};
          else if (typeof before === "boolean") before = { enabled: before };
          else if (typeof before === "string") before = { classes: before };
          if (before.enabled === false && !$(month).hasClass("disabled"))
            $(month).addClass("disabled");
          if (before.classes) $(month).addClass(before.classes);
          if (before.tooltip) $(month).prop("title", before.tooltip);
        });
      }

      // Generating decade/years picker
      this._fill_yearsView(
        ".datepicker-years",
        "year",
        10,
        year,
        startYear,
        endYear,
        this.o.beforeShowYear
      );

      // Generating century/decades picker
      this._fill_yearsView(
        ".datepicker-decades",
        "decade",
        100,
        year,
        startYear,
        endYear,
        this.o.beforeShowDecade
      );

      // Generating millennium/centuries picker
      this._fill_yearsView(
        ".datepicker-centuries",
        "century",
        1000,
        year,
        startYear,
        endYear,
        this.o.beforeShowCentury
      );
    },

    updateNavArrows: function () {
      if (!this._allow_update) return;
      // 200423 START 전호근 - BR datepicker 수정
      var d = new Date(this.viewDate),
        year = d.getUTCFullYear(),
        month = d.getUTCMonth(),
        startYear =
          this.o.startDate !== -Infinity
            ? this.o.startDate.getUTCFullYear()
            : -Infinity,
        startMonth =
          this.o.startDate !== -Infinity
            ? this.o.startDate.getUTCMonth()
            : -Infinity,
        endYear =
          this.o.endDate !== Infinity
            ? this.o.endDate.getUTCFullYear()
            : Infinity,
        endMonth =
          this.o.endDate !== Infinity ? this.o.endDate.getUTCMonth() : Infinity,
        prevIsDisabled,
        nextIsDisabled,
        prevYearIsDisabled,
        nextYearIsDisabled,
        factor = 1;
      switch (this.viewMode) {
        case 4:
          factor *= 10;
        /* falls through */
        case 3:
          factor *= 10;
        /* falls through */
        case 2:
          factor *= 10;
        /* falls through */
        case 1:
          prevIsDisabled = Math.floor(year / factor) * factor <= startYear;
          nextIsDisabled =
            Math.floor(year / factor) * factor + factor > endYear;
          break;
        case 0:
          prevIsDisabled = year <= startYear && month <= startMonth;
          nextIsDisabled = year >= endYear && month >= endMonth;
          prevYearIsDisabled = year <= startYear;
          nextYearIsDisabled = year >= endYear;
          break;
      }

      this.picker.find(".prev").toggleClass("disabled", prevIsDisabled);
      this.picker.find(".next").toggleClass("disabled", nextIsDisabled);
      if (this.viewMode == 0) {
        this.picker
          .find(".prev-year")
          .toggleClass("disabled", prevYearIsDisabled);
        this.picker
          .find(".next-year")
          .toggleClass("disabled", nextYearIsDisabled);
      }
      // 200423 END 전호근 - BR datepicker 수정
    },

    click: function (e) {
      e.preventDefault();
      e.stopPropagation();

      var target, dir, day, year, month;
      target = $(e.target).hasClass() ? $(e.target) : $(e.target).parent();

      // Clicked on the switch
      if (
        target.hasClass("datepicker-switch") &&
        this.viewMode !== this.o.maxViewMode
      ) {
        this.setViewMode(this.viewMode + 1);
      }

      // Clicked on today button
      if (target.hasClass("today") && !target.hasClass("day")) {
        this.setViewMode(0);
        this._setDate(UTCToday(), this.o.todayBtn === "linked" ? null : "view");
      }

      // Clicked on clear button
      if (target.hasClass("clear")) {
        this.clearDates();
      }

      if (!target.hasClass("disabled")) {
        // Clicked on a month, year, decade, century
        if (
          target.hasClass("month") ||
          target.hasClass("year") ||
          target.hasClass("decade") ||
          target.hasClass("century")
        ) {
          this.viewDate.setUTCDate(1);

          day = 1;
          if (this.viewMode === 1) {
            month = target.parent().find(">div").index(target);
            year = this.viewDate.getUTCFullYear();
            this.viewDate.setUTCMonth(month);
          } else {
            month = 0;
            year = Number(target.text());
            this.viewDate.setUTCFullYear(year);
          }

          this._trigger(DPGlobal.viewModes[this.viewMode - 1].e, this.viewDate);

          if (this.viewMode === this.o.minViewMode) {
            this._setDate(UTCDate(year, month, day));
          } else {
            this.setViewMode(this.viewMode - 1);
            this.fill();
          }
        }
      }

      if (this.picker.is(":visible") && this._focused_from) {
        this._focused_from.focus();
      }
      delete this._focused_from;
    },

    dayCellClick: function (e) {
      var $target = $(e.currentTarget);
      var timestamp = $target.data("date");
      var date = new Date(timestamp);

      if (this.o.updateViewDate) {
        if (date.getUTCFullYear() !== this.viewDate.getUTCFullYear()) {
          this._trigger("changeYear", this.viewDate);
        }

        if (date.getUTCMonth() !== this.viewDate.getUTCMonth()) {
          this._trigger("changeMonth", this.viewDate);
        }
      }
      this._setDate(date);
      this.hide();
    },

    // Clicked on prev or next
    navArrowsClick: function (e) {
      var $target = $(e.currentTarget);
      var dir = $target.hasClass("prev") ? -1 : 1;
      if (this.viewMode !== 0) {
        dir *= DPGlobal.viewModes[this.viewMode].navStep * 12;
      }
      this.viewDate = this.moveMonth(this.viewDate, dir);
      this._trigger(DPGlobal.viewModes[this.viewMode].e, this.viewDate);
      this.fill();

      e.preventDefault();
    },
    // Clicked on prev year or next year
    navYearArrowsClick: function (e) {
      // 200423 START 전호근 - BR datepicker 수정
      var $target = $(e.currentTarget);
      var dir = $target.hasClass("prev-year") ? -1 : 1;
      if (this.viewMode === 1) {
        dir *= DPGlobal.viewModes[this.viewMode].navStep * 12;
      }
      this.viewDate = this.moveYear(this.viewDate, dir);

      if (
        dir === 1 &&
        this.o.endDate !== Infinity &&
        this.viewDate >= this.o.endDate
      ) {
        this.viewDate = this.moveMonth(this.o.endDate, 0);
      } else if (
        dir === -1 &&
        this.o.startDate !== -Infinity &&
        this.viewDate <= this.o.startDate
      ) {
        this.viewDate = this.moveMonth(this.o.startDate, 0);
      }

      this._trigger(DPGlobal.viewModes[this.viewMode].e, this.viewDate);
      this.fill();

      e.preventDefault();
      // 200423 END 전호근 - BR datepicker 수정
    },

    _toggle_multidate: function (date) {
      var ix = this.dates.contains(date);
      if (!date) {
        this.dates.clear();
      }

      if (ix !== -1) {
        if (
          this.o.multidate === true ||
          this.o.multidate > 1 ||
          this.o.toggleActive
        ) {
          this.dates.remove(ix);
        }
      } else if (this.o.multidate === false) {
        this.dates.clear();
        this.dates.push(date);
      } else {
        this.dates.push(date);
      }

      if (typeof this.o.multidate === "number")
        while (this.dates.length > this.o.multidate) this.dates.remove(0);
    },

    _setDate: function (date, which) {
      if (!which || which === "date")
        this._toggle_multidate(date && new Date(date));
      if ((!which && this.o.updateViewDate) || which === "view")
        this.viewDate = date && new Date(date);

      this.fill();
      this.setValue();
      if (!which || which !== "view") {
        this._trigger("changeDate");
      }
      this.inputField.trigger("change");
      if (this.o.autoclose && (!which || which === "date")) {
        this.hide();
      }
    },

    moveDay: function (date, dir) {
      var newDate = new Date(date);
      newDate.setUTCDate(date.getUTCDate() + dir);

      return newDate;
    },

    moveWeek: function (date, dir) {
      return this.moveDay(date, dir * 7);
    },

    moveMonth: function (date, dir) {
      if (!isValidDate(date)) return this.o.defaultViewDate;
      if (!dir) return date;
      var new_date = new Date(date.valueOf()),
        day = new_date.getUTCDate(),
        month = new_date.getUTCMonth(),
        mag = Math.abs(dir),
        new_month,
        test;
      dir = dir > 0 ? 1 : -1;
      if (mag === 1) {
        test =
          dir === -1
            ? // If going back one month, make sure month is not current month
              // (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
              function () {
                return new_date.getUTCMonth() === month;
              }
            : // If going forward one month, make sure month is as expected
              // (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
              function () {
                return new_date.getUTCMonth() !== new_month;
              };
        new_month = month + dir;
        new_date.setUTCMonth(new_month);
        // Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
        new_month = (new_month + 12) % 12;
      } else {
        // For magnitudes >1, move one month at a time...
        for (var i = 0; i < mag; i++)
          // ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
          new_date = this.moveMonth(new_date, dir);
        // ...then reset the day, keeping it in the new month
        new_month = new_date.getUTCMonth();
        new_date.setUTCDate(day);
        test = function () {
          return new_month !== new_date.getUTCMonth();
        };
      }
      // Common date-resetting loop -- if date is beyond end of month, make it
      // end of month
      while (test()) {
        new_date.setUTCDate(--day);
        new_date.setUTCMonth(new_month);
      }
      return new_date;
    },

    moveYear: function (date, dir) {
      return this.moveMonth(date, dir * 12);
    },

    moveAvailableDate: function (date, dir, fn) {
      do {
        date = this[fn](date, dir);

        if (!this.dateWithinRange(date)) return false;

        fn = "moveDay";
      } while (this.dateIsDisabled(date));

      return date;
    },

    weekOfDateIsDisabled: function (date) {
      return $.inArray(date.getUTCDay(), this.o.daysOfWeekDisabled) !== -1;
    },

    dateIsDisabled: function (date) {
      return (
        this.weekOfDateIsDisabled(date) ||
        $.grep(this.o.datesDisabled, function (d) {
          return isUTCEquals(date, d);
        }).length > 0
      );
    },

    dateWithinRange: function (date) {
      return date >= this.o.startDate && date <= this.o.endDate;
    },

    keydown: function (e) {
      if (!this.picker.is(":visible")) {
        if (e.keyCode === 40 || e.keyCode === 27) {
          // allow down to re-show picker
          this.show();
          e.stopPropagation();
        }
        return;
      }
      var dateChanged = false,
        dir,
        newViewDate,
        focusDate = this.focusDate || this.viewDate;
      switch (e.keyCode) {
        case 27: // escape
          if (this.focusDate) {
            this.focusDate = null;
            this.viewDate = this.dates.get(-1) || this.viewDate;
            this.fill();
          } else this.hide();
          e.preventDefault();
          e.stopPropagation();
          break;
        case 37: // left
        case 38: // up
        case 39: // right
        case 40: // down
          if (
            !this.o.keyboardNavigation ||
            this.o.daysOfWeekDisabled.length === 7
          )
            break;
          dir = e.keyCode === 37 || e.keyCode === 38 ? -1 : 1;
          if (this.viewMode === 0) {
            if (e.ctrlKey) {
              newViewDate = this.moveAvailableDate(focusDate, dir, "moveYear");

              if (newViewDate) this._trigger("changeYear", this.viewDate);
            } else if (e.shiftKey) {
              newViewDate = this.moveAvailableDate(focusDate, dir, "moveMonth");

              if (newViewDate) this._trigger("changeMonth", this.viewDate);
            } else if (e.keyCode === 37 || e.keyCode === 39) {
              newViewDate = this.moveAvailableDate(focusDate, dir, "moveDay");
            } else if (!this.weekOfDateIsDisabled(focusDate)) {
              newViewDate = this.moveAvailableDate(focusDate, dir, "moveWeek");
            }
          } else if (this.viewMode === 1) {
            if (e.keyCode === 38 || e.keyCode === 40) {
              dir = dir * 4;
            }
            newViewDate = this.moveAvailableDate(focusDate, dir, "moveMonth");
          } else if (this.viewMode === 2) {
            if (e.keyCode === 38 || e.keyCode === 40) {
              dir = dir * 4;
            }
            newViewDate = this.moveAvailableDate(focusDate, dir, "moveYear");
          }
          if (newViewDate) {
            this.focusDate = this.viewDate = newViewDate;
            this.setValue();
            this.fill();
            e.preventDefault();
          }
          break;
        case 13: // enter
          if (!this.o.forceParse) break;
          focusDate = this.focusDate || this.dates.get(-1) || this.viewDate;
          if (this.o.keyboardNavigation) {
            this._toggle_multidate(focusDate);
            dateChanged = true;
          }
          this.focusDate = null;
          this.viewDate = this.dates.get(-1) || this.viewDate;
          this.setValue();
          this.fill();
          if (this.picker.is(":visible")) {
            e.preventDefault();
            e.stopPropagation();
            if (this.o.autoclose) this.hide();
          }
          break;
        case 9: // tab
          this.focusDate = null;
          this.viewDate = this.dates.get(-1) || this.viewDate;
          this.fill();
          this.hide();
          break;
      }
      if (dateChanged) {
        if (this.dates.length) this._trigger("changeDate");
        else this._trigger("clearDate");
        this.inputField.trigger("change");
      }
    },

    setViewMode: function (viewMode) {
      this.viewMode = viewMode;
      this.picker
        .children("div")
        .hide()
        .filter(".datepicker-" + DPGlobal.viewModes[this.viewMode].clsName)
        .show();
      this.updateNavArrows();
      this._trigger("changeViewMode", new Date(this.viewDate));
    },
  };

  var DateRangePicker = function (element, options) {
    $.data(element, "datepicker", this);
    this.element = $(element);
    this.inputs = $.map(options.inputs, function (i) {
      return i.jquery ? i[0] : i;
    });
    delete options.inputs;

    this.keepEmptyValues = options.keepEmptyValues;
    delete options.keepEmptyValues;

    datepickerPlugin
      .call($(this.inputs), options)
      .on("changeDate", $.proxy(this.dateUpdated, this));

    this.pickers = $.map(this.inputs, function (i) {
      return $.data(i, "datepicker");
    });
    this.updateDates();
  };
  DateRangePicker.prototype = {
    updateDates: function () {
      this.dates = $.map(this.pickers, function (i) {
        return i.getUTCDate();
      });
      this.updateRanges();
    },
    updateRanges: function () {
      var range = $.map(this.dates, function (d) {
        return d.valueOf();
      });
      $.each(this.pickers, function (i, p) {
        p.setRange(range);
      });
    },
    clearDates: function () {
      $.each(this.pickers, function (i, p) {
        p.clearDates();
      });
    },
    dateUpdated: function (e) {
      // `this.updating` is a workaround for preventing infinite recursion
      // between `changeDate` triggering and `setUTCDate` calling.  Until
      // there is a better mechanism.
      if (this.updating) return;
      this.updating = true;

      var dp = $.data(e.target, "datepicker");

      if (dp === undefined) {
        return;
      }

      var new_date = dp.getUTCDate(),
        keep_empty_values = this.keepEmptyValues,
        i = $.inArray(e.target, this.inputs),
        j = i - 1,
        k = i + 1,
        l = this.inputs.length;
      if (i === -1) return;

      $.each(this.pickers, function (i, p) {
        if (!p.getUTCDate() && (p === dp || !keep_empty_values))
          p.setUTCDate(new_date);
      });

      if (new_date < this.dates[j]) {
        // Date being moved earlier/left
        while (
          j >= 0 &&
          new_date < this.dates[j] &&
          (this.pickers[j].element.val() || "").length > 0
        ) {
          this.pickers[j--].setUTCDate(new_date);
        }
      } else if (new_date > this.dates[k]) {
        // Date being moved later/right
        while (
          k < l &&
          new_date > this.dates[k] &&
          (this.pickers[k].element.val() || "").length > 0
        ) {
          this.pickers[k++].setUTCDate(new_date);
        }
      }
      this.updateDates();

      delete this.updating;
    },
    destroy: function () {
      $.map(this.pickers, function (p) {
        p.destroy();
      });
      $(this.inputs).off("changeDate", this.dateUpdated);
      delete this.element.data().datepicker;
    },
    remove: alias(
      "destroy",
      "Method `remove` is deprecated and will be removed in version 2.0. Use `destroy` instead"
    ),
  };

  function opts_from_el(el, prefix) {
    // Derive options from element data-attrs
    var data = $(el).data(),
      out = {},
      inkey,
      replace = new RegExp("^" + prefix.toLowerCase() + "([A-Z])");
    prefix = new RegExp("^" + prefix.toLowerCase());
    function re_lower(_, a) {
      return a.toLowerCase();
    }
    for (var key in data)
      if (prefix.test(key)) {
        inkey = key.replace(replace, re_lower);
        out[inkey] = data[key];
      }
    return out;
  }

  function opts_from_locale(lang) {
    // Derive options from locale plugins
    var out = {};
    // Check if "de-DE" style date is available, if not language should
    // fallback to 2 letter code eg "de"
    if (!dates[lang]) {
      lang = lang.split("-")[0];
      if (!dates[lang]) return;
    }
    var d = dates[lang];
    $.each(locale_opts, function (i, k) {
      if (k in d) out[k] = d[k];
    });
    return out;
  }

  var old = $.fn.datePicker;
  var datepickerPlugin = function (option) {
    var args = Array.apply(null, arguments);
    args.shift();
    var internal_return;
    this.each(function () {
      var $this = $(this),
        data = $this.data("datepicker"),
        options = typeof option === "object" && option;
      if (!data) {
        var elopts = opts_from_el(this, "date"),
          // Preliminary otions
          xopts = $.extend({}, defaults, elopts, options),
          locopts = opts_from_locale(xopts.language),
          // Options priority: js args, data-attrs, locales, defaults
          opts = $.extend({}, defaults, locopts, elopts, options);
        if ($this.hasClass("input-daterange") || opts.inputs) {
          $.extend(opts, {
            inputs: opts.inputs || $this.find("input").toArray(),
          });
          data = new DateRangePicker(this, opts);
        } else {
          data = new Datepicker(this, opts);
        }
        $this.data("datepicker", data);
      }
      if (typeof option === "string" && typeof data[option] === "function") {
        internal_return = data[option].apply(data, args);
      }
    });

    if (
      internal_return === undefined ||
      internal_return instanceof Datepicker ||
      internal_return instanceof DateRangePicker
    )
      return this;

    if (this.length > 1)
      throw new Error(
        "Using only allowed for the collection of a single element (" +
          option +
          " function)"
      );
    else return internal_return;
  };
  $.fn.datePicker = datepickerPlugin;

  var defaults = ($.fn.datePicker.defaults = {
    assumeNearbyYear: false,
    autoclose: false,
    beforeShowDay: $.noop,
    beforeShowMonth: $.noop,
    beforeShowYear: $.noop,
    beforeShowDecade: $.noop,
    beforeShowCentury: $.noop,
    calendarWeeks: false,
    clearBtn: false,
    toggleActive: false,
    daysOfWeekDisabled: [],
    daysOfWeekHighlighted: [],
    datesDisabled: [],
    endDate: Infinity,
    forceParse: true,
    format: "mm/dd/yyyy",
    isInline: null,
    keepEmptyValues: false,
    keyboardNavigation: true,
    language: "en",
    minViewMode: 0,
    maxViewMode: 4,
    multidate: false,
    multidateSeparator: ",",
    orientation: "auto",
    rtl: false,
    startDate: -Infinity,
    startView: 0,
    todayBtn: false,
    todayHighlight: false,
    updateViewDate: true,
    weekStart: 0,
    disableTouchKeyboard: false,
    enableOnReadonly: true,
    showOnFocus: true,
    zIndexOffset: 10,
    container: "body",
    immediateUpdates: false,
    title: "",
    templates: {
      leftArrow: "&#x00AB;",
      rightArrow: "&#x00BB;",
      leftDoubleArrow: "&#171;",
      rightDoubleArrow: "&#187;",
    },
    showWeekDays: true,
  });
  var locale_opts = ($.fn.datePicker.locale_opts = [
    "format",
    "rtl",
    "weekStart",
  ]);
  $.fn.datePicker.Constructor = Datepicker;
  var dates = ($.fn.datePicker.dates = {
    en: {
      days: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      daysMin: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      monthsShort: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      today: "Today",
      clear: "Clear",
      titleFormat: "MM yyyy",
    },
  });

  var DPGlobal = {
    viewModes: [
      {
        names: ["days", "month"],
        clsName: "years-days",
        e: "changeMonth",
      },
      {
        names: ["months", "year"],
        clsName: "months",
        e: "changeYear",
        navStep: 1,
      },
      {
        names: ["years", "decade"],
        clsName: "years",
        e: "changeDecade",
        navStep: 10,
      },
      {
        names: ["decades", "century"],
        clsName: "decades",
        e: "changeCentury",
        navStep: 100,
      },
      {
        names: ["centuries", "millennium"],
        clsName: "centuries",
        e: "changeMillennium",
        navStep: 1000,
      },
    ],
    validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
    nonpunctuation: /[^ -\/:-@\u5e74\u6708\u65e5\[-`{-~\t\n\r]+/g,
    parseFormat: function (format) {
      if (
        typeof format.toValue === "function" &&
        typeof format.toDisplay === "function"
      )
        return format;
      // IE treats \0 as a string end in inputs (truncating the value),
      // so it's a bad format delimiter, anyway
      var separators = format.replace(this.validParts, "\0").split("\0"),
        parts = format.match(this.validParts);
      if (!separators || !separators.length || !parts || parts.length === 0) {
        throw new Error("Invalid date format.");
      }
      return { separators: separators, parts: parts };
    },
    parseDate: function (date, format, language, assumeNearby) {
      if (!date) return undefined;
      if (date instanceof Date) return date;
      if (typeof format === "string") format = DPGlobal.parseFormat(format);
      if (format.toValue) return format.toValue(date, format, language);
      var fn_map = {
          d: "moveDay",
          m: "moveMonth",
          w: "moveWeek",
          y: "moveYear",
        },
        dateAliases = {
          yesterday: "-1d",
          today: "+0d",
          tomorrow: "+1d",
        },
        parts,
        part,
        dir,
        i,
        fn;
      if (date in dateAliases) {
        date = dateAliases[date];
      }
      if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/i.test(date)) {
        parts = date.match(/([\-+]\d+)([dmwy])/gi);
        date = new Date();
        for (i = 0; i < parts.length; i++) {
          part = parts[i].match(/([\-+]\d+)([dmwy])/i);
          dir = Number(part[1]);
          fn = fn_map[part[2].toLowerCase()];
          date = Datepicker.prototype[fn](date, dir);
        }
        return Datepicker.prototype._zero_utc_time(date);
      }

      parts = (date && date.match(this.nonpunctuation)) || [];

      function applyNearbyYear(year, threshold) {
        if (threshold === true) threshold = 10;

        // if year is 2 digits or less, than the user most likely is trying to get a recent century
        if (year < 100) {
          year += 2000;
          // if the new year is more than threshold years in advance, use last century
          if (year > new Date().getFullYear() + threshold) {
            year -= 100;
          }
        }

        return year;
      }

      var parsed = {},
        setters_order = ["yyyy", "yy", "M", "MM", "m", "mm", "d", "dd"],
        setters_map = {
          yyyy: function (d, v) {
            return d.setUTCFullYear(
              assumeNearby ? applyNearbyYear(v, assumeNearby) : v
            );
          },
          m: function (d, v) {
            if (isNaN(d)) return d;
            v -= 1;
            while (v < 0) v += 12;
            v %= 12;
            d.setUTCMonth(v);
            while (d.getUTCMonth() !== v) d.setUTCDate(d.getUTCDate() - 1);
            return d;
          },
          d: function (d, v) {
            return d.setUTCDate(v);
          },
        },
        val,
        filtered;
      setters_map["yy"] = setters_map["yyyy"];
      setters_map["M"] =
        setters_map["MM"] =
        setters_map["mm"] =
          setters_map["m"];
      setters_map["dd"] = setters_map["d"];
      date = UTCToday();
      var fparts = format.parts.slice();
      // Remove noop parts
      if (parts.length !== fparts.length) {
        fparts = $(fparts)
          .filter(function (i, p) {
            return $.inArray(p, setters_order) !== -1;
          })
          .toArray();
      }
      // Process remainder
      function match_part() {
        var m = this.slice(0, parts[i].length),
          p = parts[i].slice(0, m.length);
        return m.toLowerCase() === p.toLowerCase();
      }
      if (parts.length === fparts.length) {
        var cnt;
        for (i = 0, cnt = fparts.length; i < cnt; i++) {
          val = parseInt(parts[i], 10);
          part = fparts[i];
          if (isNaN(val)) {
            switch (part) {
              case "MM":
                filtered = $(dates[language].months).filter(match_part);
                val = $.inArray(filtered[0], dates[language].months) + 1;
                break;
              case "M":
                filtered = $(dates[language].monthsShort).filter(match_part);
                val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
                break;
            }
          }
          parsed[part] = val;
        }
        var _date, s;
        for (i = 0; i < setters_order.length; i++) {
          s = setters_order[i];
          if (s in parsed && !isNaN(parsed[s])) {
            _date = new Date(date);
            setters_map[s](_date, parsed[s]);
            if (!isNaN(_date)) date = _date;
          }
        }
      }
      return date;
    },
    formatDate: function (date, format, language) {
      if (!date) return "";
      if (typeof format === "string") format = DPGlobal.parseFormat(format);
      if (format.toDisplay) return format.toDisplay(date, format, language);
      var val = {
        d: date.getUTCDate(),
        D: dates[language].daysShort[date.getUTCDay()],
        DD: dates[language].days[date.getUTCDay()],
        m: date.getUTCMonth() + 1,
        M: dates[language].monthsShort[date.getUTCMonth()],
        MM: dates[language].months[date.getUTCMonth()],
        yy: date.getUTCFullYear().toString().substring(2),
        yyyy: date.getUTCFullYear(),
      };
      val.dd = (val.d < 10 ? "0" : "") + val.d;
      val.mm = (val.m < 10 ? "0" : "") + val.m;
      date = [];
      var seps = $.extend([], format.separators);
      for (var i = 0, cnt = format.parts.length; i <= cnt; i++) {
        if (seps.length) date.push(seps.shift());
        date.push(val[format.parts[i]]);
      }
      return date.join("");
    },
    headTemplate:
      "<thead>" +
      "<tr>" +
      '<th colspan="7" class="datepicker-title"></th>' +
      "</tr>" +
      "<tr>" +
      '<th class="prev">' +
      defaults.templates.leftArrow +
      "</th>" +
      '<th colspan="5" class="datepicker-switch"></th>' +
      '<th class="next">' +
      defaults.templates.rightArrow +
      "</th>" +
      "</tr>" +
      "</thead>",
    headTemplateYear:
      "<thead>" +
      "<tr>" +
      '<th colspan="7" class="datepicker-title"></th>' +
      "</tr>" +
      "<tr>" +
      '<th class="controller" colspan="2">' +
      '<button type="button" class="prev-year">' +
      defaults.templates.leftDoubleArrow +
      "</button>" +
      '<button type="button" class="prev">' +
      defaults.templates.leftArrow +
      "</button>" +
      "</th>" +
      '<th colspan="3" class="datepicker-switch"></th>' +
      '<th class="controller" colspan="2">' +
      '<button type="button" class="next">' +
      defaults.templates.rightArrow +
      "</button>" +
      '<button type="button" class="next-year">' +
      defaults.templates.rightDoubleArrow +
      "</button>" +
      "</th>" +
      "</tr>" +
      "</thead>",
    contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
    footTemplate:
      "<tfoot>" +
      "<tr>" +
      '<th colspan="7" class="today"></th>' +
      "</tr>" +
      "<tr>" +
      '<th colspan="7" class="clear"></th>' +
      "</tr>" +
      "</tfoot>",
  };
  DPGlobal.template =
    '<div class="datepicker">' +
    '<div class="datepicker-days">' +
    '<table class="table-condensed">' +
    DPGlobal.headTemplate +
    "<tbody></tbody>" +
    DPGlobal.footTemplate +
    "</table>" +
    "</div>" +
    '<div class="datepicker-years-days">' +
    '<table class="table-condensed">' +
    DPGlobal.headTemplateYear +
    "<tbody></tbody>" +
    DPGlobal.footTemplate +
    "</table>" +
    "</div>" +
    '<div class="datepicker-months">' +
    '<table class="table-condensed">' +
    DPGlobal.headTemplate +
    DPGlobal.contTemplate +
    DPGlobal.footTemplate +
    "</table>" +
    "</div>" +
    '<div class="datepicker-years">' +
    '<table class="table-condensed">' +
    DPGlobal.headTemplate +
    DPGlobal.contTemplate +
    DPGlobal.footTemplate +
    "</table>" +
    "</div>" +
    '<div class="datepicker-decades">' +
    '<table class="table-condensed">' +
    DPGlobal.headTemplate +
    DPGlobal.contTemplate +
    DPGlobal.footTemplate +
    "</table>" +
    "</div>" +
    '<div class="datepicker-centuries">' +
    '<table class="table-condensed">' +
    DPGlobal.headTemplate +
    DPGlobal.contTemplate +
    DPGlobal.footTemplate +
    "</table>" +
    "</div>" +
    "</div>";

  $.fn.datePicker.DPGlobal = DPGlobal;

  /* DATEPICKER NO CONFLICT
   * =================== */

  $.fn.datePicker.noConflict = function () {
    $.fn.datePicker = old;
    return this;
  };

  /* DATEPICKER VERSION
   * =================== */
  $.fn.datePicker.version = "1.9.0";

  $.fn.datePicker.deprecated = function (msg) {
    var console = window.console;
    if (console && console.warn) {
      console.warn("DEPRECATED: " + msg);
    }
  };

  /* DATEPICKER DATA-API
   * ================== */
  $(function () {
    datepickerPlugin.call($('[data-provide="datepicker-inline"]'));
  });

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.3.1): index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  (function () {
    if (typeof $ === "undefined") {
      throw new TypeError(
        "Bootstrap's JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript."
      );
    }

    var version = $.fn.jquery.split(" ")[0].split(".");
    var minMajor = 1;
    var ltMajor = 2;
    var minMinor = 9;
    var minPatch = 1;
    var maxMajor = 4;

    if (
      (version[0] < ltMajor && version[1] < minMinor) ||
      (version[0] === minMajor &&
        version[1] === minMinor &&
        version[2] < minPatch) ||
      version[0] >= maxMajor
    ) {
      throw new Error(
        "Bootstrap's JavaScript requires at least jQuery v1.9.1 but less than v4.0.0"
      );
    }
  })();

  exports.Util = Util;
  exports.Collapse = Collapse;
  exports.Modal = Modal;
  exports.Toast = Toast;

  Object.defineProperty(exports, "__esModule", { value: true });
});
/*! lazysizes - v4.1.4
 * https://github.com/aFarkas/lazysizes
 */

/*! Slick - 1.8.1
 * https://kenwheeler.github.io/slick/
 */

/*!
 * InlineSVG
 *
 * This is a jQuery plugin that takes an image selector as an argument having a
 * SVG as source. Then it inlines the SVG so that the SVG stroke and path can
 * be manipulated using plain CSS.
 *
 * @license MIT
 * @version 2.0.0
 * @see {@link https://github.com/createlogic/InlineSVG|GitHub}
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2010-2015 Bilal Niaz Awan
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */

/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 */

// lazyload image (onerror)
function srcErrorIMG($img, src) {
  if (!src || src == "") return false;
  $img.attr("src", src);
}

// product summary
var productSummaryImg1 =
    "/lg5-common-gp/images/common/product-default-desktop.jpg",
  productSummaryImg2 =
    "/lg5-common-gp/images/common/product-default-mobile.jpg";

// list
var productListImg1 =
    "/lg5-common-gp/images/common/product-default-list-350.jpg",
  productListImg2 = "/lg5-common-gp/images/common/product-default-list-260.jpg",
  productListImg3 = "/lg5-common-gp/images/common/product-default-list-165.jpg";

function bindImgError() {
  // default
  $("img[data-error-img]").each(function () {
    $(this)
      .off("error")
      .on("error", function () {
        var defaultImg = $(this).attr("data-error-img");
        if (defaultImg) {
          $(this).off("error");
          console.log($(this).attr("class"), defaultImg);
          srcErrorIMG($(this), defaultImg);
        }
      });
  });

  // .js-model .visual img : GPC0004, GPC0007, GPC0026 .. and etc.
  $(
    ".js-model .visual img, .GPC0003 .visual img, .GPC0010 .item .product-img img, .GPC0012 .item .visual img, .GPC0023 .visual-info img, .GPC0058 .list-area .item .img a img, .GPC0082 .item .visual-info img, .GPC0150 .visual img, .search-result-support .product-support-list .item .visual img"
  ).each(function () {
    $(this)
      .off("error")
      .on("error", function () {
        $(this).off("error");
        if ($(this).hasClass("mobile")) srcErrorIMG($(this), productListImg2);
        else srcErrorIMG($(this), productListImg1);
      });
  });

  // GPC0009
  $(
    ".GPC0009 .pdp-visual-image img, .GPC0009 .pdp-visual .slick-slide img, #modal_detail_target .item img"
  ).each(function () {
    $(this)
      .off("error")
      .on("error", function () {
        $(this).off("error");
        if ($(this).closest(".hidden-sm").length > 0)
          srcErrorIMG($(this), productSummaryImg1);
        else srcErrorIMG($(this), productSummaryImg2);
      });
  });
  $(
    ".GPC0009 .pdp-thumbnail-nav .thumbnail img, .modal .modal-pdp-gallery .modal-body .thumbnail .image img"
  ).each(function () {
    $(this)
      .off("error")
      .on("error", function () {
        $(this).off("error");
        srcErrorIMG($(this), productListImg3);
      });
  });
  $(
    ".GPC0009 .pdp-thumbnail-nav .video img, .modal .modal-pdp-gallery .modal-body .thumbnail .video img"
  ).each(function () {
    $(this)
      .off("error")
      .on("error", function () {
        $(this).off("error");
        srcErrorIMG(
          $(this),
          "/lg5-common-gp/images/common/video-default-thumbnail.gif"
        );
      });
  });

  // My LG > Index
  // 200421 START 전호근 - error image 수정
  $(window).on("load", function () {
    $(".mylg-index-wrap .item .visual img").each(function () {
      if (
        this.src != "" &&
        (this.naturalWidth == 0 || typeof this.naturalWidth == "undefined")
      ) {
        $(this).off("error");
        if ($(this).hasClass("mobile")) srcErrorIMG($(this), productListImg2);
        else srcErrorIMG($(this), productListImg1);
      }
    });
  });
  // 200421 END 전호근 - error image 수정

  $(".mylg-index-wrap .my-repair-requests.table-list-wrap td img").each(
    function () {
      $(this)
        .off("error")
        .on("error", function () {
          $(this).off("error");
          srcErrorIMG($(this), productListImg3);
        });
    }
  );

  // My LG > Products
  $(".my-product .product-info .product-info-img img").each(function () {
    $(this)
      .off("error")
      .on("error", function () {
        $(this).off("error");
        srcErrorIMG($(this), productListImg3);
      });
  });
  $(".my-product .complete-list .image-cell img").each(function () {
    $(this)
      .off("error")
      .on("error", function () {
        $(this).off("error");
        srcErrorIMG($(this), productListImg3);
      });
  });

  // CS > Right floating bar (only desktop)
  $(".right-floating-bar .viewed-item .imagbox img").each(function () {
    $(this)
      .off("error")
      .on("error", function () {
        $(this).off("error");
        srcErrorIMG($(this), productListImg3);
      });
  });

  // CS > Home
  $(".support-wrap .solutions-contents .product-type .item .visual img").each(
    function () {
      $(this)
        .off("error")
        .on("error", function () {
          $(this).off("error");
          if ($(this).hasClass("mobile")) srcErrorIMG($(this), productListImg2);
          else srcErrorIMG($(this), productListImg1);
        });
    }
  );

  // CS > PSP
  $(".support-wrap .support-product-area .visual img").each(function () {
    $(this)
      .off("error")
      .on("error", function () {
        $(this).off("error");
        srcErrorIMG($(this), productListImg2);
      });
  });

  // CS > select a product category
  $(
    ".support-wrap .select-category-area .search-select-area .search-result-group .image-box img"
  ).each(function () {
    $(this)
      .off("error")
      .on("error", function () {
        $(this).off("error");
        srcErrorIMG($(this), productListImg3);
      });
  });

  // CS > Step > My products
  $(
    ".support-wrap .step-in-form .select-product .my-Products .item .visual img"
  ).each(function () {
    $(this)
      .off("error")
      .on("error", function () {
        $(this).off("error");
        srcErrorIMG($(this), productListImg1);
      });
  });
  $(".support-wrap .model-information-wrap .model-info-box .image img").each(
    function () {
      $(this)
        .off("error")
        .on("error", function () {
          $(this).off("error");
          srcErrorIMG($(this), productListImg1);
        });
    }
  );
  $(
    ".support-wrap .step-in-form .step-cluster .select-product .model-view-image .image-box img"
  ).each(function () {
    $(this)
      .off("error")
      .on("error", function () {
        $(this).off("error");
        srcErrorIMG($(this), productListImg1);
      });
  });
  $(".request-repair-completion .table-view  td img").each(function () {
    $(this)
      .off("error")
      .on("error", function () {
        $(this).off("error");
        srcErrorIMG($(this), productListImg3);
      });
  });

  // CS > Track Repair > List
  $(".support-wrap .track-repair-list .result-area table img").each(
    function () {
      $(this)
        .off("error")
        .on("error", function () {
          $(this).off("error");
          srcErrorIMG($(this), productListImg3);
        });
    }
  );
  $(".support-wrap .repair-info-wrap table img").each(function () {
    $(this)
      .off("error")
      .on("error", function () {
        $(this).off("error");
        srcErrorIMG($(this), productListImg3);
      });
  });

  // CS > Email
  $(
    ".support-wrap .email-common .your-product .model-image-box .model-view-image .image-box img"
  ).each(function () {
    $(this)
      .off("error")
      .on("error", function () {
        $(this).off("error");
        srcErrorIMG($(this), productListImg1);
      });
  });
  $(
    ".support-wrap .email-common .your-product .select-product .my-Products .product-type .item .visual img"
  ).each(function () {
    $(this)
      .off("error")
      .on("error", function () {
        $(this).off("error");
        if ($(this).hasClass("mobile")) srcErrorIMG($(this), productListImg2);
        else srcErrorIMG($(this), productListImg1);
      });
  });

  // CS > mylg > request repair list
  $(".support-wrap .request-repair-list .result-area table img").each(
    function () {
      $(this)
        .off("error")
        .on("error", function () {
          $(this).off("error");
          srcErrorIMG($(this), productListImg3);
        });
    }
  );

  // LGEGMC-4167 Start
  // CS > register product gate > thinQ popup
  $(
    ".modal-product-register-with-thinq .product-item .product-img-area img"
  ).each(function () {
    $(this)
      .off("error")
      .on("error", function () {
        $(this).off("error");
        srcErrorIMG($(this), productListImg2);
      });
  });
  // LGEGMC-4167 End
}
bindImgError();

$("img.lazyload").on("load", function () {
  $(this).attr("data-loaded", true);
});

// lazysizes - v4.1.4
!(function (a, b) {
  var c = b(a, a.document);
  (a.lazySizes = c),
    "object" == typeof module && module.exports && (module.exports = c);
})(window, function (a, b) {
  "use strict";
  if (b.getElementsByClassName) {
    var c,
      d,
      e = b.documentElement,
      f = a.Date,
      g = a.HTMLPictureElement,
      h = "addEventListener",
      i = "getAttribute",
      j = a[h],
      k = a.setTimeout,
      l = a.requestAnimationFrame || k,
      m = a.requestIdleCallback,
      n = /^picture$/i,
      o = ["load", "error", "lazyincluded", "_lazyloaded"],
      p = {},
      q = Array.prototype.forEach,
      r = function (a, b) {
        return (
          p[b] || (p[b] = new RegExp("(\\s|^)" + b + "(\\s|$)")),
          p[b].test(a[i]("class") || "") && p[b]
        );
      },
      s = function (a, b) {
        r(a, b) ||
          a.setAttribute("class", (a[i]("class") || "").trim() + " " + b);
      },
      t = function (a, b) {
        var c;
        (c = r(a, b)) &&
          a.setAttribute("class", (a[i]("class") || "").replace(c, " "));
      },
      u = function (a, b, c) {
        var d = c ? h : "removeEventListener";
        c && u(a, b),
          o.forEach(function (c) {
            a[d](c, b);
          });
      },
      v = function (a, d, e, f, g) {
        var h = b.createEvent("Event");
        return (
          e || (e = {}),
          (e.instance = c),
          h.initEvent(d, !f, !g),
          (h.detail = e),
          a.dispatchEvent(h),
          h
        );
      },
      w = function (b, c) {
        var e;
        !g && (e = a.picturefill || d.pf)
          ? (c && c.src && !b[i]("srcset") && b.setAttribute("srcset", c.src),
            e({ reevaluate: !0, elements: [b] }))
          : c && c.src && (b.src = c.src);
      },
      x = function (a, b) {
        return (getComputedStyle(a, null) || {})[b];
      },
      y = function (a, b, c) {
        for (c = c || a.offsetWidth; c < d.minSize && b && !a._lazysizesWidth; )
          (c = b.offsetWidth), (b = b.parentNode);
        return c;
      },
      z = (function () {
        var a,
          c,
          d = [],
          e = [],
          f = d,
          g = function () {
            var b = f;
            for (f = d.length ? e : d, a = !0, c = !1; b.length; ) b.shift()();
            a = !1;
          },
          h = function (d, e) {
            a && !e
              ? d.apply(this, arguments)
              : (f.push(d), c || ((c = !0), (b.hidden ? k : l)(g)));
          };
        return (h._lsFlush = g), h;
      })(),
      A = function (a, b) {
        return b
          ? function () {
              z(a);
            }
          : function () {
              var b = this,
                c = arguments;
              z(function () {
                a.apply(b, c);
              });
            };
      },
      B = function (a) {
        var b,
          c = 0,
          e = d.throttleDelay,
          g = d.ricTimeout,
          h = function () {
            (b = !1), (c = f.now()), a();
          },
          i =
            m && g > 49
              ? function () {
                  m(h, { timeout: g }),
                    g !== d.ricTimeout && (g = d.ricTimeout);
                }
              : A(function () {
                  k(h);
                }, !0);
        return function (a) {
          var d;
          (a = a === !0) && (g = 33),
            b ||
              ((b = !0),
              (d = e - (f.now() - c)),
              0 > d && (d = 0),
              a || 9 > d ? i() : k(i, d));
        };
      },
      C = function (a) {
        var b,
          c,
          d = 99,
          e = function () {
            (b = null), a();
          },
          g = function () {
            var a = f.now() - c;
            d > a ? k(g, d - a) : (m || e)(e);
          };
        return function () {
          (c = f.now()), b || (b = k(g, d));
        };
      };
    !(function () {
      var b,
        c = {
          lazyClass: "lazyload",
          loadedClass: "lazyloaded",
          loadingClass: "lazyloading",
          preloadClass: "lazypreload",
          errorClass: "lazyerror",
          autosizesClass: "lazyautosizes",
          srcAttr: "data-src",
          srcsetAttr: "data-srcset",
          sizesAttr: "data-sizes",
          minSize: 40,
          customMedia: {},
          init: !0,
          expFactor: 1.5,
          hFac: 0.8,
          loadMode: 2,
          loadHidden: !0,
          ricTimeout: 0,
          throttleDelay: 125,
        };
      d = a.lazySizesConfig || a.lazysizesConfig || {};
      for (b in c) b in d || (d[b] = c[b]);
      (a.lazySizesConfig = d),
        k(function () {
          d.init && F();
        });
    })();
    var D = (function () {
        var g,
          l,
          m,
          o,
          p,
          y,
          D,
          F,
          G,
          H,
          I,
          J,
          K,
          L,
          M = /^img$/i,
          N = /^iframe$/i,
          O = "onscroll" in a && !/(gle|ing)bot/.test(navigator.userAgent),
          P = 0,
          Q = 0,
          R = 0,
          S = -1,
          T = function (a) {
            R--,
              a && a.target && u(a.target, T),
              (!a || 0 > R || !a.target) && (R = 0);
          },
          U = function (a, c) {
            var d,
              f = a,
              g =
                "hidden" == x(b.body, "visibility") ||
                ("hidden" != x(a.parentNode, "visibility") &&
                  "hidden" != x(a, "visibility"));
            for (
              F -= c, I += c, G -= c, H += c;
              g && (f = f.offsetParent) && f != b.body && f != e;

            )
              (g = (x(f, "opacity") || 1) > 0),
                g &&
                  "visible" != x(f, "overflow") &&
                  ((d = f.getBoundingClientRect()),
                  (g =
                    H > d.left &&
                    G < d.right &&
                    I > d.top - 1 &&
                    F < d.bottom + 1));
            return g;
          },
          V = function () {
            var a,
              f,
              h,
              j,
              k,
              m,
              n,
              p,
              q,
              r = c.elements;
            if ((o = d.loadMode) && 8 > R && (a = r.length)) {
              (f = 0),
                S++,
                null == K &&
                  ("expand" in d ||
                    (d.expand =
                      e.clientHeight > 500 && e.clientWidth > 500 ? 500 : 370),
                  (J = d.expand),
                  (K = J * d.expFactor)),
                K > Q && 1 > R && S > 2 && o > 2 && !b.hidden
                  ? ((Q = K), (S = 0))
                  : (Q = o > 1 && S > 1 && 6 > R ? J : P);
              for (; a > f; f++)
                if (r[f] && !r[f]._lazyRace)
                  if (O)
                    if (
                      (((p = r[f][i]("data-expand")) && (m = 1 * p)) || (m = Q),
                      q !== m &&
                        ((y = innerWidth + m * L),
                        (D = innerHeight + m),
                        (n = -1 * m),
                        (q = m)),
                      (h = r[f].getBoundingClientRect()),
                      (I = h.bottom) >= n &&
                        (F = h.top) <= D &&
                        (H = h.right) >= n * L &&
                        (G = h.left) <= y &&
                        (I || H || G || F) &&
                        (d.loadHidden || "hidden" != x(r[f], "visibility")) &&
                        ((l && 3 > R && !p && (3 > o || 4 > S)) || U(r[f], m)))
                    ) {
                      if ((ba(r[f]), (k = !0), R > 9)) break;
                    } else
                      !k &&
                        l &&
                        !j &&
                        4 > R &&
                        4 > S &&
                        o > 2 &&
                        (g[0] || d.preloadAfterLoad) &&
                        (g[0] ||
                          (!p &&
                            (I ||
                              H ||
                              G ||
                              F ||
                              "auto" != r[f][i](d.sizesAttr)))) &&
                        (j = g[0] || r[f]);
                  else ba(r[f]);
              j && !k && ba(j);
            }
          },
          W = B(V),
          X = function (a) {
            s(a.target, d.loadedClass),
              t(a.target, d.loadingClass),
              u(a.target, Z),
              v(a.target, "lazyloaded");
          },
          Y = A(X),
          Z = function (a) {
            Y({ target: a.target });
          },
          $ = function (a, b) {
            try {
              a.contentWindow.location.replace(b);
            } catch (c) {
              a.src = b;
            }
          },
          _ = function (a) {
            var b,
              c = a[i](d.srcsetAttr);
            (b = d.customMedia[a[i]("data-media") || a[i]("media")]) &&
              a.setAttribute("media", b),
              c && a.setAttribute("srcset", c);
          },
          aa = A(function (a, b, c, e, f) {
            var g, h, j, l, o, p;
            (o = v(a, "lazybeforeunveil", b)).defaultPrevented ||
              (e && (c ? s(a, d.autosizesClass) : a.setAttribute("sizes", e)),
              (h = a[i](d.srcsetAttr)),
              (g = a[i](d.srcAttr)),
              f && ((j = a.parentNode), (l = j && n.test(j.nodeName || ""))),
              (p = b.firesLoad || ("src" in a && (h || g || l))),
              (o = { target: a }),
              p &&
                (u(a, T, !0),
                clearTimeout(m),
                (m = k(T, 2500)),
                s(a, d.loadingClass),
                u(a, Z, !0)),
              l && q.call(j.getElementsByTagName("source"), _),
              h
                ? a.setAttribute("srcset", h)
                : g && !l && (N.test(a.nodeName) ? $(a, g) : (a.src = g)),
              f && (h || l) && w(a, { src: g })),
              a._lazyRace && delete a._lazyRace,
              t(a, d.lazyClass),
              z(function () {
                (!p || (a.complete && a.naturalWidth > 1)) &&
                  (p ? T(o) : R--, X(o));
              }, !0);
          }),
          ba = function (a) {
            var b,
              c = M.test(a.nodeName),
              e = c && (a[i](d.sizesAttr) || a[i]("sizes")),
              f = "auto" == e;
            ((!f && l) ||
              !c ||
              (!a[i]("src") && !a.srcset) ||
              a.complete ||
              r(a, d.errorClass) ||
              !r(a, d.lazyClass)) &&
              ((b = v(a, "lazyunveilread").detail),
              f && E.updateElem(a, !0, a.offsetWidth),
              (a._lazyRace = !0),
              R++,
              aa(a, b, f, e, c));
          },
          ca = function () {
            if (!l) {
              if (f.now() - p < 999) return void k(ca, 999);
              var a = C(function () {
                (d.loadMode = 3), W();
              });
              (l = !0),
                (d.loadMode = 3),
                W(),
                j(
                  "scroll",
                  function () {
                    3 == d.loadMode && (d.loadMode = 2), a();
                  },
                  !0
                );
            }
          };
        return {
          _: function () {
            (p = f.now()),
              (c.elements = b.getElementsByClassName(d.lazyClass)),
              (g = b.getElementsByClassName(
                d.lazyClass + " " + d.preloadClass
              )),
              (L = d.hFac),
              j("scroll", W, !0),
              j("resize", W, !0),
              a.MutationObserver
                ? new MutationObserver(W).observe(e, {
                    childList: !0,
                    subtree: !0,
                    attributes: !0,
                  })
                : (e[h]("DOMNodeInserted", W, !0),
                  e[h]("DOMAttrModified", W, !0),
                  setInterval(W, 999)),
              j("hashchange", W, !0),
              [
                "focus",
                "mouseover",
                "click",
                "load",
                "transitionend",
                "animationend",
                "webkitAnimationEnd",
              ].forEach(function (a) {
                b[h](a, W, !0);
              }),
              /d$|^c/.test(b.readyState)
                ? ca()
                : (j("load", ca), b[h]("DOMContentLoaded", W), k(ca, 2e4)),
              c.elements.length ? (V(), z._lsFlush()) : W();
          },
          checkElems: W,
          unveil: ba,
        };
      })(),
      E = (function () {
        var a,
          c = A(function (a, b, c, d) {
            var e, f, g;
            if (
              ((a._lazysizesWidth = d),
              (d += "px"),
              a.setAttribute("sizes", d),
              n.test(b.nodeName || ""))
            )
              for (
                e = b.getElementsByTagName("source"), f = 0, g = e.length;
                g > f;
                f++
              )
                e[f].setAttribute("sizes", d);
            c.detail.dataAttr || w(a, c.detail);
          }),
          e = function (a, b, d) {
            var e,
              f = a.parentNode;
            f &&
              ((d = y(a, f, d)),
              (e = v(a, "lazybeforesizes", { width: d, dataAttr: !!b })),
              e.defaultPrevented ||
                ((d = e.detail.width),
                d && d !== a._lazysizesWidth && c(a, f, e, d)));
          },
          f = function () {
            var b,
              c = a.length;
            if (c) for (b = 0; c > b; b++) e(a[b]);
          },
          g = C(f);
        return {
          _: function () {
            (a = b.getElementsByClassName(d.autosizesClass)), j("resize", g);
          },
          checkElems: g,
          updateElem: e,
        };
      })(),
      F = function () {
        F.i || ((F.i = !0), E._(), D._());
      };
    return (c = {
      cfg: d,
      autoSizer: E,
      loader: D,
      init: F,
      uP: w,
      aC: s,
      rC: t,
      hC: r,
      fire: v,
      gW: y,
      rAF: z,
    });
  }
});

// Slick - 1.8.1
/*
	Last Modified Date : 2019-11-22
*/
/* LGECI-261 20201209 edit */ /* LGECI-261 20201209 edit */
!(function (i) {
  "use strict";
  "function" == typeof define && define.amd
    ? define(["jquery"], i)
    : "undefined" != typeof exports
    ? (module.exports = i(require("jquery")))
    : i(jQuery);
})(function (i) {
  "use strict";
  var e = window.Slick || {};
  ((e = (function () {
    var e = 0;
    return function (t, o) {
      var s,
        n = this;
      (n.defaults = {
        accessibility: !0,
        adaptiveHeight: !1,
        appendArrows: i(t),
        appendDots: i(t),
        arrows: !0,
        asNavFor: null,
        prevArrow:
          '<button class="slick-prev" aria-label="Previous" type="button"><span class="visually-hidden">Previous</span></button>',
        nextArrow:
          '<button class="slick-next" aria-label="Next" type="button"><span class="visually-hidden">Next</span></button>',
        autoplay: !1,
        autoplaySpeed: 3e3,
        centerMode: !1,
        centerPadding: "50px",
        cssEase: "ease",
        customPaging: function (e, t) {
          return i('<button type="button" />').text(t + 1);
        },
        dots: !1,
        dotsClass: "slick-dots",
        draggable: !0,
        easing: "linear",
        edgeFriction: 0.35,
        fade: !1,
        focusOnSelect: !1,
        focusOnChange: !1,
        infinite: !0,
        initialSlide: 0,
        lazyLoad: "ondemand",
        mobileFirst: !1,
        pauseOnHover: !0,
        pauseOnFocus: !0,
        pauseOnDotsHover: !1,
        respondTo: "window",
        responsive: null,
        rows: 0,
        rtl: $("html").attr("dir") == "rtl" ? !0 : !1, //LGEITF-228 : 20201224 modify
        listStyle: !1, // WA-Common-Slick
        slide: "",
        slidesPerRow: 1,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        swipe: !0,
        swipeToSlide: !1,
        touchMove: !0,
        touchThreshold: 5,
        useCSS: !0,
        useTransform: !0,
        variableWidth: !1,
        vertical: !1,
        verticalSwiping: !1,
        waitForAnimate: !0,
        zIndex: 1e3,
      }),
        (n.initials = {
          animating: !1,
          dragging: !1,
          autoPlayTimer: null,
          currentDirection: 0,
          currentLeft: null,
          currentSlide: 0,
          direction: 1,
          $dots: null,
          listWidth: null,
          listHeight: null,
          loadIndex: 0,
          $nextArrow: null,
          $prevArrow: null,
          scrolling: !1,
          slideCount: null,
          slideWidth: null,
          $slideTrack: null,
          $slides: null,
          sliding: !1,
          slideOffset: 0,
          swipeLeft: null,
          swiping: !1,
          $list: null,
          touchObject: {},
          transformsEnabled: !1,
          unslicked: !1,
        }),
        i.extend(n, n.initials),
        (n.activeBreakpoint = null),
        (n.animType = null),
        (n.animProp = null),
        (n.breakpoints = []),
        (n.breakpointSettings = []),
        (n.cssTransitions = !1),
        (n.focussed = !1),
        (n.interrupted = !1),
        (n.hidden = "hidden"),
        (n.paused = !0),
        (n.positionProp = null),
        (n.respondTo = null),
        (n.rowCount = 1),
        (n.shouldClick = !0),
        (n.$slider = i(t)),
        (n.$slidesCache = null),
        (n.transformType = null),
        (n.transitionType = null),
        (n.visibilityChange = "visibilitychange"),
        (n.windowWidth = 0),
        (n.windowTimer = null),
        (s = i(t).data("slick") || {}),
        (n.options = i.extend({}, n.defaults, o, s)),
        (n.currentSlide = n.options.initialSlide),
        (n.originalSettings = n.options),
        void 0 !== document.mozHidden
          ? ((n.hidden = "mozHidden"),
            (n.visibilityChange = "mozvisibilitychange"))
          : void 0 !== document.webkitHidden &&
            ((n.hidden = "webkitHidden"),
            (n.visibilityChange = "webkitvisibilitychange")),
        (n.autoPlay = i.proxy(n.autoPlay, n)),
        (n.autoPlayClear = i.proxy(n.autoPlayClear, n)),
        (n.autoPlayIterator = i.proxy(n.autoPlayIterator, n)),
        (n.changeSlide = i.proxy(n.changeSlide, n)),
        (n.clickHandler = i.proxy(n.clickHandler, n)),
        (n.selectHandler = i.proxy(n.selectHandler, n)),
        (n.setPosition = i.proxy(n.setPosition, n)),
        (n.swipeHandler = i.proxy(n.swipeHandler, n)),
        (n.dragHandler = i.proxy(n.dragHandler, n)),
        (n.keyHandler = i.proxy(n.keyHandler, n)),
        (n.instanceUid = e++),
        (n.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/),
        n.registerBreakpoints(),
        n.init(!0);
    };
  })()).prototype.activateADA = function () {
    this.$slideTrack
      .find(".slick-active")
      .attr({
        "aria-hidden": "false",
      })
      .find("a:not(.required-tabindex, .no-link), input, button, select")
      .attr({
        // WA-Common-Slick , LGETW-651 .no-link add
        tabindex: "0",
      });
  }),
    (e.prototype.addSlide = e.prototype.slickAdd =
      function (e, t, o) {
        var s = this;
        if ("boolean" == typeof t) (o = t), (t = null);
        else if (t < 0 || t >= s.slideCount) return !1;
        s.unload(),
          "number" == typeof t
            ? 0 === t && 0 === s.$slides.length
              ? i(e).appendTo(s.$slideTrack)
              : o
              ? i(e).insertBefore(s.$slides.eq(t))
              : i(e).insertAfter(s.$slides.eq(t))
            : !0 === o
            ? i(e).prependTo(s.$slideTrack)
            : i(e).appendTo(s.$slideTrack),
          (s.$slides = s.$slideTrack.children(this.options.slide)),
          s.$slideTrack.children(this.options.slide).detach(),
          s.$slideTrack.append(s.$slides),
          s.$slides.each(function (e, t) {
            i(t).attr("data-slick-index", e);
          }),
          (s.$slidesCache = s.$slides),
          s.reinit();
      }),
    (e.prototype.animateHeight = function () {
      var i = this;
      if (
        1 === i.options.slidesToShow &&
        !0 === i.options.adaptiveHeight &&
        !1 === i.options.vertical
      ) {
        var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
        i.$list.animate(
          {
            height: e,
          },
          i.options.speed
        );
      }
    }),
    (e.prototype.animateSlide = function (e, t) {
      var o = {},
        s = this;
      s.animateHeight(),
        !0 === s.options.rtl && !1 === s.options.vertical && (e = -e),
        !1 === s.transformsEnabled
          ? !1 === s.options.vertical
            ? s.$slideTrack.animate(
                {
                  left: e,
                },
                s.options.speed,
                s.options.easing,
                t
              )
            : s.$slideTrack.animate(
                {
                  top: e,
                },
                s.options.speed,
                s.options.easing,
                t
              )
          : !1 === s.cssTransitions
          ? (!0 === s.options.rtl && (s.currentLeft = -s.currentLeft),
            i({
              animStart: s.currentLeft,
            }).animate(
              {
                animStart: e,
              },
              {
                duration: s.options.speed,
                easing: s.options.easing,
                step: function (i) {
                  (i = Math.ceil(i)),
                    !1 === s.options.vertical
                      ? ((o[s.animType] = "translate(" + i + "px, 0px)"),
                        s.$slideTrack.css(o))
                      : ((o[s.animType] = "translate(0px," + i + "px)"),
                        s.$slideTrack.css(o));
                },
                complete: function () {
                  t && t.call();
                },
              }
            ))
          : (s.applyTransition(),
            (e = Math.ceil(e)),
            !1 === s.options.vertical
              ? (o[s.animType] = "translate3d(" + e + "px, 0px, 0px)")
              : (o[s.animType] = "translate3d(0px," + e + "px, 0px)"),
            s.$slideTrack.css(o),
            t &&
              setTimeout(function () {
                s.disableTransition(), t.call();
              }, s.options.speed));
    }),
    (e.prototype.getNavTarget = function () {
      var e = this,
        t = e.options.asNavFor;
      return t && null !== t && (t = i(t).not(e.$slider)), t;
    }),
    (e.prototype.asNavFor = function (e) {
      var t = this.getNavTarget();
      null !== t &&
        "object" == typeof t &&
        t.each(function () {
          var t = i(this).slick("getSlick");
          t.unslicked || t.slideHandler(e, !0);
        });
    }),
    (e.prototype.applyTransition = function (i) {
      var e = this,
        t = {};
      !1 === e.options.fade
        ? (t[e.transitionType] =
            e.transformType + " " + e.options.speed + "ms " + e.options.cssEase)
        : (t[e.transitionType] =
            "opacity " + e.options.speed + "ms " + e.options.cssEase),
        !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t);
    }),
    (e.prototype.autoPlay = function () {
      var i = this;
      i.autoPlayClear(),
        i.slideCount > i.options.slidesToShow &&
          (i.autoPlayTimer = setInterval(
            i.autoPlayIterator,
            i.options.autoplaySpeed
          ));
    }),
    (e.prototype.autoPlayClear = function () {
      var i = this;
      i.autoPlayTimer && clearInterval(i.autoPlayTimer);
    }),
    (e.prototype.autoPlayIterator = function () {
      var i = this,
        e = i.currentSlide + i.options.slidesToScroll;
      i.paused ||
        i.interrupted ||
        i.focussed ||
        (!1 === i.options.infinite &&
          (1 === i.direction && i.currentSlide + 1 === i.slideCount - 1
            ? (i.direction = 0)
            : 0 === i.direction &&
              ((e = i.currentSlide - i.options.slidesToScroll),
              i.currentSlide - 1 == 0 && (i.direction = 1))),
        i.slideHandler(e));
    }),
    (e.prototype.buildArrows = function () {
      var e = this;
      !0 === e.options.arrows &&
        ((e.$prevArrow = i(e.options.prevArrow).addClass("slick-arrow")),
        (e.$nextArrow = i(e.options.nextArrow).addClass("slick-arrow")),
        e.slideCount > e.options.slidesToShow
          ? (e.$prevArrow
              .removeClass("slick-hidden")
              .removeAttr("aria-hidden tabindex"),
            e.$nextArrow
              .removeClass("slick-hidden")
              .removeAttr("aria-hidden tabindex"),
            e.htmlExpr.test(e.options.prevArrow) &&
              e.$prevArrow.prependTo(e.options.appendArrows),
            e.htmlExpr.test(e.options.nextArrow) &&
              e.$nextArrow.appendTo(e.options.appendArrows),
            !0 !== e.options.infinite &&
              e.$prevArrow
                .addClass("slick-disabled")
                .attr("aria-disabled", "true")
                .attr("disabled", "true"))
          : e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({
              "aria-disabled": "true",
              disabled: "true",
              tabindex: "-1", //- WA-Common-Slick
            }));
    }),
    (e.prototype.buildDots = function () {
      var e,
        t,
        o = this;
      if (!0 === o.options.dots) {
        for (
          o.$slider.addClass("slick-dotted"),
            t = i("<ul />").addClass(o.options.dotsClass),
            e = 0;
          e <= o.getDotCount();
          e += 1
        )
          t.append(i("<li />").append(o.options.customPaging.call(this, o, e)));
        (o.$dots = t.appendTo(o.options.appendDots)),
          o.$dots.find("li").first().addClass("slick-active");
      }
    }),
    (e.prototype.buildOut = function () {
      var e = this;
      /* WA-Common-Slick : 아래 코드에서 e.options.listStyle가 true이면, <div class="slick-track"/> 를 <ul class="slick-track"/> 로 변경 */
      var html = e.options.listStyle
        ? '<ul class="slick-track"/>'
        : '<div class="slick-track"/>';
      //var html2 = (e.$slider.get(0).tagName=='UL') ? '<li class="slick-list"/>' : '<div class="slick-list"/>';
      (e.$slides = e.$slider
        .children(e.options.slide + ":not(.slick-cloned)")
        .addClass("slick-slide")),
        (e.slideCount = e.$slides.length),
        e.$slides.each(function (e, t) {
          i(t)
            .attr("data-slick-index", e)
            .data("originalStyling", i(t).attr("style") || "");
        }),
        e.$slider.addClass("slick-slider"),
        (e.$slideTrack =
          0 === e.slideCount
            ? i(html).appendTo(e.$slider)
            : e.$slides.wrapAll(html).parent()),
        (e.$list = e.$slideTrack.wrap('<div class="slick-list"/>').parent()),
        e.$slideTrack.css("opacity", 0),
        (!0 !== e.options.centerMode && !0 !== e.options.swipeToSlide) ||
          (e.options.slidesToScroll = 1),
        i("img[data-lazy]", e.$slider).not("[src]").addClass("slick-loading"),
        e.setupInfinite(),
        e.buildArrows(),
        e.buildDots(),
        e.updateDots(),
        e.setSlideClasses(
          "number" == typeof e.currentSlide ? e.currentSlide : 0
        ),
        !0 === e.options.draggable && e.$list.addClass("draggable");
      /* WA-Common-Slick : 위 코드에서 e.options.listStyle가 true이면, <div class="slick-track"/> 를 <ul class="slick-track"/> 로 변경 */
    }),
    (e.prototype.buildRows = function () {
      var i,
        e,
        t,
        o,
        s,
        n,
        r,
        l = this;
      if (
        ((o = document.createDocumentFragment()),
        (n = l.$slider.children()),
        l.options.rows > 0)
      ) {
        for (
          r = l.options.slidesPerRow * l.options.rows,
            s = Math.ceil(n.length / r),
            i = 0;
          i < s;
          i++
        ) {
          var d = document.createElement("div");
          for (e = 0; e < l.options.rows; e++) {
            var a = document.createElement("div");
            for (t = 0; t < l.options.slidesPerRow; t++) {
              var c = i * r + (e * l.options.slidesPerRow + t);
              n.get(c) && a.appendChild(n.get(c));
            }
            d.appendChild(a);
          }
          o.appendChild(d);
        }
        l.$slider.empty().append(o),
          l.$slider
            .children()
            .children()
            .children()
            .css({
              width: 100 / l.options.slidesPerRow + "%",
              display: "inline-block",
            });
      }
    }),
    (e.prototype.checkResponsive = function (e, t) {
      var o,
        s,
        n,
        r = this,
        l = !1,
        d = r.$slider.width(),
        a = window.innerWidth || i(window).width();
      if (
        ("window" === r.respondTo
          ? (n = a)
          : "slider" === r.respondTo
          ? (n = d)
          : "min" === r.respondTo && (n = Math.min(a, d)),
        r.options.responsive &&
          r.options.responsive.length &&
          null !== r.options.responsive)
      ) {
        s = null;
        for (o in r.breakpoints)
          r.breakpoints.hasOwnProperty(o) &&
            (!1 === r.originalSettings.mobileFirst
              ? n < r.breakpoints[o] && (s = r.breakpoints[o])
              : n > r.breakpoints[o] && (s = r.breakpoints[o]));
        null !== s
          ? null !== r.activeBreakpoint
            ? (s !== r.activeBreakpoint || t) &&
              ((r.activeBreakpoint = s),
              "unslick" === r.breakpointSettings[s]
                ? r.unslick(s)
                : ((r.options = i.extend(
                    {},
                    r.originalSettings,
                    r.breakpointSettings[s]
                  )),
                  !0 === e && (r.currentSlide = r.options.initialSlide),
                  r.refresh(e)),
              (l = s))
            : ((r.activeBreakpoint = s),
              "unslick" === r.breakpointSettings[s]
                ? r.unslick(s)
                : ((r.options = i.extend(
                    {},
                    r.originalSettings,
                    r.breakpointSettings[s]
                  )),
                  !0 === e && (r.currentSlide = r.options.initialSlide),
                  r.refresh(e)),
              (l = s))
          : null !== r.activeBreakpoint &&
            ((r.activeBreakpoint = null),
            (r.options = r.originalSettings),
            !0 === e && (r.currentSlide = r.options.initialSlide),
            r.refresh(e),
            (l = s)),
          e || !1 === l || r.$slider.trigger("breakpoint", [r, l]);
      }
    }),
    (e.prototype.changeSlide = function (e, t) {
      var o,
        s,
        n,
        r = this,
        l = i(e.currentTarget);
      switch (
        (l.is("a") && e.preventDefault(),
        l.is("li") || (l = l.closest("li")),
        (n = r.slideCount % r.options.slidesToScroll != 0),
        (o = n
          ? 0
          : (r.slideCount - r.currentSlide) % r.options.slidesToScroll),
        e.data.message)
      ) {
        case "previous":
          (s = 0 === o ? r.options.slidesToScroll : r.options.slidesToShow - o),
            r.slideCount > r.options.slidesToShow &&
              r.slideHandler(r.currentSlide - s, !1, t);
          break;
        case "next":
          (s = 0 === o ? r.options.slidesToScroll : o),
            r.slideCount > r.options.slidesToShow &&
              r.slideHandler(r.currentSlide + s, !1, t);
          break;
        case "index":
          var d =
            0 === e.data.index
              ? 0
              : e.data.index || l.index() * r.options.slidesToScroll;
          r.slideHandler(r.checkNavigable(d), !1, t),
            l.children().trigger("focus");
          break;
        default:
          return;
      }
    }),
    (e.prototype.checkNavigable = function (i) {
      var e, t;
      if (((e = this.getNavigableIndexes()), (t = 0), i > e[e.length - 1]))
        i = e[e.length - 1];
      else
        for (var o in e) {
          if (i < e[o]) {
            i = t;
            break;
          }
          t = e[o];
        }
      return i;
    }),
    (e.prototype.cleanUpEvents = function () {
      var e = this;
      e.options.dots &&
        null !== e.$dots &&
        (i("li", e.$dots)
          .off("click.slick", e.changeSlide)
          .off("mouseenter.slick", i.proxy(e.interrupt, e, !0))
          .off("mouseleave.slick", i.proxy(e.interrupt, e, !1)),
        !0 === e.options.accessibility &&
          e.$dots.off("keydown.slick", e.keyHandler)),
        e.$slider.off("focus.slick blur.slick"),
        !0 === e.options.arrows &&
          e.slideCount > e.options.slidesToShow &&
          (e.$prevArrow && e.$prevArrow.off("click.slick", e.changeSlide),
          e.$nextArrow && e.$nextArrow.off("click.slick", e.changeSlide),
          !0 === e.options.accessibility &&
            (e.$prevArrow && e.$prevArrow.off("keydown.slick", e.keyHandler),
            e.$nextArrow && e.$nextArrow.off("keydown.slick", e.keyHandler))),
        e.$list.off("touchstart.slick mousedown.slick", e.swipeHandler),
        e.$list.off("touchmove.slick mousemove.slick", e.swipeHandler),
        e.$list.off("touchend.slick mouseup.slick", e.swipeHandler),
        e.$list.off("touchcancel.slick mouseleave.slick", e.swipeHandler),
        e.$list.off("click.slick", e.clickHandler),
        i(document).off(e.visibilityChange, e.visibility),
        e.cleanUpSlideEvents(),
        !0 === e.options.accessibility &&
          e.$list.off("keydown.slick", e.keyHandler),
        !0 === e.options.focusOnSelect &&
          i(e.$slideTrack).children().off("click.slick", e.selectHandler),
        i(window).off(
          "orientationchange.slick.slick-" + e.instanceUid,
          e.orientationChange
        ),
        i(window).off("resize.slick.slick-" + e.instanceUid, e.resize),
        i("[draggable!=true]", e.$slideTrack).off(
          "dragstart",
          e.preventDefault
        ),
        i(window).off("load.slick.slick-" + e.instanceUid, e.setPosition);
    }),
    (e.prototype.cleanUpSlideEvents = function () {
      var e = this;
      e.$list.off("mouseenter.slick", i.proxy(e.interrupt, e, !0)),
        e.$list.off("mouseleave.slick", i.proxy(e.interrupt, e, !1));
    }),
    (e.prototype.cleanUpRows = function () {
      var i,
        e = this;
      e.options.rows > 0 &&
        ((i = e.$slides.children().children()).removeAttr("style"),
        e.$slider.empty().append(i));
    }),
    (e.prototype.clickHandler = function (i) {
      !1 === this.shouldClick &&
        (i.stopImmediatePropagation(), i.stopPropagation(), i.preventDefault());
    }),
    (e.prototype.destroy = function (e) {
      var t = this;
      // WA-Common-Slick 아래 내용 수정
      t.autoPlayClear(),
        (t.touchObject = {}),
        t.cleanUpEvents(),
        i(".slick-cloned", t.$slider).detach(),
        t.$dots && t.$dots.remove(),
        t.$prevArrow &&
          t.$prevArrow.length &&
          (t.$prevArrow
            .removeClass("slick-disabled slick-arrow slick-hidden")
            .removeAttr("aria-hidden aria-disabled tabindex disabled")
            .css("display", ""),
          t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove()),
        t.$nextArrow &&
          t.$nextArrow.length &&
          (t.$nextArrow
            .removeClass("slick-disabled slick-arrow slick-hidden")
            .removeAttr("aria-hidden aria-disabled tabindex disabled")
            .css("display", ""),
          t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove()),
        t.$slides &&
          (t.$slides
            .removeClass(
              "slick-slide slick-active slick-center slick-visible slick-current"
            )
            .removeAttr("aria-hidden")
            .removeAttr("data-slick-index")
            .each(function () {
              i(this).attr("style", i(this).data("originalStyling"));
            }),
          t.$slideTrack.children(this.options.slide).detach(),
          t.$slideTrack.detach(),
          t.$list.detach(),
          t.$slider.append(t.$slides)),
        t.cleanUpRows(),
        t.$slider.removeClass("slick-slider"),
        t.$slider.removeClass("slick-initialized"),
        t.$slider.removeClass("slick-dotted");
      if (t.options.listStyle && t.$slider.data("origin-tagname") != "UL") {
        t.$slider.find(">li").each(function () {
          // class에 undefined  들어가는 경우 제거
          var className = $(this).attr("class");
          if (!!className)
            $(this).replaceWith(
              '<div class="' + className + '">' + $(this).html() + "</div>"
            );
          else $(this).replaceWith("<div>" + $(this).html() + "</div>");
        });
      }
      if (t.$slider.data("origin-tagname") == "UL") {
        var html = t.$slider.html();
        //console.log(html);
        t.$slider.html("<ul></ul>").find("ul").html(html);
      }
      (t.unslicked = !0), e || t.$slider.trigger("destroy", [t]);
    }),
    (e.prototype.disableTransition = function (i) {
      var e = this,
        t = {};
      (t[e.transitionType] = ""),
        !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t);
    }),
    (e.prototype.fadeSlide = function (i, e) {
      var t = this;
      !1 === t.cssTransitions
        ? (t.$slides.eq(i).css({
            zIndex: t.options.zIndex,
          }),
          t.$slides.eq(i).animate(
            {
              opacity: 1,
            },
            t.options.speed,
            t.options.easing,
            e
          ))
        : (t.applyTransition(i),
          t.$slides.eq(i).css({
            opacity: 1,
            zIndex: t.options.zIndex,
          }),
          e &&
            setTimeout(function () {
              t.disableTransition(i), e.call();
            }, t.options.speed));
    }),
    (e.prototype.fadeSlideOut = function (i) {
      var e = this;
      !1 === e.cssTransitions
        ? e.$slides.eq(i).animate(
            {
              opacity: 0,
              zIndex: e.options.zIndex - 2,
            },
            e.options.speed,
            e.options.easing
          )
        : (e.applyTransition(i),
          e.$slides.eq(i).css({
            opacity: 0,
            zIndex: e.options.zIndex - 2,
          }));
    }),
    (e.prototype.filterSlides = e.prototype.slickFilter =
      function (i) {
        var e = this;
        null !== i &&
          ((e.$slidesCache = e.$slides),
          e.unload(),
          e.$slideTrack.children(this.options.slide).detach(),
          e.$slidesCache.filter(i).appendTo(e.$slideTrack),
          e.reinit());
      }),
    (e.prototype.focusHandler = function () {
      var e = this;
      e.$slider
        .off("focus.slick blur.slick")
        .on("focus.slick blur.slick", "*", function (t) {
          t.stopImmediatePropagation();
          var o = i(this);
          setTimeout(function () {
            e.options.pauseOnFocus &&
              ((e.focussed = o.is(":focus")), e.autoPlay());
          }, 0);
        });
    }),
    (e.prototype.getCurrent = e.prototype.slickCurrentSlide =
      function () {
        return this.currentSlide;
      }),
    (e.prototype.getDotCount = function () {
      var i = this,
        e = 0,
        t = 0,
        o = 0;
      if (!0 === i.options.infinite)
        if (i.slideCount <= i.options.slidesToShow) ++o;
        else
          for (; e < i.slideCount; )
            ++o,
              (e = t + i.options.slidesToScroll),
              (t +=
                i.options.slidesToScroll <= i.options.slidesToShow
                  ? i.options.slidesToScroll
                  : i.options.slidesToShow);
      else if (!0 === i.options.centerMode) o = i.slideCount;
      else if (i.options.asNavFor)
        for (; e < i.slideCount; )
          ++o,
            (e = t + i.options.slidesToScroll),
            (t +=
              i.options.slidesToScroll <= i.options.slidesToShow
                ? i.options.slidesToScroll
                : i.options.slidesToShow);
      else
        o =
          1 +
          Math.ceil(
            (i.slideCount - i.options.slidesToShow) / i.options.slidesToScroll
          );
      return o - 1;
    }),
    (e.prototype.getLeft = function (i) {
      var e,
        t,
        o,
        s,
        n = this,
        r = 0;
      return (
        (n.slideOffset = 0),
        (t = n.$slides.first().outerHeight(!0)),
        !0 === n.options.infinite
          ? (n.slideCount > n.options.slidesToShow &&
              ((n.slideOffset = n.slideWidth * n.options.slidesToShow * -1),
              (s = -1),
              !0 === n.options.vertical &&
                !0 === n.options.centerMode &&
                (2 === n.options.slidesToShow
                  ? (s = -1.5)
                  : 1 === n.options.slidesToShow && (s = -2)),
              (r = t * n.options.slidesToShow * s)),
            n.slideCount % n.options.slidesToScroll != 0 &&
              i + n.options.slidesToScroll > n.slideCount &&
              n.slideCount > n.options.slidesToShow &&
              (i > n.slideCount
                ? ((n.slideOffset =
                    (n.options.slidesToShow - (i - n.slideCount)) *
                    n.slideWidth *
                    -1),
                  (r = (n.options.slidesToShow - (i - n.slideCount)) * t * -1))
                : ((n.slideOffset =
                    (n.slideCount % n.options.slidesToScroll) *
                    n.slideWidth *
                    -1),
                  (r = (n.slideCount % n.options.slidesToScroll) * t * -1))))
          : i + n.options.slidesToShow > n.slideCount &&
            ((n.slideOffset =
              (i + n.options.slidesToShow - n.slideCount) * n.slideWidth),
            (r = (i + n.options.slidesToShow - n.slideCount) * t)),
        n.slideCount <= n.options.slidesToShow &&
          ((n.slideOffset = 0), (r = 0)),
        !0 === n.options.centerMode && n.slideCount <= n.options.slidesToShow
          ? (n.slideOffset =
              (n.slideWidth * Math.floor(n.options.slidesToShow)) / 2 -
              (n.slideWidth * n.slideCount) / 2)
          : !0 === n.options.centerMode && !0 === n.options.infinite
          ? (n.slideOffset +=
              n.slideWidth * Math.floor(n.options.slidesToShow / 2) -
              n.slideWidth)
          : !0 === n.options.centerMode &&
            ((n.slideOffset = 0),
            (n.slideOffset +=
              n.slideWidth * Math.floor(n.options.slidesToShow / 2))),
        (e =
          !1 === n.options.vertical
            ? i * n.slideWidth * -1 + n.slideOffset
            : i * t * -1 + r),
        !0 === n.options.variableWidth &&
          ((o =
            n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite
              ? n.$slideTrack.children(".slick-slide").eq(i)
              : n.$slideTrack
                  .children(".slick-slide")
                  .eq(i + n.options.slidesToShow)),
          (e =
            !0 === n.options.rtl
              ? o[0]
                ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width())
                : 0
              : o[0]
              ? -1 * o[0].offsetLeft
              : 0),
          !0 === n.options.centerMode &&
            ((o =
              n.slideCount <= n.options.slidesToShow ||
              !1 === n.options.infinite
                ? n.$slideTrack.children(".slick-slide").eq(i)
                : n.$slideTrack
                    .children(".slick-slide")
                    .eq(i + n.options.slidesToShow + 1)),
            (e =
              !0 === n.options.rtl
                ? o[0]
                  ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width())
                  : 0
                : o[0]
                ? -1 * o[0].offsetLeft
                : 0),
            (e += (n.$list.width() - o.outerWidth()) / 2))),
        e
      );
    }),
    (e.prototype.getOption = e.prototype.slickGetOption =
      function (i) {
        return this.options[i];
      }),
    (e.prototype.getNavigableIndexes = function () {
      var i,
        e = this,
        t = 0,
        o = 0,
        s = [];
      for (
        !1 === e.options.infinite
          ? (i = e.slideCount)
          : ((t = -1 * e.options.slidesToScroll),
            (o = -1 * e.options.slidesToScroll),
            (i = 2 * e.slideCount));
        t < i;

      )
        s.push(t),
          (t = o + e.options.slidesToScroll),
          (o +=
            e.options.slidesToScroll <= e.options.slidesToShow
              ? e.options.slidesToScroll
              : e.options.slidesToShow);
      return s;
    }),
    (e.prototype.getSlick = function () {
      return this;
    }),
    (e.prototype.getSlideCount = function () {
      var e,
        t,
        o = this;
      return (
        (t =
          !0 === o.options.centerMode
            ? o.slideWidth * Math.floor(o.options.slidesToShow / 2)
            : 0),
        !0 === o.options.swipeToSlide
          ? (o.$slideTrack.find(".slick-slide").each(function (s, n) {
              if (n.offsetLeft - t + i(n).outerWidth() / 2 > -1 * o.swipeLeft)
                return (e = n), !1;
            }),
            Math.abs(i(e).attr("data-slick-index") - o.currentSlide) || 1)
          : o.options.slidesToScroll
      );
    }),
    (e.prototype.goTo = e.prototype.slickGoTo =
      function (i, e) {
        this.changeSlide(
          {
            data: {
              message: "index",
              index: parseInt(i),
            },
          },
          e
        );
      }),
    (e.prototype.init = function (e) {
      var t = this;
      /* WA-Common-Slick : 아래 내용 추가 */
      if (t.$slider.find(">ul").length > 0) {
        t.$slider.html(t.$slider.find(">ul").html());
        t.$slider.data("origin-tagname", "UL");
      } else {
        t.$slider.data("origin-tagname", "");
      }
      if (t.options.listStyle) {
        //  && t.$slider.find('.slick-track').length>0 && t.$slider.find('.slick-track').get(0).tagName=='UL'
        t.$slider.find("> div, >li").each(function () {
          // class에 undefined  들어가는 경우 제거
          var className = $(this).attr("class");
          if (!!className)
            $(this).replaceWith(
              '<li class="' + className + '">' + $(this).html() + "</li>"
            );
          else $(this).replaceWith("<li>" + $(this).html() + "</li>");
        });
      }
      /* WA-Common-Slick : 위 내용 추가 */
      i(t.$slider).hasClass("slick-initialized") ||
        (i(t.$slider).addClass("slick-initialized"),
        t.buildRows(),
        t.buildOut(),
        t.setProps(),
        t.startLoad(),
        t.loadSlider(),
        t.initializeEvents(),
        t.updateArrows(),
        t.updateDots(),
        t.checkResponsive(!0),
        t.focusHandler()),
        e && t.$slider.trigger("init", [t]),
        !0 === t.options.accessibility && t.initADA(),
        t.options.autoplay && ((t.paused = !1), t.autoPlay());
      /* WA-C0003-11 : 키보드 접근성 테스트
		i(t.$slider).find('a, button').on({
			focus: function(e){
				if($(t.$slider).is('.initialized-tabindex')) return false;
				$(t.$slider).find('.slick-slide[aria-hidden="true"] a').attr('tabindex', -1);
				$(t.$slider).addClass('initialized-tabindex');
			}
		});
		*/
      /* WA-Common-Slick : 현재 슬라이드가 아닌 경우, 포커스 되면 현재 슬라이드로 돌아오도록 수정 */
      i(t.$slider)
        .find(".slick-track")
        .find("a, button")
        .on({
          "focus.current": function (e) {
            if (!$(this).closest(".slick-slide").hasClass("slick-active")) {
              $(this).closest(".slick-list").scrollLeft(0);
              var currentPage = parseInt(
                $(this).closest(".slick-slide").attr("data-slick-index")
              );
              var oldPage = parseInt(
                i(t.$slider)
                  .find(".slick-active")
                  .eq(0)
                  .attr("data-slick-index")
              );

              //console.log(currentPage, oldPage);
              if (t.options.arrows) {
                if (currentPage == oldPage) {
                  return false;
                } else if (currentPage > oldPage) {
                  //console.log('next');
                  t.$nextArrow.trigger("click");
                } else {
                  //console.log('prev');
                  t.$prevArrow.trigger("click");
                }
              } else {
                i(t.$slider).slick("slickGoTo", currentPage);
              }
              /*
					if(currentPage == oldPage) {
						return false;
					} else if(currentPage > oldPage) {
						t.changeSlide({
							data: {
								message: "next"
							}
						});
					} else {
						t.changeSlide({
							data: {
								message: "previous"
							}
						});
					}
					*/
            }
          },
        });
    }),
    (e.prototype.initADA = function () {
      var e = this,
        t = Math.ceil(e.slideCount / e.options.slidesToShow),
        o = e.getNavigableIndexes().filter(function (i) {
          return i >= 0 && i < e.slideCount;
        });
      // WA-Common-Slick
      /*
		e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({
			//"aria-hidden": "true"//, // WA-Common-Slick
			//tabindex: "-1"  // WA-Common-Slick
		}).find("a, input, button, select").attr({
			tabindex: "-1"
		}), */
      null !== e.$dots &&
        (e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function (t) {
          var s = o.indexOf(t);
          i(this).attr({
            id: "slick-slide" + e.instanceUid + t, //, - WA-Common-Slick
            tabindex: "-1", // WA-Common-Slick   	//test_200526
          }),
            i(this).find("a:not(.required-tabindex), button").attr({
              tabindex: "-1", // WA-Common-Slick   	//test_200526
            }),
            -1 !== s &&
              i(this).attr({
                //"aria-describedby": "slick-slide-control" + e.instanceUid + s
                id: "slick-slide-control" + e.instanceUid + s,
              });
        }),
        e.$dots
          .attr("role", "tablist")
          .find("li")
          .each(function (s) {
            var n = o[s];
            var totalCnt = e.$dots.attr("role", "tablist").find("li").length;
            var dotsText = s + 1 + " of " + totalCnt;
            if (e.$slider.data("wa-msg") != undefined) {
              dotsText = e.$slider
                .data("wa-msg")
                .replace("#1", s + 1 + " of " + totalCnt);
            }
            i(this).attr({
              role: "presentation",
            }),
              i(this)
                .find("button")
                .attr({
                  tabindex: "-1",
                })
                .text(dotsText),
              i(this)
                .find("button")
                .first()
                .attr({
                  //role: "tab", // remove - theJ
                  //id: "slick-slide-control" + e.instanceUid + s,
                  "aria-describedby": "slick-slide-control" + e.instanceUid + s,
                  role: "tab",
                  "aria-controls": "slick-slide-control" + e.instanceUid + s,
                  //"aria-label": (s + 1 +' of '+ totalCnt),
                  "aria-selected": null, //,
                  //tabindex: "-1"
                })
                .text(dotsText);
            //}).eq(e.currentSlide).find("button").attr({
          })
          .eq(e.currentSlide)
          .find("a, button")
          .attr({
            "aria-selected": "true", //, - WA-Common-Slick
            tabindex: "0", // WA-Common-Slick
          })
          .end());
      if (!e.$slider.hasClass("notices-list")) {
        for (var s = e.currentSlide, n = s + e.options.slidesToShow; s < n; s++)
          e.$slides.eq(s).attr("tabindex", 0);
      }
      e.activateADA();
    }),
    (e.prototype.initArrowEvents = function () {
      var i = this;
      !0 === i.options.arrows &&
        i.slideCount > i.options.slidesToShow &&
        (i.$prevArrow.off("click.slick").on(
          "click.slick",
          {
            message: "previous",
          },
          i.changeSlide
        ),
        i.$nextArrow.off("click.slick").on(
          "click.slick",
          {
            message: "next",
          },
          i.changeSlide
        ),
        !0 === i.options.accessibility &&
          (i.$prevArrow.on("keydown.slick", i.keyHandler),
          i.$nextArrow.on("keydown.slick", i.keyHandler)));
    }),
    (e.prototype.initDotEvents = function () {
      var e = this;
      !0 === e.options.dots &&
        (i("li", e.$dots).on(
          "click.slick",
          {
            message: "index",
          },
          e.changeSlide
        ),
        !0 === e.options.accessibility &&
          e.$dots.on("keydown.slick", e.keyHandler)),
        !0 === e.options.dots &&
          !0 === e.options.pauseOnDotsHover &&
          i("li", e.$dots)
            .on("mouseenter.slick", i.proxy(e.interrupt, e, !0))
            .on("mouseleave.slick", i.proxy(e.interrupt, e, !1));
    }),
    (e.prototype.initSlideEvents = function () {
      var e = this;
      e.options.pauseOnHover &&
        (e.$list.on("mouseenter.slick", i.proxy(e.interrupt, e, !0)),
        e.$list.on("mouseleave.slick", i.proxy(e.interrupt, e, !1)));
    }),
    (e.prototype.initializeEvents = function () {
      var e = this;
      e.initArrowEvents(),
        e.initDotEvents(),
        e.initSlideEvents(),
        e.$list.on(
          "touchstart.slick mousedown.slick",
          {
            action: "start",
          },
          e.swipeHandler
        ),
        e.$list.on(
          "touchmove.slick mousemove.slick",
          {
            action: "move",
          },
          e.swipeHandler
        ),
        e.$list.on(
          "touchend.slick mouseup.slick",
          {
            action: "end",
          },
          e.swipeHandler
        ),
        e.$list.on(
          "touchcancel.slick mouseleave.slick",
          {
            action: "end",
          },
          e.swipeHandler
        ),
        e.$list.on("click.slick", e.clickHandler),
        i(document).on(e.visibilityChange, i.proxy(e.visibility, e)),
        !0 === e.options.accessibility &&
          e.$list.on("keydown.slick", e.keyHandler),
        !0 === e.options.focusOnSelect &&
          i(e.$slideTrack).children().on("click.slick", e.selectHandler),
        i(window).on(
          "orientationchange.slick.slick-" + e.instanceUid,
          i.proxy(e.orientationChange, e)
        ),
        i(window).on(
          "resize.slick.slick-" + e.instanceUid,
          i.proxy(e.resize, e)
        ),
        i("[draggable!=true]", e.$slideTrack).on("dragstart", e.preventDefault),
        i(window).on("load.slick.slick-" + e.instanceUid, e.setPosition),
        i(e.setPosition);
    }),
    (e.prototype.initUI = function () {
      var i = this;
      !0 === i.options.arrows &&
        i.slideCount > i.options.slidesToShow &&
        (i.$prevArrow.show(), i.$nextArrow.show()),
        !0 === i.options.dots &&
          i.slideCount > i.options.slidesToShow &&
          i.$dots.show();
    }),
    (e.prototype.keyHandler = function (i) {
      var e = this;
      var $radioTab = $(".model-group, .color-list, .size-list");
      $radioTab.each(function () {
        $(this)
          .find("a")
          .on("keydown", function (e) {
            var keycode = e.keyCode;
            var keys = {
              left: 37,
              right: 39,
            };
            var direction = {
              37: -1,
              39: 1,
            };
            var keyProceed = false;
            var index = $(e.target)
              .parents('[role="radiogroup"]')
              .find('[role="radio"]')
              .index(this);
            if (keycode === keys.right) {
              e.stopPropagation();
              keyProceed = true;
            } else if (keycode === keys.left) {
              e.stopPropagation();
              keyProceed = true;
            }
            if (keyProceed) {
              targetTab(e);
            }
            function targetTab(e) {
              e.preventDefault();
              var keyProceed = e.keyCode;
              var target = e.target;
              var targetTab = $(target)
                .parents('[role="radiogroup"]')
                .find('[role="radio"]').length;
              var targetActive = $(target)
                .parents('[role="radiogroup"]')
                .find('[role="radio"]');
              if ($(target).parents('[role="radiogroup"]').length !== 0) {
                if (direction[keyProceed]) {
                  if (targetActive[index + direction[keyProceed]]) {
                    targetActive[index + direction[keyProceed]].focus();
                  } else if (keyProceed === keys.left) {
                    targetActive[0].focus();
                  } else if (keyProceed === keys.right) {
                    targetActive[targetTab - 1].focus();
                  }
                }
              } else {
                console.log("not Accessibility Guide");
                //접근성 키보드 관련해서 wai 구조상 값이 잘못되면 나타남 해당 console시 radiogroup 유형을 확인하세요
              }
            }
          });
      });

      i.target.tagName.match("TEXTAREA|INPUT|SELECT") ||
        (37 === i.keyCode && !0 === e.options.accessibility
          ? e.changeSlide({
              data: {
                message: !0 === e.options.rtl ? "next" : "previous",
              },
            })
          : 39 === i.keyCode &&
            !0 === e.options.accessibility &&
            e.changeSlide({
              data: {
                message: !0 === e.options.rtl ? "previous" : "next",
              },
            }));
    }),
    (e.prototype.lazyLoad = function () {
      function e(e) {
        i("img[data-lazy]", e).each(function () {
          var e = i(this),
            t = i(this).attr("data-lazy"),
            o = i(this).attr("data-srcset"),
            s = i(this).attr("data-sizes") || n.$slider.attr("data-sizes"),
            r = document.createElement("img");
          (r.onload = function () {
            e.animate(
              {
                opacity: 0,
              },
              100,
              function () {
                o && (e.attr("srcset", o), s && e.attr("sizes", s)),
                  e.attr("src", t).animate(
                    {
                      opacity: 1,
                    },
                    200,
                    function () {
                      e.removeAttr(
                        "data-lazy data-srcset data-sizes"
                      ).removeClass("slick-loading");
                    }
                  ),
                  n.$slider.trigger("lazyLoaded", [n, e, t]);
              }
            );
          }),
            (r.onerror = function () {
              //e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), n.$slider.trigger("lazyLoadError", [n, e, t])
              e
                .attr("data-src", e.attr("data-lazy"))
                .removeAttr("data-lazy")
                .addClass("lazyload")
                .removeClass("slick-loading")
                .addClass("slick-lazyload-error"),
                n.$slider.trigger("lazyLoadError", [n, e, t]);
            }),
            (r.src = t);
        });
      }
      var t,
        o,
        s,
        n = this;
      if (
        (!0 === n.options.centerMode
          ? !0 === n.options.infinite
            ? (s =
                (o = n.currentSlide + (n.options.slidesToShow / 2 + 1)) +
                n.options.slidesToShow +
                2)
            : ((o = Math.max(
                0,
                n.currentSlide - (n.options.slidesToShow / 2 + 1)
              )),
              (s = n.options.slidesToShow / 2 + 1 + 2 + n.currentSlide))
          : ((o = n.options.infinite
              ? n.options.slidesToShow + n.currentSlide
              : n.currentSlide),
            (s = Math.ceil(o + n.options.slidesToShow)),
            !0 === n.options.fade && (o > 0 && o--, s <= n.slideCount && s++)),
        (t = n.$slider.find(".slick-slide").slice(o, s)),
        "anticipated" === n.options.lazyLoad)
      )
        for (
          var r = o - 1, l = s, d = n.$slider.find(".slick-slide"), a = 0;
          a < n.options.slidesToScroll;
          a++
        )
          r < 0 && (r = n.slideCount - 1),
            (t = (t = t.add(d.eq(r))).add(d.eq(l))),
            r--,
            l++;
      e(t),
        n.slideCount <= n.options.slidesToShow
          ? e(n.$slider.find(".slick-slide"))
          : n.currentSlide >= n.slideCount - n.options.slidesToShow
          ? e(n.$slider.find(".slick-cloned").slice(0, n.options.slidesToShow))
          : 0 === n.currentSlide &&
            e(
              n.$slider.find(".slick-cloned").slice(-1 * n.options.slidesToShow)
            );
    }),
    (e.prototype.loadSlider = function () {
      var i = this;
      i.setPosition(),
        i.$slideTrack.css({
          opacity: 1,
        }),
        i.$slider.removeClass("slick-loading"),
        i.initUI(),
        "progressive" === i.options.lazyLoad && i.progressiveLazyLoad();
    }),
    (e.prototype.next = e.prototype.slickNext =
      function () {
        this.changeSlide({
          data: {
            message: "next",
          },
        });
      }),
    (e.prototype.orientationChange = function () {
      var i = this;
      i.checkResponsive(), i.setPosition();
    }),
    (e.prototype.pause = e.prototype.slickPause =
      function () {
        var i = this;
        i.autoPlayClear(), (i.paused = !0);
      }),
    (e.prototype.play = e.prototype.slickPlay =
      function () {
        var i = this;
        i.autoPlay(),
          (i.options.autoplay = !0),
          (i.paused = !1),
          (i.focussed = !1),
          (i.interrupted = !1);
      }),
    (e.prototype.postSlide = function (e) {
      var t = this;
      t.unslicked ||
        (t.$slider.trigger("afterChange", [t, e]),
        (t.animating = !1),
        t.slideCount > t.options.slidesToShow && t.setPosition(),
        (t.swipeLeft = null),
        t.options.autoplay && t.autoPlay(),
        !0 === t.options.accessibility &&
          (t.initADA(),
          t.options.focusOnChange &&
            i(t.$slides.get(t.currentSlide)) /*.attr("tabindex", 0)*/
              .focus())); /* WA-Common-Slick */
    }),
    (e.prototype.prev = e.prototype.slickPrev =
      function () {
        this.changeSlide({
          data: {
            message: "previous",
          },
        });
      }),
    (e.prototype.preventDefault = function (i) {
      i.preventDefault();
    }),
    (e.prototype.progressiveLazyLoad = function (e) {
      e = e || 1;
      var t,
        o,
        s,
        n,
        r,
        l = this,
        d = i("img[data-lazy]", l.$slider);
      d.length
        ? ((t = d.first()),
          (o = t.attr("data-lazy")),
          (s = t.attr("data-srcset")),
          (n = t.attr("data-sizes") || l.$slider.attr("data-sizes")),
          ((r = document.createElement("img")).onload = function () {
            s && (t.attr("srcset", s), n && t.attr("sizes", n)),
              t
                .attr("src", o)
                .removeAttr("data-lazy data-srcset data-sizes")
                .removeClass("slick-loading"),
              !0 === l.options.adaptiveHeight && l.setPosition(),
              l.$slider.trigger("lazyLoaded", [l, t, o]),
              l.progressiveLazyLoad();
          }),
          (r.onerror = function () {
            e < 3
              ? setTimeout(function () {
                  l.progressiveLazyLoad(e + 1);
                  // }, 500) : (t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), l.$slider.trigger("lazyLoadError", [l, t, o]), l.progressiveLazyLoad())
                }, 500)
              : (t
                  .attr("data-src", t.attr("data-lazy"))
                  .addClass("lazyload")
                  .removeAttr("data-lazy")
                  .removeClass("slick-loading")
                  .addClass("slick-lazyload-error"),
                l.$slider.trigger("lazyLoadError", [l, t, o]),
                l.progressiveLazyLoad());
          }),
          (r.src = o))
        : l.$slider.trigger("allImagesLoaded", [l]);
    }),
    (e.prototype.refresh = function (e) {
      var t,
        o,
        s = this;
      (o = s.slideCount - s.options.slidesToShow),
        !s.options.infinite && s.currentSlide > o && (s.currentSlide = o),
        s.slideCount <= s.options.slidesToShow && (s.currentSlide = 0),
        (t = s.currentSlide),
        s.destroy(!0),
        i.extend(s, s.initials, {
          currentSlide: t,
        }),
        s.init(),
        e ||
          s.changeSlide(
            {
              data: {
                message: "index",
                index: t,
              },
            },
            !1
          );
    }),
    (e.prototype.registerBreakpoints = function () {
      var e,
        t,
        o,
        s = this,
        n = s.options.responsive || null;
      if ("array" === i.type(n) && n.length) {
        s.respondTo = s.options.respondTo || "window";
        for (e in n)
          if (((o = s.breakpoints.length - 1), n.hasOwnProperty(e))) {
            for (t = n[e].breakpoint; o >= 0; )
              s.breakpoints[o] &&
                s.breakpoints[o] === t &&
                s.breakpoints.splice(o, 1),
                o--;
            s.breakpoints.push(t), (s.breakpointSettings[t] = n[e].settings);
          }
        s.breakpoints.sort(function (i, e) {
          return s.options.mobileFirst ? i - e : e - i;
        });
      }
    }),
    (e.prototype.reinit = function () {
      var e = this;
      (e.$slides = e.$slideTrack
        .children(e.options.slide)
        .addClass("slick-slide")),
        (e.slideCount = e.$slides.length),
        e.currentSlide >= e.slideCount &&
          0 !== e.currentSlide &&
          (e.currentSlide = e.currentSlide - e.options.slidesToScroll),
        e.slideCount <= e.options.slidesToShow && (e.currentSlide = 0),
        e.registerBreakpoints(),
        e.setProps(),
        e.setupInfinite(),
        e.buildArrows(),
        e.updateArrows(),
        e.initArrowEvents(),
        e.buildDots(),
        e.updateDots(),
        e.initDotEvents(),
        e.cleanUpSlideEvents(),
        e.initSlideEvents(),
        e.checkResponsive(!1, !0),
        !0 === e.options.focusOnSelect &&
          i(e.$slideTrack).children().on("click.slick", e.selectHandler),
        e.setSlideClasses(
          "number" == typeof e.currentSlide ? e.currentSlide : 0
        ),
        e.setPosition(),
        e.focusHandler(),
        (e.paused = !e.options.autoplay),
        e.autoPlay(),
        e.$slider.trigger("reInit", [e]);
    }),
    (e.prototype.resize = function () {
      var e = this;
      i(window).width() !== e.windowWidth &&
        (clearTimeout(e.windowDelay),
        (e.windowDelay = window.setTimeout(function () {
          (e.windowWidth = i(window).width()),
            e.checkResponsive(),
            e.unslicked || e.setPosition();
        }, 50)));
    }),
    (e.prototype.removeSlide = e.prototype.slickRemove =
      function (i, e, t) {
        var o = this;
        if (
          ((i =
            "boolean" == typeof i
              ? !0 === (e = i)
                ? 0
                : o.slideCount - 1
              : !0 === e
              ? --i
              : i),
          o.slideCount < 1 || i < 0 || i > o.slideCount - 1)
        )
          return !1;
        o.unload(),
          !0 === t
            ? o.$slideTrack.children().remove()
            : o.$slideTrack.children(this.options.slide).eq(i).remove(),
          (o.$slides = o.$slideTrack.children(this.options.slide)),
          o.$slideTrack.children(this.options.slide).detach(),
          o.$slideTrack.append(o.$slides),
          (o.$slidesCache = o.$slides),
          o.reinit();
      }),
    (e.prototype.setCSS = function (i) {
      var e,
        t,
        o = this,
        s = {};
      !0 === o.options.rtl && (i = -i),
        (e = "left" == o.positionProp ? Math.ceil(i) + "px" : "0px"),
        (t = "top" == o.positionProp ? Math.ceil(i) + "px" : "0px"),
        (s[o.positionProp] = i),
        !1 === o.transformsEnabled
          ? o.$slideTrack.css(s)
          : ((s = {}),
            !1 === o.cssTransitions
              ? ((s[o.animType] = "translate(" + e + ", " + t + ")"),
                o.$slideTrack.css(s))
              : ((s[o.animType] = "translate3d(" + e + ", " + t + ", 0px)"),
                o.$slideTrack.css(s)));
    }),
    (e.prototype.setDimensions = function () {
      var i = this;
      !1 === i.options.vertical
        ? !0 === i.options.centerMode &&
          i.$list.css({
            padding: "0px " + i.options.centerPadding,
          })
        : (i.$list.height(
            i.$slides.first().outerHeight(!0) * i.options.slidesToShow
          ),
          !0 === i.options.centerMode &&
            i.$list.css({
              padding: i.options.centerPadding + " 0px",
            })),
        (i.listWidth = i.$list.width()),
        (i.listHeight = i.$list.height()),
        !1 === i.options.vertical && !1 === i.options.variableWidth
          ? ((i.slideWidth = Math.ceil(i.listWidth / i.options.slidesToShow)),
            i.$slideTrack.width(
              Math.ceil(
                i.slideWidth * i.$slideTrack.children(".slick-slide").length
              )
            ))
          : !0 === i.options.variableWidth
          ? i.$slideTrack.width(5e3 * i.slideCount)
          : ((i.slideWidth = Math.ceil(i.listWidth)),
            i.$slideTrack.height(
              Math.ceil(
                i.$slides.first().outerHeight(!0) *
                  i.$slideTrack.children(".slick-slide").length
              )
            ));
      var e = i.$slides.first().outerWidth(!0) - i.$slides.first().width();
      !1 === i.options.variableWidth &&
        i.$slideTrack.children(".slick-slide").width(i.slideWidth - e);
    }),
    (e.prototype.setFade = function () {
      var e,
        t = this;
      t.$slides.each(function (o, s) {
        (e = t.slideWidth * o * -1),
          !0 === t.options.rtl
            ? i(s).css({
                position: "relative",
                right: e,
                top: 0,
                zIndex: t.options.zIndex - 2,
                opacity: 0,
              })
            : i(s).css({
                position: "relative",
                left: e,
                top: 0,
                zIndex: t.options.zIndex - 2,
                opacity: 0,
              });
      }),
        t.$slides.eq(t.currentSlide).css({
          zIndex: t.options.zIndex - 1,
          opacity: 1,
        });
    }),
    (e.prototype.setHeight = function () {
      var i = this;
      if (
        1 === i.options.slidesToShow &&
        !0 === i.options.adaptiveHeight &&
        !1 === i.options.vertical
      ) {
        var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
        i.$list.css("height", e);
      }
    }),
    (e.prototype.setOption = e.prototype.slickSetOption =
      function () {
        var e,
          t,
          o,
          s,
          n,
          r = this,
          l = !1;
        if (
          ("object" === i.type(arguments[0])
            ? ((o = arguments[0]), (l = arguments[1]), (n = "multiple"))
            : "string" === i.type(arguments[0]) &&
              ((o = arguments[0]),
              (s = arguments[1]),
              (l = arguments[2]),
              "responsive" === arguments[0] && "array" === i.type(arguments[1])
                ? (n = "responsive")
                : void 0 !== arguments[1] && (n = "single")),
          "single" === n)
        )
          r.options[o] = s;
        else if ("multiple" === n)
          i.each(o, function (i, e) {
            r.options[i] = e;
          });
        else if ("responsive" === n)
          for (t in s)
            if ("array" !== i.type(r.options.responsive))
              r.options.responsive = [s[t]];
            else {
              for (e = r.options.responsive.length - 1; e >= 0; )
                r.options.responsive[e].breakpoint === s[t].breakpoint &&
                  r.options.responsive.splice(e, 1),
                  e--;
              r.options.responsive.push(s[t]);
            }
        l && (r.unload(), r.reinit());
      }),
    (e.prototype.setPosition = function () {
      var i = this;
      i.setDimensions(),
        i.setHeight(),
        !1 === i.options.fade
          ? i.setCSS(i.getLeft(i.currentSlide))
          : i.setFade(),
        i.$slider.trigger("setPosition", [i]);
    }),
    (e.prototype.setProps = function () {
      var i = this,
        e = document.body.style;
      (i.positionProp = !0 === i.options.vertical ? "top" : "left"),
        "top" === i.positionProp
          ? i.$slider.addClass("slick-vertical")
          : i.$slider.removeClass("slick-vertical"),
        (void 0 === e.WebkitTransition &&
          void 0 === e.MozTransition &&
          void 0 === e.msTransition) ||
          (!0 === i.options.useCSS && (i.cssTransitions = !0)),
        i.options.fade &&
          ("number" == typeof i.options.zIndex
            ? i.options.zIndex < 3 && (i.options.zIndex = 3)
            : (i.options.zIndex = i.defaults.zIndex)),
        void 0 !== e.OTransform &&
          ((i.animType = "OTransform"),
          (i.transformType = "-o-transform"),
          (i.transitionType = "OTransition"),
          void 0 === e.perspectiveProperty &&
            void 0 === e.webkitPerspective &&
            (i.animType = !1)),
        void 0 !== e.MozTransform &&
          ((i.animType = "MozTransform"),
          (i.transformType = "-moz-transform"),
          (i.transitionType = "MozTransition"),
          void 0 === e.perspectiveProperty &&
            void 0 === e.MozPerspective &&
            (i.animType = !1)),
        void 0 !== e.webkitTransform &&
          ((i.animType = "webkitTransform"),
          (i.transformType = "-webkit-transform"),
          (i.transitionType = "webkitTransition"),
          void 0 === e.perspectiveProperty &&
            void 0 === e.webkitPerspective &&
            (i.animType = !1)),
        void 0 !== e.msTransform &&
          ((i.animType = "msTransform"),
          (i.transformType = "-ms-transform"),
          (i.transitionType = "msTransition"),
          void 0 === e.msTransform && (i.animType = !1)),
        void 0 !== e.transform &&
          !1 !== i.animType &&
          ((i.animType = "transform"),
          (i.transformType = "transform"),
          (i.transitionType = "transition")),
        (i.transformsEnabled =
          i.options.useTransform && null !== i.animType && !1 !== i.animType);
    }),
    (e.prototype.setSlideClasses = function (i) {
      var e,
        t,
        o,
        s,
        n = this;
      // 아래 .attr("aria-hidden", "true") >> 삭제 WA-Common-Slick,
      if (
        ((t = n.$slider
          .find(".slick-slide")
          .removeClass("slick-active slick-center slick-current")),
        /* LGEUS-11794 : 20190813 modify */ !n.options.defaultFocus
          ? n.$slides.eq(i).addClass("slick-current")
          : null /* //LGEUS-11794 : 20190813 modify */,
        !0 === n.options.centerMode)
      ) {
        var r = n.options.slidesToShow % 2 == 0 ? 1 : 0;
        (e = Math.floor(n.options.slidesToShow / 2)),
          !0 === n.options.infinite &&
            (i >= e && i <= n.slideCount - 1 - e
              ? n.$slides.slice(i - e + r, i + e + 1).addClass("slick-active")
              : ((o = n.options.slidesToShow + i),
                t.slice(o - e + 1 + r, o + e + 2).addClass("slick-active")),
            0 === i
              ? t
                  .eq(t.length - 1 - n.options.slidesToShow)
                  .addClass("slick-center")
              : i === n.slideCount - 1 &&
                t.eq(n.options.slidesToShow).addClass("slick-center")),
          n.$slides.eq(i).addClass("slick-center");
      } else
        i >= 0 && i <= n.slideCount - n.options.slidesToShow
          ? n.$slides
              .slice(i, i + n.options.slidesToShow)
              .addClass("slick-active")
          : t.length <= n.options.slidesToShow
          ? t.addClass("slick-active")
          : ((s = n.slideCount % n.options.slidesToShow),
            (o = !0 === n.options.infinite ? n.options.slidesToShow + i : i),
            n.options.slidesToShow == n.options.slidesToScroll &&
            n.slideCount - i < n.options.slidesToShow
              ? t
                  .slice(o - (n.options.slidesToShow - s), o + s)
                  .addClass("slick-active")
              : t
                  .slice(o, o + n.options.slidesToShow)
                  .addClass("slick-active"));
      ("ondemand" !== n.options.lazyLoad &&
        "anticipated" !== n.options.lazyLoad) ||
        n.lazyLoad();
    }),
    (e.prototype.setupInfinite = function () {
      var e,
        t,
        o,
        s = this;
      if (
        (!0 === s.options.fade && (s.options.centerMode = !1),
        !0 === s.options.infinite &&
          !1 === s.options.fade &&
          ((t = null), s.slideCount > s.options.slidesToShow))
      ) {
        for (
          o =
            !0 === s.options.centerMode
              ? s.options.slidesToShow + 1
              : s.options.slidesToShow,
            e = s.slideCount;
          e > s.slideCount - o;
          e -= 1
        )
          (t = e - 1),
            i(s.$slides[t])
              .clone(!0)
              .attr("id", "")
              .attr("data-slick-index", t - s.slideCount)
              .prependTo(s.$slideTrack)
              .addClass("slick-cloned");
        for (e = 0; e < o + s.slideCount; e += 1)
          (t = e),
            i(s.$slides[t])
              .clone(!0)
              .attr("id", "")
              .attr("data-slick-index", t + s.slideCount)
              .appendTo(s.$slideTrack)
              .addClass("slick-cloned");
        s.$slideTrack
          .find(".slick-cloned")
          .find("[id]")
          .each(function () {
            i(this).attr("id", "");
          });
      }
    }),
    (e.prototype.interrupt = function (i) {
      var e = this;
      i || e.autoPlay(), (e.interrupted = i);
    }),
    (e.prototype.selectHandler = function (e) {
      var t = this,
        o = i(e.target).is(".slick-slide")
          ? i(e.target)
          : i(e.target).parents(".slick-slide"),
        s = parseInt(o.attr("data-slick-index"));
      s || (s = 0),
        t.slideCount <= t.options.slidesToShow
          ? t.slideHandler(s, !1, !0)
          : t.slideHandler(s);
    }),
    (e.prototype.slideHandler = function (i, e, t) {
      var o,
        s,
        n,
        r,
        l,
        d = null,
        a = this;
      if (
        ((e = e || !1),
        !(
          (!0 === a.animating && !0 === a.options.waitForAnimate) ||
          (!0 === a.options.fade && a.currentSlide === i)
        ))
      )
        if (
          (!1 === e && a.asNavFor(i),
          (o = i),
          (d = a.getLeft(o)),
          (r = a.getLeft(a.currentSlide)),
          (a.currentLeft = null === a.swipeLeft ? r : a.swipeLeft),
          !1 === a.options.infinite &&
            !1 === a.options.centerMode &&
            (i < 0 || i > a.getDotCount() * a.options.slidesToScroll))
        )
          !1 === a.options.fade &&
            ((o = a.currentSlide),
            !0 !== t
              ? a.animateSlide(r, function () {
                  a.postSlide(o);
                })
              : a.postSlide(o));
        else if (
          !1 === a.options.infinite &&
          !0 === a.options.centerMode &&
          (i < 0 || i > a.slideCount - a.options.slidesToScroll)
        )
          !1 === a.options.fade &&
            ((o = a.currentSlide),
            !0 !== t
              ? a.animateSlide(r, function () {
                  a.postSlide(o);
                })
              : a.postSlide(o));
        else {
          if (
            (a.options.autoplay && clearInterval(a.autoPlayTimer),
            (s =
              o < 0
                ? a.slideCount % a.options.slidesToScroll != 0
                  ? a.slideCount - (a.slideCount % a.options.slidesToScroll)
                  : a.slideCount + o
                : o >= a.slideCount
                ? a.slideCount % a.options.slidesToScroll != 0
                  ? 0
                  : o - a.slideCount
                : o),
            (a.animating = !0),
            a.$slider.trigger("beforeChange", [a, a.currentSlide, s]),
            (n = a.currentSlide),
            (a.currentSlide = s),
            a.setSlideClasses(a.currentSlide),
            a.options.asNavFor &&
              (l = (l = a.getNavTarget()).slick("getSlick")).slideCount <=
                l.options.slidesToShow &&
              l.setSlideClasses(a.currentSlide),
            a.updateDots(),
            a.updateArrows(),
            !0 === a.options.fade)
          )
            return (
              !0 !== t
                ? (a.fadeSlideOut(n),
                  a.fadeSlide(s, function () {
                    a.postSlide(s);
                  }))
                : a.postSlide(s),
              void a.animateHeight()
            );
          !0 !== t
            ? a.animateSlide(d, function () {
                a.postSlide(s);
              })
            : a.postSlide(s);
        }
    }),
    (e.prototype.startLoad = function () {
      var i = this;
      !0 === i.options.arrows &&
        i.slideCount > i.options.slidesToShow &&
        (i.$prevArrow.hide(), i.$nextArrow.hide()),
        !0 === i.options.dots &&
          i.slideCount > i.options.slidesToShow &&
          i.$dots.hide(),
        i.$slider.addClass("slick-loading");
    }),
    (e.prototype.swipeDirection = function () {
      var i,
        e,
        t,
        o,
        s = this;
      return (
        (i = s.touchObject.startX - s.touchObject.curX),
        (e = s.touchObject.startY - s.touchObject.curY),
        (t = Math.atan2(e, i)),
        (o = Math.round((180 * t) / Math.PI)) < 0 && (o = 360 - Math.abs(o)),
        o <= 45 && o >= 0
          ? !1 === s.options.rtl
            ? "left"
            : "right"
          : o <= 360 && o >= 315
          ? !1 === s.options.rtl
            ? "left"
            : "right"
          : o >= 135 && o <= 225
          ? !1 === s.options.rtl
            ? "right"
            : "left"
          : !0 === s.options.verticalSwiping
          ? o >= 35 && o <= 135
            ? "down"
            : "up"
          : "vertical"
      );
    }),
    (e.prototype.swipeEnd = function (i) {
      var e,
        t,
        o = this;
      if (((o.dragging = !1), (o.swiping = !1), o.scrolling))
        return (o.scrolling = !1), !1;
      if (
        ((o.interrupted = !1),
        (o.shouldClick = !(o.touchObject.swipeLength > 10)),
        void 0 === o.touchObject.curX)
      )
        return !1;
      if (
        (!0 === o.touchObject.edgeHit &&
          o.$slider.trigger("edge", [o, o.swipeDirection()]),
        o.touchObject.swipeLength >= o.touchObject.minSwipe)
      ) {
        switch ((t = o.swipeDirection())) {
          case "left":
          case "down":
            (e = o.options.swipeToSlide
              ? o.checkNavigable(o.currentSlide + o.getSlideCount())
              : o.currentSlide + o.getSlideCount()),
              (o.currentDirection = 0);
            break;
          case "right":
          case "up":
            (e = o.options.swipeToSlide
              ? o.checkNavigable(o.currentSlide - o.getSlideCount())
              : o.currentSlide - o.getSlideCount()),
              (o.currentDirection = 1);
        }
        "vertical" != t &&
          (o.slideHandler(e),
          (o.touchObject = {}),
          o.$slider.trigger("swipe", [o, t]));
      } else
        o.touchObject.startX !== o.touchObject.curX &&
          (o.slideHandler(o.currentSlide), (o.touchObject = {}));
    }),
    (e.prototype.swipeHandler = function (i) {
      var e = this;
      if (
        !(
          !1 === e.options.swipe ||
          ("ontouchend" in document && !1 === e.options.swipe) ||
          (!1 === e.options.draggable && -1 !== i.type.indexOf("mouse"))
        )
      )
        switch (
          ((e.touchObject.fingerCount =
            i.originalEvent && void 0 !== i.originalEvent.touches
              ? i.originalEvent.touches.length
              : 1),
          (e.touchObject.minSwipe = e.listWidth / e.options.touchThreshold),
          !0 === e.options.verticalSwiping &&
            (e.touchObject.minSwipe = e.listHeight / e.options.touchThreshold),
          i.data.action)
        ) {
          case "start":
            e.swipeStart(i);
            break;
          case "move":
            e.swipeMove(i);
            break;
          case "end":
            e.swipeEnd(i);
        }
    }),
    (e.prototype.swipeMove = function (i) {
      var e,
        t,
        o,
        s,
        n,
        r,
        l = this;
      return (
        (n = void 0 !== i.originalEvent ? i.originalEvent.touches : null),
        !(!l.dragging || l.scrolling || (n && 1 !== n.length)) &&
          ((e = l.getLeft(l.currentSlide)),
          (l.touchObject.curX = void 0 !== n ? n[0].pageX : i.clientX),
          (l.touchObject.curY = void 0 !== n ? n[0].pageY : i.clientY),
          (l.touchObject.swipeLength = Math.round(
            Math.sqrt(Math.pow(l.touchObject.curX - l.touchObject.startX, 2))
          )),
          (r = Math.round(
            Math.sqrt(Math.pow(l.touchObject.curY - l.touchObject.startY, 2))
          )),
          !l.options.verticalSwiping && !l.swiping && r > 4
            ? ((l.scrolling = !0), !1)
            : (!0 === l.options.verticalSwiping &&
                (l.touchObject.swipeLength = r),
              (t = l.swipeDirection()),
              void 0 !== i.originalEvent &&
                l.touchObject.swipeLength > 4 &&
                ((l.swiping = !0), i.preventDefault()),
              (s =
                (!1 === l.options.rtl ? 1 : -1) *
                (l.touchObject.curX > l.touchObject.startX ? 1 : -1)),
              !0 === l.options.verticalSwiping &&
                (s = l.touchObject.curY > l.touchObject.startY ? 1 : -1),
              (o = l.touchObject.swipeLength),
              (l.touchObject.edgeHit = !1),
              !1 === l.options.infinite &&
                ((0 === l.currentSlide && "right" === t) ||
                  (l.currentSlide >= l.getDotCount() && "left" === t)) &&
                ((o = l.touchObject.swipeLength * l.options.edgeFriction),
                (l.touchObject.edgeHit = !0)),
              !1 === l.options.vertical
                ? (l.swipeLeft = e + o * s)
                : (l.swipeLeft = e + o * (l.$list.height() / l.listWidth) * s),
              !0 === l.options.verticalSwiping && (l.swipeLeft = e + o * s),
              !0 !== l.options.fade &&
                !1 !== l.options.touchMove &&
                (!0 === l.animating
                  ? ((l.swipeLeft = null), !1)
                  : void l.setCSS(l.swipeLeft))))
      );
    }),
    (e.prototype.swipeStart = function (i) {
      var e,
        t = this;
      if (
        ((t.interrupted = !0),
        1 !== t.touchObject.fingerCount ||
          t.slideCount <= t.options.slidesToShow)
      )
        return (t.touchObject = {}), !1;
      void 0 !== i.originalEvent &&
        void 0 !== i.originalEvent.touches &&
        (e = i.originalEvent.touches[0]),
        (t.touchObject.startX = t.touchObject.curX =
          void 0 !== e ? e.pageX : i.clientX),
        (t.touchObject.startY = t.touchObject.curY =
          void 0 !== e ? e.pageY : i.clientY),
        (t.dragging = !0);
    }),
    (e.prototype.unfilterSlides = e.prototype.slickUnfilter =
      function () {
        var i = this;
        null !== i.$slidesCache &&
          (i.unload(),
          i.$slideTrack.children(this.options.slide).detach(),
          i.$slidesCache.appendTo(i.$slideTrack),
          i.reinit());
      }),
    (e.prototype.unload = function () {
      var e = this;
      i(".slick-cloned", e.$slider).remove(),
        e.$dots && e.$dots.remove(),
        e.$prevArrow &&
          e.htmlExpr.test(e.options.prevArrow) &&
          e.$prevArrow.remove(),
        e.$nextArrow &&
          e.htmlExpr.test(e.options.nextArrow) &&
          e.$nextArrow.remove(),
        e.$slides
          .removeClass("slick-slide slick-active slick-visible slick-current")
          .css("width", ""); // attr("aria-hidden", "true") WA-Common-slick
    }),
    (e.prototype.unslick = function (i) {
      var e = this;
      e.$slider.trigger("unslick", [e, i]), e.destroy();
    }),
    (e.prototype.updateArrows = function () {
      var i = this;
      Math.floor(i.options.slidesToShow / 2),
        !0 === i.options.arrows &&
          i.slideCount > i.options.slidesToShow &&
          !i.options.infinite &&
          (i.$prevArrow
            .removeClass("slick-disabled")
            .attr("aria-disabled", "false")
            .removeAttr("disabled"),
          i.$nextArrow
            .removeClass("slick-disabled")
            .attr("aria-disabled", "false")
            .removeAttr("disabled"),
          0 === i.currentSlide
            ? (i.$prevArrow
                .addClass("slick-disabled")
                .attr("aria-disabled", "true")
                .attr("disabled", "true"),
              i.$nextArrow
                .removeClass("slick-disabled")
                .attr("aria-disabled", "false")
                .removeAttr("disabled"))
            : i.currentSlide >= i.slideCount - i.options.slidesToShow &&
              !1 === i.options.centerMode
            ? (i.$nextArrow
                .addClass("slick-disabled")
                .attr("aria-disabled", "true")
                .attr("disabled", "true"),
              i.$prevArrow
                .removeClass("slick-disabled")
                .attr("aria-disabled", "false")
                .removeAttr("disabled"))
            : i.currentSlide >= i.slideCount - 1 &&
              !0 === i.options.centerMode &&
              (i.$nextArrow
                .addClass("slick-disabled")
                .attr("aria-disabled", "true")
                .attr("disabled", "true"),
              i.$prevArrow
                .removeClass("slick-disabled")
                .attr("aria-disabled", "false")
                .removeAttr("disabled"))); /* WA-Common-Slick */
    }),
    (e.prototype.updateDots = function () {
      var i = this;
      null !== i.$dots &&
        (i.$dots.find("li").removeClass("slick-active").end(),
        i.$dots
          .find("li")
          .eq(Math.floor(i.currentSlide / i.options.slidesToScroll))
          .addClass("slick-active"));
    }),
    (e.prototype.visibility = function () {
      var i = this;
      i.options.autoplay &&
        (document[i.hidden] ? (i.interrupted = !0) : (i.interrupted = !1));
    }),
    (i.fn.slick = function () {
      var i,
        t,
        o = this,
        s = arguments[0],
        n = Array.prototype.slice.call(arguments, 1),
        r = o.length;
      for (i = 0; i < r; i++)
        if (
          ("object" == typeof s || void 0 === s
            ? (o[i].slick = new e(o[i], s))
            : (t = o[i].slick[s].apply(o[i].slick, n)),
          void 0 !== t)
        )
          return t;
      return o;
    });
});
/* //LGECI-261 edit */

// InlineSVG 2.0.0
!(function (e) {
  "use strict";
  e.fn.inlineSVG = function (t) {
    t = e.extend(
      {
        eachAfter: null,
        allAfter: null,
        beforeReplace: null,
        replacedClass: "replaced-svg",
        keepSize: !0,
        keepStyle: !0,
      },
      t || {}
    );
    var l = this,
      a = 0;
    return l.each(function () {
      var r = e(this),
        n = r.attr("id"),
        c = r.attr("class"),
        i = r.attr("src");
      e.get(
        i,
        function (i) {
          function s(n) {
            (n = "boolean" === e.type(n) ? n : !0),
              n
                ? (r.replaceWith(f), t.eachAfter && t.eachAfter.call(f.get(0)))
                : f.remove(),
              ++a === l.length && t.allAfter && t.allAfter.call(null);
          }
          var f = e(i).find("svg"),
            h = [];
          if (
            (n && f.attr("id", n),
            c && h.push(c),
            t.replacedClass && h.push(t.replacedClass),
            f.attr("class", h.join(" ")),
            f.removeAttr("xmlns:a"),
            t.keepSize)
          ) {
            var p = r.attr("width"),
              u = r.attr("height");
            p && f.attr("width", p), u && f.attr("height", u);
          }
          if (t.keepStyle) {
            var o = r.attr("style");
            o && f.attr("style", o);
          }
          t.beforeReplace ? t.beforeReplace.call(null, r, f, s) : s();
        },
        "xml"
      );
    });
  };
})(jQuery);

// jQuery Cookie Plugin v1.4.1
!(function (e) {
  "function" == typeof define && define.amd
    ? define(["jquery"], e)
    : "object" == typeof exports
    ? e(require("jquery"))
    : e(jQuery);
})(function (e) {
  var o = /\+/g;
  function n(e) {
    return r.raw ? e : encodeURIComponent(e);
  }
  function i(n, i) {
    var t = r.raw
      ? n
      : (function (e) {
          0 === e.indexOf('"') &&
            (e = e.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
          try {
            return (
              (e = decodeURIComponent(e.replace(o, " "))),
              r.json ? JSON.parse(e) : e
            );
          } catch (e) {}
        })(n);
    return e.isFunction(i) ? i(t) : t;
  }
  var r = (e.cookie = function (o, t, c) {
    if (void 0 !== t && !e.isFunction(t)) {
      if ("number" == typeof (c = e.extend({}, r.defaults, c)).expires) {
        var u = c.expires,
          a = (c.expires = new Date());
        a.setTime(+a + 864e5 * u);
      }
      return (document.cookie = [
        n(o),
        "=",
        ((d = t), n(r.json ? JSON.stringify(d) : String(d))),
        c.expires ? "; expires=" + c.expires.toUTCString() : "",
        c.path ? "; path=" + c.path : "",
        c.domain ? "; domain=" + c.domain : "",
        c.secure ? "; secure" : "",
      ].join(""));
    }
    for (
      var d,
        f,
        p = o ? void 0 : {},
        s = document.cookie ? document.cookie.split("; ") : [],
        m = 0,
        v = s.length;
      m < v;
      m++
    ) {
      var x = s[m].split("="),
        k = ((f = x.shift()), r.raw ? f : decodeURIComponent(f)),
        l = x.join("=");
      if (o && o === k) {
        p = i(l, t);
        break;
      }
      o || void 0 === (l = i(l)) || (p[k] = l);
    }
    return p;
  });
  (r.defaults = {}),
    (e.removeCookie = function (o, n) {
      return (
        void 0 !== e.cookie(o) &&
        (e.cookie(o, "", e.extend({}, n, { expires: -1 })), !e.cookie(o))
      );
    });
});
$.cookie.raw = true;

// jQuery Mousewheel 3.1.13
(function (factory) {
  if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module.
    define(["jquery"], factory);
  } else if (typeof exports === "object") {
    // Node/CommonJS style for Browserify
    module.exports = factory;
  } else {
    // Browser globals
    factory(jQuery);
  }
})(function ($) {
  var toFix = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
    toBind =
      "onwheel" in document || document.documentMode >= 9
        ? ["wheel"]
        : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
    slice = Array.prototype.slice,
    nullLowestDeltaTimeout,
    lowestDelta;

  if ($.event.fixHooks) {
    for (var i = toFix.length; i; ) {
      $.event.fixHooks[toFix[--i]] = $.event.mouseHooks;
    }
  }

  var special = ($.event.special.mousewheel = {
    version: "3.1.12",

    setup: function () {
      if (this.addEventListener) {
        for (var i = toBind.length; i; ) {
          this.addEventListener(toBind[--i], handler, false);
        }
      } else {
        this.onmousewheel = handler;
      }
      // Store the line height and page height for this particular element
      $.data(this, "mousewheel-line-height", special.getLineHeight(this));
      $.data(this, "mousewheel-page-height", special.getPageHeight(this));
    },

    teardown: function () {
      if (this.removeEventListener) {
        for (var i = toBind.length; i; ) {
          this.removeEventListener(toBind[--i], handler, false);
        }
      } else {
        this.onmousewheel = null;
      }
      // Clean up the data we added to the element
      $.removeData(this, "mousewheel-line-height");
      $.removeData(this, "mousewheel-page-height");
    },

    getLineHeight: function (elem) {
      var $elem = $(elem),
        $parent = $elem["offsetParent" in $.fn ? "offsetParent" : "parent"]();
      if (!$parent.length) {
        $parent = $("body");
      }
      return (
        parseInt($parent.css("fontSize"), 10) ||
        parseInt($elem.css("fontSize"), 10) ||
        16
      );
    },

    getPageHeight: function (elem) {
      return $(elem).height();
    },

    settings: {
      adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
      normalizeOffset: true, // calls getBoundingClientRect for each event
    },
  });

  $.fn.extend({
    mousewheel: function (fn) {
      return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },

    unmousewheel: function (fn) {
      return this.unbind("mousewheel", fn);
    },
  });

  function handler(event) {
    var orgEvent = event || window.event,
      args = slice.call(arguments, 1),
      delta = 0,
      deltaX = 0,
      deltaY = 0,
      absDelta = 0,
      offsetX = 0,
      offsetY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";

    // Old school scrollwheel delta
    if ("detail" in orgEvent) {
      deltaY = orgEvent.detail * -1;
    }
    if ("wheelDelta" in orgEvent) {
      deltaY = orgEvent.wheelDelta;
    }
    if ("wheelDeltaY" in orgEvent) {
      deltaY = orgEvent.wheelDeltaY;
    }
    if ("wheelDeltaX" in orgEvent) {
      deltaX = orgEvent.wheelDeltaX * -1;
    }

    // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
    if ("axis" in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
      deltaX = deltaY * -1;
      deltaY = 0;
    }

    // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
    delta = deltaY === 0 ? deltaX : deltaY;

    // New school wheel delta (wheel event)
    if ("deltaY" in orgEvent) {
      deltaY = orgEvent.deltaY * -1;
      delta = deltaY;
    }
    if ("deltaX" in orgEvent) {
      deltaX = orgEvent.deltaX;
      if (deltaY === 0) {
        delta = deltaX * -1;
      }
    }

    // No change actually happened, no reason to go any further
    if (deltaY === 0 && deltaX === 0) {
      return;
    }

    // Need to convert lines and pages to pixels if we aren't already in pixels
    // There are three delta modes:
    //   * deltaMode 0 is by pixels, nothing to do
    //   * deltaMode 1 is by lines
    //   * deltaMode 2 is by pages
    if (orgEvent.deltaMode === 1) {
      var lineHeight = $.data(this, "mousewheel-line-height");
      delta *= lineHeight;
      deltaY *= lineHeight;
      deltaX *= lineHeight;
    } else if (orgEvent.deltaMode === 2) {
      var pageHeight = $.data(this, "mousewheel-page-height");
      delta *= pageHeight;
      deltaY *= pageHeight;
      deltaX *= pageHeight;
    }

    // Store lowest absolute delta to normalize the delta values
    absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX));

    if (!lowestDelta || absDelta < lowestDelta) {
      lowestDelta = absDelta;

      // Adjust older deltas if necessary
      if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
        lowestDelta /= 40;
      }
    }

    // Adjust older deltas if necessary
    if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
      // Divide all the things by 40!
      delta /= 40;
      deltaX /= 40;
      deltaY /= 40;
    }

    // Get a whole, normalized value for the deltas
    delta = Math[delta >= 1 ? "floor" : "ceil"](delta / lowestDelta);
    deltaX = Math[deltaX >= 1 ? "floor" : "ceil"](deltaX / lowestDelta);
    deltaY = Math[deltaY >= 1 ? "floor" : "ceil"](deltaY / lowestDelta);

    // Normalise offsetX and offsetY properties
    if (special.settings.normalizeOffset && this.getBoundingClientRect) {
      var boundingRect = this.getBoundingClientRect();
      offsetX = event.clientX - boundingRect.left;
      offsetY = event.clientY - boundingRect.top;
    }

    // Add information to the event object
    event.deltaX = deltaX;
    event.deltaY = deltaY;
    event.deltaFactor = lowestDelta;
    event.offsetX = offsetX;
    event.offsetY = offsetY;
    // Go ahead and set deltaMode to 0 since we converted to pixels
    // Although this is a little odd since we overwrite the deltaX/Y
    // properties with normalized deltas.
    event.deltaMode = 0;

    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);

    // Clearout lowestDelta after sometime to better
    // handle multiple device types that give different
    // a different lowestDelta
    // Ex: trackpad = 3 and mouse wheel = 120
    if (nullLowestDeltaTimeout) {
      clearTimeout(nullLowestDeltaTimeout);
    }
    nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

    return ($.event.dispatch || $.event.handle).apply(this, args);
  }

  function nullLowestDelta() {
    lowestDelta = null;
  }

  function shouldAdjustOldDeltas(orgEvent, absDelta) {
    // If this is an older event and the delta is divisable by 120,
    // then we are assuming that the browser is treating this as an
    // older mouse wheel event and that we should divide the deltas
    // by 40 to try and get a more usable deltaFactor.
    // Side note, this actually impacts the reported scroll distance
    // in older browsers and can cause scrolling to be slower than native.
    // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
    return (
      special.settings.adjustOldDeltas &&
      orgEvent.type === "mousewheel" &&
      absDelta % 120 === 0
    );
  }
});

// tiny Layer
var tinyLayer = (function () {
  var initModule = function ($container) {
    if (document.querySelector($container)) {
      $(document)
        .on("mouseenter focus", $container, function (e) {
          // init
          e.preventDefault();
          var _this = $(this),
            tooltip_title = _this.text(),
            tooltip_x = _this.offset().left,
            tooltip_y = _this.offset().top - 30,
            swatch_tooltip,
            swatch_tooltip_arrow,
            out_x;

          $(".tooltip-box").remove();
          //_this.siblings().attr('id','')
          $("#tooltipId").attr("id", "");

          // create tooltip
          _this.attr("id", "tooltipId");
          $("body").append(
            '<span class="tooltip-box" aria-describedby="tooltipId"><span class="arrow"></span><span class="text">' +
              tooltip_title +
              "</span></span>"
          );

          swatch_tooltip = $(".tooltip-box");
          swatch_tooltip_arrow = swatch_tooltip.find(".arrow");

          swatch_tooltip
            .css("max-width", _this.closest(".model-group").width())
            .css(
              "left",
              Math.floor(tooltip_x + _this.innerWidth() / 2) -
                swatch_tooltip.innerWidth() / 2
            )
            .css("top", tooltip_y - swatch_tooltip.height());

          if (swatch_tooltip.offset().left < 0) {
            out_x =
              parseInt(
                swatch_tooltip_arrow.css("margin-left").replace("px", "")
              ) + swatch_tooltip.offset().left;
            swatch_tooltip.css("left", 0);
            swatch_tooltip_arrow.css("margin-left", out_x);
          }
          if (
            swatch_tooltip.offset().left + swatch_tooltip.innerWidth() + 2 ==
            $(window).width()
          ) {
            out_x = 0;
            swatch_tooltip_arrow.css("margin-left", out_x);
          }
        })
        .on("focusout mouseleave", $container, function (e) {
          e.preventDefault();
          $(".tooltip-box").remove();
        });
    }
  };

  return { initModule: initModule };
})();

/* LGEITF-520 Start */
/**
 * Skipped minification because the original files appears to be already minified.
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
/**
 * keen-slider 5.5.0
 * The HTML touch slider carousel with the most native feeling you will get.
 * https://keen-slider.io
 * Copyright 2020-2021 Eric Beyer <contact@ericbeyer.de>
 * License: MIT
 * Released on: 2021-06-07
 */

!(function (t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define(e)
    : ((t =
        "undefined" != typeof globalThis ? globalThis : t || self).KeenSlider =
        e(jQuery));
})(this, function ($) {
  "use strict";
  function t(t, e, n) {
    return (
      e in t
        ? Object.defineProperty(t, e, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (t[e] = n),
      t
    );
  }
  function e(t, e) {
    var n = Object.keys(t);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(t);
      e &&
        (r = r.filter(function (e) {
          return Object.getOwnPropertyDescriptor(t, e).enumerable;
        })),
        n.push.apply(n, r);
    }
    return n;
  }
  function n(n) {
    for (var r = 1; r < arguments.length; r++) {
      var i = null != arguments[r] ? arguments[r] : {};
      r % 2
        ? e(Object(i), !0).forEach(function (e) {
            t(n, e, i[e]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(i))
        : e(Object(i)).forEach(function (t) {
            Object.defineProperty(n, t, Object.getOwnPropertyDescriptor(i, t));
          });
    }
    return n;
  }
  function r(t) {
    return (
      (function (t) {
        if (Array.isArray(t)) return i(t);
      })(t) ||
      (function (t) {
        if ("undefined" != typeof Symbol && Symbol.iterator in Object(t))
          return Array.from(t);
      })(t) ||
      (function (t, e) {
        if (!t) return;
        if ("string" == typeof t) return i(t, e);
        var n = Object.prototype.toString.call(t).slice(8, -1);
        "Object" === n && t.constructor && (n = t.constructor.name);
        if ("Map" === n || "Set" === n) return Array.from(t);
        if (
          "Arguments" === n ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
        )
          return i(t, e);
      })(t) ||
      (function () {
        throw new TypeError(
          "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
        );
      })()
    );
  }
  function i(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
    return r;
  }
  function o(t) {
    return Array.prototype.slice.call(t);
  }
  function a(t) {
    var e =
      arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : document;
    return "function" == typeof t
      ? o(t())
      : "string" == typeof t
      ? o(e.querySelectorAll(t))
      : t instanceof HTMLElement != !1
      ? [t]
      : t instanceof NodeList != !1
      ? t
      : [];
  }
  function u(t, e, n) {
    return Math.min(Math.max(t, e), n);
  }
  return (
    Math.sign ||
      (Math.sign = function (t) {
        return (t > 0) - (t < 0) || +t;
      }),
    function (t) {
      var e,
        i,
        o,
        c,
        f,
        s,
        l,
        d,
        h,
        v,
        p,
        m,
        b,
        g,
        w,
        y,
        M,
        O,
        S,
        j,
        A,
        x,
        k,
        P,
        E,
        T,
        D,
        C,
        L,
        V,
        X,
        Y,
        z,
        H,
        I = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        q = "data-keen-slider-moves",
        F = "data-keen-slider-v",
        W = [],
        _ = null,
        K = !1,
        N = !1,
        R = 0,
        U = [];
      function $(t, e, n) {
        var r =
          arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
        t.addEventListener(e, n, r), W.push([t, e, n, r]);
      }
      function B(t) {
        if (O && S === Z(t) && ft()) {
          var n = et(t).x;
          if (!rt(t) && P) return J(t);
          P && (Kt(), (j = n), (P = !1)), t.cancelable && t.preventDefault();
          var r = j - n;
          (E += Math.abs(r)),
            !T && E > 5 && ((T = !0), e.setAttribute(q, !0)),
            Yt(k(r, Gt) * (lt() ? -1 : 1), t.timeStamp),
            (j = n);
        }
      }
      function G(t) {
        O ||
          !ft() ||
          nt(t.target) ||
          ((O = !0),
          (P = !0),
          (S = Z(t)),
          (T = !1),
          (E = 0),
          rt(t),
          pt(),
          (M = v),
          (j = et(t).x),
          Yt(0, t.timeStamp),
          ut("dragStart"));
      }
      function J(t) {
        O &&
          S === Z(t, !0) &&
          ft() &&
          (e.removeAttribute(q), (O = !1), gt(), ut("dragEnd"));
      }
      function Q(t) {
        return t.changedTouches;
      }
      function Z(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
          n = e ? Q(t) : tt(t);
        return n ? (n[0] ? n[0].identifier : "error") : "default";
      }
      function tt(t) {
        return t.targetTouches;
      }
      function et(t) {
        var e = tt(t);
        return {
          x: ht() ? (e ? e[0].screenY : t.pageY) : e ? e[0].screenX : t.pageX,
          timestamp: t.timeStamp,
        };
      }
      function nt(t) {
        return t.hasAttribute(y.preventEvent);
      }
      function rt(t) {
        var e = tt(t);
        if (!e) return !0;
        var n = e[0],
          r = ht() ? n.clientY : n.clientX,
          i = ht() ? n.clientX : n.clientY,
          o =
            void 0 !== A && void 0 !== x && Math.abs(x - i) <= Math.abs(A - r);
        return (A = r), (x = i), o;
      }
      function it(t) {
        ft() && O && t.preventDefault();
      }
      function ot() {
        $(window, "orientationchange", Dt),
          $(window, "resize", function () {
            return Tt();
          }),
          $(e, "dragstart", function (t) {
            ft() && t.preventDefault();
          }),
          $(e, "mousedown", G),
          $(y.cancelOnLeave ? e : window, "mousemove", B),
          y.cancelOnLeave && $(e, "mouseleave", J),
          $(window, "mouseup", J),
          $(e, "touchstart", G, {
            passive: !0,
          }),
          $(e, "touchmove", B, {
            passive: !1,
          }),
          $(e, "touchend", J, {
            passive: !0,
          }),
          $(e, "touchcancel", J, {
            passive: !0,
          }),
          $(window, "wheel", it, {
            passive: !1,
          });
      }
      function at() {
        W.forEach(function (t) {
          t[0].removeEventListener(t[1], t[2], t[3]);
        }),
          (W = []);
      }
      function ut(t) {
        y[t] && y[t](Gt);
      }
      function ct() {
        return y.centered;
      }
      function ft() {
        return void 0 !== i ? i : y.controls;
      }
      function st() {
        return y.loop && o > 1;
      }
      function lt() {
        return y.rtl;
      }
      function dt() {
        return !y.loop && y.rubberband;
      }
      function ht() {
        return !!y.vertical;
      }
      function jh() {
        return !!y.custom;
      }
      function vt() {
        D = window.requestAnimationFrame(mt);
      }
      function pt() {
        D && (window.cancelAnimationFrame(D), (D = null)), (C = null);
      }
      function mt(t) {
        C || (C = t);
        var e = t - C,
          n = bt(e);
        if (e >= V) return Yt(L - Y, !1), H ? H() : void ut("afterChange");
        var r = zt(n);
        if (0 === r || st() || dt() || z) {
          if (0 !== r && dt() && !z) return St();
          (Y += n), Yt(n, !1), vt();
        } else Yt(n - r, !1);
      }
      function bt(t) {
        return L * X(t / V) - Y;
      }
      function gt() {
        switch ((ut("beforeChange"), y.mode)) {
          case "free":
            Mt();
            break;
          case "free-snap":
            Ot();
            break;
          case "snap":
          default:
            wt();
        }
      }
      function wt() {
        yt((1 === l && 0 !== p ? M : v) + Math.sign(p));
      }
      function yt(t, e) {
        var n =
            arguments.length > 2 && void 0 !== arguments[2]
              ? arguments[2]
              : y.duration,
          r = arguments.length > 3 && void 0 !== arguments[3] && arguments[3],
          i = arguments.length > 4 && void 0 !== arguments[4] && arguments[4],
          o = function (t) {
            return 1 + --t * t * t * t * t;
          };
        jt(Ft((t = qt(t, r, i))), n, o, e);
      }
      function Mt() {
        if (0 === b) return !(!zt(0) || st()) && yt(v);
        var t = y.friction / Math.pow(Math.abs(b), -0.5);
        jt(
          (Math.pow(b, 2) / t) * Math.sign(b),
          6 * Math.abs(b / t),
          function (t) {
            return 1 - Math.pow(1 - t, 5);
          }
        );
      }
      function Ot() {
        if (0 === b) return yt(v);
        var t = y.friction / Math.pow(Math.abs(b), -0.5),
          e = (Math.pow(b, 2) / t) * Math.sign(b),
          n = 6 * Math.abs(b / t),
          r = (R + e) / (s / l);
        jt(
          (-1 === p ? Math.floor(r) : Math.ceil(r)) * (s / l) - R,
          n,
          function (t) {
            return 1 - Math.pow(1 - t, 5);
          }
        );
      }
      function St() {
        if ((pt(), 0 === b)) return yt(v, !0);
        var t = 0.04 / Math.pow(Math.abs(b), -0.5),
          e = (Math.pow(b, 2) / t) * Math.sign(b),
          n = function (t) {
            return --t * t * t + 1;
          },
          r = b;
        jt(e, 3 * Math.abs(r / t), n, !0, function () {
          jt(Ft(qt(v)), 500, n, !0);
        });
      }
      function jt(t, e, n, r, i) {
        pt(),
          (L = t),
          (Y = 0),
          (V = e),
          (X = n),
          (z = r),
          (H = i),
          (C = null),
          vt();
      }
      function At(n) {
        var r = a(t);
        r.length && ((e = r[0]), Tt(n), ot(), ut("mounted"));
      }
      function xt() {
        var t,
          e = I.breakpoints || [];
        for (var r in e) window.matchMedia(r).matches && (t = r);
        if (t === _) return !0;
        var i = (_ = t) ? e[_] : I;
        i.breakpoints && _ && delete i.breakpoints,
          (y = n(n(n({}, Bt), I), i)),
          (K = !0),
          (h = null),
          ut("optionsChanged"),
          Et();
      }
      function kt(t) {
        if ("function" == typeof t) return t();
        var e = y.autoAdjustSlidesPerView;
        e || (o = Math.max(t, o));
        var n = st() && e ? o - 1 : o;
        return u(t, 1, Math.max(n, 1));
      }
      function Pt() {
        xt(), (N = !0), ut("created");
      }
      function Et(t, e) {
        t && (I = t), e && (_ = null), Ct(), At(e);
      }
      function Tt(t) {
        var n = window.innerWidth;
        if (xt() && (n !== h || t)) {
          h = n;
          var r = y.slides;
          "number" == typeof r
            ? ((f = null), (o = r))
            : ((f = a(r, e)), (o = f ? f.length : 0));
          var i = y.dragSpeed;
          (k =
            "function" == typeof i
              ? i
              : function (t) {
                  return t * i;
                }),
            (s = ht() ? e.offsetHeight : e.offsetWidth),
            (l = kt(y.slidesPerView)),
            (d = u(y.spacing, 0, s / (l - 1) - 1)),
            (s += d),
            (c = ct() ? (s / 2 - s / l / 2) / s : 0),
            Vt();
          var p = !N || (K && y.resetSlide) ? y.initial : v;
          $t(st() ? p : Ht(p)), ht() && e.setAttribute(F, !0), (K = !1);
        }
      }
      function Dt(t) {
        Tt(), setTimeout(Tt, 500), setTimeout(Tt, 2e3);
      }
      function Ct() {
        at(),
          Xt(),
          e && e.hasAttribute(F) && e.removeAttribute(F),
          ut("destroyed");
      }
      function Lt() {
        f &&
          f.forEach(function (t, e) {
            var n =
                g[e].distance * s -
                (lt() ? -e : e) * (s / l - d / l - (d / l) * (l - 1)),
              r = ht() ? 0 : n,
              i = ht() ? n : 0,
              o = "translate3d(".concat(r, "px, ").concat(i, "px, 0)");
            jh() ? 0 : (t.style.transform = o),
              jh() ? 0 : (t.style["-webkit-transform"] = o);
          });
      }
      function Vt() {
        f &&
          f.forEach(function (t) {
            var e = "calc("
              .concat(100 / l, "% - ")
              .concat((d / l) * (l - 1), "px)");
            ht()
              ? ((t.style["min-height"] = e), (t.style["max-height"] = e))
              : ((t.style["min-width"] = e), (t.style["max-width"] = e));
          });
      }
      function Xt() {
        if (f) {
          var t = ["transform", "-webkit-transform"];
          (t = [].concat(
            r(t),
            ht ? ["min-height", "max-height"] : ["min-width", "max-width"]
          )),
            f.forEach(function (e) {
              t.forEach(function (t) {
                e.style.removeProperty(t);
              });
            });
        }
      }
      function Yt(t) {
        var e =
            !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1],
          n =
            arguments.length > 2 && void 0 !== arguments[2]
              ? arguments[2]
              : Date.now();
        _t(t, n), e && (t = Rt(t)), (R += t), Nt();
      }
      function zt(t) {
        var e = (s * (o - 1 * (ct() ? 1 : l))) / l,
          n = R + t;
        return n > e ? n - e : n < 0 ? n : 0;
      }
      function Ht(t) {
        return u(t, 0, o - 1 - (ct() ? 0 : l - 1));
      }
      function It() {
        var t = Math.abs(w),
          e = R < 0 ? 1 - t : t;
        return {
          direction: p,
          progressTrack: e,
          progressSlides: (e * o) / (o - 1),
          positions: g,
          position: R,
          speed: b,
          relativeSlide: ((v % o) + o) % o,
          absoluteSlide: v,
          size: o,
          slidesPerView: l,
          widthOrHeight: s,
        };
      }
      function qt(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
          n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
        return st() ? (e ? Wt(t, n) : t) : Ht(t);
      }
      function Ft(t) {
        return -((-s / l) * t + R);
      }
      function Wt(t, e) {
        var n = ((v % o) + o) % o,
          r = n < (t = ((t % o) + o) % o) ? -n - o + t : -(n - t),
          i = n > t ? o - n + t : t - n,
          a = e ? (Math.abs(r) <= i ? r : i) : t < n ? r : i;
        return v + a;
      }
      function _t(t, e) {
        clearTimeout(m);
        var n = Math.sign(t);
        if (
          (n !== p && Kt(),
          (p = n),
          U.push({
            distance: t,
            time: e,
          }),
          (m = setTimeout(function () {
            (U = []), (b = 0);
          }, 50)),
          (U = U.slice(-6)).length <= 1 || 0 === p)
        )
          return (b = 0);
        var r = U.slice(0, -1).reduce(function (t, e) {
            return t + e.distance;
          }, 0),
          i = U[U.length - 1].time,
          o = U[0].time;
        b = u(r / (i - o), -10, 10);
      }
      function Kt() {
        U = [];
      }
      function Nt() {
        (w = st() ? (R % ((s * o) / l)) / ((s * o) / l) : R / ((s * o) / l)),
          Ut();
        for (var t = [], e = 0; e < o; e++) {
          var n = (((1 / o) * e - (w < 0 && st() ? w + 1 : w)) * o) / l + c;
          st() && (n += n > (o - 1) / l ? -o / l : n < -o / l + 1 ? o / l : 0);
          var r = 1 / l,
            i = n + r,
            a = i < r ? i / r : i > 1 ? 1 - ((i - 1) * l) / 1 : 1;
          t.push({
            portion: a < 0 || a > 1 ? 0 : a,
            distance: lt() ? -1 * n + 1 - r : n,
          });
        }
        (g = t), Lt(), ut("move");
      }
      function Rt(t) {
        if (st()) return t;
        var e = zt(t);
        if (!dt()) return t - e;
        if (0 === e) return t;
        var n;
        return t * ((n = e / s), (1 - Math.abs(n)) * (1 - Math.abs(n)));
      }
      function Ut() {
        var t = Math.round(R / (s / l));
        t !== v &&
          ((!st() && (t < 0 || t > o - 1)) || ((v = t), ut("slideChanged")));
      }
      function $t(t) {
        ut("beforeChange"), Yt(Ft(t), !1), ut("afterChange");
      }

      var interval = 0;
      var nextTab = true;
      var Bt = {
          autoAdjustSlidesPerView: !0,
          centered: !1,
          breakpoints: null,
          controls: !0,
          dragSpeed: 1,
          friction: 0.0025,
          loop: !1,
          initial: 0,
          duration: 500,
          preventEvent: "data-keen-slider-pe",
          slides: ".keen-slider__slide",
          vertical: !1,
          custom: !1,
          resetSlide: !1,
          slidesPerView: 1,
          spacing: 0,
          mode: "snap",
          rtl:
            document.querySelector("html").getAttribute("dir") == "rtl"
              ? !0
              : !1,
          rubberband: !0,
          cancelOnLeave: !0,
          autoplaySpeed: 3000,
          prevArrow:
            '<button class="slick-prev" aria-label="Previous" type="button"><span class="visually-hidden">Previous</span></button>',
          nextArrow:
            '<button class="slick-next" aria-label="Next" type="button"><span class="visually-hidden">Next</span></button>',
        },
        Gt = {
          controls: function (t) {
            i = t;
          },
          destroy: Ct,
          refresh: function (t) {
            Et(t, !0);
          },
          next: function () {
            yt(v + 1, !0);
          },
          prev: function () {
            yt(v - 1, !0);
          },
          moveToSlide: function (t, e) {
            yt(t, !0, e);
          },
          moveToSlideRelative: function (t) {
            var e =
                arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
              n = arguments.length > 2 ? arguments[2] : void 0;
            yt(t, !0, n, !0, e);
          },
          resize: function () {
            Tt(!0);
          },
          details: function () {
            return It();
          },
          options: function () {
            var t = n({}, y);
            return delete t.breakpoints, t;
          },
          settings: function (_this, instance) {
            if (window.NodeList && !NodeList.prototype.forEach) {
              NodeList.prototype.forEach = Array.prototype.forEach;
            }

            var keenSliderWrap = _this.querySelector(".keen-slider-wrap");
            keenSliderWrap.classList.add("active");
            keenSliderWrap.classList.add("slick-initialized");
            keenSliderWrap.classList.add("slick-slider");

            /* arrow */
            if (instance.options().arrows) {
              keenSliderBuildArrows(_this, instance.options());
              _this
                .querySelector(".slick-prev")
                .addEventListener("click", function () {
                  clearInterval(interval);
                  instance.prev();
                  !(
                    _this
                      .querySelector(".slide-pause")
                      .className.indexOf("play") > -1
                  ) && instance.autoplay(true, instance);
                });
              _this
                .querySelector(".slick-next")
                .addEventListener("click", function () {
                  clearInterval(interval);
                  instance.next();
                  !(
                    _this
                      .querySelector(".slide-pause")
                      .className.indexOf("play") > -1
                  ) && instance.autoplay(true, instance);
                });
            }
            /*// arrow*/

            if (instance.options().dots) {
              /* dot */
              var dots_wrapper = _this.querySelector(".keen-slider-dot-wrap");
              if (!!instance.options().appendDots) {
                dots_wrapper = instance.options().appendDots;
              }
              var slides = _this.querySelectorAll(".keen-slider__slide");
              var dots_ul = document.createElement("ul");
              var totalCnt = instance.details().size;

              dots_ul.classList.add("slick-dots");
              slides.forEach(function (t, idx) {
                t.classList.remove("hide");
                t.setAttribute(
                  "id",
                  _this.querySelector(".keen-slider").getAttribute("id") +
                    "-" +
                    idx
                );
                t.setAttribute("data-slick-index", idx);
                var dots_li = document.createElement("li");
                var dot = document.createElement("button");
                dots_ul.appendChild(dots_li);
                dots_li.appendChild(dot);
                dot.classList.add("dot");
                dot.type = "button";
                dot.setAttribute("role", "tab");
                dot.setAttribute(
                  "aria-describedby",
                  _this.querySelector(".keen-slider").getAttribute("id") +
                    "-" +
                    idx
                );
                dot.setAttribute(
                  "aria-controls",
                  _this.querySelector(".keen-slider").getAttribute("id") +
                    "-" +
                    idx
                );
                var dotsText = idx + 1 + " of " + totalCnt;
                if (keenSliderWrap.dataset.waMsg != undefined) {
                  dotsText = keenSliderWrap.dataset.waMsg.replace(
                    "#1",
                    idx + 1 + " of " + totalCnt
                  );
                }
                dot.textContent = dotsText;
                dots_wrapper.appendChild(dots_ul);
                dot.addEventListener("click", function () {
                  instance.moveToSlide(idx);
                });
              });
              /*// dot */

              /* play/pause button */
              _this.querySelector(".slide-pause").classList.add("active");
              /*_this.querySelector('.slide-pause').addEventListener('click', function(e){
						e.preventDefault();
						if (this.classList.contains('pause')) {
							this.classList.remove('pause');
							this.classList.add('play');
							this.innerText  = this.dataset.titlePlay;
							instance.autoplay(false, instance);
						} else {
							this.classList.remove('play');
							this.classList.add('pause');
							this.innerText = this.dataset.titleStop;
							instance.autoplay(true, instance);
						}
					});	*/
              /*// play/pause button */
            } else {
              var slides = _this.querySelectorAll(".keen-slider__slide");

              slides.forEach(function (t, idx) {
                t.classList.remove("hide");
                t.setAttribute(
                  "id",
                  _this.querySelector(".keen-slider").getAttribute("id") +
                    "-" +
                    idx
                );
              });
            }

            if (instance.options().autoplay) {
              instance.autoplay(true, instance);
            }

            instance.updateClasses(_this, instance);
          },
          updateClasses: function (_this, instance) {
            if (window.NodeList && !NodeList.prototype.forEach) {
              NodeList.prototype.forEach = Array.prototype.forEach;
            }

            var slide = instance.details().relativeSlide;
            /* arrow */
            if (instance.options().arrows && !instance.options().loop) {
              var arrowLeft = _this.querySelector(".slick-prev");
              var arrowRight = _this.querySelector(".slick-next");
              if (!!_this.querySelector(".slick-prev")) {
                slide === 0
                  ? arrowLeft.classList.add("slick-disabled")
                  : arrowLeft.classList.remove("slick-disabled");
                slide === instance.details().size - 1
                  ? arrowRight.classList.add("slick-disabled")
                  : arrowRight.classList.remove("slick-disabled");
              }
            }
            /*// arrow */

            /* slide */
            var slideContents = _this.querySelectorAll(".carousel-box");
            slideContents.forEach(function (slider, idx) {
              if (idx === slide) {
                slider.setAttribute("tabindex", "0");
                slider.classList.add("slick-current");
                slider
                  .querySelectorAll("a, button")
                  .forEach(function (btn, idx) {
                    btn.setAttribute("tabindex", 0);
                  });
              } else {
                slider.setAttribute("tabindex", "-1");
                slider.classList.remove("slick-current");
                slider
                  .querySelectorAll("a, button")
                  .forEach(function (btn, idx) {
                    btn.setAttribute("tabindex", -1);
                  });
              }
            });
            /*// slide */

            /* dot */
            if (instance.options().dots) {
              var dots = _this.querySelectorAll(".dot");
              dots.forEach(function (dot, idx) {
                if (idx === slide) {
                  dot.parentElement.classList.add("slick-active");
                  dot.setAttribute("aria-selected", true);
                } else {
                  dot.parentElement.classList.remove("slick-active");
                  dot.setAttribute("aria-selected", false);
                }
              });
            }
            /*// dot */
          },
          autoplay: function (run, instance, _this) {
            clearInterval(interval);
            interval = setInterval(function () {
              if (run && instance) {
                if (!instance.options().loop) {
                  if (
                    instance.details().relativeSlide ==
                    instance.details().size - 1
                  ) {
                    nextTab = false;
                  } else if (instance.details().relativeSlide == 0) {
                    nextTab = true;
                  }
                }
                nextTab ? instance.next() : instance.prev();
              }
            }, instance.options().autoplaySpeed);
          },
        };
      return Pt(), Gt;
    }
  );
});
//# sourceMappingURL=keen-slider.js.map

function keenSliderBuildArrows(_this, options) {
  var sliderWrap = $(_this).find(".keen-slider-wrap");
  sliderWrap.prepend(options.prevArrow).append(options.nextArrow);
  sliderWrap.find(".slick-next").addClass("slick-arrow");
  sliderWrap.find(".slick-prev").addClass("slick-arrow");
}
/* LGEITF-520 End */

/* Chosen v1.8.7 | (c) 2011-2018 by Harvest | MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md */
/* The-j customize Scripts */
/* Last Modified Date : 2019-07-17 */

(function () {
  var $,
    AbstractChosen,
    Chosen,
    SelectParser,
    bind = function (fn, me) {
      return function () {
        return fn.apply(me, arguments);
      };
    },
    extend = function (child, parent) {
      for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    },
    hasProp = {}.hasOwnProperty;

  SelectParser = (function () {
    function SelectParser() {
      this.options_index = 0;
      this.parsed = [];
    }

    SelectParser.prototype.add_node = function (child) {
      if (child.nodeName.toUpperCase() === "OPTGROUP") {
        return this.add_group(child);
      } else {
        return this.add_option(child);
      }
    };

    SelectParser.prototype.add_group = function (group) {
      var group_position, i, len, option, ref, results1;
      group_position = this.parsed.length;
      this.parsed.push({
        array_index: group_position,
        group: true,
        label: group.label,
        title: group.title ? group.title : void 0,
        children: 0,
        disabled: group.disabled,
        classes: group.className,
      });
      ref = group.childNodes;
      results1 = [];
      for (i = 0, len = ref.length; i < len; i++) {
        option = ref[i];
        results1.push(this.add_option(option, group_position, group.disabled));
      }
      return results1;
    };

    SelectParser.prototype.add_option = function (
      option,
      group_position,
      group_disabled
    ) {
      if (option.nodeName.toUpperCase() === "OPTION") {
        if (option.text !== "") {
          if (group_position != null) {
            this.parsed[group_position].children += 1;
          }
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            value: option.value,
            text: option.text,
            html: option.innerHTML,
            title: option.title ? option.title : void 0,
            selected: option.selected,
            disabled:
              group_disabled === true ? group_disabled : option.disabled,
            group_array_index: group_position,
            group_label:
              group_position != null ? this.parsed[group_position].label : null,
            classes: option.className,
            style: option.style.cssText,
          });
        } else {
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            empty: true,
          });
        }
        return (this.options_index += 1);
      }
    };

    return SelectParser;
  })();

  SelectParser.select_to_array = function (select) {
    var child, i, len, parser, ref;
    parser = new SelectParser();
    ref = select.childNodes;
    for (i = 0, len = ref.length; i < len; i++) {
      child = ref[i];
      parser.add_node(child);
    }
    return parser.parsed;
  };

  AbstractChosen = (function () {
    function AbstractChosen(form_field, options1) {
      this.form_field = form_field;
      this.options = options1 != null ? options1 : {};
      this.label_click_handler = bind(this.label_click_handler, this);
      /* 20200904 LGEBR-177 search text for mobile  */
      // if (!AbstractChosen.browser_is_supported()) {
      //   return;
      // }
      /* // 20200904 LGEBR-177 search text for mobile  */
      this.is_multiple = this.form_field.multiple;
      this.set_default_text();
      this.set_default_values();
      this.setup();
      this.set_up_html();
      this.register_observers();
      this.on_ready();
    }

    AbstractChosen.prototype.set_default_values = function () {
      this.click_test_action = (function (_this) {
        return function (evt) {
          return _this.test_active_click(evt);
        };
      })(this);
      this.activate_action = (function (_this) {
        return function (evt) {
          return _this.activate_field(evt);
        };
      })(this);
      this.active_field = false;
      this.mouse_on_container = false;
      this.results_showing = false;
      this.result_highlighted = null;
      this.is_rtl =
        this.options.rtl || /\bchosen-rtl\b/.test(this.form_field.className);
      this.allow_single_deselect =
        this.options.allow_single_deselect != null &&
        this.form_field.options[0] != null &&
        this.form_field.options[0].text === ""
          ? this.options.allow_single_deselect
          : false;
      this.disable_search_threshold =
        this.options.disable_search_threshold || 0;
      this.disable_search = this.options.disable_search || false;
      this.enable_split_word_search =
        this.options.enable_split_word_search != null
          ? this.options.enable_split_word_search
          : true;
      this.group_search =
        this.options.group_search != null ? this.options.group_search : true;
      this.search_contains = this.options.search_contains || false;
      this.single_backstroke_delete =
        this.options.single_backstroke_delete != null
          ? this.options.single_backstroke_delete
          : true;
      this.max_selected_options = this.options.max_selected_options || Infinity;
      this.inherit_select_classes =
        this.options.inherit_select_classes || false;
      this.display_selected_options =
        this.options.display_selected_options != null
          ? this.options.display_selected_options
          : true;
      this.display_disabled_options =
        this.options.display_disabled_options != null
          ? this.options.display_disabled_options
          : true;
      this.include_group_label_in_selected =
        this.options.include_group_label_in_selected || false;
      this.max_shown_results =
        this.options.max_shown_results || Number.POSITIVE_INFINITY;
      this.case_sensitive_search = this.options.case_sensitive_search || false;
      this.button_markup = this.options.button_markup || "<b></b>";
      return (this.hide_results_on_select =
        this.options.hide_results_on_select != null
          ? this.options.hide_results_on_select
          : true);
    };

    AbstractChosen.prototype.set_default_text = function () {
      if (this.form_field.getAttribute("data-placeholder")) {
        this.default_text = this.form_field.getAttribute("data-placeholder");
      } else if (this.is_multiple) {
        this.default_text =
          this.options.placeholder_text_multiple ||
          this.options.placeholder_text ||
          AbstractChosen.default_multiple_text;
      } else {
        this.default_text =
          this.options.placeholder_text_single ||
          this.options.placeholder_text ||
          AbstractChosen.default_single_text;
      }
      this.default_text = this.escape_html(this.default_text);
      return (this.results_none_found =
        this.form_field.getAttribute("data-no_results_text") ||
        this.options.no_results_text ||
        AbstractChosen.default_no_result_text);
    };

    AbstractChosen.prototype.choice_label = function (item) {
      if (this.include_group_label_in_selected && item.group_label != null) {
        return (
          "<b class='group-name'>" +
          this.escape_html(item.group_label) +
          "</b>" +
          item.html
        );
      } else {
        return item.html;
      }
    };

    AbstractChosen.prototype.mouse_enter = function () {
      // theJ
      return (this.mouse_on_container = true);
    };

    AbstractChosen.prototype.mouse_leave = function () {
      // theJ
      return (this.mouse_on_container = false);
    };

    AbstractChosen.prototype.input_focus = function (evt) {
      // add focus_on_container - theJ
      this.focus_on_container = true;

      // add 'if' - theJ
      if (
        $(".chosen-container.chosen-container-active.chosen-with-drop").not(
          this.container
        ).length > 0
      ) {
        $(".chosen-container.chosen-container-active.chosen-with-drop")
          .not(this.container)
          .removeClass("chosen-with-drop chosen-container-active");
      }
      if (this.is_multiple) {
        if (!this.active_field) {
          return setTimeout(
            (function (_this) {
              return function () {
                return _this.container_mousedown();
              };
            })(this),
            50
          );
        }
      } else {
        if (!this.active_field) {
          return this.activate_field();
        }
      }
    };

    AbstractChosen.prototype.input_blur = function (evt) {
      // 2019-07-17 theJ
      //if (!this.mouse_on_container) {
      if (
        !this.container.hasClass("chosen-with-drop") &&
        this.focus_on_container
      ) {
        // if open (original code)
        this.active_field = false;
        return setTimeout(
          (function (_this) {
            return function () {
              // add focus_on_container - theJ
              this.focus_on_container = false;
              return _this.blur_test();
            };
          })(this),
          100
        );
      }
    };

    AbstractChosen.prototype.label_click_handler = function (evt) {
      if (this.is_multiple) {
        return this.container_mousedown(evt);
      } else {
        return this.activate_field();
      }
    };

    AbstractChosen.prototype.results_option_build = function (options) {
      var content, data, data_content, i, len, ref, shown_results;
      content = "";
      shown_results = 0;
      ref = this.results_data;
      for (i = 0, len = ref.length; i < len; i++) {
        data = ref[i];
        data_content = "";
        if (data.group) {
          data_content = this.result_add_group(data);
        } else {
          data_content = this.result_add_option(data);
        }
        if (data_content !== "") {
          shown_results++;
          content += data_content;
        }
        if (options != null ? options.first : void 0) {
          if (data.selected && this.is_multiple) {
            this.choice_build(data);
          } else if (data.selected && !this.is_multiple) {
            this.single_set_selected_text(this.choice_label(data));
          }
        }
        if (shown_results >= this.max_shown_results) {
          break;
        }
      }
      return content;
    };

    AbstractChosen.prototype.result_add_option = function (option) {
      var classes, option_el;
      if (!option.search_match) {
        return "";
      }
      if (!this.include_option_in_results(option)) {
        return "";
      }
      classes = [];
      if (!option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("active-result");
      }
      if (option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("disabled-result");
      }
      if (option.selected) {
        classes.push("result-selected");
      }
      if (option.group_array_index != null) {
        classes.push("group-option");
      }
      if (option.classes !== "") {
        classes.push(option.classes);
      }
      option_el = document.createElement("li");
      option_el.className = classes.join(" ");
      option_el.setAttribute("role", "option");
      if (option.style) {
        option_el.style.cssText = option.style;
      }
      // add - theJ
      if (option.selected) {
        option_el.setAttribute("aria-selected", true);
      } else {
        option_el.setAttribute("aria-selected", false);
      }
      option_el.setAttribute("data-option-array-index", option.array_index);
      option_el.innerHTML = option.highlighted_html || option.html;
      // add - theJ
      option_el.setAttribute("tabindex", "0");
      if (option.title) {
        option_el.title = option.title;
      }
      return this.outerHTML(option_el);
    };

    AbstractChosen.prototype.result_add_group = function (group) {
      var classes, group_el;
      if (!(group.search_match || group.group_match)) {
        return "";
      }
      if (!(group.active_options > 0)) {
        return "";
      }
      classes = [];
      classes.push("group-result");
      if (group.classes) {
        classes.push(group.classes);
      }
      group_el = document.createElement("li");
      group_el.className = classes.join(" ");
      group_el.innerHTML =
        group.highlighted_html || this.escape_html(group.label);
      if (group.title) {
        group_el.title = group.title;
      }
      return this.outerHTML(group_el);
    };

    AbstractChosen.prototype.results_update_field = function () {
      this.set_default_text();
      if (!this.is_multiple) {
        this.results_reset_cleanup();
      }
      this.result_clear_highlight();
      this.results_build();
      if (this.results_showing) {
        return this.winnow_results();
      }
    };

    AbstractChosen.prototype.reset_single_select_options = function () {
      var i, len, ref, result, results1;
      ref = this.results_data;
      results1 = [];
      for (i = 0, len = ref.length; i < len; i++) {
        result = ref[i];
        if (result.selected) {
          results1.push((result.selected = false));
        } else {
          results1.push(void 0);
        }
      }
      return results1;
    };

    AbstractChosen.prototype.results_toggle = function () {
      if (this.results_showing) {
        return this.results_hide();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.results_search = function (evt) {
      if (this.results_showing) {
        return this.winnow_results();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.winnow_results = function (options) {
      var escapedQuery,
        fix,
        i,
        len,
        option,
        prefix,
        query,
        ref,
        regex,
        results,
        results_group,
        search_match,
        startpos,
        suffix,
        text;
      this.no_results_clear();
      results = 0;
      query = this.get_search_text();
      escapedQuery = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      regex = this.get_search_regex(escapedQuery);
      ref = this.results_data;
      for (i = 0, len = ref.length; i < len; i++) {
        option = ref[i];
        option.search_match = false;
        results_group = null;
        search_match = null;
        option.highlighted_html = "";
        if (this.include_option_in_results(option)) {
          if (option.group) {
            option.group_match = false;
            option.active_options = 0;
          }
          if (
            option.group_array_index != null &&
            this.results_data[option.group_array_index]
          ) {
            results_group = this.results_data[option.group_array_index];
            if (
              results_group.active_options === 0 &&
              results_group.search_match
            ) {
              results += 1;
            }
            results_group.active_options += 1;
          }
          text = option.group ? option.label : option.text;
          if (!(option.group && !this.group_search)) {
            search_match = this.search_string_match(text, regex);
            option.search_match = search_match != null;
            if (option.search_match && !option.group) {
              results += 1;
            }
            if (option.search_match) {
              if (query.length) {
                startpos = search_match.index;
                prefix = text.slice(0, startpos);
                fix = text.slice(startpos, startpos + query.length);
                suffix = text.slice(startpos + query.length);
                option.highlighted_html =
                  this.escape_html(prefix) +
                  "<em>" +
                  this.escape_html(fix) +
                  "</em>" +
                  this.escape_html(suffix);
              }
              if (results_group != null) {
                results_group.group_match = true;
              }
            } else if (
              option.group_array_index != null &&
              this.results_data[option.group_array_index].search_match
            ) {
              option.search_match = true;
            }
          }
        }
      }
      this.result_clear_highlight();
      if (results < 1 && query.length) {
        this.update_results_content("");
        return this.no_results(query);
      } else {
        this.update_results_content(this.results_option_build());
        if (!(options != null ? options.skip_highlight : void 0)) {
          return this.winnow_results_set_highlight();
        }
      }
    };

    AbstractChosen.prototype.get_search_regex = function (
      escaped_search_string
    ) {
      var regex_flag, regex_string;
      regex_string = this.search_contains
        ? escaped_search_string
        : "(^|\\s|\\b)" + escaped_search_string + "[^\\s]*";
      if (!(this.enable_split_word_search || this.search_contains)) {
        regex_string = "^" + regex_string;
      }
      regex_flag = this.case_sensitive_search ? "" : "i";
      return new RegExp(regex_string, regex_flag);
    };

    AbstractChosen.prototype.search_string_match = function (
      search_string,
      regex
    ) {
      var match;
      match = regex.exec(search_string);
      if (!this.search_contains && (match != null ? match[1] : void 0)) {
        match.index += 1;
      }
      return match;
    };

    AbstractChosen.prototype.choices_count = function () {
      var i, len, option, ref;
      if (this.selected_option_count != null) {
        return this.selected_option_count;
      }
      this.selected_option_count = 0;
      ref = this.form_field.options;
      for (i = 0, len = ref.length; i < len; i++) {
        option = ref[i];
        if (option.selected) {
          this.selected_option_count += 1;
        }
      }
      return this.selected_option_count;
    };

    AbstractChosen.prototype.choices_click = function (evt) {
      evt.preventDefault();
      this.activate_field();
      if (!(this.results_showing || this.is_disabled)) {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.keydown_checker = function (evt) {
      var ref, stroke;
      stroke = (ref = evt.which) != null ? ref : evt.keyCode;
      this.search_field_scale();
      if (stroke !== 8 && this.pending_backstroke) {
        this.clear_backstroke();
      }
      switch (stroke) {
        case 8: // backspace
          this.backstroke_length = this.get_search_field_value().length;
          break;
        // delete - theJ
        /*
				case 9: // tab
					if (this.results_showing && !this.is_multiple) {
						this.result_select(evt);
					}
					this.mouse_on_container = false;
					break;
				*/
        case 9:
          break;
        case 13: // enter
          if (this.results_showing) {
            evt.preventDefault();
            this.result_select(evt); // add - theJ
          } else {
            // add 'else' - theJ
            evt.preventDefault();
            this.keydown_arrow();
          }
          break;
        case 27: // ESC
          if (this.results_showing) {
            evt.preventDefault();
            // add theJ
            this.close_field(evt);
          }
          break;
        case 32: // space
          if (this.disable_search) {
            evt.preventDefault();
          }
          break;
        case 38: // up
          evt.preventDefault();
          this.keyup_arrow();
          break;
        case 40: // down
          evt.preventDefault();
          this.keydown_arrow();
          break;
      }
    };

    AbstractChosen.prototype.keyup_checker = function (evt) {
      var ref, stroke;
      stroke = (ref = evt.which) != null ? ref : evt.keyCode;
      this.search_field_scale();
      switch (stroke) {
        case 8:
          if (
            this.is_multiple &&
            this.backstroke_length < 1 &&
            this.choices_count() > 0
          ) {
            this.keydown_backstroke();
          } else if (!this.pending_backstroke) {
            this.result_clear_highlight();
            this.results_search();
          }
          break;
        case 13:
          evt.preventDefault();
          // remove - theJ
          //if (this.results_showing) {
          //  this.result_select(evt);
          //}
          break;
        case 27:
          if (this.results_showing) {
            this.results_hide();
          }
          break;
        case 9:
        case 16:
        case 17:
        case 18:
        case 38:
          break;
        case 40:
          break;
        case 91:
          break;
        default:
          this.results_search();
          break;
      }
    };

    AbstractChosen.prototype.clipboard_event_checker = function (evt) {
      if (this.is_disabled) {
        return;
      }
      return setTimeout(
        (function (_this) {
          return function () {
            return _this.results_search();
          };
        })(this),
        50
      );
    };

    AbstractChosen.prototype.container_width = function () {
      if (this.options.width != null) {
        return this.options.width;
      } else {
        return this.form_field.offsetWidth + "px";
      }
    };

    AbstractChosen.prototype.include_option_in_results = function (option) {
      if (
        this.is_multiple &&
        !this.display_selected_options &&
        option.selected
      ) {
        return false;
      }
      if (!this.display_disabled_options && option.disabled) {
        return false;
      }
      if (option.empty) {
        return false;
      }
      return true;
    };

    AbstractChosen.prototype.search_results_touchstart = function (evt) {
      this.touch_started = true;
      return this.search_results_mouseover(evt);
    };

    AbstractChosen.prototype.search_results_touchmove = function (evt) {
      this.touch_started = false;
      return this.search_results_mouseout(evt);
    };

    AbstractChosen.prototype.search_results_touchend = function (evt) {
      if (this.touch_started) {
        return this.search_results_mouseup(evt);
      }
    };

    AbstractChosen.prototype.outerHTML = function (element) {
      var tmp;
      if (element.outerHTML) {
        return element.outerHTML;
      }
      tmp = document.createElement("div");
      tmp.appendChild(element);
      return tmp.innerHTML;
    };

    AbstractChosen.prototype.get_single_html = function () {
      // add title on input - theJ
      var title = this.form_field.title
        ? this.form_field.title
        : this.form_field.getAttribute("data-placeholder") ||
          this.form_field.getAttribute("placeholder");
      // 20200316 START 박지영 : combobox에 aria-expanded, aria-owns 속성 추가, listbox에 id 속성 추가 (aria 오류 방지)
      var id = this.form_field.id + "_listbox";
      return (
        '<a class="chosen-single chosen-default">\n  <span>' +
        this.default_text +
        "</span>\n  <div>" +
        this.button_markup +
        '</div>\n</a>\n<div class="chosen-search">\n    <input class="chosen-search-input" role="combobox" aria-expanded="false" aria-owns="' +
        id +
        '" type="text" autocomplete="off" title="' +
        title +
        '" />\n  </div>\n<div class="chosen-drop">\n    <ul class="chosen-results" role="listbox" id="' +
        id +
        '"></ul>\n</div>'
      );
      // 20200316 END
    };

    AbstractChosen.prototype.get_multi_html = function () {
      // add title on input - theJ
      var title2 = this.form_field.title
        ? this.form_field.title
        : this.form_field.getAttribute("data-placeholder") ||
          this.form_field.getAttribute("placeholder");
      // 20200316 START 박지영 : combobox에 aria-expanded, aria-owns 속성 추가, listbox에 id 속성 추가 (aria 오류 방지)
      var id2 = this.form_field.id + "_listbox";
      return (
        '<ul class="chosen-choices">\n  <li class="search-field">\n    <input class="chosen-search-input" role="combobox" aria-expanded="false" aria-owns="' +
        id2 +
        '" type="text" autocomplete="off" value="' +
        this.default_text +
        '" title="' +
        title2 +
        '" />\n  </li>\n</ul>\n<div class="chosen-drop">\n  <ul class="chosen-results" role="listbox" id="' +
        id2 +
        '"></ul>\n</div>'
      );
      // 20200316 END
    };

    AbstractChosen.prototype.get_no_results_html = function (terms) {
      // LGEIS-554 Start
      if (this.form_field.getAttribute("data-qr-reveiw") == "Y") {
        var nvlMsgCode = this.results_none_found;
        var set_no_result_text =
          nvlMsgCode == "component-qrReview-predictive-noResult"
            ? "The model code you enter is not on this page.<br>Please check again or you can find model below."
            : nvlMsgCode;

        return '<li class="no-results">\n  ' + set_no_result_text + "\n</li>";
      } else {
        return '<li class="no-results">\n  ' + this.results_none_found;
        +" <span>" + this.escape_html(terms) + "</span>\n</li>";
      }
      // LGEIS-554 End
    };

    AbstractChosen.browser_is_supported = function () {
      if ("Microsoft Internet Explorer" === window.navigator.appName) {
        return document.documentMode >= 8;
      }
      if (
        /iP(od|hone)/i.test(window.navigator.userAgent) ||
        /IEMobile/i.test(window.navigator.userAgent) ||
        /Windows Phone/i.test(window.navigator.userAgent) ||
        /BlackBerry/i.test(window.navigator.userAgent) ||
        /BB10/i.test(window.navigator.userAgent) ||
        /Android.*Mobile/i.test(window.navigator.userAgent)
      ) {
        // theJ - Search Result page 에서는 모바일 기기에서도 chosen 사용함
        if (
          document.querySelectorAll(".search-area-common").length > 0 ||
          ($("html").data("countrycode") == "vn" &&
            $(".mobile-bottom-info #pinCodeList").length > 0)
        ) {
          /*LGCOMVN-289 add*/
          return true;
        } else {
          return false;
        }
      }
      return true;
    };

    AbstractChosen.default_multiple_text = "Select Some Options";

    AbstractChosen.default_single_text = "Select an Option";

    AbstractChosen.default_no_result_text = "No results match";

    return AbstractChosen;
  })();

  $ = jQuery;

  $.fn.extend({
    chosen: function (options) {
      /* 20200904 LGEBR-177 search text for mobile  */
      if (
        AbstractChosen.browser_is_supported() ||
        $(this).parent().is(".chosen-input-searchtext")
      ) {
        return this.each(function (input_field) {
          var $this, chosen;
          $this = $(this);
          chosen = $this.data("chosen");
          if (options === "destroy") {
            if (chosen instanceof Chosen) {
              chosen.destroy();
            }
            return;
          }
          if (!(chosen instanceof Chosen)) {
            $this.data("chosen", new Chosen(this, options));
          }
        });
      } else {
        return this;
      }
      /*// 20200904 LGEBR-177 search text for mobile  */
    },
  });

  Chosen = (function (superClass) {
    extend(Chosen, superClass);

    function Chosen() {
      return Chosen.__super__.constructor.apply(this, arguments);
    }

    Chosen.prototype.setup = function () {
      this.form_field_jq = $(this.form_field);
      return (this.current_selectedIndex = this.form_field.selectedIndex);
    };

    Chosen.prototype.set_up_html = function () {
      var container_classes, container_props;
      container_classes = ["chosen-container"];
      container_classes.push(
        "chosen-container-" + (this.is_multiple ? "multi" : "single")
      );
      if (this.inherit_select_classes && this.form_field.className) {
        container_classes.push(this.form_field.className);
      }
      if (this.is_rtl) {
        container_classes.push("chosen-rtl");
      }
      container_props = {
        // remove title on div - theJ
        class: container_classes.join(" "), //,
        //'title': this.form_field.title
      };
      if (this.form_field.id.length) {
        container_props.id =
          this.form_field.id.replace(/[^\w]/g, "_") + "_chosen";
      }
      this.container = $("<div />", container_props);
      this.container.width(this.container_width());
      if (this.is_multiple) {
        this.container.html(this.get_multi_html());
      } else {
        this.container.html(this.get_single_html());
      }
      this.form_field_jq.hide().after(this.container);
      this.dropdown = this.container.find("div.chosen-drop").first();
      this.search_field = this.container.find("input").first();
      this.search_results = this.container.find("ul.chosen-results").first();
      this.search_field_scale();
      this.search_no_results = this.container.find("li.no-results").first();
      if (this.is_multiple) {
        this.search_choices = this.container.find("ul.chosen-choices").first();
        this.search_container = this.container.find("li.search-field").first();
      } else {
        this.search_container = this.container
          .find("div.chosen-search")
          .first();
        this.selected_item = this.container.find(".chosen-single").first();
      }
      this.results_build();
      this.set_tab_index();
      // 20200316 START 박지영 : 빈 option 추가 (aria 오류 방지)
      this.search_results.html('<li role="option"></li>');
      // 20200316 END
      return this.set_label_behavior();
    };

    Chosen.prototype.on_ready = function () {
      return this.form_field_jq.trigger("chosen:ready", {
        chosen: this,
      });
    };

    Chosen.prototype.register_observers = function () {
      this.container.on(
        "touchstart.chosen",
        (function (_this) {
          return function (evt) {
            _this.container_mousedown(evt);
          };
        })(this)
      );
      this.container.on(
        "touchend.chosen",
        (function (_this) {
          return function (evt) {
            _this.container_mouseup(evt);
          };
        })(this)
      );
      this.container.on(
        "mousedown.chosen",
        (function (_this) {
          return function (evt) {
            _this.container_mousedown(evt);
          };
        })(this)
      );
      this.container.on(
        "mouseup.chosen",
        (function (_this) {
          return function (evt) {
            _this.container_mouseup(evt);
          };
        })(this)
      );
      this.container.on(
        "mouseenter.chosen",
        (function (_this) {
          return function (evt) {
            _this.mouse_enter(evt);
          };
        })(this)
      );
      this.container.on(
        "mouseleave.chosen",
        (function (_this) {
          return function (evt) {
            _this.mouse_leave(evt);
          };
        })(this)
      );
      this.search_results.on(
        "mouseup.chosen",
        (function (_this) {
          return function (evt) {
            _this.search_results_mouseup(evt);
          };
        })(this)
      );
      this.search_results.on(
        "mouseover.chosen",
        (function (_this) {
          return function (evt) {
            _this.search_results_mouseover(evt);
          };
        })(this)
      );
      this.search_results.on(
        "mouseout.chosen",
        (function (_this) {
          return function (evt) {
            _this.search_results_mouseout(evt);
          };
        })(this)
      );
      this.search_results.on(
        "mousewheel.chosen DOMMouseScroll.chosen",
        (function (_this) {
          return function (evt) {
            _this.search_results_mousewheel(evt);
          };
        })(this)
      );
      this.search_results.on(
        "touchstart.chosen",
        (function (_this) {
          return function (evt) {
            _this.search_results_touchstart(evt);
          };
        })(this)
      );
      this.search_results.on(
        "touchmove.chosen",
        (function (_this) {
          return function (evt) {
            _this.search_results_touchmove(evt);
          };
        })(this)
      );
      this.search_results.on(
        "touchend.chosen",
        (function (_this) {
          return function (evt) {
            _this.search_results_touchend(evt);
          };
        })(this)
      );
      this.form_field_jq.on(
        "chosen:updated.chosen",
        (function (_this) {
          return function (evt) {
            _this.results_update_field(evt);
          };
        })(this)
      );
      this.form_field_jq.on(
        "chosen:activate.chosen",
        (function (_this) {
          return function (evt) {
            _this.activate_field(evt);
          };
        })(this)
      );
      this.form_field_jq.on(
        "chosen:open.chosen",
        (function (_this) {
          return function (evt) {
            _this.container_mousedown(evt);
          };
        })(this)
      );
      this.form_field_jq.on(
        "chosen:close.chosen",
        (function (_this) {
          return function (evt) {
            _this.close_field(evt);
          };
        })(this)
      );
      this.search_field.on(
        "blur.chosen",
        (function (_this) {
          return function (evt) {
            _this.input_blur(evt);
          };
        })(this)
      );
      this.search_field.on(
        "keyup.chosen",
        (function (_this) {
          return function (evt) {
            _this.keyup_checker(evt);
          };
        })(this)
      );
      this.search_field.on(
        "keydown.chosen",
        (function (_this) {
          return function (evt) {
            _this.keydown_checker(evt);
          };
        })(this)
      );
      this.search_field.on(
        "focus.chosen",
        (function (_this) {
          return function (evt) {
            _this.input_focus(evt);
          };
        })(this)
      );
      this.search_field.on(
        "cut.chosen",
        (function (_this) {
          return function (evt) {
            _this.clipboard_event_checker(evt);
          };
        })(this)
      );
      this.search_field.on(
        "paste.chosen",
        (function (_this) {
          return function (evt) {
            _this.clipboard_event_checker(evt);
          };
        })(this)
      );

      if (this.is_multiple) {
        return this.search_choices.on(
          "click.chosen",
          (function (_this) {
            return function (evt) {
              _this.choices_click(evt);
            };
          })(this)
        );
      } else {
        return this.container.on("click.chosen", function (evt) {
          evt.preventDefault();
        });
      }
    };

    Chosen.prototype.destroy = function () {
      $(this.container[0].ownerDocument).off(
        "click.chosen",
        this.click_test_action
      );
      if (this.form_field_label.length > 0) {
        this.form_field_label.off("click.chosen");
      }
      if (this.search_field[0].tabIndex) {
        this.form_field_jq[0].tabIndex = this.search_field[0].tabIndex;
      }
      this.container.remove();
      this.form_field_jq.removeData("chosen");
      return this.form_field_jq.show();
    };

    Chosen.prototype.search_field_disabled = function () {
      this.is_disabled =
        this.form_field.disabled ||
        this.form_field_jq.parents("fieldset").is(":disabled");
      this.container.toggleClass("chosen-disabled", this.is_disabled);
      this.search_field[0].disabled = this.is_disabled;
      if (!this.is_multiple) {
        this.selected_item.off("focus.chosen", this.activate_field);
      }
      if (this.is_disabled) {
        return this.close_field();
      } else if (!this.is_multiple) {
        return this.selected_item.on("focus.chosen", this.activate_field);
      }
    };

    Chosen.prototype.container_mousedown = function (evt) {
      var ref;
      if (this.is_disabled) {
        return;
      }
      if (
        evt &&
        ((ref = evt.type) === "mousedown" || ref === "touchstart") &&
        !this.results_showing
      ) {
        evt.preventDefault();
      }
      if (!(evt != null && $(evt.target).hasClass("search-choice-close"))) {
        if (!this.active_field) {
          if (this.is_multiple) {
            this.search_field.val("");
          }
          $(this.container[0].ownerDocument).on(
            "click.chosen",
            this.click_test_action
          );
          this.results_show();
        } else if (
          !this.is_multiple &&
          evt &&
          ($(evt.target)[0] === this.selected_item[0] ||
            $(evt.target).parents("a.chosen-single").length)
        ) {
          evt.preventDefault();
          this.results_toggle();
        }
        return this.activate_field();
      }
    };

    Chosen.prototype.container_mouseup = function (evt) {
      if (evt.target.nodeName === "ABBR" && !this.is_disabled) {
        return this.results_reset(evt);
      }
    };

    Chosen.prototype.search_results_mousewheel = function (evt) {
      var delta;
      if (evt.originalEvent) {
        delta =
          evt.originalEvent.deltaY ||
          -evt.originalEvent.wheelDelta ||
          evt.originalEvent.detail;
      }
      if (delta != null) {
        evt.preventDefault();
        if (evt.type === "DOMMouseScroll") {
          delta = delta * 40;
        }
        return this.search_results.scrollTop(
          delta + this.search_results.scrollTop()
        );
      }
    };

    Chosen.prototype.blur_test = function (evt) {
      if (
        !this.active_field &&
        this.container.hasClass("chosen-container-active")
      ) {
        return this.close_field();
      }
    };

    Chosen.prototype.close_field = function () {
      $(this.container[0].ownerDocument).off(
        "click.chosen",
        this.click_test_action
      );
      this.active_field = false;
      this.results_hide();
      this.container.removeClass("chosen-container-active");
      this.clear_backstroke();
      this.show_search_field_default();
      this.search_field_scale();
      return this.search_field.blur();
    };

    Chosen.prototype.activate_field = function () {
      if (this.is_disabled) {
        return;
      }
      this.container.addClass("chosen-container-active");
      this.active_field = true;
      this.search_field.val(this.search_field.val());
      return this.search_field.focus();
    };

    Chosen.prototype.test_active_click = function (evt) {
      var active_container;
      active_container = $(evt.target).closest(".chosen-container");
      if (
        active_container.length &&
        this.container[0] === active_container[0]
      ) {
        return (this.active_field = true);
      } else {
        return this.close_field();
      }
    };

    Chosen.prototype.results_build = function () {
      this.parsing = true;
      this.selected_option_count = null;
      this.results_data = SelectParser.select_to_array(this.form_field);
      if (this.is_multiple) {
        this.search_choices.find("li.search-choice").remove();
      } else {
        this.single_set_selected_text();
        if (
          this.disable_search ||
          this.form_field.options.length <= this.disable_search_threshold
        ) {
          this.search_field[0].readOnly = true;
          this.container.addClass("chosen-container-single-nosearch");
        } else {
          this.search_field[0].readOnly = false;
          this.container.removeClass("chosen-container-single-nosearch");
        }
      }
      this.update_results_content(
        this.results_option_build({
          first: true,
        })
      );
      this.search_field_disabled();
      this.show_search_field_default();
      this.search_field_scale();
      return (this.parsing = false);
    };

    Chosen.prototype.result_do_highlight = function (el) {
      var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
      if (el.length) {
        this.result_clear_highlight();
        this.result_highlight = el;
        this.result_highlight.addClass("highlighted");
        // mCustomScrollBox - theJ
        var _this = this;
        setTimeout(function () {
          if ($(_this.container).find(".mCustomScrollBox").length > 0) {
            maxHeight = parseInt(
              $(_this.container).find(".mCustomScrollBox").outerHeight()
            );
            // maxHeight = parseInt(_this.search_results.css("maxHeight"), 10);
            visible_top = Math.abs(
              $(_this.container).find(".mCSB_container").position().top
            );
            visible_bottom = maxHeight + visible_top;
            high_top = _this.result_highlight
              ? _this.result_highlight.position().top +
                _this.search_results.scrollTop()
              : _this.search_results.scrollTop();
            high_bottom =
              high_top + _this.result_highlight
                ? _this.result_highlight.outerHeight()
                : 0;
            if (high_bottom >= visible_bottom) {
              var temp =
                high_bottom - maxHeight > 0 ? high_bottom - maxHeight : 0;
              return $(_this.dropdown).mCustomScrollbar("scrollTo", temp, {
                scrollInertia: 0,
              });
              // return _this.search_results.scrollTop();
              /* LGETH-323 Start */
            } else if (high_top < visible_top && _this.result_highlight) {
              /* LGETH-323 End */
              // return _this.search_results.scrollTop(high_top);
              return $(_this.dropdown).mCustomScrollbar("scrollTo", high_top, {
                scrollInertia: 0,
              });
            }
          }
        }, 100);
      }
    };

    Chosen.prototype.result_clear_highlight = function () {
      if (this.result_highlight) {
        this.result_highlight.removeClass("highlighted");
      }
      return (this.result_highlight = null);
    };

    Chosen.prototype.results_show = function () {
      if (
        this.is_multiple &&
        this.max_selected_options <= this.choices_count()
      ) {
        this.form_field_jq.trigger("chosen:maxselected", {
          chosen: this,
        });
        return false;
      }
      this.container
        .addClass("chosen-with-drop")
        .find(".chosen-search-input")
        .attr("aria-expanded", true);
      this.results_showing = true;
      this.search_field.focus();
      this.search_field.val(this.get_search_field_value());
      this.winnow_results();
      return this.form_field_jq.trigger("chosen:showing_dropdown", {
        chosen: this,
      });
    };

    Chosen.prototype.update_results_content = function (content) {
      return this.search_results.html(content);
    };

    Chosen.prototype.results_hide = function () {
      if (this.results_showing) {
        this.result_clear_highlight();
        // 20200316 START 박지영 : aria-expanded 속성 삭제 되지 않도록 수정
        this.container
          .removeClass("chosen-with-drop")
          .find(".chosen-search-input")
          .attr("aria-expanded", false);
        // 20200316 END
        this.form_field_jq.trigger("chosen:hiding_dropdown", {
          chosen: this,
        });
      }
      return (this.results_showing = false);
    };

    Chosen.prototype.set_tab_index = function (el) {
      var ti;
      if (this.form_field.tabIndex) {
        ti = this.form_field.tabIndex;
        this.form_field.tabIndex = -1;
        return (this.search_field[0].tabIndex = ti);
      }
    };

    Chosen.prototype.set_label_behavior = function () {
      this.form_field_label = this.form_field_jq.parents("label");
      if (!this.form_field_label.length && this.form_field.id.length) {
        this.form_field_label = $("label[for='" + this.form_field.id + "']");
      }
      if (this.form_field_label.length > 0) {
        return this.form_field_label.on(
          "click.chosen",
          this.label_click_handler
        );
      }
    };

    Chosen.prototype.show_search_field_default = function () {
      if (this.is_multiple && this.choices_count() < 1 && !this.active_field) {
        this.search_field.val(this.default_text);
        return this.search_field.addClass("default");
      } else {
        this.search_field.val("");
        return this.search_field.removeClass("default");
      }
    };

    Chosen.prototype.search_results_mouseup = function (evt) {
      var target;
      target = $(evt.target).hasClass("active-result")
        ? $(evt.target)
        : $(evt.target).parents(".active-result").first();
      if (target.length) {
        this.result_highlight = target;
        this.result_select(evt);
        return this.search_field.focus();
      }
    };

    Chosen.prototype.search_results_mouseover = function (evt) {
      var target;
      target = $(evt.target).hasClass("active-result")
        ? $(evt.target)
        : $(evt.target).parents(".active-result").first();
      if (target) {
        return this.result_do_highlight(target);
      }
    };

    Chosen.prototype.search_results_mouseout = function (evt) {
      if (
        $(evt.target).hasClass("active-result") ||
        $(evt.target).parents(".active-result").first()
      ) {
        return this.result_clear_highlight();
      }
    };

    Chosen.prototype.choice_build = function (item) {
      var choice, close_link;
      choice = $("<li />", {
        class: "search-choice",
      }).html("<span>" + this.choice_label(item) + "</span>");
      if (item.disabled) {
        choice.addClass("search-choice-disabled");
      } else {
        close_link = $("<a />", {
          class: "search-choice-close",
          "data-option-array-index": item.array_index,
        });
        close_link.on(
          "click.chosen",
          (function (_this) {
            return function (evt) {
              return _this.choice_destroy_link_click(evt);
            };
          })(this)
        );
        choice.append(close_link);
      }
      return this.search_container.before(choice);
    };

    Chosen.prototype.choice_destroy_link_click = function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
      if (!this.is_disabled) {
        return this.choice_destroy($(evt.target));
      }
    };

    Chosen.prototype.choice_destroy = function (link) {
      if (
        this.result_deselect(link[0].getAttribute("data-option-array-index"))
      ) {
        if (this.active_field) {
          this.search_field.focus();
        } else {
          this.show_search_field_default();
        }
        if (
          this.is_multiple &&
          this.choices_count() > 0 &&
          this.get_search_field_value().length < 1
        ) {
          this.results_hide();
        }
        link.parents("li").first().remove();
        return this.search_field_scale();
      }
    };

    Chosen.prototype.results_reset = function () {
      this.reset_single_select_options();
      this.form_field.options[0].selected = true;
      this.single_set_selected_text();
      this.show_search_field_default();
      this.results_reset_cleanup();
      this.trigger_form_field_change();
      if (this.active_field) {
        return this.results_hide();
      }
    };

    Chosen.prototype.results_reset_cleanup = function () {
      this.current_selectedIndex = this.form_field.selectedIndex;
      return this.selected_item.find("abbr").remove();
    };

    Chosen.prototype.result_select = function (evt) {
      var high, item;
      if (this.result_highlight) {
        high = this.result_highlight;
        this.result_clear_highlight();
        if (
          this.is_multiple &&
          this.max_selected_options <= this.choices_count()
        ) {
          this.form_field_jq.trigger("chosen:maxselected", {
            chosen: this,
          });
          return false;
        }
        if (this.is_multiple) {
          high.removeClass("active-result");
        } else {
          this.reset_single_select_options();
        }
        high.addClass("result-selected");
        high
          .attr("aria-selected", true)
          .siblings()
          .attr("aria-selected", false);
        item =
          this.results_data[high[0].getAttribute("data-option-array-index")];
        item.selected = true;
        this.form_field.options[item.options_index].selected = true;
        this.selected_option_count = null;
        if (this.is_multiple) {
          this.choice_build(item);
        } else {
          this.single_set_selected_text(this.choice_label(item));
        }
        if (
          this.is_multiple &&
          (!this.hide_results_on_select || evt.metaKey || evt.ctrlKey)
        ) {
          if (evt.metaKey || evt.ctrlKey) {
            this.winnow_results({
              skip_highlight: true,
            });
          } else {
            this.search_field.val("");
            this.winnow_results();
          }
        } else {
          this.results_hide();
          this.show_search_field_default();
        }
        if (
          this.is_multiple ||
          this.form_field.selectedIndex !== this.current_selectedIndex
        ) {
          this.trigger_form_field_change({
            selected: this.form_field.options[item.options_index].value,
          });
        }
        this.current_selectedIndex = this.form_field.selectedIndex;
        evt.preventDefault();
        return this.search_field_scale();
      }
    };

    Chosen.prototype.single_set_selected_text = function (text) {
      if (text == null) {
        text = this.default_text;
        var defaultTitle = $(this.form_field).attr("title")
          ? $(this.form_field).attr("title")
          : $(this.form_field).attr("data-placeholder");
        this.container.find(".chosen-search-input").attr("title", defaultTitle);
      }
      if (text === this.default_text) {
        this.selected_item.addClass("chosen-default");
      } else {
        this.single_deselect_control_build();
        this.selected_item.removeClass("chosen-default");
      }

      this.container.find(".chosen-search-input").attr("title", text);
      return this.selected_item.find("span").html(text);
    };

    Chosen.prototype.result_deselect = function (pos) {
      var result_data;
      result_data = this.results_data[pos];
      if (!this.form_field.options[result_data.options_index].disabled) {
        result_data.selected = false;
        this.form_field.options[result_data.options_index].selected = false;
        this.selected_option_count = null;
        this.result_clear_highlight();
        if (this.results_showing) {
          this.winnow_results();
        }
        this.trigger_form_field_change({
          deselected: this.form_field.options[result_data.options_index].value,
        });
        this.search_field_scale();
        return true;
      } else {
        return false;
      }
    };

    Chosen.prototype.single_deselect_control_build = function () {
      if (!this.allow_single_deselect) {
        return;
      }
      if (!this.selected_item.find("abbr").length) {
        this.selected_item
          .find("span")
          .first()
          .after('<abbr class="search-choice-close"></abbr>');
      }
      return this.selected_item.addClass("chosen-single-with-deselect");
    };

    Chosen.prototype.get_search_field_value = function () {
      return this.search_field.val();
    };

    Chosen.prototype.get_search_text = function () {
      return $.trim(this.get_search_field_value());
    };

    Chosen.prototype.escape_html = function (text) {
      return $("<div/>").text(text).html();
    };

    Chosen.prototype.winnow_results_set_highlight = function () {
      var do_high, selected_results;
      selected_results = !this.is_multiple
        ? this.search_results.find(".result-selected.active-result")
        : [];
      do_high = selected_results.length
        ? selected_results.first()
        : this.search_results.find(".active-result").first();
      if (do_high != null) {
        return this.result_do_highlight(do_high);
      }
    };

    Chosen.prototype.no_results = function (terms) {
      var no_results_html;
      no_results_html = this.get_no_results_html(terms);
      this.search_results.append(no_results_html);
      return this.form_field_jq.trigger("chosen:no_results", {
        chosen: this,
      });
    };

    Chosen.prototype.no_results_clear = function () {
      return this.search_results.find(".no-results").remove();
    };

    Chosen.prototype.keydown_arrow = function () {
      var next_sib;
      // theJ
      console.log(this.results_showing);
      if (!this.results_showing) {
        this.results_show();
        var _this = this;
        setTimeout(function () {
          _this.container
            .find(".chosen-drop .chosen-results li.active-result")
            .eq(0)
            .focus();
        }, 200);
      }
      /*
			if (this.results_showing && this.result_highlight) {
				next_sib = this.result_highlight.nextAll("li.active-result").first();
				if (next_sib) {
					return this.result_do_highlight(next_sib);
				}
			} else {
				return this.results_show();
			}
			*/
    };

    Chosen.prototype.keyup_arrow = function () {
      var prev_sibs;
      if (!this.results_showing && !this.is_multiple) {
        // remove theJ
        //return this.results_show();
      } else if (this.result_highlight) {
        prev_sibs = this.result_highlight.prevAll("li.active-result");
        if (prev_sibs.length) {
          //return this.result_do_highlight(prev_sibs.first());
        } else {
          if (this.choices_count() > 0) {
            this.results_hide();
          }
          return this.result_clear_highlight();
        }
      }
    };

    Chosen.prototype.keydown_backstroke = function () {
      var next_available_destroy;
      if (this.pending_backstroke) {
        this.choice_destroy(this.pending_backstroke.find("a").first());
        return this.clear_backstroke();
      } else {
        next_available_destroy = this.search_container
          .siblings("li.search-choice")
          .last();
        if (
          next_available_destroy.length &&
          !next_available_destroy.hasClass("search-choice-disabled")
        ) {
          this.pending_backstroke = next_available_destroy;
          if (this.single_backstroke_delete) {
            return this.keydown_backstroke();
          } else {
            return this.pending_backstroke.addClass("search-choice-focus");
          }
        }
      }
    };

    Chosen.prototype.clear_backstroke = function () {
      if (this.pending_backstroke) {
        this.pending_backstroke.removeClass("search-choice-focus");
      }
      return (this.pending_backstroke = null);
    };

    Chosen.prototype.search_field_scale = function () {
      var div, i, len, style, style_block, styles, width;
      if (!this.is_multiple) {
        return;
      }
      style_block = {
        position: "absolute",
        left: "-1000px",
        top: "-1000px",
        display: "none",
        whiteSpace: "pre",
      };
      styles = [
        "fontSize",
        "fontStyle",
        "fontWeight",
        "fontFamily",
        "lineHeight",
        "textTransform",
        "letterSpacing",
      ];
      for (i = 0, len = styles.length; i < len; i++) {
        style = styles[i];
        style_block[style] = this.search_field.css(style);
      }
      div = $("<div />").css(style_block);
      div.text(this.get_search_field_value());
      $("body").append(div);
      width = div.width() + 25;
      div.remove();
      if (this.container.is(":visible")) {
        width = Math.min(this.container.outerWidth() - 10, width);
      }
      return this.search_field.width(width);
    };

    Chosen.prototype.trigger_form_field_change = function (extra) {
      this.form_field_jq.trigger("input", extra);
      return this.form_field_jq.trigger("change", extra);
    };
    return Chosen;
  })(AbstractChosen);
}).call(this);

var angle =
  '<i class="icon"><svg width="10px" height="7px"><path d="M9.706,0.290 C9.335,-0.085 8.734,-0.085 8.364,0.290 L4.989,3.589 L1.614,0.290 C1.243,-0.085 0.642,-0.085 0.272,0.290 C-0.099,0.665 -0.099,1.273 0.272,1.649 L4.303,5.743 C4.492,5.935 4.741,6.026 4.989,6.022 C5.236,6.026 5.485,5.935 5.673,5.743 L9.706,1.649 C10.076,1.273 10.076,0.665 9.706,0.290 Z"/></svg></i>';
// EMP 20220204 START 박지영 - Selectbox 디자인 추가
// EMP 회원가입 페이지에서 사용 (통합)
var angle2 =
  '<i class="icon"><svg width="12" height="8" viewBox="0 0 9 6"><path d="M883,16.487l3.786-4.065a0.908,0.908,0,0,0,0-1.158,0.652,0.652,0,0,0-1.01,0l-3.292,3.467-3.292-3.467a0.651,0.651,0,0,0-1.009,0,0.908,0.908,0,0,0,0,1.158l3.786,4.065A0.676,0.676,0,0,0,883,16.487Z" transform="translate(-878 -11.031)"/></svg></i>';
// EMP 20220204 END 박지영 - Selectbox 디자인 추가
var chosenDefault = {
  disable_search: true,
  button_markup: angle,
  width: "100%",
};
var runChosen = function () {
  var chosens = document.querySelectorAll(".run-chosen");
  // var chosens = $('.run-chosen');
  var l = chosens.length;
  for (var idx = 0; idx < l; idx++) {
    var el = chosens[idx]; // this
    var search = el.getAttribute("data-search") == "true" ? false : true;

    if (
      !$(el).is(".chosen-initialized") &&
      !$(el).is(".chosen-container") &&
      $(el).closest("template").length == 0
    ) {
      // EMP 20220204 START 박지영 - Selectbox 디자인 추가
      var arrowDesign = angle;
      if ($(el).is(".type-round")) {
        arrowDesign = angle2;
      }
      // EMP 20220204 END 박지영 - Selectbox 디자인 추가
      $(el)
        .chosen({
          disable_search: search,
          search_contains: true, // LGEIS-554 :: .type-search-option + allows matches starting from anywhere within a word
          button_markup: arrowDesign, // EMP 20220204 박지영 - Selectbox 디자인 추가 (angle을 arrowDesign으로 변경)
          width: "100%",
          inherit_select_classes: true,
        })
        .addClass("chosen-initialized");
    }
  }
};
$(document).ready(function () {
  runChosen();
  //$(myobj).trigger("chosen:updated");

  // chosen-drop 목록 중 마지막 목록에서 blur 되면 닫음
  $("body").on(
    "blur",
    ".chosen-drop .chosen-results li.active-result:last-child",
    function (e) {
      e.preventDefault();
      var _this = $(this);
      setTimeout(function (e) {
        if (!$(":focus").hasClass("active-result")) {
          _this.closest(".chosen-container").prev().trigger("chosen:close");
        }
      }, 100);
    }
  );

  // chosen-drop list
  $("body").on(
    "keydown",
    ".chosen-drop .chosen-results li.active-result",
    function (e) {
      var kcode = (ref = e.which) != null ? ref : e.keyCode;
      if (kcode == 38 || kcode == 40) {
        // up & down arrow key
        return false;
      }
    }
  );
  $("body").on(
    "keyup",
    ".chosen-drop .chosen-results li.active-result",
    function (e) {
      var kcode = (ref = e.which) != null ? ref : e.keyCode;
      if (kcode == 13) {
        e.preventDefault();
        $(this).trigger("mouseup");
      } else if (kcode == 38) {
        // up
        e.preventDefault();
        if (
          $(this).prev().length > 0 &&
          $(this).prev().hasClass("active-result")
        ) {
          $(this).prev().focus();
        }
        return false;
      } else if (kcode == 40) {
        // down
        e.preventDefault();
        if (
          $(this).next().length > 0 &&
          $(this).next().hasClass("active-result")
        ) {
          $(this).next().focus();
        }
        return false;
      } else if (kcode == 27) {
        // esc
        console.log("__");
        if (
          $(this)
            .closest(".chosen-container")
            .hasClass("chosen-container-active")
        ) {
          $(this)
            .closest(".chosen-container")
            .removeClass("chosen-container-active chosen-with-drop")
            .find(".chosen-search-input")
            .attr("aria-expanded", false);
        }
      }
    }
  );
  $("body").on("click", function (e) {
    var _this = $(e.currentTarget);
    if (_this.closest(".chosen-container").length == -1) {
      _this
        .closest(".chosen-container")
        .removeClass("chosen-container-active chosen-with-drop")
        .find(".chosen-search-input")
        .attr("aria-expanded", false);
    }
  });

  // auto fill (address, name ... )
  $(
    ".contact-information .run-chosen, .unit-location-information .run-chosen, .requestor-information .run-chosen, .same_info_check .run-chosen, .inquiry-fieldset-box .run-chosen"
  ).on("change", function () {
    //console.log($(this).val());
    if (!$(this).is("#reservationTime") && !$(this).is("#reservationDate")) {
      $(this).trigger("chosen:updated");
    }
  });
  $(document).on(
    "chosen:updated",
    '.run-chosen[data-readonly="true"]',
    function () {
      var $this = $(this);
      if ($this.data("readonly")) {
        var disableFlag = $this.attr("disabled");

        $this.attr("disabled", "disabled");
        $this.data("chosen") && $this.data("chosen").search_field_disabled();

        if (!disableFlag) {
          $this.removeAttr("disabled");
        }
      }
    }
  );
  $('select[data-readonly="true"]').trigger("chosen:updated");
});
/*
== malihu jquery custom scrollbar plugin == 
Version: 3.1.5 (custom)
Modified from the-j
Last Modified Date : 2019-03-22
Plugin URI: http://manos.malihu.gr/jquery-custom-content-scroller 
Author: malihu
Author URI: http://manos.malihu.gr
License: MIT License (MIT)
*/

/*
Copyright Manos Malihutsakis (email: manos@malihu.gr)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
The code below is fairly long, fully commented and should be normally used in development. 
For production, use either the minified jquery.mCustomScrollbar.min.js script or 
the production-ready jquery.mCustomScrollbar.concat.min.js which contains the plugin 
and dependencies (minified). 
*/

// <-- mCustomScrollbar.js
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery"], factory);
  } else if (typeof module !== "undefined" && module.exports) {
    module.exports = factory;
  } else {
    factory(jQuery, window, document);
  }
})(function ($) {
  (function (init) {
    //var _rjs=typeof define==="function" && define.amd, /* RequireJS */
    //	_njs=typeof module !== "undefined" && module.exports, /* NodeJS */
    //	_dlp=("https:"==document.location.protocol) ? "https:" : "http:", /* location protocol */
    //	_url="cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js";
    //if(!_rjs){
    //	if(_njs){
    //		require("jquery-mousewheel")($);
    //	}else{
    //		/* load jquery-mousewheel plugin (via CDN) if it's not present or not loaded via RequireJS
    //		(works when mCustomScrollbar fn is called on window load) */
    //		//$.event.special.mousewheel || $("head").append(decodeURI("%3Cscript src="+_dlp+"//"+_url+"%3E%3C/script%3E"));
    //	}
    //}
    init();
  })(function () {
    /* 
		----------------------------------------
		PLUGIN NAMESPACE, PREFIX, DEFAULT SELECTOR(S) 
		----------------------------------------
		*/

    var pluginNS = "mCustomScrollbar",
      pluginPfx = "mCS",
      defaultSelector = ".mCustomScrollbar",
      /* 
		----------------------------------------
		DEFAULT OPTIONS 
		----------------------------------------
		*/

      defaults = {
        /*
				set element/content width/height programmatically 
				values: boolean, pixels, percentage 
					option						default
					-------------------------------------
					setWidth					false
					setHeight					false
				*/
        /*
				set the initial css top property of content  
				values: string (e.g. "-100px", "10%" etc.)
				*/
        setTop: 0,
        /*
				set the initial css left property of content  
				values: string (e.g. "-100px", "10%" etc.)
				*/
        setLeft: 0,
        /* 
				scrollbar axis (vertical and/or horizontal scrollbars) 
				values (string): "y", "x", "yx"
				*/
        axis: "y",
        /*
				position of scrollbar relative to content  
				values (string): "inside", "outside" ("outside" requires elements with position:relative)
				*/
        scrollbarPosition: "inside",
        /*
				scrolling inertia
				values: integer (milliseconds)
				*/
        scrollInertia: 950,
        /* 
				auto-adjust scrollbar dragger length
				values: boolean
				*/
        autoDraggerLength: true,
        /*
				auto-hide scrollbar when idle 
				values: boolean
					option						default
					-------------------------------------
					autoHideScrollbar			false
				*/
        /*
				auto-expands scrollbar on mouse-over and dragging
				values: boolean
					option						default
					-------------------------------------
					autoExpandScrollbar			false
				*/
        /*
				always show scrollbar, even when there's nothing to scroll 
				values: integer (0=disable, 1=always show dragger rail and buttons, 2=always show dragger rail, dragger and buttons), boolean
				*/
        alwaysShowScrollbar: 0,
        /*
				scrolling always snaps to a multiple of this number in pixels
				values: integer, array ([y,x])
					option						default
					-------------------------------------
					snapAmount					null
				*/
        /*
				when snapping, snap with this number in pixels as an offset 
				values: integer
				*/
        snapOffset: 0,
        /* 
				mouse-wheel scrolling
				*/
        mouseWheel: {
          /* 
					enable mouse-wheel scrolling
					values: boolean
					*/
          enable: true,
          /* 
					scrolling amount in pixels
					values: "auto", integer 
					*/
          scrollAmount: "auto",
          /* 
					mouse-wheel scrolling axis 
					the default scrolling direction when both vertical and horizontal scrollbars are present 
					values (string): "y", "x" 
					*/
          axis: "y",
          /* 
					prevent the default behaviour which automatically scrolls the parent element(s) when end of scrolling is reached 
					values: boolean
						option						default
						-------------------------------------
						preventDefault				null
					*/
          /*
					the reported mouse-wheel delta value. The number of lines (translated to pixels) one wheel notch scrolls.  
					values: "auto", integer 
					"auto" uses the default OS/browser value 
					*/
          deltaFactor: "auto",
          /*
					normalize mouse-wheel delta to -1 or 1 (disables mouse-wheel acceleration) 
					values: boolean
						option						default
						-------------------------------------
						normalizeDelta				null
					*/
          /*
					invert mouse-wheel scrolling direction 
					values: boolean
						option						default
						-------------------------------------
						invert						null
					*/
          /*
					the tags that disable mouse-wheel when cursor is over them
					*/
          disableOver: ["select", "option", "keygen", "datalist", "textarea"],
        },
        /* 
				scrollbar buttons
				*/
        scrollButtons: {
          /*
					enable scrollbar buttons
					values: boolean
						option						default
						-------------------------------------
						enable						null
					*/
          /*
					scrollbar buttons scrolling type 
					values (string): "stepless", "stepped"
					*/
          scrollType: "stepless",
          /*
					scrolling amount in pixels
					values: "auto", integer 
					*/
          scrollAmount: "auto",
          /*
					tabindex of the scrollbar buttons
					values: false, integer
						option						default
						-------------------------------------
						tabindex					null
					*/
        },
        /* 
				keyboard scrolling
				*/
        keyboard: {
          /*
					enable scrolling via keyboard
					values: boolean
					*/
          enable: true,
          /*
					keyboard scrolling type 
					values (string): "stepless", "stepped"
					*/
          scrollType: "stepless",
          /*
					scrolling amount in pixels
					values: "auto", integer 
					*/
          scrollAmount: "auto",
        },
        /*
				enable content touch-swipe scrolling 
				values: boolean, integer, string (number)
				integer values define the axis-specific minimum amount required for scrolling momentum
				*/
        contentTouchScroll: 25,
        /*
				enable/disable document (default) touch-swipe scrolling 
				*/
        documentTouchScroll: true,
        /*
				advanced option parameters
				*/
        advanced: {
          /*
					auto-expand content horizontally (for "x" or "yx" axis) 
					values: boolean, integer (the value 2 forces the non scrollHeight/scrollWidth method, the value 3 forces the scrollHeight/scrollWidth method)
						option						default
						-------------------------------------
						autoExpandHorizontalScroll	null
					*/
          /*
					auto-scroll to elements with focus
					*/
          autoScrollOnFocus:
            "input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable='true']",
          /*
					auto-update scrollbars on content, element or viewport resize 
					should be true for fluid layouts/elements, adding/removing content dynamically, hiding/showing elements, content with images etc. 
					values: boolean
					*/
          updateOnContentResize: true,
          /*
					auto-update scrollbars each time each image inside the element is fully loaded 
					values: "auto", boolean
					*/
          updateOnImageLoad: "auto",
          /*
					auto-update scrollbars based on the amount and size changes of specific selectors 
					useful when you need to update the scrollbar(s) automatically, each time a type of element is added, removed or changes its size 
					values: boolean, string (e.g. "ul li" will auto-update scrollbars each time list-items inside the element are changed) 
					a value of true (boolean) will auto-update scrollbars each time any element is changed
						option						default
						-------------------------------------
						updateOnSelectorChange		null
					*/
          /*
					extra selectors that'll allow scrollbar dragging upon mousemove/up, pointermove/up, touchend etc. (e.g. "selector-1, selector-2")
						option						default
						-------------------------------------
						extraDraggableSelectors		null
					*/
          /*
					extra selectors that'll release scrollbar dragging upon mouseup, pointerup, touchend etc. (e.g. "selector-1, selector-2")
						option						default
						-------------------------------------
						releaseDraggableSelectors	null
					*/
          /*
					auto-update timeout 
					values: integer (milliseconds)
					*/
          autoUpdateTimeout: 60,
        },
        /* 
				scrollbar theme 
				values: string (see CSS/plugin URI for a list of ready-to-use themes)
				*/
        theme: "light",
        /*
				user defined callback functions
				*/
        callbacks: {
          /*
					Available callbacks: 
						callback					default
						-------------------------------------
						onCreate					null
						onInit						null
						onScrollStart				null
						onScroll					null
						onTotalScroll				null
						onTotalScrollBack			null
						whileScrolling				null
						onOverflowY					null
						onOverflowX					null
						onOverflowYNone				null
						onOverflowXNone				null
						onImageLoad					null
						onSelectorChange			null
						onBeforeUpdate				null
						onUpdate					null
					*/
          onTotalScrollOffset: 0,
          onTotalScrollBackOffset: 0,
          alwaysTriggerOffsets: true,
        },
        /*
				add scrollbar(s) on all elements matching the current selector, now and in the future 
				values: boolean, string 
				string values: "on" (enable), "once" (disable after first invocation), "off" (disable)
				liveSelector values: string (selector)
					option						default
					-------------------------------------
					live						false
					liveSelector				null
				*/
      },
      /* 
		----------------------------------------
		VARS, CONSTANTS 
		----------------------------------------
		*/

      totalInstances = 0 /* plugin instances amount */,
      liveTimers = {} /* live option timers */,
      oldIE =
        window.attachEvent && !window.addEventListener
          ? 1
          : 0 /* detect IE < 9 */,
      touchActive = false,
      touchable /* global touch vars (for touch and pointer events) */,
      /* general plugin classes */
      classes = [
        "mCSB_dragger_onDrag",
        "mCSB_scrollTools_onDrag",
        "mCS_img_loaded",
        "mCS_disabled",
        "mCS_destroyed",
        "mCS_no_scrollbar",
        "mCS-autoHide",
        "mCS-dir-rtl",
        "mCS_no_scrollbar_y",
        "mCS_no_scrollbar_x",
        "mCS_y_hidden",
        "mCS_x_hidden",
        "mCSB_draggerContainer",
        "mCSB_buttonUp",
        "mCSB_buttonDown",
        "mCSB_buttonLeft",
        "mCSB_buttonRight",
      ],
      /* 
		----------------------------------------
		METHODS 
		----------------------------------------
		*/

      methods = {
        /* 
				plugin initialization method 
				creates the scrollbar(s), plugin data object and options
				----------------------------------------
				*/

        init: function (options) {
          var options = $.extend(true, {}, defaults, options),
            selector = _selector.call(this); /* validate selector */

          /* 
					if live option is enabled, monitor for elements matching the current selector and 
					apply scrollbar(s) when found (now and in the future) 
					*/
          if (options.live) {
            var liveSelector =
                options.liveSelector ||
                this.selector ||
                defaultSelector /* live selector(s) */,
              $liveSelector =
                $(liveSelector); /* live selector(s) as jquery object */
            if (options.live === "off") {
              /* 
							disable live if requested 
							usage: $(selector).mCustomScrollbar({live:"off"}); 
							*/
              removeLiveTimers(liveSelector);
              return;
            }
            liveTimers[liveSelector] = setTimeout(function () {
              /* call mCustomScrollbar fn on live selector(s) every half-second */
              $liveSelector.mCustomScrollbar(options);
              if (options.live === "once" && $liveSelector.length) {
                /* disable live after first invocation */
                removeLiveTimers(liveSelector);
              }
            }, 500);
          } else {
            removeLiveTimers(liveSelector);
          }

          /* options backward compatibility (for versions < 3.0.0) and normalization */
          options.setWidth = options.set_width
            ? options.set_width
            : options.setWidth;
          options.setHeight = options.set_height
            ? options.set_height
            : options.setHeight;
          options.axis = options.horizontalScroll
            ? "x"
            : _findAxis(options.axis);
          options.scrollInertia =
            options.scrollInertia > 0 && options.scrollInertia < 17
              ? 17
              : options.scrollInertia;
          if (
            typeof options.mouseWheel !== "object" &&
            options.mouseWheel == true
          ) {
            /* old school mouseWheel option (non-object) */
            options.mouseWheel = {
              enable: true,
              scrollAmount: "auto",
              axis: "y",
              preventDefault: false,
              deltaFactor: "auto",
              normalizeDelta: false,
              invert: false,
            };
          }
          options.mouseWheel.scrollAmount = !options.mouseWheelPixels
            ? options.mouseWheel.scrollAmount
            : options.mouseWheelPixels;
          options.mouseWheel.normalizeDelta = !options.advanced
            .normalizeMouseWheelDelta
            ? options.mouseWheel.normalizeDelta
            : options.advanced.normalizeMouseWheelDelta;
          options.scrollButtons.scrollType = _findScrollButtonsType(
            options.scrollButtons.scrollType
          );

          _theme(options); /* theme-specific options */

          /* plugin constructor */
          return $(selector).each(function () {
            var $this = $(this);

            if (!$this.data(pluginPfx)) {
              /* prevent multiple instantiations */

              /* store options and create objects in jquery data */
              $this.data(pluginPfx, {
                idx: ++totalInstances /* instance index */,
                opt: options /* options */,
                scrollRatio: {
                  y: null,
                  x: null,
                } /* scrollbar to content ratio */,
                overflowed: null /* overflowed axis */,
                contentReset: {
                  y: null,
                  x: null,
                } /* object to check when content resets */,
                bindEvents: false /* object to check if events are bound */,
                tweenRunning: false /* object to check if tween is running */,
                sequential: {} /* sequential scrolling object */,
                //langDir:$this.css("direction"), /* detect/store direction (ltr or rtl) */
                langDir: $("html").attr("dir") == "rtl" ? "rtl" : "ltr",
                cbOffsets:
                  null /* object to check whether callback offsets always trigger */,
                /* 
								object to check how scrolling events where last triggered 
								"internal" (default - triggered by this script), "external" (triggered by other scripts, e.g. via scrollTo method) 
								usage: object.data("mCS").trigger
								*/
                trigger: null,
                /* 
								object to check for changes in elements in order to call the update method automatically 
								*/
                poll: {
                  size: { o: 0, n: 0 },
                  img: { o: 0, n: 0 },
                  change: { o: 0, n: 0 },
                },
              });

              var d = $this.data(pluginPfx),
                o = d.opt,
                /* HTML data attributes */
                htmlDataAxis = $this.data("mcs-axis"),
                htmlDataSbPos = $this.data("mcs-scrollbar-position"),
                htmlDataTheme = $this.data("mcs-theme");

              if (htmlDataAxis) {
                o.axis = htmlDataAxis;
              } /* usage example: data-mcs-axis="y" */
              if (htmlDataSbPos) {
                o.scrollbarPosition = htmlDataSbPos;
              } /* usage example: data-mcs-scrollbar-position="outside" */
              if (htmlDataTheme) {
                /* usage example: data-mcs-theme="minimal" */
                o.theme = htmlDataTheme;
                _theme(o); /* theme-specific options */
              }

              _pluginMarkup.call(this); /* add plugin markup */

              if (
                d &&
                o.callbacks.onCreate &&
                typeof o.callbacks.onCreate === "function"
              ) {
                o.callbacks.onCreate.call(this);
              } /* callbacks: onCreate */

              $(
                "#mCSB_" + d.idx + "_container img:not(." + classes[2] + ")"
              ).addClass(classes[2]); /* flag loaded images */

              methods.update.call(null, $this); /* call the update method */
            }
          });
        },
        /* ---------------------------------------- */

        /* 
				plugin update method 
				updates content and scrollbar(s) values, events and status 
				----------------------------------------
				usage: $(selector).mCustomScrollbar("update");
				*/

        update: function (el, cb) {
          var selector = el || _selector.call(this); /* validate selector */

          return $(selector).each(function () {
            var $this = $(this);

            if ($this.data(pluginPfx)) {
              /* check if plugin has initialized */

              var d = $this.data(pluginPfx),
                o = d.opt,
                mCSB_container = $("#mCSB_" + d.idx + "_container"),
                mCustomScrollBox = $("#mCSB_" + d.idx),
                mCSB_dragger = [
                  $("#mCSB_" + d.idx + "_dragger_vertical"),
                  $("#mCSB_" + d.idx + "_dragger_horizontal"),
                ];

              if (!mCSB_container.length) {
                return;
              }

              if (d.tweenRunning) {
                _stop($this);
              } /* stop any running tweens while updating */

              if (
                cb &&
                d &&
                o.callbacks.onBeforeUpdate &&
                typeof o.callbacks.onBeforeUpdate === "function"
              ) {
                o.callbacks.onBeforeUpdate.call(this);
              } /* callbacks: onBeforeUpdate */

              /* if element was disabled or destroyed, remove class(es) */
              if ($this.hasClass(classes[3])) {
                $this.removeClass(classes[3]);
              }
              if ($this.hasClass(classes[4])) {
                $this.removeClass(classes[4]);
              }

              /* css flexbox fix, detect/set max-height */
              mCustomScrollBox.css("max-height", "none");
              if (mCustomScrollBox.height() !== $this.height()) {
                mCustomScrollBox.css("max-height", $this.height());
              }

              _expandContentHorizontally.call(
                this
              ); /* expand content horizontally */

              if (o.axis !== "y" && !o.advanced.autoExpandHorizontalScroll) {
                mCSB_container.css("width", _contentWidth(mCSB_container));
              }

              d.overflowed =
                _overflowed.call(this); /* determine if scrolling is required */

              _scrollbarVisibility.call(this); /* show/hide scrollbar(s) */

              /* auto-adjust scrollbar dragger length analogous to content */
              if (o.autoDraggerLength) {
                _setDraggerLength.call(this);
              }

              _scrollRatio.call(
                this
              ); /* calculate and store scrollbar to content ratio */

              _bindEvents.call(this); /* bind scrollbar events */

              /* reset scrolling position and/or events */
              var to = [
                Math.abs(mCSB_container[0].offsetTop),
                Math.abs(mCSB_container[0].offsetLeft),
              ];
              if (o.axis !== "x") {
                /* y/yx axis */
                if (!d.overflowed[0]) {
                  /* y scrolling is not required */
                  _resetContentPosition.call(this); /* reset content position */
                  if (o.axis === "y") {
                    _unbindEvents.call(this);
                  } else if (o.axis === "yx" && d.overflowed[1]) {
                    _scrollTo($this, to[1].toString(), {
                      dir: "x",
                      dur: 0,
                      overwrite: "none",
                    });
                  }
                } else if (
                  mCSB_dragger[0].height() > mCSB_dragger[0].parent().height()
                ) {
                  _resetContentPosition.call(this); /* reset content position */
                } else {
                  /* y scrolling is required */
                  _scrollTo($this, to[0].toString(), {
                    dir: "y",
                    dur: 0,
                    overwrite: "none",
                  });
                  d.contentReset.y = null;
                }
              }
              if (o.axis !== "y") {
                /* x/yx axis */
                if (!d.overflowed[1]) {
                  /* x scrolling is not required */
                  _resetContentPosition.call(this); /* reset content position */
                  if (o.axis === "x") {
                    _unbindEvents.call(this);
                  } else if (o.axis === "yx" && d.overflowed[0]) {
                    _scrollTo($this, to[0].toString(), {
                      dir: "y",
                      dur: 0,
                      overwrite: "none",
                    });
                  }
                } else if (
                  mCSB_dragger[1].width() > mCSB_dragger[1].parent().width()
                ) {
                  _resetContentPosition.call(this); /* reset content position */
                } else {
                  /* x scrolling is required */
                  _scrollTo($this, to[1].toString(), {
                    dir: "x",
                    dur: 0,
                    overwrite: "none",
                  });
                  d.contentReset.x = null;
                }
              }

              /* callbacks: onImageLoad, onSelectorChange, onUpdate */
              if (cb && d) {
                if (
                  cb === 2 &&
                  o.callbacks.onImageLoad &&
                  typeof o.callbacks.onImageLoad === "function"
                ) {
                  o.callbacks.onImageLoad.call(this);
                } else if (
                  cb === 3 &&
                  o.callbacks.onSelectorChange &&
                  typeof o.callbacks.onSelectorChange === "function"
                ) {
                  o.callbacks.onSelectorChange.call(this);
                } else if (
                  o.callbacks.onUpdate &&
                  typeof o.callbacks.onUpdate === "function"
                ) {
                  o.callbacks.onUpdate.call(this);
                }
              }

              _autoUpdate.call(
                this
              ); /* initialize automatic updating (for dynamic content, fluid layouts etc.) */
            }
          });
        },
        /* ---------------------------------------- */

        /* 
				plugin scrollTo method 
				triggers a scrolling event to a specific value
				----------------------------------------
				usage: $(selector).mCustomScrollbar("scrollTo",value,options);
				*/

        scrollTo: function (val, options) {
          /* prevent silly things like $(selector).mCustomScrollbar("scrollTo",undefined); */
          if (typeof val == "undefined" || val == null) {
            return;
          }

          var selector = _selector.call(this); /* validate selector */

          return $(selector).each(function () {
            var $this = $(this);

            if ($this.data(pluginPfx)) {
              /* check if plugin has initialized */

              var d = $this.data(pluginPfx),
                o = d.opt,
                /* method default options */
                methodDefaults = {
                  trigger:
                    "external" /* method is by default triggered externally (e.g. from other scripts) */,
                  scrollInertia:
                    o.scrollInertia /* scrolling inertia (animation duration) */,
                  scrollEasing: "mcsEaseInOut" /* animation easing */,
                  moveDragger: false /* move dragger instead of content */,
                  timeout: 60 /* scroll-to delay */,
                  callbacks: true /* enable/disable callbacks */,
                  onStart: true,
                  onUpdate: true,
                  onComplete: true,
                },
                methodOptions = $.extend(true, {}, methodDefaults, options),
                to = _arr.call(this, val),
                dur =
                  methodOptions.scrollInertia > 0 &&
                  methodOptions.scrollInertia < 17
                    ? 17
                    : methodOptions.scrollInertia;

              /* translate yx values to actual scroll-to positions */
              to[0] = _to.call(this, to[0], "y");
              to[1] = _to.call(this, to[1], "x");

              /* 
							check if scroll-to value moves the dragger instead of content. 
							Only pixel values apply on dragger (e.g. 100, "100px", "-=100" etc.) 
							*/
              if (methodOptions.moveDragger) {
                to[0] *= d.scrollRatio.y;
                to[1] *= d.scrollRatio.x;
              }

              methodOptions.dur = _isTabHidden() ? 0 : dur; //skip animations if browser tab is hidden

              setTimeout(function () {
                /* do the scrolling */
                if (
                  to[0] !== null &&
                  typeof to[0] !== "undefined" &&
                  o.axis !== "x" &&
                  d.overflowed[0]
                ) {
                  /* scroll y */
                  methodOptions.dir = "y";
                  methodOptions.overwrite = "all";
                  _scrollTo($this, to[0].toString(), methodOptions);
                }
                if (
                  to[1] !== null &&
                  typeof to[1] !== "undefined" &&
                  o.axis !== "y" &&
                  d.overflowed[1]
                ) {
                  /* scroll x */
                  methodOptions.dir = "x";
                  methodOptions.overwrite = "none";
                  _scrollTo($this, to[1].toString(), methodOptions);
                }
              }, methodOptions.timeout);
            }
          });
        },
        /* ---------------------------------------- */

        /*
				plugin stop method 
				stops scrolling animation
				----------------------------------------
				usage: $(selector).mCustomScrollbar("stop");
				*/
        stop: function () {
          var selector = _selector.call(this); /* validate selector */

          return $(selector).each(function () {
            var $this = $(this);

            if ($this.data(pluginPfx)) {
              /* check if plugin has initialized */

              _stop($this);
            }
          });
        },
        /* ---------------------------------------- */

        /*
				plugin disable method 
				temporarily disables the scrollbar(s) 
				----------------------------------------
				usage: $(selector).mCustomScrollbar("disable",reset); 
				reset (boolean): resets content position to 0 
				*/
        disable: function (r) {
          var selector = _selector.call(this); /* validate selector */

          return $(selector).each(function () {
            var $this = $(this);

            if ($this.data(pluginPfx)) {
              /* check if plugin has initialized */

              var d = $this.data(pluginPfx);

              _autoUpdate.call(this, "remove"); /* remove automatic updating */

              _unbindEvents.call(this); /* unbind events */

              if (r) {
                _resetContentPosition.call(this);
              } /* reset content position */

              _scrollbarVisibility.call(
                this,
                true
              ); /* show/hide scrollbar(s) */

              $this.addClass(classes[3]); /* add disable class */
            }
          });
        },
        /* ---------------------------------------- */

        /*
				plugin destroy method 
				completely removes the scrollbar(s) and returns the element to its original state
				----------------------------------------
				usage: $(selector).mCustomScrollbar("destroy"); 
				*/
        destroy: function () {
          var selector = _selector.call(this); /* validate selector */

          return $(selector).each(function () {
            var $this = $(this);

            if ($this.data(pluginPfx)) {
              /* check if plugin has initialized */

              var d = $this.data(pluginPfx),
                o = d.opt,
                mCustomScrollBox = $("#mCSB_" + d.idx),
                mCSB_container = $("#mCSB_" + d.idx + "_container"),
                scrollbar = $(".mCSB_" + d.idx + "_scrollbar");

              if (o.live) {
                removeLiveTimers(o.liveSelector || $(selector).selector);
              } /* remove live timers */

              _autoUpdate.call(this, "remove"); /* remove automatic updating */

              _unbindEvents.call(this); /* unbind events */

              _resetContentPosition.call(this); /* reset content position */

              $this.removeData(pluginPfx); /* remove plugin data object */

              _delete(this, "mcs"); /* delete callbacks object */

              /* remove plugin markup */
              scrollbar.remove(); /* remove scrollbar(s) first (those can be either inside or outside plugin's inner wrapper) */
              mCSB_container
                .find("img." + classes[2])
                .removeClass(classes[2]); /* remove loaded images flag */
              mCustomScrollBox.replaceWith(
                mCSB_container.contents()
              ); /* replace plugin's inner wrapper with the original content */
              /* remove plugin classes from the element and add destroy class */
              $this
                .removeClass(
                  pluginNS +
                    " _" +
                    pluginPfx +
                    "_" +
                    d.idx +
                    " " +
                    classes[6] +
                    " " +
                    classes[7] +
                    " " +
                    classes[5] +
                    " " +
                    classes[3]
                )
                .addClass(classes[4]);
            }
          });
        },
        /* ---------------------------------------- */
      },
      /* 
		----------------------------------------
		FUNCTIONS
		----------------------------------------
		*/

      /* validates selector (if selector is invalid or undefined uses the default one) */
      _selector = function () {
        return typeof $(this) !== "object" || $(this).length < 1
          ? defaultSelector
          : this;
      },
      /* -------------------- */

      /* changes options according to theme */
      _theme = function (obj) {
        var fixedSizeScrollbarThemes = [
            "rounded",
            "rounded-dark",
            "rounded-dots",
            "rounded-dots-dark",
          ],
          nonExpandedScrollbarThemes = [
            "rounded-dots",
            "rounded-dots-dark",
            "3d",
            "3d-dark",
            "3d-thick",
            "3d-thick-dark",
            "inset",
            "inset-dark",
            "inset-2",
            "inset-2-dark",
            "inset-3",
            "inset-3-dark",
          ],
          disabledScrollButtonsThemes = ["minimal", "minimal-dark"],
          enabledAutoHideScrollbarThemes = ["minimal", "minimal-dark"],
          scrollbarPositionOutsideThemes = ["minimal", "minimal-dark"];
        obj.autoDraggerLength =
          $.inArray(obj.theme, fixedSizeScrollbarThemes) > -1
            ? false
            : obj.autoDraggerLength;
        obj.autoExpandScrollbar =
          $.inArray(obj.theme, nonExpandedScrollbarThemes) > -1
            ? false
            : obj.autoExpandScrollbar;
        obj.scrollButtons.enable =
          $.inArray(obj.theme, disabledScrollButtonsThemes) > -1
            ? false
            : obj.scrollButtons.enable;
        obj.autoHideScrollbar =
          $.inArray(obj.theme, enabledAutoHideScrollbarThemes) > -1
            ? true
            : obj.autoHideScrollbar;
        obj.scrollbarPosition =
          $.inArray(obj.theme, scrollbarPositionOutsideThemes) > -1
            ? "outside"
            : obj.scrollbarPosition;
      },
      /* -------------------- */

      /* live option timers removal */
      removeLiveTimers = function (selector) {
        if (liveTimers[selector]) {
          clearTimeout(liveTimers[selector]);
          _delete(liveTimers, selector);
        }
      },
      /* -------------------- */

      /* normalizes axis option to valid values: "y", "x", "yx" */
      _findAxis = function (val) {
        return val === "yx" || val === "xy" || val === "auto"
          ? "yx"
          : val === "x" || val === "horizontal"
          ? "x"
          : "y";
      },
      /* -------------------- */

      /* normalizes scrollButtons.scrollType option to valid values: "stepless", "stepped" */
      _findScrollButtonsType = function (val) {
        return val === "stepped" ||
          val === "pixels" ||
          val === "step" ||
          val === "click"
          ? "stepped"
          : "stepless";
      },
      /* -------------------- */

      /* generates plugin markup */
      _pluginMarkup = function () {
        var $this = $(this),
          d = $this.data(pluginPfx),
          o = d.opt,
          expandClass = o.autoExpandScrollbar
            ? " " + classes[1] + "_expand"
            : "",
          scrollbar = [
            "<div id='mCSB_" +
              d.idx +
              "_scrollbar_vertical' class='mCSB_scrollTools mCSB_" +
              d.idx +
              "_scrollbar mCS-" +
              o.theme +
              " mCSB_scrollTools_vertical" +
              expandClass +
              "'><div class='" +
              classes[12] +
              "'><div id='mCSB_" +
              d.idx +
              "_dragger_vertical' class='mCSB_dragger' style='position:absolute;'> <div class='mCSB_dragger_bar'></div></div><div class='mCSB_draggerRail'></div></div>",
            "<div id='mCSB_" +
              d.idx +
              "_scrollbar_horizontal' class='mCSB_scrollTools mCSB_" +
              d.idx +
              "_scrollbar mCS-" +
              o.theme +
              " mCSB_scrollTools_horizontal" +
              expandClass +
              "'><div class='" +
              classes[12] +
              "'><div id='mCSB_" +
              d.idx +
              "_dragger_horizontal' class='mCSB_dragger' style='position:absolute;'> <div class='mCSB_dragger_bar'></div></div><div class='mCSB_draggerRail'></div></div>",
          ],
          wrapperClass =
            o.axis === "yx"
              ? "mCSB_vertical_horizontal"
              : o.axis === "x"
              ? "mCSB_horizontal"
              : "mCSB_vertical",
          scrollbars =
            o.axis === "yx"
              ? scrollbar[0] + scrollbar[1]
              : o.axis === "x"
              ? scrollbar[1]
              : scrollbar[0],
          contentWrapper =
            o.axis === "yx"
              ? "<div id='mCSB_" +
                d.idx +
                "_container_wrapper' class='mCSB_container_wrapper' />"
              : "",
          autoHideClass = o.autoHideScrollbar ? " " + classes[6] : "",
          scrollbarDirClass =
            o.axis !== "x" && d.langDir === "rtl" ? " " + classes[7] : "";
        if (o.setWidth) {
          $this.css("width", o.setWidth);
        } /* set element width */
        if (o.setHeight) {
          $this.css("height", o.setHeight);
        } /* set element height */
        o.setLeft =
          o.axis !== "y" && d.langDir === "rtl"
            ? "989999px"
            : o.setLeft; /* adjust left position for rtl direction */
        $this
          .addClass(
            pluginNS +
              " _" +
              pluginPfx +
              "_" +
              d.idx +
              autoHideClass +
              scrollbarDirClass
          )
          .wrapInner(
            "<div id='mCSB_" +
              d.idx +
              "' class='mCustomScrollBox mCS-" +
              o.theme +
              " " +
              wrapperClass +
              "'><div id='mCSB_" +
              d.idx +
              "_container' class='mCSB_container' style='position:relative; top:" +
              o.setTop +
              "; left:" +
              o.setLeft +
              ";' dir='" +
              d.langDir +
              "' /></div>"
          );
        var mCustomScrollBox = $("#mCSB_" + d.idx),
          mCSB_container = $("#mCSB_" + d.idx + "_container");
        if (o.axis !== "y" && !o.advanced.autoExpandHorizontalScroll) {
          mCSB_container.css("width", _contentWidth(mCSB_container));
        }
        if (o.scrollbarPosition === "outside") {
          if ($this.css("position") === "static") {
            /* requires elements with non-static position */
            $this.css("position", "relative");
          }
          $this.css("overflow", "visible");
          mCustomScrollBox.addClass("mCSB_outside").after(scrollbars);
        } else {
          mCustomScrollBox.addClass("mCSB_inside").append(scrollbars);
          mCSB_container.wrap(contentWrapper);
        }
        _scrollButtons.call(this); /* add scrollbar buttons */
        /* minimum dragger length */
        var mCSB_dragger = [
          $("#mCSB_" + d.idx + "_dragger_vertical"),
          $("#mCSB_" + d.idx + "_dragger_horizontal"),
        ];
        mCSB_dragger[0].css("min-height", mCSB_dragger[0].height());
        mCSB_dragger[1].css("min-width", mCSB_dragger[1].width());
      },
      /* -------------------- */

      /* calculates content width */
      // 20200511 START 이상현 - tab의 너비 계산을 반응형에 맞게 수정
      _contentWidth = function (el) {
        var val = [
            el[0].scrollWidth,
            Math.max.apply(
              Math,
              el
                .children()
                .map(function () {
                  return Math.ceil($(this).outerWidth(true));
                })
                .get()
            ),
          ],
          w = el.parent().width();
        if ($(window).innerWidth() < 768) {
          return val[1] > w ? val[1] : "100%";
        } else {
          return val[0] > w ? val[0] : val[1] > w ? val[1] : "100%";
        }
      },
      // 20200511 END
      /* -------------------- */

      /* expands content horizontally */
      _expandContentHorizontally = function () {
        var $this = $(this),
          d = $this.data(pluginPfx),
          o = d.opt,
          mCSB_container = $("#mCSB_" + d.idx + "_container");
        if (o.advanced.autoExpandHorizontalScroll && o.axis !== "y") {
          /* calculate scrollWidth */
          mCSB_container.css({
            width: "auto",
            "min-width": 0,
            "overflow-x": "scroll",
          });
          var w = Math.ceil(mCSB_container[0].scrollWidth);
          if (
            o.advanced.autoExpandHorizontalScroll === 3 ||
            (o.advanced.autoExpandHorizontalScroll !== 2 &&
              w > mCSB_container.parent().width())
          ) {
            mCSB_container.css({
              width: w,
              "min-width": "100%",
              "overflow-x": "inherit",
            });
          } else {
            /* 
						wrap content with an infinite width div and set its position to absolute and width to auto. 
						Setting width to auto before calculating the actual width is important! 
						We must let the browser set the width as browser zoom values are impossible to calculate.
						*/
            mCSB_container
              .css({ "overflow-x": "inherit", position: "absolute" })
              .wrap(
                "<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />"
              )
              .css({
                /* set actual width, original position and un-wrap */
                /* 
								get the exact width (with decimals) and then round-up. 
								Using jquery outerWidth() will round the width value which will mess up with inner elements that have non-integer width
								*/
                width:
                  Math.ceil(
                    mCSB_container[0].getBoundingClientRect().right + 0.4
                  ) -
                  Math.floor(mCSB_container[0].getBoundingClientRect().left),
                "min-width": "100%",
                position: "relative",
              })
              .unwrap();
          }
        }
      },
      /* -------------------- */

      /* adds scrollbar buttons */
      _scrollButtons = function () {
        var $this = $(this),
          d = $this.data(pluginPfx),
          o = d.opt,
          mCSB_scrollTools = $(".mCSB_" + d.idx + "_scrollbar:first"),
          tabindex = !_isNumeric(o.scrollButtons.tabindex)
            ? ""
            : "tabindex='" + o.scrollButtons.tabindex + "'",
          btnHTML = [
            "<a href='#' class='" + classes[13] + "' " + tabindex + " />",
            "<a href='#' class='" + classes[14] + "' " + tabindex + " />",
            "<a href='#' class='" + classes[15] + "' " + tabindex + " />",
            "<a href='#' class='" + classes[16] + "' " + tabindex + " />",
          ],
          btn = [
            o.axis === "x" ? btnHTML[2] : btnHTML[0],
            o.axis === "x" ? btnHTML[3] : btnHTML[1],
            btnHTML[2],
            btnHTML[3],
          ];
        if (o.scrollButtons.enable) {
          mCSB_scrollTools
            .prepend(btn[0])
            .append(btn[1])
            .next(".mCSB_scrollTools")
            .prepend(btn[2])
            .append(btn[3]);
        }
      },
      /* -------------------- */

      /* auto-adjusts scrollbar dragger length */
      _setDraggerLength = function () {
        var $this = $(this),
          d = $this.data(pluginPfx),
          mCustomScrollBox = $("#mCSB_" + d.idx),
          mCSB_container = $("#mCSB_" + d.idx + "_container"),
          mCSB_dragger = [
            $("#mCSB_" + d.idx + "_dragger_vertical"),
            $("#mCSB_" + d.idx + "_dragger_horizontal"),
          ],
          ratio = [
            mCustomScrollBox.height() / mCSB_container.outerHeight(false),
            mCustomScrollBox.width() / mCSB_container.outerWidth(false),
          ],
          l = [
            parseInt(mCSB_dragger[0].css("min-height")),
            Math.round(ratio[0] * mCSB_dragger[0].parent().height()),
            parseInt(mCSB_dragger[1].css("min-width")),
            Math.round(ratio[1] * mCSB_dragger[1].parent().width()),
          ],
          h = oldIE && l[1] < l[0] ? l[0] : l[1],
          w = oldIE && l[3] < l[2] ? l[2] : l[3];
        mCSB_dragger[0]
          .css({
            height: h,
            "max-height": mCSB_dragger[0].parent().height() - 10,
          })
          .find(".mCSB_dragger_bar")
          .css({ "line-height": l[0] + "px" });
        mCSB_dragger[1].css({
          width: w,
          "max-width": mCSB_dragger[1].parent().width() - 10,
        });
      },
      /* -------------------- */

      /* calculates scrollbar to content ratio */
      _scrollRatio = function () {
        var $this = $(this),
          d = $this.data(pluginPfx),
          mCustomScrollBox = $("#mCSB_" + d.idx),
          mCSB_container = $("#mCSB_" + d.idx + "_container"),
          mCSB_dragger = [
            $("#mCSB_" + d.idx + "_dragger_vertical"),
            $("#mCSB_" + d.idx + "_dragger_horizontal"),
          ],
          scrollAmount = [
            mCSB_container.outerHeight(false) - mCustomScrollBox.height(),
            mCSB_container.outerWidth(false) - mCustomScrollBox.width(),
          ],
          ratio = [
            scrollAmount[0] /
              (mCSB_dragger[0].parent().height() - mCSB_dragger[0].height()),
            scrollAmount[1] /
              (mCSB_dragger[1].parent().width() - mCSB_dragger[1].width()),
          ];
        d.scrollRatio = { y: ratio[0], x: ratio[1] };
      },
      /* -------------------- */

      /* toggles scrolling classes */
      _onDragClasses = function (el, action, xpnd) {
        var expandClass = xpnd ? classes[0] + "_expanded" : "",
          scrollbar = el.closest(".mCSB_scrollTools");
        if (action === "active") {
          el.toggleClass(classes[0] + " " + expandClass);
          scrollbar.toggleClass(classes[1]);
          el[0]._draggable = el[0]._draggable ? 0 : 1;
        } else {
          if (!el[0]._draggable) {
            if (action === "hide") {
              el.removeClass(classes[0]);
              scrollbar.removeClass(classes[1]);
            } else {
              el.addClass(classes[0]);
              scrollbar.addClass(classes[1]);
            }
          }
        }
      },
      /* -------------------- */

      /* checks if content overflows its container to determine if scrolling is required */
      _overflowed = function () {
        var $this = $(this),
          d = $this.data(pluginPfx),
          mCustomScrollBox = $("#mCSB_" + d.idx),
          mCSB_container = $("#mCSB_" + d.idx + "_container");

        var cacheStyle = mCSB_container.attr("style");
        var innerWidth = mCSB_container
          .css({
            width: "auto",
            position: "absolute",
          })
          .outerWidth();
        mCSB_container.attr("style", cacheStyle);

        var contentHeight =
            d.overflowed == null
              ? mCSB_container.height()
              : mCSB_container.outerHeight(false),
          contentWidth = d.overflowed == null ? innerWidth : innerWidth,
          h = mCSB_container[0].scrollHeight,
          w = mCSB_container[0].scrollWidth;
        if (h > contentHeight) {
          contentHeight = h;
        }
        if (w > contentWidth) {
          contentWidth = w;
        }

        return [
          contentHeight > mCustomScrollBox.height(),
          contentWidth > mCustomScrollBox.width(),
        ];
      },
      /* -------------------- */

      /* resets content position to 0 */
      _resetContentPosition = function () {
        var $this = $(this),
          d = $this.data(pluginPfx),
          o = d.opt,
          mCustomScrollBox = $("#mCSB_" + d.idx),
          mCSB_container = $("#mCSB_" + d.idx + "_container"),
          mCSB_dragger = [
            $("#mCSB_" + d.idx + "_dragger_vertical"),
            $("#mCSB_" + d.idx + "_dragger_horizontal"),
          ];
        _stop($this); /* stop any current scrolling before resetting */
        if (
          (o.axis !== "x" && !d.overflowed[0]) ||
          (o.axis === "y" && d.overflowed[0])
        ) {
          /* reset y */
          mCSB_dragger[0].add(mCSB_container).css("top", 0);
          _scrollTo($this, "_resetY");
        }
        if (
          (o.axis !== "y" && !d.overflowed[1]) ||
          (o.axis === "x" && d.overflowed[1])
        ) {
          /* reset x */
          var cx = (dx = 0);
          if (d.langDir === "rtl") {
            /* adjust left position for rtl direction */
            cx = mCustomScrollBox.width() - mCSB_container.outerWidth(false);
            dx = Math.abs(cx / d.scrollRatio.x);
          }
          mCSB_container.css("left", cx);
          mCSB_dragger[1].css("left", dx);
          _scrollTo($this, "_resetX");
        }
      },
      /* -------------------- */

      /* binds scrollbar events */
      _bindEvents = function () {
        var $this = $(this),
          d = $this.data(pluginPfx),
          o = d.opt;
        if (!d.bindEvents) {
          /* check if events are already bound */
          _draggable.call(this);
          if (o.contentTouchScroll) {
            _contentDraggable.call(this);
          }
          _selectable.call(this);
          if (o.mouseWheel.enable) {
            /* bind mousewheel fn when plugin is available */
            function _mwt() {
              mousewheelTimeout = setTimeout(function () {
                if (!$.event.special.mousewheel) {
                  _mwt();
                } else {
                  clearTimeout(mousewheelTimeout);
                  _mousewheel.call($this[0]);
                }
              }, 100);
            }
            var mousewheelTimeout;
            _mwt();
          }
          _draggerRail.call(this);
          _wrapperScroll.call(this);
          if (o.advanced.autoScrollOnFocus) {
            _focus.call(this);
          }
          if (o.scrollButtons.enable) {
            _buttons.call(this);
          }
          if (o.keyboard.enable) {
            _keyboard.call(this);
          }
          d.bindEvents = true;
        }
      },
      /* -------------------- */

      /* unbinds scrollbar events */
      _unbindEvents = function () {
        var $this = $(this),
          d = $this.data(pluginPfx),
          o = d.opt,
          namespace = pluginPfx + "_" + d.idx,
          sb = ".mCSB_" + d.idx + "_scrollbar",
          sel = $(
            "#mCSB_" +
              d.idx +
              ",#mCSB_" +
              d.idx +
              "_container,#mCSB_" +
              d.idx +
              "_container_wrapper," +
              sb +
              " ." +
              classes[12] +
              ",#mCSB_" +
              d.idx +
              "_dragger_vertical,#mCSB_" +
              d.idx +
              "_dragger_horizontal," +
              sb +
              ">a"
          ),
          mCSB_container = $("#mCSB_" + d.idx + "_container");
        if (o.advanced.releaseDraggableSelectors) {
          sel.add($(o.advanced.releaseDraggableSelectors));
        }
        if (o.advanced.extraDraggableSelectors) {
          sel.add($(o.advanced.extraDraggableSelectors));
        }
        if (d.bindEvents) {
          /* check if events are bound */
          /* unbind namespaced events from document/selectors */
          $(document)
            .add($(!_canAccessIFrame() || top.document))
            .unbind("." + namespace);
          sel.each(function () {
            $(this).unbind("." + namespace);
          });
          /* clear and delete timeouts/objects */
          clearTimeout($this[0]._focusTimeout);
          _delete($this[0], "_focusTimeout");
          clearTimeout(d.sequential.step);
          _delete(d.sequential, "step");
          clearTimeout(mCSB_container[0].onCompleteTimeout);
          _delete(mCSB_container[0], "onCompleteTimeout");
          d.bindEvents = false;
        }
      },
      /* -------------------- */

      /* toggles scrollbar visibility */
      _scrollbarVisibility = function (disabled) {
        var $this = $(this),
          d = $this.data(pluginPfx),
          o = d.opt,
          contentWrapper = $("#mCSB_" + d.idx + "_container_wrapper"),
          content = contentWrapper.length
            ? contentWrapper
            : $("#mCSB_" + d.idx + "_container"),
          scrollbar = [
            $("#mCSB_" + d.idx + "_scrollbar_vertical"),
            $("#mCSB_" + d.idx + "_scrollbar_horizontal"),
          ],
          mCSB_dragger = [
            scrollbar[0].find(".mCSB_dragger"),
            scrollbar[1].find(".mCSB_dragger"),
          ];
        if (o.axis !== "x") {
          if (d.overflowed[0] && !disabled) {
            scrollbar[0]
              .add(mCSB_dragger[0])
              .add(scrollbar[0].children("a"))
              .css("display", "block");
            content.removeClass(classes[8] + " " + classes[10]);
          } else {
            if (o.alwaysShowScrollbar) {
              if (o.alwaysShowScrollbar !== 2) {
                mCSB_dragger[0].css("display", "none");
              }
              content.removeClass(classes[10]);
            } else {
              scrollbar[0].css("display", "none");
              content.addClass(classes[10]);
            }
            content.addClass(classes[8]);
          }
        }
        if (o.axis !== "y") {
          if (d.overflowed[1] && !disabled) {
            scrollbar[1]
              .add(mCSB_dragger[1])
              .add(scrollbar[1].children("a"))
              .css("display", "block");
            content.removeClass(classes[9] + " " + classes[11]);
          } else {
            if (o.alwaysShowScrollbar) {
              if (o.alwaysShowScrollbar !== 2) {
                mCSB_dragger[1].css("display", "none");
              }
              content.removeClass(classes[11]);
            } else {
              scrollbar[1].css("display", "none");
              content.addClass(classes[11]);
            }
            content.addClass(classes[9]);
          }
        }
        if (
          (o.axis == "y" && !d.overflowed[0]) ||
          (o.axis == "x" && !d.overflowed[1])
        ) {
          $this.addClass(classes[5]);
        } else {
          $this.removeClass(classes[5]);
        }
      },
      /* -------------------- */

      /* returns input coordinates of pointer, touch and mouse events (relative to document) */
      _coordinates = function (e) {
        var t = e.type,
          o =
            e.target.ownerDocument !== document && frameElement !== null
              ? [$(frameElement).offset().top, $(frameElement).offset().left]
              : null,
          io =
            _canAccessIFrame() &&
            e.target.ownerDocument !== top.document &&
            frameElement !== null
              ? [
                  $(e.view.frameElement).offset().top,
                  $(e.view.frameElement).offset().left,
                ]
              : [0, 0];
        switch (t) {
          case "pointerdown":
          case "MSPointerDown":
          case "pointermove":
          case "MSPointerMove":
          case "pointerup":
          case "MSPointerUp":
            return o
              ? [
                  e.originalEvent.pageY - o[0] + io[0],
                  e.originalEvent.pageX - o[1] + io[1],
                  false,
                ]
              : [e.originalEvent.pageY, e.originalEvent.pageX, false];
            break;
          case "touchstart":
          case "touchmove":
          case "touchend":
            var touch =
                e.originalEvent.touches[0] || e.originalEvent.changedTouches[0],
              touches =
                e.originalEvent.touches.length ||
                e.originalEvent.changedTouches.length;
            return e.target.ownerDocument !== document
              ? [touch.screenY, touch.screenX, touches > 1]
              : [touch.pageY, touch.pageX, touches > 1];
            break;
          default:
            return o
              ? [e.pageY - o[0] + io[0], e.pageX - o[1] + io[1], false]
              : [e.pageY, e.pageX, false];
        }
      },
      /* -------------------- */

      /* 
			SCROLLBAR DRAG EVENTS
			scrolls content via scrollbar dragging 
			*/
      _draggable = function () {
        var $this = $(this),
          d = $this.data(pluginPfx),
          o = d.opt,
          namespace = pluginPfx + "_" + d.idx,
          draggerId = [
            "mCSB_" + d.idx + "_dragger_vertical",
            "mCSB_" + d.idx + "_dragger_horizontal",
          ],
          mCSB_container = $("#mCSB_" + d.idx + "_container"),
          mCSB_dragger = $("#" + draggerId[0] + ",#" + draggerId[1]),
          draggable,
          dragY,
          dragX,
          rds = o.advanced.releaseDraggableSelectors
            ? mCSB_dragger.add($(o.advanced.releaseDraggableSelectors))
            : mCSB_dragger,
          eds = o.advanced.extraDraggableSelectors
            ? $(!_canAccessIFrame() || top.document).add(
                $(o.advanced.extraDraggableSelectors)
              )
            : $(!_canAccessIFrame() || top.document);
        mCSB_dragger
          .bind("contextmenu." + namespace, function (e) {
            e.preventDefault(); //prevent right click
          })
          .bind(
            "mousedown." +
              namespace +
              " touchstart." +
              namespace +
              " pointerdown." +
              namespace +
              " MSPointerDown." +
              namespace,
            function (e) {
              e.stopImmediatePropagation();
              e.preventDefault();
              if (!_mouseBtnLeft(e)) {
                return;
              } /* left mouse button only */
              touchActive = true;
              if (oldIE) {
                document.onselectstart = function () {
                  return false;
                };
              } /* disable text selection for IE < 9 */
              _iframe.call(
                mCSB_container,
                false
              ); /* enable scrollbar dragging over iframes by disabling their events */
              _stop($this);
              draggable = $(this);
              var offset = draggable.offset(),
                y = _coordinates(e)[0] - offset.top,
                x = _coordinates(e)[1] - offset.left,
                h = draggable.height() + offset.top,
                w = draggable.width() + offset.left;
              if (y < h && y > 0 && x < w && x > 0) {
                dragY = y;
                dragX = x;
              }
              _onDragClasses(draggable, "active", o.autoExpandScrollbar);
            }
          )
          .bind("touchmove." + namespace, function (e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            var offset = draggable.offset(),
              y = _coordinates(e)[0] - offset.top,
              x = _coordinates(e)[1] - offset.left;
            _drag(dragY, dragX, y, x);
          });
        $(document)
          .add(eds)
          .bind(
            "mousemove." +
              namespace +
              " pointermove." +
              namespace +
              " MSPointerMove." +
              namespace,
            function (e) {
              if (draggable) {
                var offset = draggable.offset(),
                  y = _coordinates(e)[0] - offset.top,
                  x = _coordinates(e)[1] - offset.left;
                if (dragY === y && dragX === x) {
                  return;
                } /* has it really moved? */
                _drag(dragY, dragX, y, x);
              }
            }
          )
          .add(rds)
          .bind(
            "mouseup." +
              namespace +
              " touchend." +
              namespace +
              " pointerup." +
              namespace +
              " MSPointerUp." +
              namespace,
            function (e) {
              if (draggable) {
                _onDragClasses(draggable, "active", o.autoExpandScrollbar);
                draggable = null;
              }
              touchActive = false;
              if (oldIE) {
                document.onselectstart = null;
              } /* enable text selection for IE < 9 */
              _iframe.call(mCSB_container, true); /* enable iframes events */
            }
          );
        function _drag(dragY, dragX, y, x) {
          mCSB_container[0].idleTimer = o.scrollInertia < 233 ? 250 : 0;
          if (draggable.attr("id") === draggerId[1]) {
            var dir = "x",
              to = (draggable[0].offsetLeft - dragX + x) * d.scrollRatio.x;
          } else {
            var dir = "y",
              to = (draggable[0].offsetTop - dragY + y) * d.scrollRatio.y;
          }
          _scrollTo($this, to.toString(), { dir: dir, drag: true });
        }
      },
      /* -------------------- */

      /* 
			TOUCH SWIPE EVENTS
			scrolls content via touch swipe 
			Emulates the native touch-swipe scrolling with momentum found in iOS, Android and WP devices 
			*/
      _contentDraggable = function () {
        var $this = $(this),
          d = $this.data(pluginPfx),
          o = d.opt,
          namespace = pluginPfx + "_" + d.idx,
          mCustomScrollBox = $("#mCSB_" + d.idx),
          mCSB_container = $("#mCSB_" + d.idx + "_container"),
          mCSB_dragger = [
            $("#mCSB_" + d.idx + "_dragger_vertical"),
            $("#mCSB_" + d.idx + "_dragger_horizontal"),
          ],
          draggable,
          dragY,
          dragX,
          touchStartY,
          touchStartX,
          touchMoveY = [],
          touchMoveX = [],
          startTime,
          runningTime,
          endTime,
          distance,
          speed,
          amount,
          durA = 0,
          durB,
          overwrite = o.axis === "yx" ? "none" : "all",
          touchIntent = [],
          touchDrag,
          docDrag,
          iframe = mCSB_container.find("iframe"),
          events = [
            "touchstart." +
              namespace +
              " pointerdown." +
              namespace +
              " MSPointerDown." +
              namespace, //start
            "touchmove." +
              namespace +
              " pointermove." +
              namespace +
              " MSPointerMove." +
              namespace, //move
            "touchend." +
              namespace +
              " pointerup." +
              namespace +
              " MSPointerUp." +
              namespace, //end
          ],
          touchAction =
            document.body.style.touchAction !== undefined &&
            document.body.style.touchAction !== "";
        mCSB_container
          .bind(events[0], function (e) {
            _onTouchstart(e);
          })
          .bind(events[1], function (e) {
            _onTouchmove(e);
          });
        mCustomScrollBox
          .bind(events[0], function (e) {
            _onTouchstart2(e);
          })
          .bind(events[2], function (e) {
            _onTouchend(e);
          });
        if (iframe.length) {
          iframe.each(function () {
            $(this).bind("load", function () {
              /* bind events on accessible iframes */
              if (_canAccessIFrame(this)) {
                $(this.contentDocument || this.contentWindow.document)
                  .bind(events[0], function (e) {
                    _onTouchstart(e);
                    _onTouchstart2(e);
                  })
                  .bind(events[1], function (e) {
                    _onTouchmove(e);
                  })
                  .bind(events[2], function (e) {
                    _onTouchend(e);
                  });
              }
            });
          });
        }
        function _onTouchstart(e) {
          if (!_pointerTouch(e) || touchActive || _coordinates(e)[2]) {
            touchable = 0;
            return;
          }
          touchable = 1;
          touchDrag = 0;
          docDrag = 0;
          draggable = 1;
          $this.removeClass("mCS_touch_action");
          var offset = mCSB_container.offset();
          dragY = _coordinates(e)[0] - offset.top;
          dragX = _coordinates(e)[1] - offset.left;
          touchIntent = [_coordinates(e)[0], _coordinates(e)[1]];
        }
        function _onTouchmove(e) {
          if (!_pointerTouch(e) || touchActive || _coordinates(e)[2]) {
            return;
          }
          if (!o.documentTouchScroll) {
            e.preventDefault();
          }
          e.stopImmediatePropagation();
          if (docDrag && !touchDrag) {
            return;
          }
          if (draggable) {
            runningTime = _getTime();
            var offset = mCustomScrollBox.offset(),
              y = _coordinates(e)[0] - offset.top,
              x = _coordinates(e)[1] - offset.left,
              easing = "mcsLinearOut";
            touchMoveY.push(y);
            touchMoveX.push(x);
            touchIntent[2] = Math.abs(_coordinates(e)[0] - touchIntent[0]);
            touchIntent[3] = Math.abs(_coordinates(e)[1] - touchIntent[1]);
            if (d.overflowed[0]) {
              var limit =
                  mCSB_dragger[0].parent().height() - mCSB_dragger[0].height(),
                prevent =
                  dragY - y > 0 &&
                  y - dragY > -(limit * d.scrollRatio.y) &&
                  (touchIntent[3] * 2 < touchIntent[2] || o.axis === "yx");
            }
            if (d.overflowed[1]) {
              var limitX =
                  mCSB_dragger[1].parent().width() - mCSB_dragger[1].width(),
                preventX =
                  dragX - x > 0 &&
                  x - dragX > -(limitX * d.scrollRatio.x) &&
                  (touchIntent[2] * 2 < touchIntent[3] || o.axis === "yx");
            }
            if (prevent || preventX) {
              /* prevent native document scrolling */
              if (!touchAction) {
                e.preventDefault();
              }
              touchDrag = 1;
            } else {
              docDrag = 1;
              $this.addClass("mCS_touch_action");
            }
            if (touchAction) {
              e.preventDefault();
            }
            amount =
              o.axis === "yx"
                ? [dragY - y, dragX - x]
                : o.axis === "x"
                ? [null, dragX - x]
                : [dragY - y, null];
            mCSB_container[0].idleTimer = 250;
            if (d.overflowed[0]) {
              _drag(amount[0], durA, easing, "y", "all", true);
            }
            if (d.overflowed[1]) {
              _drag(amount[1], durA, easing, "x", overwrite, true);
            }
          }
        }
        function _onTouchstart2(e) {
          if (!_pointerTouch(e) || touchActive || _coordinates(e)[2]) {
            touchable = 0;
            return;
          }
          touchable = 1;
          e.stopImmediatePropagation();
          _stop($this);
          startTime = _getTime();
          var offset = mCustomScrollBox.offset();
          touchStartY = _coordinates(e)[0] - offset.top;
          touchStartX = _coordinates(e)[1] - offset.left;
          touchMoveY = [];
          touchMoveX = [];
        }
        function _onTouchend(e) {
          if (!_pointerTouch(e) || touchActive || _coordinates(e)[2]) {
            return;
          }
          draggable = 0;
          e.stopImmediatePropagation();
          touchDrag = 0;
          docDrag = 0;
          endTime = _getTime();
          var offset = mCustomScrollBox.offset(),
            y = _coordinates(e)[0] - offset.top,
            x = _coordinates(e)[1] - offset.left;
          if (endTime - runningTime > 30) {
            return;
          }
          speed = 1000 / (endTime - startTime);
          var easing = "mcsEaseOut",
            slow = speed < 2.5,
            diff = slow
              ? [
                  touchMoveY[touchMoveY.length - 2],
                  touchMoveX[touchMoveX.length - 2],
                ]
              : [0, 0];
          distance = slow
            ? [y - diff[0], x - diff[1]]
            : [y - touchStartY, x - touchStartX];
          var absDistance = [Math.abs(distance[0]), Math.abs(distance[1])];
          speed = slow
            ? [Math.abs(distance[0] / 4), Math.abs(distance[1] / 4)]
            : [speed, speed];
          var a = [
            Math.abs(mCSB_container[0].offsetTop) -
              distance[0] * _m(absDistance[0] / speed[0], speed[0]),
            Math.abs(mCSB_container[0].offsetLeft) -
              distance[1] * _m(absDistance[1] / speed[1], speed[1]),
          ];
          amount =
            o.axis === "yx"
              ? [a[0], a[1]]
              : o.axis === "x"
              ? [null, a[1]]
              : [a[0], null];
          durB = [
            absDistance[0] * 4 + o.scrollInertia,
            absDistance[1] * 4 + o.scrollInertia,
          ];
          var md =
            parseInt(o.contentTouchScroll) ||
            0; /* absolute minimum distance required */
          amount[0] = absDistance[0] > md ? amount[0] : 0;
          amount[1] = absDistance[1] > md ? amount[1] : 0;
          if (d.overflowed[0]) {
            _drag(amount[0], durB[0], easing, "y", overwrite, false);
          }
          if (d.overflowed[1]) {
            _drag(amount[1], durB[1], easing, "x", overwrite, false);
          }
        }
        function _m(ds, s) {
          var r = [s * 1.5, s * 2, s / 1.5, s / 2];
          if (ds > 90) {
            return s > 4 ? r[0] : r[3];
          } else if (ds > 60) {
            return s > 3 ? r[3] : r[2];
          } else if (ds > 30) {
            return s > 8 ? r[1] : s > 6 ? r[0] : s > 4 ? s : r[2];
          } else {
            return s > 8 ? s : r[3];
          }
        }
        function _drag(amount, dur, easing, dir, overwrite, drag) {
          if (!amount) {
            return;
          }
          _scrollTo($this, amount.toString(), {
            dur: dur,
            scrollEasing: easing,
            dir: dir,
            overwrite: overwrite,
            drag: drag,
          });
        }
      },
      /* -------------------- */

      /* 
			SELECT TEXT EVENTS 
			scrolls content when text is selected 
			*/
      _selectable = function () {
        var $this = $(this),
          d = $this.data(pluginPfx),
          o = d.opt,
          seq = d.sequential,
          namespace = pluginPfx + "_" + d.idx,
          mCSB_container = $("#mCSB_" + d.idx + "_container"),
          wrapper = mCSB_container.parent(),
          action;
        mCSB_container
          .bind("mousedown." + namespace, function (e) {
            if (touchable) {
              return;
            }
            if (!action) {
              action = 1;
              touchActive = true;
            }
          })
          .add(document)
          .bind("mousemove." + namespace, function (e) {
            if (!touchable && action && _sel()) {
              var offset = mCSB_container.offset(),
                y =
                  _coordinates(e)[0] - offset.top + mCSB_container[0].offsetTop,
                x =
                  _coordinates(e)[1] -
                  offset.left +
                  mCSB_container[0].offsetLeft;
              if (
                y > 0 &&
                y < wrapper.height() &&
                x > 0 &&
                x < wrapper.width()
              ) {
                if (seq.step) {
                  _seq("off", null, "stepped");
                }
              } else {
                if (o.axis !== "x" && d.overflowed[0]) {
                  if (y < 0) {
                    _seq("on", 38);
                  } else if (y > wrapper.height()) {
                    _seq("on", 40);
                  }
                }
                if (o.axis !== "y" && d.overflowed[1]) {
                  if (x < 0) {
                    _seq("on", 37);
                  } else if (x > wrapper.width()) {
                    _seq("on", 39);
                  }
                }
              }
            }
          })
          .bind("mouseup." + namespace + " dragend." + namespace, function (e) {
            if (touchable) {
              return;
            }
            if (action) {
              action = 0;
              _seq("off", null);
            }
            touchActive = false;
          });
        function _sel() {
          return window.getSelection
            ? window.getSelection().toString()
            : document.selection && document.selection.type != "Control"
            ? document.selection.createRange().text
            : 0;
        }
        function _seq(a, c, s) {
          seq.type = s && action ? "stepped" : "stepless";
          seq.scrollAmount = 10;
          _sequentialScroll($this, a, c, "mcsLinearOut", s ? 60 : null);
        }
      },
      /* -------------------- */

      /* 
			MOUSE WHEEL EVENT
			scrolls content via mouse-wheel 
			via mouse-wheel plugin (https://github.com/brandonaaron/jquery-mousewheel)
			*/
      _mousewheel = function () {
        if (!$(this).data(pluginPfx)) {
          return;
        } /* Check if the scrollbar is ready to use mousewheel events (issue: #185) */
        var $this = $(this),
          d = $this.data(pluginPfx),
          o = d.opt,
          namespace = pluginPfx + "_" + d.idx,
          mCustomScrollBox = $("#mCSB_" + d.idx),
          mCSB_dragger = [
            $("#mCSB_" + d.idx + "_dragger_vertical"),
            $("#mCSB_" + d.idx + "_dragger_horizontal"),
          ],
          iframe = $("#mCSB_" + d.idx + "_container").find("iframe");
        if (iframe.length) {
          iframe.each(function () {
            $(this).bind("load", function () {
              /* bind events on accessible iframes */
              if (_canAccessIFrame(this)) {
                $(this.contentDocument || this.contentWindow.document).bind(
                  "mousewheel." + namespace,
                  function (e, delta) {
                    _onMousewheel(e, delta);
                  }
                );
              }
            });
          });
        }
        mCustomScrollBox.bind("mousewheel." + namespace, function (e, delta) {
          _onMousewheel(e, delta);
        });
        function _onMousewheel(e, delta) {
          _stop($this);
          if (_disableMousewheel($this, e.target)) {
            return;
          } /* disables mouse-wheel when hovering specific elements */
          var deltaFactor =
              o.mouseWheel.deltaFactor !== "auto"
                ? parseInt(o.mouseWheel.deltaFactor)
                : oldIE && e.deltaFactor < 100
                ? 100
                : e.deltaFactor || 100,
            dur = o.scrollInertia;
          if (o.axis === "x" || o.mouseWheel.axis === "x") {
            var dir = "x",
              px = [
                Math.round(deltaFactor * d.scrollRatio.x),
                parseInt(o.mouseWheel.scrollAmount),
              ],
              amount =
                o.mouseWheel.scrollAmount !== "auto"
                  ? px[1]
                  : px[0] >= mCustomScrollBox.width()
                  ? mCustomScrollBox.width() * 0.9
                  : px[0],
              contentPos = Math.abs(
                $("#mCSB_" + d.idx + "_container")[0].offsetLeft
              ),
              draggerPos = mCSB_dragger[1][0].offsetLeft,
              limit =
                mCSB_dragger[1].parent().width() - mCSB_dragger[1].width(),
              dlt = o.mouseWheel.axis === "y" ? e.deltaY || delta : e.deltaX;
          } else {
            var dir = "y",
              px = [
                Math.round(deltaFactor * d.scrollRatio.y),
                parseInt(o.mouseWheel.scrollAmount),
              ],
              amount =
                o.mouseWheel.scrollAmount !== "auto"
                  ? px[1]
                  : px[0] >= mCustomScrollBox.height()
                  ? mCustomScrollBox.height() * 0.9
                  : px[0],
              contentPos = Math.abs(
                $("#mCSB_" + d.idx + "_container")[0].offsetTop
              ),
              draggerPos = mCSB_dragger[0][0].offsetTop,
              limit =
                mCSB_dragger[0].parent().height() - mCSB_dragger[0].height(),
              dlt = e.deltaY || delta;
          }
          if (
            (dir === "y" && !d.overflowed[0]) ||
            (dir === "x" && !d.overflowed[1])
          ) {
            return;
          }
          if (o.mouseWheel.invert || e.webkitDirectionInvertedFromDevice) {
            dlt = -dlt;
          }
          if (o.mouseWheel.normalizeDelta) {
            dlt = dlt < 0 ? -1 : 1;
          }
          if (
            (dlt > 0 && draggerPos !== 0) ||
            (dlt < 0 && draggerPos !== limit) ||
            o.mouseWheel.preventDefault
          ) {
            e.stopImmediatePropagation();
            e.preventDefault();
          }
          if (e.deltaFactor < 5 && !o.mouseWheel.normalizeDelta) {
            //very low deltaFactor values mean some kind of delta acceleration (e.g. osx trackpad), so adjusting scrolling accordingly
            amount = e.deltaFactor;
            dur = 17;
          }
          _scrollTo($this, (contentPos - dlt * amount).toString(), {
            dir: dir,
            dur: dur,
          });
        }
      },
      /* -------------------- */

      /* checks if iframe can be accessed */
      _canAccessIFrameCache = new Object(),
      _canAccessIFrame = function (iframe) {
        var result = false,
          cacheKey = false,
          html = null;
        if (iframe === undefined) {
          cacheKey = "#empty";
        } else if ($(iframe).attr("id") !== undefined) {
          cacheKey = $(iframe).attr("id");
        }
        if (
          cacheKey !== false &&
          _canAccessIFrameCache[cacheKey] !== undefined
        ) {
          return _canAccessIFrameCache[cacheKey];
        }
        if (!iframe) {
          try {
            var doc = top.document;
            html = doc.body.innerHTML;
          } catch (err) {
            /* do nothing */
          }
          result = html !== null;
        } else {
          try {
            var doc = iframe.contentDocument || iframe.contentWindow.document;
            html = doc.body.innerHTML;
          } catch (err) {
            /* do nothing */
          }
          result = html !== null;
        }
        if (cacheKey !== false) {
          _canAccessIFrameCache[cacheKey] = result;
        }
        return result;
      },
      /* -------------------- */

      /* switches iframe's pointer-events property (drag, mousewheel etc. over cross-domain iframes) */
      _iframe = function (evt) {
        var el = this.find("iframe");
        if (!el.length) {
          return;
        } /* check if content contains iframes */
        var val = !evt ? "none" : "auto";
        el.css(
          "pointer-events",
          val
        ); /* for IE11, iframe's display property should not be "block" */
      },
      /* -------------------- */

      /* disables mouse-wheel when hovering specific elements like select, datalist etc. */
      _disableMousewheel = function (el, target) {
        var tag = target.nodeName.toLowerCase(),
          tags = el.data(pluginPfx).opt.mouseWheel.disableOver,
          /* elements that require focus */
          focusTags = ["select", "textarea"];
        return (
          $.inArray(tag, tags) > -1 &&
          !($.inArray(tag, focusTags) > -1 && !$(target).is(":focus"))
        );
      },
      /* -------------------- */

      /* 
			DRAGGER RAIL CLICK EVENT
			scrolls content via dragger rail 
			*/
      _draggerRail = function () {
        var $this = $(this),
          d = $this.data(pluginPfx),
          namespace = pluginPfx + "_" + d.idx,
          mCSB_container = $("#mCSB_" + d.idx + "_container"),
          wrapper = mCSB_container.parent(),
          mCSB_draggerContainer = $(
            ".mCSB_" + d.idx + "_scrollbar ." + classes[12]
          ),
          clickable;
        mCSB_draggerContainer
          .bind(
            "mousedown." +
              namespace +
              " touchstart." +
              namespace +
              " pointerdown." +
              namespace +
              " MSPointerDown." +
              namespace,
            function (e) {
              touchActive = true;
              if (!$(e.target).hasClass("mCSB_dragger")) {
                clickable = 1;
              }
            }
          )
          .bind(
            "touchend." +
              namespace +
              " pointerup." +
              namespace +
              " MSPointerUp." +
              namespace,
            function (e) {
              touchActive = false;
            }
          )
          .bind("click." + namespace, function (e) {
            if (!clickable) {
              return;
            }
            clickable = 0;
            if (
              $(e.target).hasClass(classes[12]) ||
              $(e.target).hasClass("mCSB_draggerRail")
            ) {
              _stop($this);
              var el = $(this),
                mCSB_dragger = el.find(".mCSB_dragger");
              if (el.parent(".mCSB_scrollTools_horizontal").length > 0) {
                if (!d.overflowed[1]) {
                  return;
                }
                var dir = "x",
                  clickDir = e.pageX > mCSB_dragger.offset().left ? -1 : 1,
                  to =
                    Math.abs(mCSB_container[0].offsetLeft) -
                    clickDir * (wrapper.width() * 0.9);
              } else {
                if (!d.overflowed[0]) {
                  return;
                }
                var dir = "y",
                  clickDir = e.pageY > mCSB_dragger.offset().top ? -1 : 1,
                  to =
                    Math.abs(mCSB_container[0].offsetTop) -
                    clickDir * (wrapper.height() * 0.9);
              }
              _scrollTo($this, to.toString(), {
                dir: dir,
                scrollEasing: "mcsEaseInOut",
              });
            }
          });
      },
      /* -------------------- */

      /* 
			FOCUS EVENT
			scrolls content via element focus (e.g. clicking an input, pressing TAB key etc.)
			*/
      _focus = function () {
        var $this = $(this),
          d = $this.data(pluginPfx),
          o = d.opt,
          namespace = pluginPfx + "_" + d.idx,
          mCSB_container = $("#mCSB_" + d.idx + "_container"),
          wrapper = mCSB_container.parent();
        mCSB_container.bind("focusin." + namespace, function (e) {
          var el = $(document.activeElement),
            nested = mCSB_container.find(".mCustomScrollBox").length,
            dur = 0;
          if (!el.is(o.advanced.autoScrollOnFocus)) {
            return;
          }
          _stop($this);
          clearTimeout($this[0]._focusTimeout);
          $this[0]._focusTimer = nested ? (dur + 17) * nested : 0;
          $this[0]._focusTimeout = setTimeout(function () {
            var to = [_childPos(el)[0], _childPos(el)[1]],
              contentPos = [
                mCSB_container[0].offsetTop,
                mCSB_container[0].offsetLeft,
              ],
              isVisible = [
                contentPos[0] + to[0] >= 0 &&
                  contentPos[0] + to[0] <
                    wrapper.height() - el.outerHeight(false),
                contentPos[1] + to[1] >= 0 &&
                  contentPos[0] + to[1] <
                    wrapper.width() - el.outerWidth(false),
              ],
              overwrite =
                o.axis === "yx" && !isVisible[0] && !isVisible[1]
                  ? "none"
                  : "all";
            if (o.axis !== "x" && !isVisible[0]) {
              _scrollTo($this, to[0].toString(), {
                dir: "y",
                scrollEasing: "mcsEaseInOut",
                overwrite: overwrite,
                dur: dur,
              });
            }
            if (o.axis !== "y" && !isVisible[1]) {
              _scrollTo($this, to[1].toString(), {
                dir: "x",
                scrollEasing: "mcsEaseInOut",
                overwrite: overwrite,
                dur: dur,
              });
            }
          }, $this[0]._focusTimer);
        });
      },
      /* -------------------- */

      /* sets content wrapper scrollTop/scrollLeft always to 0 */
      _wrapperScroll = function () {
        var $this = $(this),
          d = $this.data(pluginPfx),
          namespace = pluginPfx + "_" + d.idx,
          wrapper = $("#mCSB_" + d.idx + "_container").parent();
        wrapper.bind("scroll." + namespace, function (e) {
          if (wrapper.scrollTop() !== 0 || wrapper.scrollLeft() !== 0) {
            $(".mCSB_" + d.idx + "_scrollbar").css(
              "visibility",
              "hidden"
            ); /* hide scrollbar(s) */
          }
        });
      },
      /* -------------------- */

      /* 
			BUTTONS EVENTS
			scrolls content via up, down, left and right buttons 
			*/
      _buttons = function () {
        var $this = $(this),
          d = $this.data(pluginPfx),
          o = d.opt,
          seq = d.sequential,
          namespace = pluginPfx + "_" + d.idx,
          sel = ".mCSB_" + d.idx + "_scrollbar",
          btn = $(sel + ">a");
        btn
          .bind("contextmenu." + namespace, function (e) {
            e.preventDefault(); //prevent right click
          })
          .bind(
            "mousedown." +
              namespace +
              " touchstart." +
              namespace +
              " pointerdown." +
              namespace +
              " MSPointerDown." +
              namespace +
              " mouseup." +
              namespace +
              " touchend." +
              namespace +
              " pointerup." +
              namespace +
              " MSPointerUp." +
              namespace +
              " mouseout." +
              namespace +
              " pointerout." +
              namespace +
              " MSPointerOut." +
              namespace +
              " click." +
              namespace,
            function (e) {
              e.preventDefault();
              if (!_mouseBtnLeft(e)) {
                return;
              } /* left mouse button only */
              var btnClass = $(this).attr("class");
              seq.type = o.scrollButtons.scrollType;
              switch (e.type) {
                case "mousedown":
                case "touchstart":
                case "pointerdown":
                case "MSPointerDown":
                  if (seq.type === "stepped") {
                    return;
                  }
                  touchActive = true;
                  d.tweenRunning = false;
                  _seq("on", btnClass);
                  break;
                case "mouseup":
                case "touchend":
                case "pointerup":
                case "MSPointerUp":
                case "mouseout":
                case "pointerout":
                case "MSPointerOut":
                  if (seq.type === "stepped") {
                    return;
                  }
                  touchActive = false;
                  if (seq.dir) {
                    _seq("off", btnClass);
                  }
                  break;
                case "click":
                  if (seq.type !== "stepped" || d.tweenRunning) {
                    return;
                  }
                  _seq("on", btnClass);
                  break;
              }
              function _seq(a, c) {
                seq.scrollAmount = o.scrollButtons.scrollAmount;
                _sequentialScroll($this, a, c);
              }
            }
          );
      },
      /* -------------------- */

      /* 
			KEYBOARD EVENTS
			scrolls content via keyboard 
			Keys: up arrow, down arrow, left arrow, right arrow, PgUp, PgDn, Home, End
			*/
      _keyboard = function () {
        var $this = $(this),
          d = $this.data(pluginPfx),
          o = d.opt,
          seq = d.sequential,
          namespace = pluginPfx + "_" + d.idx,
          mCustomScrollBox = $("#mCSB_" + d.idx),
          mCSB_container = $("#mCSB_" + d.idx + "_container"),
          wrapper = mCSB_container.parent(),
          editables =
            "input,textarea,select,datalist,keygen,[contenteditable='true']",
          iframe = mCSB_container.find("iframe"),
          events = [
            "blur." +
              namespace +
              " keydown." +
              namespace +
              " keyup." +
              namespace,
          ];
        if (iframe.length) {
          iframe.each(function () {
            $(this).bind("load", function () {
              /* bind events on accessible iframes */
              if (_canAccessIFrame(this)) {
                $(this.contentDocument || this.contentWindow.document).bind(
                  events[0],
                  function (e) {
                    _onKeyboard(e);
                  }
                );
              }
            });
          });
        }
        // WA-Common-Tab : 불필요한 tabindex="0" 제거
        // mCustomScrollBox.attr("tabindex","0").bind(events[0],function(e){
        mCustomScrollBox.bind(events[0], function (e) {
          _onKeyboard(e);
        });
        function _onKeyboard(e) {
          switch (e.type) {
            case "blur":
              if (d.tweenRunning && seq.dir) {
                _seq("off", null);
              }
              break;
            case "keydown":
            case "keyup":
              var code = e.keyCode ? e.keyCode : e.which,
                action = "on";
              if (
                (o.axis !== "x" && (code === 38 || code === 40)) ||
                (o.axis !== "y" && (code === 37 || code === 39))
              ) {
                /* up (38), down (40), left (37), right (39) arrows */
                if (
                  ((code === 38 || code === 40) && !d.overflowed[0]) ||
                  ((code === 37 || code === 39) && !d.overflowed[1])
                ) {
                  return;
                }
                if (e.type === "keyup") {
                  action = "off";
                }
                if (!$(document.activeElement).is(editables)) {
                  e.preventDefault();
                  e.stopImmediatePropagation();
                  _seq(action, code);
                }
              } else if (code === 33 || code === 34) {
                /* PgUp (33), PgDn (34) */
                if (d.overflowed[0] || d.overflowed[1]) {
                  e.preventDefault();
                  e.stopImmediatePropagation();
                }
                if (e.type === "keyup") {
                  _stop($this);
                  var keyboardDir = code === 34 ? -1 : 1;
                  if (
                    o.axis === "x" ||
                    (o.axis === "yx" && d.overflowed[1] && !d.overflowed[0])
                  ) {
                    var dir = "x",
                      to =
                        Math.abs(mCSB_container[0].offsetLeft) -
                        keyboardDir * (wrapper.width() * 0.9);
                  } else {
                    var dir = "y",
                      to =
                        Math.abs(mCSB_container[0].offsetTop) -
                        keyboardDir * (wrapper.height() * 0.9);
                  }
                  _scrollTo($this, to.toString(), {
                    dir: dir,
                    scrollEasing: "mcsEaseInOut",
                  });
                }
              } else if (code === 35 || code === 36) {
                /* End (35), Home (36) */
                if (!$(document.activeElement).is(editables)) {
                  if (d.overflowed[0] || d.overflowed[1]) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                  }
                  if (e.type === "keyup") {
                    if (
                      o.axis === "x" ||
                      (o.axis === "yx" && d.overflowed[1] && !d.overflowed[0])
                    ) {
                      var dir = "x",
                        to =
                          code === 35
                            ? Math.abs(
                                wrapper.width() -
                                  mCSB_container.outerWidth(false)
                              )
                            : 0;
                    } else {
                      var dir = "y",
                        to =
                          code === 35
                            ? Math.abs(
                                wrapper.height() -
                                  mCSB_container.outerHeight(false)
                              )
                            : 0;
                    }
                    _scrollTo($this, to.toString(), {
                      dir: dir,
                      scrollEasing: "mcsEaseInOut",
                    });
                  }
                }
              }
              break;
          }
          function _seq(a, c) {
            seq.type = o.keyboard.scrollType;
            seq.scrollAmount = o.keyboard.scrollAmount;
            if (seq.type === "stepped" && d.tweenRunning) {
              return;
            }
            _sequentialScroll($this, a, c);
          }
        }
      },
      /* -------------------- */

      /* scrolls content sequentially (used when scrolling via buttons, keyboard arrows etc.) */
      _sequentialScroll = function (el, action, trigger, e, s) {
        var d = el.data(pluginPfx),
          o = d.opt,
          seq = d.sequential,
          mCSB_container = $("#mCSB_" + d.idx + "_container"),
          once = seq.type === "stepped" ? true : false,
          steplessSpeed =
            o.scrollInertia < 26 ? 26 : o.scrollInertia /* 26/1.5=17 */,
          steppedSpeed = o.scrollInertia < 1 ? 17 : o.scrollInertia;
        switch (action) {
          case "on":
            seq.dir = [
              trigger === classes[16] ||
              trigger === classes[15] ||
              trigger === 39 ||
              trigger === 37
                ? "x"
                : "y",
              trigger === classes[13] ||
              trigger === classes[15] ||
              trigger === 38 ||
              trigger === 37
                ? -1
                : 1,
            ];
            _stop(el);
            if (_isNumeric(trigger) && seq.type === "stepped") {
              return;
            }
            _on(once);
            break;
          case "off":
            _off();
            if (once || (d.tweenRunning && seq.dir)) {
              _on(true);
            }
            break;
        }

        /* starts sequence */
        function _on(once) {
          if (o.snapAmount) {
            seq.scrollAmount = !(o.snapAmount instanceof Array)
              ? o.snapAmount
              : seq.dir[0] === "x"
              ? o.snapAmount[1]
              : o.snapAmount[0];
          } /* scrolling snapping */
          var c = seq.type !== "stepped" /* continuous scrolling */,
            t = s
              ? s
              : !once
              ? 1000 / 60
              : c
              ? steplessSpeed / 1.5
              : steppedSpeed /* timer */,
            m = !once ? 2.5 : c ? 7.5 : 40 /* multiplier */,
            contentPos = [
              Math.abs(mCSB_container[0].offsetTop),
              Math.abs(mCSB_container[0].offsetLeft),
            ],
            ratio = [
              d.scrollRatio.y > 10 ? 10 : d.scrollRatio.y,
              d.scrollRatio.x > 10 ? 10 : d.scrollRatio.x,
            ],
            amount =
              seq.dir[0] === "x"
                ? contentPos[1] + seq.dir[1] * (ratio[1] * m)
                : contentPos[0] + seq.dir[1] * (ratio[0] * m),
            px =
              seq.dir[0] === "x"
                ? contentPos[1] + seq.dir[1] * parseInt(seq.scrollAmount)
                : contentPos[0] + seq.dir[1] * parseInt(seq.scrollAmount),
            to = seq.scrollAmount !== "auto" ? px : amount,
            easing = e
              ? e
              : !once
              ? "mcsLinear"
              : c
              ? "mcsLinearOut"
              : "mcsEaseInOut",
            onComplete = !once ? false : true;
          if (once && t < 17) {
            to = seq.dir[0] === "x" ? contentPos[1] : contentPos[0];
          }
          _scrollTo(el, to.toString(), {
            dir: seq.dir[0],
            scrollEasing: easing,
            dur: t,
            onComplete: onComplete,
          });
          if (once) {
            seq.dir = false;
            return;
          }
          clearTimeout(seq.step);
          seq.step = setTimeout(function () {
            _on();
          }, t);
        }
        /* stops sequence */
        function _off() {
          clearTimeout(seq.step);
          _delete(seq, "step");
          _stop(el);
        }
      },
      /* -------------------- */

      /* returns a yx array from value */
      _arr = function (val) {
        var o = $(this).data(pluginPfx).opt,
          vals = [];
        if (typeof val === "function") {
          val = val();
        } /* check if the value is a single anonymous function */
        /* check if value is object or array, its length and create an array with yx values */
        if (!(val instanceof Array)) {
          /* object value (e.g. {y:"100",x:"100"}, 100 etc.) */
          vals[0] = val.y ? val.y : val.x || o.axis === "x" ? null : val;
          vals[1] = val.x ? val.x : val.y || o.axis === "y" ? null : val;
        } else {
          /* array value (e.g. [100,100]) */
          vals =
            val.length > 1
              ? [val[0], val[1]]
              : o.axis === "x"
              ? [null, val[0]]
              : [val[0], null];
        }
        /* check if array values are anonymous functions */
        if (typeof vals[0] === "function") {
          vals[0] = vals[0]();
        }
        if (typeof vals[1] === "function") {
          vals[1] = vals[1]();
        }
        return vals;
      },
      /* -------------------- */

      /* translates values (e.g. "top", 100, "100px", "#id") to actual scroll-to positions */
      _to = function (val, dir) {
        if (val == null || typeof val == "undefined") {
          return;
        }
        var $this = $(this),
          d = $this.data(pluginPfx),
          o = d.opt,
          mCSB_container = $("#mCSB_" + d.idx + "_container"),
          wrapper = mCSB_container.parent(),
          t = typeof val;
        if (!dir) {
          dir = o.axis === "x" ? "x" : "y";
        }
        var contentLength =
            dir === "x"
              ? mCSB_container.outerWidth(false) - wrapper.width()
              : mCSB_container.outerHeight(false) - wrapper.height(),
          contentPos =
            dir === "x"
              ? mCSB_container[0].offsetLeft
              : mCSB_container[0].offsetTop,
          cssProp = dir === "x" ? "left" : "top";

        switch (t) {
          case "function" /* this currently is not used. Consider removing it */:
            return val();
            break;
          case "object" /* js/jquery object */:
            var obj = val.jquery ? val : $(val);
            if (!obj.length) {
              return;
            }
            return dir === "x" ? _childPos(obj)[1] : _childPos(obj)[0];
            break;
          case "string":
          case "number":
            if (_isNumeric(val)) {
              /* numeric value */
              return Math.abs(val);
            } else if (val.indexOf("%") !== -1) {
              /* percentage value */
              return Math.abs((contentLength * parseInt(val)) / 100);
            } else if (val.indexOf("-=") !== -1) {
              /* decrease value */
              return Math.abs(contentPos - parseInt(val.split("-=")[1]));
            } else if (val.indexOf("+=") !== -1) {
              /* inrease value */
              var p = contentPos + parseInt(val.split("+=")[1]);
              return p >= 0 ? 0 : Math.abs(p);
            } else if (
              val.indexOf("px") !== -1 &&
              _isNumeric(val.split("px")[0])
            ) {
              /* pixels string value (e.g. "100px") */
              return Math.abs(val.split("px")[0]);
            } else {
              if (val === "top" || val === "left") {
                /* special strings */
                return 0;
              } else if (val === "bottom") {
                return Math.abs(
                  wrapper.height() - mCSB_container.outerHeight(false)
                );
              } else if (val === "right") {
                return Math.abs(
                  wrapper.width() - mCSB_container.outerWidth(false)
                );
              } else if (val === "first" || val === "last") {
                var obj = mCSB_container.find(":" + val);
                return dir === "x" ? _childPos(obj)[1] : _childPos(obj)[0];
              } else {
                if ($(val).length) {
                  /* jquery selector */
                  return dir === "x"
                    ? _childPos($(val))[1]
                    : _childPos($(val))[0];
                } else {
                  /* other values (e.g. "100em") */
                  mCSB_container.css(cssProp, val);
                  methods.update.call(null, $this[0]);
                  return;
                }
              }
            }
            break;
        }
      },
      /* -------------------- */

      /* calls the update method automatically */
      _autoUpdate = function (rem) {
        var $this = $(this),
          d = $this.data(pluginPfx),
          o = d.opt,
          mCSB_container = $("#mCSB_" + d.idx + "_container");
        if (rem) {
          /* 
					removes autoUpdate timer 
					usage: _autoUpdate.call(this,"remove");
					*/
          clearTimeout(mCSB_container[0].autoUpdate);
          _delete(mCSB_container[0], "autoUpdate");
          return;
        }
        upd();
        function upd() {
          clearTimeout(mCSB_container[0].autoUpdate);
          if ($this.parents("html").length === 0) {
            /* check element in dom tree */
            $this = null;
            return;
          }
          mCSB_container[0].autoUpdate = setTimeout(function () {
            /* update on specific selector(s) length and size change */
            if (o.advanced.updateOnSelectorChange) {
              d.poll.change.n = sizesSum();
              if (d.poll.change.n !== d.poll.change.o) {
                d.poll.change.o = d.poll.change.n;
                doUpd(3);
                return;
              }
            }
            /* update on main element and scrollbar size changes */
            if (o.advanced.updateOnContentResize) {
              d.poll.size.n =
                $this[0].scrollHeight +
                $this[0].scrollWidth +
                mCSB_container[0].offsetHeight +
                $this[0].offsetHeight +
                $this[0].offsetWidth;
              if (d.poll.size.n !== d.poll.size.o) {
                d.poll.size.o = d.poll.size.n;
                doUpd(1);
                return;
              }
            }
            /* update on image load */
            if (o.advanced.updateOnImageLoad) {
              if (
                !(o.advanced.updateOnImageLoad === "auto" && o.axis === "y")
              ) {
                //by default, it doesn't run on vertical content
                d.poll.img.n = mCSB_container.find("img").length;
                if (d.poll.img.n !== d.poll.img.o) {
                  d.poll.img.o = d.poll.img.n;
                  mCSB_container.find("img").each(function () {
                    imgLoader(this);
                  });
                  return;
                }
              }
            }
            if (
              o.advanced.updateOnSelectorChange ||
              o.advanced.updateOnContentResize ||
              o.advanced.updateOnImageLoad
            ) {
              upd();
            }
          }, o.advanced.autoUpdateTimeout);
        }
        /* a tiny image loader */
        function imgLoader(el) {
          if ($(el).hasClass(classes[2])) {
            doUpd();
            return;
          }
          var img = new Image();
          function createDelegate(contextObject, delegateMethod) {
            return function () {
              return delegateMethod.apply(contextObject, arguments);
            };
          }
          function imgOnLoad() {
            this.onload = null;
            $(el).addClass(classes[2]);
            doUpd(2);
          }
          img.onload = createDelegate(img, imgOnLoad);
          img.src = el.src;
        }
        /* returns the total height and width sum of all elements matching the selector */
        function sizesSum() {
          if (o.advanced.updateOnSelectorChange === true) {
            o.advanced.updateOnSelectorChange = "*";
          }
          var total = 0,
            sel = mCSB_container.find(o.advanced.updateOnSelectorChange);
          if (o.advanced.updateOnSelectorChange && sel.length > 0) {
            sel.each(function () {
              total += this.offsetHeight + this.offsetWidth;
            });
          }
          return total;
        }
        /* calls the update method */
        function doUpd(cb) {
          clearTimeout(mCSB_container[0].autoUpdate);
          methods.update.call(null, $this[0], cb);
        }
      },
      /* -------------------- */

      /* snaps scrolling to a multiple of a pixels number */
      _snapAmount = function (to, amount, offset) {
        return Math.round(to / amount) * amount - offset;
      },
      /* -------------------- */

      /* stops content and scrollbar animations */
      _stop = function (el) {
        var d = el.data(pluginPfx),
          sel = $(
            "#mCSB_" +
              d.idx +
              "_container,#mCSB_" +
              d.idx +
              "_container_wrapper,#mCSB_" +
              d.idx +
              "_dragger_vertical,#mCSB_" +
              d.idx +
              "_dragger_horizontal"
          );
        sel.each(function () {
          _stopTween.call(this);
        });
      },
      /* -------------------- */

      /* 
			ANIMATES CONTENT 
			This is where the actual scrolling happens
			*/
      _scrollTo = function (el, to, options) {
        var d = el.data(pluginPfx),
          o = d.opt,
          defaults = {
            trigger: "internal",
            dir: "y",
            scrollEasing: "mcsEaseOut",
            drag: false,
            dur: o.scrollInertia,
            overwrite: "all",
            callbacks: true,
            onStart: true,
            onUpdate: true,
            onComplete: true,
          },
          options = $.extend(defaults, options),
          dur = [options.dur, options.drag ? 0 : options.dur],
          mCustomScrollBox = $("#mCSB_" + d.idx),
          mCSB_container = $("#mCSB_" + d.idx + "_container"),
          wrapper = mCSB_container.parent(),
          totalScrollOffsets = o.callbacks.onTotalScrollOffset
            ? _arr.call(el, o.callbacks.onTotalScrollOffset)
            : [0, 0],
          totalScrollBackOffsets = o.callbacks.onTotalScrollBackOffset
            ? _arr.call(el, o.callbacks.onTotalScrollBackOffset)
            : [0, 0];
        d.trigger = options.trigger;
        if (wrapper.scrollTop() !== 0 || wrapper.scrollLeft() !== 0) {
          /* always reset scrollTop/Left */
          $(".mCSB_" + d.idx + "_scrollbar").css("visibility", "visible");
          wrapper.scrollTop(0).scrollLeft(0);
        }
        if (to === "_resetY" && !d.contentReset.y) {
          /* callbacks: onOverflowYNone */
          if (_cb("onOverflowYNone")) {
            o.callbacks.onOverflowYNone.call(el[0]);
          }
          d.contentReset.y = 1;
        }
        if (to === "_resetX" && !d.contentReset.x) {
          /* callbacks: onOverflowXNone */
          if (_cb("onOverflowXNone")) {
            o.callbacks.onOverflowXNone.call(el[0]);
          }
          d.contentReset.x = 1;
        }
        if (to === "_resetY" || to === "_resetX") {
          return;
        }
        if ((d.contentReset.y || !el[0].mcs) && d.overflowed[0]) {
          /* callbacks: onOverflowY */
          if (_cb("onOverflowY")) {
            o.callbacks.onOverflowY.call(el[0]);
          }
          d.contentReset.x = null;
        }
        if ((d.contentReset.x || !el[0].mcs) && d.overflowed[1]) {
          /* callbacks: onOverflowX */
          if (_cb("onOverflowX")) {
            o.callbacks.onOverflowX.call(el[0]);
          }
          d.contentReset.x = null;
        }
        if (o.snapAmount) {
          /* scrolling snapping */
          var snapAmount = !(o.snapAmount instanceof Array)
            ? o.snapAmount
            : options.dir === "x"
            ? o.snapAmount[1]
            : o.snapAmount[0];
          to = _snapAmount(to, snapAmount, o.snapOffset);
        }
        switch (options.dir) {
          case "x":
            var mCSB_dragger = $("#mCSB_" + d.idx + "_dragger_horizontal"),
              property = "left",
              contentPos = mCSB_container[0].offsetLeft,
              limit = [
                mCustomScrollBox.width() - mCSB_container.outerWidth(false),
                mCSB_dragger.parent().width() - mCSB_dragger.width(),
              ],
              scrollTo = [to, to === 0 ? 0 : to / d.scrollRatio.x],
              tso = totalScrollOffsets[1],
              tsbo = totalScrollBackOffsets[1],
              totalScrollOffset = tso > 0 ? tso / d.scrollRatio.x : 0,
              totalScrollBackOffset = tsbo > 0 ? tsbo / d.scrollRatio.x : 0;
            break;
          case "y":
            var mCSB_dragger = $("#mCSB_" + d.idx + "_dragger_vertical"),
              property = "top",
              contentPos = mCSB_container[0].offsetTop,
              limit = [
                mCustomScrollBox.height() - mCSB_container.outerHeight(false),
                mCSB_dragger.parent().height() - mCSB_dragger.height(),
              ],
              scrollTo = [to, to === 0 ? 0 : to / d.scrollRatio.y],
              tso = totalScrollOffsets[0],
              tsbo = totalScrollBackOffsets[0],
              totalScrollOffset = tso > 0 ? tso / d.scrollRatio.y : 0,
              totalScrollBackOffset = tsbo > 0 ? tsbo / d.scrollRatio.y : 0;
            break;
        }
        if (scrollTo[1] < 0 || (scrollTo[0] === 0 && scrollTo[1] === 0)) {
          scrollTo = [0, 0];
        } else if (scrollTo[1] >= limit[1]) {
          scrollTo = [limit[0], limit[1]];
        } else {
          scrollTo[0] = -scrollTo[0];
        }
        if (!el[0].mcs) {
          _mcs(); /* init mcs object (once) to make it available before callbacks */
          if (_cb("onInit")) {
            o.callbacks.onInit.call(el[0]);
          } /* callbacks: onInit */
        }
        clearTimeout(mCSB_container[0].onCompleteTimeout);
        _tweenTo(
          mCSB_dragger[0],
          property,
          Math.round(scrollTo[1]),
          dur[1],
          options.scrollEasing
        );
        if (
          !d.tweenRunning &&
          ((contentPos === 0 && scrollTo[0] >= 0) ||
            (contentPos === limit[0] && scrollTo[0] <= limit[0]))
        ) {
          return;
        }
        _tweenTo(
          mCSB_container[0],
          property,
          Math.round(scrollTo[0]),
          dur[0],
          options.scrollEasing,
          options.overwrite,
          {
            onStart: function () {
              if (options.callbacks && options.onStart && !d.tweenRunning) {
                /* callbacks: onScrollStart */
                if (_cb("onScrollStart")) {
                  _mcs();
                  o.callbacks.onScrollStart.call(el[0]);
                }
                d.tweenRunning = true;
                _onDragClasses(mCSB_dragger);
                d.cbOffsets = _cbOffsets();
              }
            },
            onUpdate: function () {
              if (options.callbacks && options.onUpdate) {
                /* callbacks: whileScrolling */
                if (_cb("whileScrolling")) {
                  _mcs();
                  o.callbacks.whileScrolling.call(el[0]);
                }
              }
            },
            onComplete: function () {
              if (options.callbacks && options.onComplete) {
                if (o.axis === "yx") {
                  clearTimeout(mCSB_container[0].onCompleteTimeout);
                }
                var t = mCSB_container[0].idleTimer || 0;
                mCSB_container[0].onCompleteTimeout = setTimeout(function () {
                  /* callbacks: onScroll, onTotalScroll, onTotalScrollBack */
                  if (_cb("onScroll")) {
                    _mcs();
                    o.callbacks.onScroll.call(el[0]);
                  }
                  if (
                    _cb("onTotalScroll") &&
                    scrollTo[1] >= limit[1] - totalScrollOffset &&
                    d.cbOffsets[0]
                  ) {
                    _mcs();
                    o.callbacks.onTotalScroll.call(el[0]);
                  }
                  if (
                    _cb("onTotalScrollBack") &&
                    scrollTo[1] <= totalScrollBackOffset &&
                    d.cbOffsets[1]
                  ) {
                    _mcs();
                    o.callbacks.onTotalScrollBack.call(el[0]);
                  }
                  d.tweenRunning = false;
                  mCSB_container[0].idleTimer = 0;
                  _onDragClasses(mCSB_dragger, "hide");
                }, t);
              }
            },
          }
        );
        /* checks if callback function exists */
        function _cb(cb) {
          return d && o.callbacks[cb] && typeof o.callbacks[cb] === "function";
        }
        /* checks whether callback offsets always trigger */
        function _cbOffsets() {
          return [
            o.callbacks.alwaysTriggerOffsets || contentPos >= limit[0] + tso,
            o.callbacks.alwaysTriggerOffsets || contentPos <= -tsbo,
          ];
        }
        /* 
				populates object with useful values for the user 
				values: 
					content: this.mcs.content
					content top position: this.mcs.top 
					content left position: this.mcs.left 
					dragger top position: this.mcs.draggerTop 
					dragger left position: this.mcs.draggerLeft 
					scrolling y percentage: this.mcs.topPct 
					scrolling x percentage: this.mcs.leftPct 
					scrolling direction: this.mcs.direction
				*/
        function _mcs() {
          var cp = [
              mCSB_container[0].offsetTop,
              mCSB_container[0].offsetLeft,
            ] /* content position */,
            dp = [
              mCSB_dragger[0].offsetTop,
              mCSB_dragger[0].offsetLeft,
            ] /* dragger position */,
            cl = [
              mCSB_container.outerHeight(false),
              mCSB_container.outerWidth(false),
            ] /* content length */,
            pl = [
              mCustomScrollBox.height(),
              mCustomScrollBox.width(),
            ]; /* content parent length */
          el[0].mcs = {
            content:
              mCSB_container /* original content wrapper as jquery object */,
            top: cp[0],
            left: cp[1],
            draggerTop: dp[0],
            draggerLeft: dp[1],
            topPct: Math.round(
              (100 * Math.abs(cp[0])) / (Math.abs(cl[0]) - pl[0])
            ),
            leftPct: Math.round(
              (100 * Math.abs(cp[1])) / (Math.abs(cl[1]) - pl[1])
            ),
            direction: options.dir,
          };
          /* 
					this refers to the original element containing the scrollbar(s)
					usage: this.mcs.top, this.mcs.leftPct etc. 
					*/
        }
      },
      /* -------------------- */

      /* 
			CUSTOM JAVASCRIPT ANIMATION TWEEN 
			Lighter and faster than jquery animate() and css transitions 
			Animates top/left properties and includes easings 
			*/
      _tweenTo = function (
        el,
        prop,
        to,
        duration,
        easing,
        overwrite,
        callbacks
      ) {
        if (!el._mTween) {
          el._mTween = { top: {}, left: {} };
        }
        var callbacks = callbacks || {},
          onStart = callbacks.onStart || function () {},
          onUpdate = callbacks.onUpdate || function () {},
          onComplete = callbacks.onComplete || function () {},
          startTime = _getTime(),
          _delay,
          progress = 0,
          from = el.offsetTop,
          elStyle = el.style,
          _request,
          tobj = el._mTween[prop];
        if (prop === "left") {
          from = el.offsetLeft;
        }
        var diff = to - from;
        tobj.stop = 0;
        if (overwrite !== "none") {
          _cancelTween();
        }
        _startTween();
        function _step() {
          if (tobj.stop) {
            return;
          }
          if (!progress) {
            onStart.call();
          }
          progress = _getTime() - startTime;
          _tween();
          if (progress >= tobj.time) {
            tobj.time =
              progress > tobj.time
                ? progress + _delay - (progress - tobj.time)
                : progress + _delay - 1;
            if (tobj.time < progress + 1) {
              tobj.time = progress + 1;
            }
          }
          if (tobj.time < duration) {
            tobj.id = _request(_step);
          } else {
            onComplete.call();
          }
        }
        function _tween() {
          if (duration > 0) {
            tobj.currVal = _ease(tobj.time, from, diff, duration, easing);
            elStyle[prop] = Math.round(tobj.currVal) + "px";
          } else {
            elStyle[prop] = to + "px";
          }
          onUpdate.call();
        }
        function _startTween() {
          _delay = 1000 / 60;
          tobj.time = progress + _delay;
          _request = !window.requestAnimationFrame
            ? function (f) {
                _tween();
                return setTimeout(f, 0.01);
              }
            : window.requestAnimationFrame;
          tobj.id = _request(_step);
        }
        function _cancelTween() {
          if (tobj.id == null) {
            return;
          }
          if (!window.requestAnimationFrame) {
            clearTimeout(tobj.id);
          } else {
            window.cancelAnimationFrame(tobj.id);
          }
          tobj.id = null;
        }
        function _ease(t, b, c, d, type) {
          switch (type) {
            case "linear":
            case "mcsLinear":
              return (c * t) / d + b;
              break;
            case "mcsLinearOut":
              t /= d;
              t--;
              return c * Math.sqrt(1 - t * t) + b;
              break;
            case "easeInOutSmooth":
              t /= d / 2;
              if (t < 1) return (c / 2) * t * t + b;
              t--;
              return (-c / 2) * (t * (t - 2) - 1) + b;
              break;
            case "easeInOutStrong":
              t /= d / 2;
              if (t < 1) return (c / 2) * Math.pow(2, 10 * (t - 1)) + b;
              t--;
              return (c / 2) * (-Math.pow(2, -10 * t) + 2) + b;
              break;
            case "easeInOut":
            case "mcsEaseInOut":
              t /= d / 2;
              if (t < 1) return (c / 2) * t * t * t + b;
              t -= 2;
              return (c / 2) * (t * t * t + 2) + b;
              break;
            case "easeOutSmooth":
              t /= d;
              t--;
              return -c * (t * t * t * t - 1) + b;
              break;
            case "easeOutStrong":
              return c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
              break;
            case "easeOut":
            case "mcsEaseOut":
            default:
              var ts = (t /= d) * t,
                tc = ts * t;
              return (
                b +
                c *
                  (0.499999999999997 * tc * ts +
                    -2.5 * ts * ts +
                    5.5 * tc +
                    -6.5 * ts +
                    4 * t)
              );
          }
        }
      },
      /* -------------------- */

      /* returns current time */
      _getTime = function () {
        if (window.performance && window.performance.now) {
          return window.performance.now();
        } else {
          if (window.performance && window.performance.webkitNow) {
            return window.performance.webkitNow();
          } else {
            if (Date.now) {
              return Date.now();
            } else {
              return new Date().getTime();
            }
          }
        }
      },
      /* -------------------- */

      /* stops a tween */
      _stopTween = function () {
        var el = this;
        if (!el._mTween) {
          el._mTween = { top: {}, left: {} };
        }
        var props = ["top", "left"];
        for (var i = 0; i < props.length; i++) {
          var prop = props[i];
          if (el._mTween[prop].id) {
            if (!window.requestAnimationFrame) {
              clearTimeout(el._mTween[prop].id);
            } else {
              window.cancelAnimationFrame(el._mTween[prop].id);
            }
            el._mTween[prop].id = null;
            el._mTween[prop].stop = 1;
          }
        }
      },
      /* -------------------- */

      /* deletes a property (avoiding the exception thrown by IE) */
      _delete = function (c, m) {
        try {
          delete c[m];
        } catch (e) {
          c[m] = null;
        }
      },
      /* -------------------- */

      /* detects left mouse button */
      _mouseBtnLeft = function (e) {
        return !(e.which && e.which !== 1);
      },
      /* -------------------- */

      /* detects if pointer type event is touch */
      _pointerTouch = function (e) {
        var t = e.originalEvent.pointerType;
        return !(t && t !== "touch" && t !== 2);
      },
      /* -------------------- */

      /* checks if value is numeric */
      _isNumeric = function (val) {
        return !isNaN(parseFloat(val)) && isFinite(val);
      },
      /* -------------------- */

      /* returns element position according to content */
      _childPos = function (el) {
        var p = el.parents(".mCSB_container");
        return [
          el.offset().top - p.offset().top,
          el.offset().left - p.offset().left,
        ];
      },
      /* -------------------- */

      /* checks if browser tab is hidden/inactive via Page Visibility API */
      _isTabHidden = function () {
        var prop = _getHiddenProp();
        if (!prop) return false;
        return document[prop];
        function _getHiddenProp() {
          var pfx = ["webkit", "moz", "ms", "o"];
          if ("hidden" in document) return "hidden"; //natively supported
          for (var i = 0; i < pfx.length; i++) {
            //prefixed
            if (pfx[i] + "Hidden" in document) return pfx[i] + "Hidden";
          }
          return null; //not supported
        }
      };
    /* -------------------- */

    /* 
		----------------------------------------
		PLUGIN SETUP 
		----------------------------------------
		*/

    /* plugin constructor functions */
    $.fn[pluginNS] = function (method) {
      /* usage: $(selector).mCustomScrollbar(); */
      if (methods[method]) {
        return methods[method].apply(
          this,
          Array.prototype.slice.call(arguments, 1)
        );
      } else if (typeof method === "object" || !method) {
        return methods.init.apply(this, arguments);
      } else {
        $.error("Method " + method + " does not exist");
      }
    };
    $[pluginNS] = function (method) {
      /* usage: $.mCustomScrollbar(); */
      if (methods[method]) {
        return methods[method].apply(
          this,
          Array.prototype.slice.call(arguments, 1)
        );
      } else if (typeof method === "object" || !method) {
        return methods.init.apply(this, arguments);
      } else {
        $.error("Method " + method + " does not exist");
      }
    };

    /* 
		allow setting plugin default options. 
		usage: $.mCustomScrollbar.defaults.scrollInertia=500; 
		to apply any changed default options on default selectors (below), use inside document ready fn 
		e.g.: $(document).ready(function(){ $.mCustomScrollbar.defaults.scrollInertia=500; });
		*/
    $[pluginNS].defaults = defaults;

    /* 
		add window object (window.mCustomScrollbar) 
		usage: if(window.mCustomScrollbar){console.log("custom scrollbar plugin loaded");}
		*/
    window[pluginNS] = true;

    $(window).bind("load", function () {
      $(defaultSelector)[
        pluginNS
      ](); /* add scrollbars automatically on default selector */

      /* extend jQuery expressions */
      $.extend($.expr[":"], {
        /* checks if element is within scrollable viewport */
        mcsInView:
          $.expr[":"].mcsInView ||
          function (el) {
            var $el = $(el),
              content = $el.parents(".mCSB_container"),
              wrapper,
              cPos;
            if (!content.length) {
              return;
            }
            wrapper = content.parent();
            cPos = [content[0].offsetTop, content[0].offsetLeft];
            return (
              cPos[0] + _childPos($el)[0] >= 0 &&
              cPos[0] + _childPos($el)[0] <
                wrapper.height() - $el.outerHeight(false) &&
              cPos[1] + _childPos($el)[1] >= 0 &&
              cPos[1] + _childPos($el)[1] <
                wrapper.width() - $el.outerWidth(false)
            );
          },
        /* checks if element or part of element is in view of scrollable viewport */
        mcsInSight:
          $.expr[":"].mcsInSight ||
          function (el, i, m) {
            var $el = $(el),
              elD,
              content = $el.parents(".mCSB_container"),
              wrapperView,
              pos,
              wrapperViewPct,
              pctVals =
                m[3] === "exact"
                  ? [
                      [1, 0],
                      [1, 0],
                    ]
                  : [
                      [0.9, 0.1],
                      [0.6, 0.4],
                    ];
            if (!content.length) {
              return;
            }
            elD = [$el.outerHeight(false), $el.outerWidth(false)];
            pos = [
              content[0].offsetTop + _childPos($el)[0],
              content[0].offsetLeft + _childPos($el)[1],
            ];
            wrapperView = [
              content.parent()[0].offsetHeight,
              content.parent()[0].offsetWidth,
            ];
            wrapperViewPct = [
              elD[0] < wrapperView[0] ? pctVals[0] : pctVals[1],
              elD[1] < wrapperView[1] ? pctVals[0] : pctVals[1],
            ];
            return (
              pos[0] - wrapperView[0] * wrapperViewPct[0][0] < 0 &&
              pos[0] + elD[0] - wrapperView[0] * wrapperViewPct[0][1] >= 0 &&
              pos[1] - wrapperView[1] * wrapperViewPct[1][0] < 0 &&
              pos[1] + elD[1] - wrapperView[1] * wrapperViewPct[1][1] >= 0
            );
          },
        /* checks if element is overflowed having visible scrollbar(s) */
        mcsOverflow:
          $.expr[":"].mcsOverflow ||
          function (el) {
            var d = $(el).data(pluginPfx);
            if (!d) {
              return;
            }
            return d.overflowed[0] || d.overflowed[1];
          },
      });
    });
  });
});
//  mCustomScrollbar.js -->

var scrollDesign, setCustomScrollbar, setActiveScroll, chosenScrollInit;
$(document).ready(function () {
  // modal scroll design
  setTabCustomScrollbar = function (e) {
    var $outer = $(".js-tab-guide-outer");

    for (var i = 0; i < $outer.length; i++) {
      var $thisOuter = $outer.eq(i);
      if (e.matches) {
        $thisOuter.find(".mCSB_container").css({
          width: $thisOuter.find(".js-tab-guide-inner").outerWidth(),
        });
        $thisOuter.removeClass("mCustomScrollbar_init");
      } else {
        $thisOuter.addClass("mCustomScrollbar_init");
      }
      setActiveScroll($thisOuter[0]);
    }
    $outer.closest(".tab-wrap").removeClass("none-scroll");
  };
  scrollDesign = function () {
    // simply scrollbar area
    var scrollObj = document.getElementsByClassName("js-scroll");
    var scrollObjX = document.getElementsByClassName("js-scroll-x");
    if (!$(".navigation").hasClass("mobile-device")) {
      $(scrollObj).mCustomScrollbar({
        theme: "dark",
        mouseWheelPixels: 120,
      });
    } else {
      $(scrollObj).css("overflow-y", "auto");
    }
    $(scrollObjX).mCustomScrollbar({
      theme: "dark",
      mouseWheelPixels: 300,
      axis: "x",
    });

    // tab overflow scrollbar
    var $tabScrollbar = $(".js-tab-guide-outer");
    // WA-Common-Tab : mcustomscrollbar 조건 스크립트 수정
    // if(parseInt($(window).width())>768 && $tabScrollbar.length > 0) {
    if ($tabScrollbar.length > 0) {
      for (var i = 0; i < $tabScrollbar.length; i++) {
        var timer = null; // WA-Common-Tab
        $tabScrollbar.eq(i).mCustomScrollbar({
          theme: "dark",
          axis: "x",
          advanced: { autoUpdateTimeout: 100, autoScrollOnFocus: false },
          keyboard: { enable: false },
          scrollInertia: 400, // 2022.01.21 움직임 속도 수정
          callbacks: {
            onCreate: function () {
              $(this).addClass("mCustomScrollbar_init");
              setActiveScroll(this);
            },
            onBeforeUpdate: function () {
              // $(this).removeClass('mCustomScrollbar_init').closest('.tab-wrap').removeClass('none-scroll');
              $(this).removeClass("mCustomScrollbar_init");
            },
            onUpdate: function () {
              $(this).addClass("mCustomScrollbar_init");
              // WA-Common-Tab : 일부 버그 수정
              var _this = this;
              clearTimeout(timer);
              timer = setTimeout(function () {
                setActiveScroll(_this);
              }, 70);
              // WA-Common-Tab : 일부 버그 끝
            },
            onOverflowXNone: function () {
              var _this = this;
              $(_this)
                .closest(".tab-wrap")
                .addClass("none-scroll")
                .removeClass("has-scroll");
            },
            onOverflowX: function () {
              $(this)
                .closest(".tab-wrap")
                .removeClass("none-scroll")
                .addClass("has-scroll");
            },
            onScroll: function () {
              $(this).trigger("scrolled");
            },
            onTotalScroll: function () {
              $(this).trigger("totalScroll");
            },
            onTotalScrollBack: function () {
              $(this).trigger("totalScrollBack");
            },
          },
        });
      }
    }
    // WA-Common-Tab : 조건에 맞춰 아래 스크립트 삭제
    // mql.maxSm.addListener(setTabCustomScrollbar);
  };
  setActiveScroll = function (_target) {
    // 20200511 START 이상현 - tab ui에 스크롤이 생겼을 때 선택한 탭의 위치를 찾는 식을 수정
    var treeNestingChecker =
        $(_target).find(".btn-tab").eq(0).parent().attr("role") === "tablist", // tablist > tab의 트리 구조인지를 확인하는 판별식.
      $activeTab = treeNestingChecker
        ? $(_target).find(".btn-tab.active")
        : $(_target).find(".btn-tab.active").parent(),
      $activeTabMargin = $activeTab.outerWidth(true) - $activeTab.innerWidth(),
      activeChecker = $activeTab.length > 0 ? true : false;

    // 2022.01.21 category type 을 위한 추가 start
    if ($(_target).closest(".js-tab-controll-type3").length > 0) {
      if ($activeTab.index() != 0) {
        $activeTabMargin =
          $(_target).find("li:nth-child(2)").innerWidth() -
          $(_target).find("li:nth-child(2)").width();
      }
      if (
        (mql.maxSm.matches && $activeTab.index() != 0) ||
        $activeTab.index() != $(_target).find("li").length - 1
      ) {
        var buttonSize = $(_target)
          .closest(".js-tab-controll-type3")
          .find(".tab-scroll-controller button")
          .width();
        var hiddenSize =
          buttonSize -
          ($(_target).closest(".js-tab-controll-type3").width() -
            $(_target).width()) /
            2;
        if ($(_target).closest(".text-menu").length > 0)
          hiddenSize += $(_target)
            .closest(".js-tab-controll-type3")
            .find(".tab-scroll-controller .gradient")
            .width();

        $activeTabMargin -= hiddenSize;
      }
      if ($(_target).closest("text-menu").length > 0) {
        $(_target).mCustomScrollbar("update");
      }
    }
    // 2022.01.21 category type 을 위한 추가 end

    if (activeChecker) {
      if ($("html").attr("dir") !== "rtl") {
        // LTR
        // positioning
        // 2022.01.21 category type 을 위한 수정 start
        if ($(_target).closest(".is-scroll").length > 0) return;
        else if (
          $(_target).closest(".js-tab-controll-type3").length > 0 &&
          $activeTab.position().left + $activeTab.closest("li").outerWidth() <=
            $(_target).width()
        )
          return;
        else
          $(_target).mCustomScrollbar(
            "scrollTo",
            $activeTab.position().left + $activeTabMargin
          );
        // 2022.01.21 category type 을 위한 수정 end
      } else {
        // RTL
        // calculate
        var tabItem = treeNestingChecker
            ? $(_target).find(".btn-tab")
            : $(_target).find(".tab-inner li"),
          activeIdx = $activeTab.index(),
          activePosition =
            activeIdx === 0
              ? $activeTab.position().left + $activeTab.innerWidth()
              : treeNestingChecker
              ? tabItem.eq(activeIdx - 1).position().left
              : tabItem
                  .eq(activeIdx - 1)
                  .children()
                  .position().left,
          tabContainerWidth = $(_target).width(),
          scrollContainerWidth = $(_target).find(".mCSB_container").width(),
          rightSideHiddenWidth = 0;
        for (var i = 0; i < activeIdx; i++) {
          rightSideHiddenWidth += tabItem.eq(i).outerWidth(true);
        }

        // positioning
        // 2022.01.21 category type 을 위한 수정 start
        if ($(_target).closest(".is-scroll").length > 0) return;
        else if (
          $(_target).closest(".js-tab-controll-type3").length > 0 &&
          scrollContainerWidth -
            activePosition +
            $activeTab.closest("li").outerWidth() <=
            tabContainerWidth
        )
          return;
        else if (tabContainerWidth > activePosition) {
          // 2022.01.21 category type 을 위한 수정 end
          $(_target).mCustomScrollbar("scrollTo", 0);
        } else {
          $(_target).mCustomScrollbar(
            "scrollTo",
            Math.ceil(
              scrollContainerWidth -
                rightSideHiddenWidth -
                tabContainerWidth -
                $activeTabMargin
            )
          );
        }
      }
      // var offset = {
      // 	left: Math.ceil($activeTab.offset().left),
      // 	right: Math.ceil($activeTab.offset().left + $activeTab.width())
      // };
      // WA-Common-tab : 일부 버그 수정
      // if($(_target).outerWidth() < offset.right) {
      // 	$(_target).mCustomScrollbar("scrollTo", offset.right);
      // }else {
      // 	$(_target).mCustomScrollbar("scrollTo", 0);
      // }
      // WA-Common-tab : 일부 버그 수정 끝
      // 20200511 END
    } else {
      // WA-Common-Tab : 일부 버그 수정
      // 2022.01.21 category type 을 위한 추가 start
      if (
        $(_target).closest(".js-tab-controll-type3").length > 0 &&
        $activeTab.index() === -1
      )
        return;
      else $(_target).mCustomScrollbar("scrollTo", 0);
      // 2022.01.21 category type 을 위한 추가 end
    }
  };
  chosenScrollInit = function () {
    // chosen select scrollbar
    $(".chosen-scroll:not(.scroll-initialized) .chosen-drop")
      .mCustomScrollbar({
        theme: "dark",
        mouseWheelPixels: 100,
        keyboard: { enable: false },
        advanced: {
          autoScrollOnFocus: "li",
        },
        // addClass 오탈자 수정 - WA-Common-Tab
      })
      .addClass("scroll-initialized")
      .trigger("chosen:updated");
  };
  scrollDesign();
  chosenScrollInit();
});

// please run modalUpdate function after Modal contents can be changed.
// $(modal).modalUpdate(); // example
(function ($) {
  $.fn.modalUpdate = function () {
    return this.each(function (dr) {
      var $el = $(this);
      var duration = dr ? dr : 300;
      // 'modal-locked' Classes must be added before contents can be changed.
      $el.addClass("modal-locked");
      // 'modal-locked' Classes must be removed after contents can be changed.
      setTimeout(function () {
        $el.removeClass("modal-locked");
      }, duration);
    });
  };
})(jQuery);

$(document).ready(function () {
  var modal = document.getElementsByClassName("modal");
  // modal focus
  $(modal).on("shown.bs.modal", function () {
    var focusObj = $(this).find(
      "a[href], area[href], input:not([disabled]), input:not([readonly]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]"
    );
    var focusFirst = focusObj.first();
    var focusLast = focusObj.last();

    focusFirst.focus();

    focusLast.on("keydown", function (e) {
      if (e.which === 9 && !e.shiftKey) {
        e.preventDefault();
        focusFirst.focus();
      }
    });
    focusFirst.on("keydown", function (e) {
      if (e.which === 9 && e.shiftKey) {
        e.preventDefault();
        focusLast.focus();
      }
    });

    $(this)
      .find(".modal-all-close")
      .off()
      .on({
        click: function () {
          $(".modal").modal("hide");
        },
      });
    $(document).on("keydown.close", function (e) {
      // console.log("MODAL", e.type, e.keyCode);
      if (e.keyCode === 27) {
        $(".modal").modal("hide");
      } else {
        return;
      }
    });
  });
  $(modal).on("hidden.bs.modal", function () {
    // console.log("hidden modal");
    $(document).off("keydown.close");
  });
});
/* checkValidation v1.0 */
(function ($) {
  $.fn.checkValidation = function (options) {
    var _this = this;
    var $this = $(this);
    var _isMobile = "ontouchstart" in window;
    var opt = $.extend(
      {
        trigger: false,
        onlyBoolean: false,
      },
      options,
      $this.data()
    );

    var form = {
      $fields: null,
      result: true,
      radios: {},
      init: function () {
        if ($this.is("input, textarea, select")) {
          form.$fields = $this;
        } else {
          form.$fields = $this.find("input, textarea, select");
        }
        form.validation();
      },
      accessibility: function (t, condition) {
        var $errorMsg = $(t).closest(".field-block").find(".error-msg"),
          errorId = $(t).attr("id") + "Error";

        if ($errorMsg.length > 0) {
          $errorMsg.find("> span").removeAttr("id");
          $(t).removeAttr("aria-describedby");

          if (!condition) {
            $errorMsg.find("> span").each(function () {
              if ($(this).is(":visible")) {
                $(this).attr("id", errorId);
                return false;
              }
            });
            $(t).attr("aria-describedby", errorId);
          }
        }
      },
      autoFocus: function (t) {
        if (t.type.indexOf("select") >= 0 && $(t).is(".run-chosen")) {
          if (!$(t).is(":visible")) {
            $(t).trigger("chosen:activate");
          } else {
            $(t).focus();
          }
        } else {
          $(t).focus();
        }

        var $reTarget = $(t);
        if (t.type == "radio") {
          check.$fieldBlock.addClass("error");
          check.$errorMsg.find(".required").show();
          $reTarget = check.$fieldBlock.find('input[name="' + t.name + '"]');
        }
        $reTarget.off("change.reconfirm").on({
          "change.reconfirm": function (e) {
            var _field = e.currentTarget;
            form.validation(_field);

            $(_field).off("change.reconfirm");
          },
        });
      },
      validation: function (_targetField) {
        var l,
          _fieldArray = [],
          errorFields = [];

        if (_targetField) {
          _fieldArray = [_targetField];
          //console.log("11111");
        } else {
          _fieldArray = form.$fields;
          //console.log("22222");
        }

        l = _fieldArray.length;
        //console.log("33333", l);

        // 20200409 START	오샘 || disable 항목 있을 시 error 동작하지 않는 버그 수정
        var tempBlock;
        // 20200409 END		오샘 || disable 항목 있을 시 error 동작하지 않는 버그 수정

        for (var i = 0; i < l; i++) {
          var t = _fieldArray[i];

          check.$fieldBlock = $(t).parents(".field-block");
          check.$errorMsg = check.$fieldBlock.find(".error-msg");

          // 20200406 START 전호근 || input:image 있을 경우 validation 넘어가는 오류 수정
          // 20200311 START 김우람 || search 버튼 에러 메세지 오류 수정
          if (t.type == "image") {
            continue;
          }
          // 20200311 END 김우람 || search 버튼 에러 메세지 오류 수정
          // 20200406 END 전호근 || input:image 있을 경우 validation 넘어가는 오류 수정
          // 20200316 START 김우람 || select 에러메세지 버그 수정
          if (
            !opt.onlyBoolean &&
            $(t).hasClass("chosen-search-input") == false
          ) {
            // 20200316 END 김우람 || select 에러메세지 버그 수정
            // 200311 START 전호근 - 접근성 관련 수정
            $(t).removeAttr("aria-invalid");
            // 200311 END

            // 20200409 START	오샘 || disable 항목 있을 시 error 동작하지 않는 버그 수정

            if (tempBlock != check.$fieldBlock[0]) {
              check.$fieldBlock.removeClass("error");
              check.$errorMsg.find("span").hide();
              //console.log("오샘1", check.$fieldBlock[0]);
            }

            tempBlock = check.$fieldBlock[0];
            // 20200409 END		오샘 || disable 항목 있을 시 error 동작하지 않는 버그 수정
          }

          var condition = true;
          var isMobile = $("header.navigation").is(".mobile-device");
          if ($(t).is(":hidden") && t.type != "hidden") {
            var condition1 =
                t.type.indexOf("select") <= 0 && !$(t).is(".run-chosen"),
              condition2 =
                t.type.indexOf("select") <= 0 &&
                $(t).siblings(".chosen-container").is(":hidden"),
              //모바일에서 chosen-container 없을경우 추가
              condition3 = t.type.indexOf("select") <= 0 && isMobile;

            if (condition1 || condition2 || condition3) continue;
            // if is not select, skip this field;
          } else if ($(t).is(":disabled")) {
            //console.log('disabled t', t);
            //console.log('disabled check.$fieldBlock', check.$fieldBlock);
            continue;
          }

          if (!check.required(t)) {
            // check required
            condition = false;

            if (!opt.onlyBoolean) {
              // 200311 START - 접근성 관련 수정
              $(t).attr("aria-invalid", true);
              // 200311 END
              //$(_this).find('.field-block').removeClass('error');
              check.$fieldBlock.addClass("error");
              form.accessibility(t, condition);
              //form.autoFocus(t);
            }
            //console.log('validation case 1');
            form.result = false;

            errorFields.push(t);
            continue;
            //break;
          } else {
            // ie9 only
            if (
              t.type == "text" &&
              t.getAttribute("data-type") &&
              navigator.appVersion.indexOf("MSIE 9.") != -1
            ) {
              t.setAttribute("type", t.getAttribute("data-type"));
            }
            // input condition validation
            // GPC0085 : textarea 케이스 추가
            var checkType = [
              "text",
              "password",
              "tel",
              "email",
              "number",
              "textarea",
              "file",
            ];
            if (checkType.indexOf(t.type) >= 0) {
              // is text style input
              if (check.minLength(t)) {
                if (t.type == "text") condition = check.pattern(t);
                if (t.type == "email") condition = check.email(t);
                if (t.type == "tel") condition = check.tel(t);
                if (t.type == "file") condition = check.file(t);

                if (condition && t.getAttribute("data-match-target")) {
                  condition = check.match(t);
                }
                // data-rule 속성 validation 추가
                if (
                  condition &&
                  t.getAttribute("data-rule") &&
                  $(t).val().length
                ) {
                  var dataRules = t.getAttribute("data-rule").split(",");
                  var result = [];
                  for (var ii = 0, len = dataRules.length; ii < len; ii++) {
                    // LGCOMIN-47 Start
                    let b2bNumberDataRule = dataRules[ii];
                    if (
                      COUNTRY_CODE == "in" &&
                      t.id == "txtBoxBusinessNumber" &&
                      dataRules[ii] == "number"
                    )
                      b2bNumberDataRule = "isText";
                    // LGCOMIN-47 End

                    result.push(check.dataRule[b2bNumberDataRule]($(t)));

                    if (typeof result[result.length - 1] == "string") {
                      condition = false;
                    }

                    if (result[result.length - 1] == false) {
                      condition = false;
                    }
                    //console.log('result', result);
                    //console.log('result condition' , condition);
                    //console.log('result condition t' , t);
                  }
                  //console.log( 'data rule error message code', result );
                  //console.log('data rule error message code condition' , condition);
                  //console.log('data rule error message code condition t' , t);
                }
              } else {
                condition = false;
              }
            } else if (t.type == "radio" || t.type == "checkbox") {
              var selected = check.$fieldBlock
                .find('input[name="' + t.name + '"]:checked')
                .get(0);
              // removed of unnecessary loops
              if (!form.radios[t.name] && selected) {
                form.radios[t.name] = {
                  checkedField: selected,
                };
                condition = check.radio(t);
              } else {
                continue;
              }
            }
          }

          if (!condition) {
            if (!opt.onlyBoolean) {
              // 200311 START 전호근 - 접근성 관련 수정
              $(t).attr("aria-invalid", true);
              // 200311 END
              check.$fieldBlock.addClass("error");
              form.accessibility(t, condition);
              //form.autoFocus(t);
            }
            //console.log('validation case 2');
            form.result = false;
            errorFields.push(t);
            continue;
          } else {
            //form.result = true;
            // 20200316 START 김우람 || select 에러메세지 버그 수정
            if (
              !opt.onlyBoolean &&
              $(t).hasClass("chosen-search-input") == false
            ) {
              // 20200316 END 김우람 || select 에러메세지 버그 수정
              // 200311 START 전호근 - 접근성 관련 수정
              $(t).removeAttr("aria-invalid");
              // 200311 END
              check.$fieldBlock.removeClass("error");
              form.accessibility(t, condition);
            }
          }
        }
        console.log("errorFields", errorFields);
        /*
				if (errorFields.length > 0){
					var firstInput = errorFields[0];
					$(t).parents('.field-block').addClass('error');
					check.$fieldBlock.find('.error-msg');
					form.autoFocus(errorFields[0]);
				}
				*/

        $.each(errorFields, function (idx) {
          //$(this).parents('.field-block').addClass('error');
          if (idx == 0) {
            check.$fieldBlock = $(errorFields[0]).parents(".field-block");
            check.$errorMsg = check.$fieldBlock.find(".error-msg");
            form.autoFocus(errorFields[0]);
            //$(errorFields[0]).focus();
            console.log("errorFields[0]", errorFields[0]);
          }
        });
      },
    };
    var locale = $("html").data().countrycode;
    var check = {
      $fieldBlock: null,
      $errorMsg: null,
      required: function (t) {
        var isEmpty,
          required = t.getAttribute("required") != null ? true : false;

        if ($(t).is(":disabled")) required = false;
        if (t.type == "checkbox" && (t.name == "" || t.name == undefined)) {
          isEmpty = !t.checked;
        } else if (t.type == "radio" || (t.type == "checkbox" && t.name)) {
          var inputName = t.name;
          var $checkedField = check.$fieldBlock.find(
            'input[name="' + inputName + '"]:checked'
          );
          var checked = $checkedField.val();

          isEmpty = !checked ? true : false;
        } else {
          isEmpty = $.trim($(t).val()) == "" || $.trim($(t).val()) == null;
        }

        if (required && isEmpty) {
          // valiation error
          //console.log(t);

          if (!opt.onlyBoolean) check.$errorMsg.find(".required").show();
          if (opt.trigger) $(t).trigger("invalid.required");
          //console.log('check case 1');
          return false;
        } else {
          //console.log(t);
          // 20200316 START 김우람 || select 에러메세지 버그 수정
          if (!opt.onlyBoolean && $(t).hasClass("chosen-search-input") == false)
            check.$errorMsg.find(".required").hide();
          // 20200316 END 김우람 || select 에러메세지 버그 수정
          if (opt.trigger) $(t).trigger("valid.required");
          return true;
        }
      },
      dataRule: {
        email: function (e) {
          var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
          if (locale == "/fr") {
            regex =
              /^[a-zA-Z0-9.!$%'*+=?^_`{|}~-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
          }
          return regex.test(e.val());
        },
        onlyAlphabet: function (a) {
          var b = /^[a-zA-Z]*$/;
          if (
            b.test(a.val()) ||
            (!a.attr("required") &&
              !a.is("[required]") &&
              (!a.val() || a.val() == a.attr("placeholder")))
          ) {
            return true;
          } else {
            check.$errorMsg.find(".required").show();
            return false;
            //return ("" + formerror["required"]).split("%title%").join(a.attr("title"))
          }
        },
        isText: function (a) {
          var b = /^[a-zA-Z0-9]*$/;
          if (b.test(a.val())) {
            return true;
          } else {
            check.$errorMsg.find(".required").show();
            return false;
            //return ("" + formerror["invalid"]).split("%title%").join(a.attr("title"))
          }
        },
        onlyCharacters: function (a) {
          var regexp = /^[0-9~`!@#$%^&*()_+-=]*$/;
          var regtemp = true;
          for (var i = 0; i < a.val().length; i++) {
            regexp.test(a.val().charAt(i)) ? (regtemp = false) : null;
          }
          if (regtemp) {
            return true;
          } else if (a.val() == "") {
            check.$errorMsg.find(".required").show();
            return false;
            //return ("" + formerror["required"]).split("%title%").join(a.attr("title"));
          } else {
            if (a.data("validmsg")) {
              //return a.data('validmsg');
              check.$errorMsg.find(".required").show();
              return false;
            } else {
              //return ("" + formerror["required"]).split("%title%").join(a.attr("title"));
              check.$errorMsg.find(".required").show();
              return false;
            }
          }
        },
        onlyCharactersBr: function (a) {
          var personType = a
            .closest("form")
            .find("input[name='persontype']:radio:checked")
            .val();
          var regexp = /^[0-9~`!@#$%^&*()_+,\-./:;<=>?[\\\]{|}'"]*$/;

          if (personType == "corporation") {
            regexp = /^[0-9~`!@#$%^&*()_+,.:;<=>?[\\\]{|}'"]*$/;
          }

          var regtemp = true;
          for (var i = 0; i < a.val().length; i++) {
            regexp.test(a.val().charAt(i)) ? (regtemp = false) : null;
          }
          if (regtemp) {
            return true;
          } else if (a.val() == "") {
            //return ("" + formerror["required"]).split("%title%").join(a.attr("title"));
            check.$errorMsg.find(".required").show();
            return false;
          } else {
            if (a.data("validmsg")) {
              if (personType == "corporation" && a.data("excepmsg")) {
                //return (a.data('validmsg') + " " + a.data('excepmsg'));
                check.$errorMsg.find(".required").show();
                return false;
              } else {
                check.$errorMsg.find(".required").show();
                return false;
                //return a.data('validmsg');
              }
            } else {
              //return ("" + formerror["required"]).split("%title%").join(a.attr("title"));
              check.$errorMsg.find(".required").show();
              return false;
            }
          }
        },
        match: function (a, b) {
          if (
            a.val() != a.attr("placeholder") &&
            a.val() == $('[name="' + b + '"]', a.closest("form")).val()
          ) {
            return true;
          } else {
            if (lgFilter.locale == "/jp" && a.hasClass("jpPassword")) {
              //return ("" + formerror["jpPwMatch"])
              check.$errorMsg.find(".required").show();
              return false;
            } else {
              check.$errorMsg.find(".required").show();
              return false;
              //return ("" + formerror["match"]).split("%title%").join(a.attr("title")).split("%target_title%").join($('[name="' + b + '"]').attr("title"))
            }
          }
        },
        minlength: function (a, b) {
          if (
            !a.val() ||
            a.val() == a.attr("placeholder") ||
            a.val().length >= b
          ) {
            return true;
          } else {
            if (a.data("validmsg")) {
              //return a.data('validmsg');
              check.$errorMsg.find(".required").show();
              return false;
            } else {
              if (locale == "jp" && a.attr("id") == "confirmPassword") {
                //return ("" + formerror["jpPwMin"]);
                check.$errorMsg.find(".required").show();
                return false;
              } else if (
                locale == "ru" &&
                a.attr("id") == "contactPhone" &&
                a.data("blurValidate") !== undefined
              ) {
                //return (a.data("numberMsg"))
                check.$errorMsg.find(".required").show();
                return false;
              } else {
                //return ("" + formerror["minlength"]).split("%title%").join(a.attr("title")).split("%target%").join(b).split("%used%").join(a.val().length)
                check.$errorMsg.find(".required").show();
                return false;
              }
            }
          }
        },
        maxlength: function (a, b) {
          if (
            !a.val() ||
            a.val() == a.attr("placeholder") ||
            a.val().length <= b
          ) {
            return true;
          } else {
            return ("" + formerror["maxlength"])
              .split("%title%")
              .join(a.attr("title"))
              .split("%target%")
              .join(b)
              .split("%used%")
              .join(a.val().length);
          }
        },
        textarea: function (e) {
          return e.val() && e.val() != e.attr("placeholder")
            ? !0
            : ("" + formerror.required).split("%title%").join(e.attr("title"));
        },
        checkbox: function (e) {
          return e.prop("checked") ||
            (!e.attr("required") && !e.is("[required]"))
            ? !0
            : e.data("validmsg")
            ? e.data("validmsg")
            : ("" + formerror.checkbox).split("%title%").join(e.attr("title"));
        },
        radio: function (t) {
          return e('input[name="' + t.attr("name") + '"]:checked').val() ||
            !t.attr("required")
            ? !0
            : ("" + formerror.radio).split("%title%").join(t.attr("title"));
        },
        select: function (e) {
          return e.val() || (!e.attr("required") && !e.is("[required]"))
            ? !0
            : ("" + formerror.required).split("%title%").join(e.attr("title"));
        },
        number: function (e) {
          var regex = /^\s*\d+\s*$/;
          if (regex.test(e.val().replace(/-|\(|\)|\./g, ""))) {
            if (locale == "vn" && e.attr("name") == "contactMobilePhone") {
              var n = 0;
              if (e.val().indexOf(0) == 0) {
                for (var r = 0; r < e.val().length; r++) {
                  if (e.val()[r] != 0) break;
                  n++;
                }
                if (n == e.val().length)
                  //return ("" + formerror.number).split("%title%").join(e.attr("title"))
                  check.$errorMsg.find(".invalid").show();
                return false;
              }
              var i = e.val().substring(n, e.val().length);
              e.val(Number(i));
            }
            check.$errorMsg.find(".invalid").hide();
            return true;
          }
          check.$errorMsg.find(".invalid").show();
          return false;
        },
        noRepeatNum: function (a) {
          var c = "123456789012345678909876543210";
          var d =
            /^1{10}|2{10}|3{10}|4{10}|5{10}|6{10}|7{10}|8{10}|9{10}|0{10}$/;
          var _val = a.val().replace(/-|\(|\)|\./g, ""); // 20200409 김우람 || 정규식 수정

          if (c.indexOf(_val) < 0 && !d.test(_val)) {
            return true;
          } else {
            check.$errorMsg.find(".noRepeatNum").show();
            return false;
          }
        },
        date: function (e) {
          return e.val() || (!e.attr("required") && !e.is("[required]"))
            ? !0
            : ("" + formerror.required).split("%title%").join(e.attr("title"));
        },
        required: function (t) {
          var n = e.trim(t.val());
          return n ||
            (!t.attr("required") && !t.is("[required]")) ||
            (!t.find("option[value!='']").length && t[0].tagName == "SELECT")
            ? !0
            : t.data("requiredSelectMsg")
            ? t.data("requiredSelectMsg")
            : ("" + formerror.required).split("%title%").join(t.attr("title"));
        },
        between: function (e, t) {
          var n = t.split("-");
          return !e.val() ||
            e.val() == e.attr("placeholder") ||
            (e.val().length >= parseInt(n[0]) &&
              e.val().length <= parseInt(n[1]))
            ? !0
            : ("" + formerror.between)
                .split("%title%")
                .join(e.attr("title"))
                .split("%target%")
                .join(t);
        },
        incorrect: function (e) {
          return ("" + formerror.incorrect)
            .split("%title%")
            .join(e.attr("title"));
        },
        length: function (e, t) {
          return !e.val() ||
            e.val() == e.attr("placeholder") ||
            e.val().length == t
            ? !0
            : ("" + formerror.length)
                .split("%title%")
                .join(e.attr("title"))
                .split("%target%")
                .join(t);
        },
        invalid: function (e) {
          return ("" + formerror.invalid)
            .split("%title%")
            .join(e.attr("title"));
        },
        already: function (e) {
          return "" + formerror.already;
        },
        keywords: function (e, t) {
          return !e.val() ||
            e.val() == e.attr("placeholder") ||
            e.val().length >= t
            ? !0
            : ("" + formerror.keywords)
                .split("%title%")
                .join(e.attr("title"))
                .split("%target%")
                .join(t);
        },
        newpassword: function (b) {
          if (b.val() && b.val() != b.attr("placeholder")) {
            var isValid = false;
            var char1 =
              /(abc)|(bcd)|(cde)|(def)|(efg)|(fgh)|(ghi)|(hij)|(ijk)|(jkl)|(klm)|(lmn)|(mno)|(nop)|(opq)|(pqr)|(qrs)|(rst)|(stu)|(tuv)|(uvw)|(vwx)|(wxy)|(xyz)|(qwer)|(wert)|(erty)|(rtyu)|(tyui)|(yuio)|(uiop)|(asdf)|(sdfg)|(dfgh)|(fghj)|(ghjk)|(hjkl)|(zxcv)|(xcvb)|(cvbn)|(vbnm)|(ABC)|(BCD)|(CDE)|(DEF)|(EFG)|(FGH)|(GHI)|(HIJ)|(IJK)|(JKL)|(KLM)|(LMN)|(MNO)|(NOP)|(OPQ)|(PQR)|(QRS)|(RST)|(STU)|(TUV)|(UVW)|(VWX)|(WXY)|(XYZ)|(QWER)|(WERT)|(ERTY)|(RTYU)|(TYUI)|(YUIO)|(UIOP)|(ASDF)|(SDFG)|(DFGH)|(FGHJ)|(GHJK)|(HJKL)|(ZXCV)|(XCVB)|(CVBN)|(VBNM)|(zyx)|(yxw)|(xwv)|(wvu)|(vut)|(uts)|(tsr)|(srq)|(rqp)|(qpo)|(pon)|(onm)|(nml)|(mlk)|(lkj)|(kji)|(jih)|(ihg)|(hgf)|(gfe)|(fed)|(edc)|(dcb)|(cba)|(poiu)|(oiuy)|(iuyt)|(uytr)|(ytre)|(trew)|(rewq)|(lkjh)|(kjhg)|(jhgf)|(hgfd)|(gfds)|(fdsa)|(mnbv)|(nbvc)|(bvcx)|(vcxz)|(ZYX)|(YXW)|(XWV)|(WVU)|(VUT)|(UTS)|(TSR)|(SRQ)|(RQP)|(QPO)|(PON)|(ONM)|(NML)|(MLK)|(LKJ)|(KJI)|(JIH)|(IHG)|(HGF)|(GFE)|(FED)|(EDC)|(DCB)|(CBA)|(POIU)|(OIUY)|(IUYT)|(UYTR)|(YTRE)|(TREW)|(REWQ)|(LKJH)|(KJHG)|(JHGF)|(HGFD)|(GFDS)|(FDSA)|(MNBV)|(NBVC)|(BVCX)|(VCXZ)|(012)|(123)|(234)|(345)|(456)|(567)|(678)|(789)|(890)|(987)|(876)|(765)|(654)|(432)|(321)|(210)/;
            var filter1 = /^[a-zA-Z]+$/;
            var filter2 = /^[\~\!\@\#\$\%\^\&\*\(\)\_\-\+\|\{\}\[\]\,\.\/\?]+$/;
            var filter3 = /^[0-9]+$/;
            var filter4 =
              /^[a-zA-Z\~\!\@\#\$\%\^\&\*\(\)\_\-\+\|\{\}\[\]\,\.\/\?]+$/;
            var filter5 =
              /^[0-9\~\!\@\#\$\%\^\&\*\(\)\_\-\+\|\{\}\[\]\,\.\/\?]+$/;
            var filter6 = /^[a-zA-Z0-9]+$/;
            var filter =
              /^[a-zA-Z0-9\~\!\@\#\$\%\^\&\*\(\)\_\-\+\|\{\}\[\]\,\.\/\?]+$/;

            if (char1.test(b.val())) {
              check.$errorMsg.find(".password3").show();
              return false;
            }

            if (b.val().length < 10) {
              if (filter1.test(b.val())) {
                check.$errorMsg.find(".password8").show();
                return false;
              }
              if (filter2.test(b.val())) {
                check.$errorMsg.find(".password8").show();
                return false;
              }
              if (filter3.test(b.val())) {
                check.$errorMsg.find(".password8").show();
                return false;
              }
              if (filter4.test(b.val())) {
                check.$errorMsg.find(".password8").show();
                return false;
              }
              if (filter5.test(b.val())) {
                check.$errorMsg.find(".password8").show();
                return false;
              }
              if (filter6.test(b.val())) {
                check.$errorMsg.find(".password8").show();
                return false;
              }
              if (filter.test(b.val())) {
                if (b.val().length < 8) {
                  check.$errorMsg.find(".password8").show();
                  return false;
                } else {
                  isValid = true;
                }
              }

              if (isValid == true) {
                return true;
              } else {
                check.$errorMsg.find(".notsymbols").show();
                return false;
              }
            } else {
              if (filter1.test(b.val())) {
                check.$errorMsg.find(".password10").show();
                return false;
              }
              if (filter2.test(b.val())) {
                check.$errorMsg.find(".password10").show();
                return false;
              }
              if (filter3.test(b.val())) {
                check.$errorMsg.find(".password10").show();
                return false;
              }
              if (filter4.test(b.val())) {
                check.$errorMsg.find(".password10").show();
                return false;
              }
              if (filter5.test(b.val())) {
                check.$errorMsg.find(".password10").show();
                return false;
              }
              if (filter6.test(b.val())) {
                isValid = true;
              }
              if (filter.test(b.val())) {
                isValid = true;
              }

              if (isValid == true) {
                return true;
              } else {
                check.$errorMsg.find(".notsymbols").show();
                return false;
              }
            }
          }
        },
        // EMP 20220215 START 이상현 - emp password filter 추가
        newpasswordemp: function ($input) {
          var value = $input.val();
          var char1 =
            /(abc)|(bcd)|(cde)|(def)|(efg)|(fgh)|(ghi)|(hij)|(ijk)|(jkl)|(klm)|(lmn)|(mno)|(nop)|(opq)|(pqr)|(qrs)|(rst)|(stu)|(tuv)|(uvw)|(vwx)|(wxy)|(xyz)|(qwer)|(wert)|(erty)|(rtyu)|(tyui)|(yuio)|(uiop)|(asdf)|(sdfg)|(dfgh)|(fghj)|(ghjk)|(hjkl)|(zxcv)|(xcvb)|(cvbn)|(vbnm)|(ABC)|(BCD)|(CDE)|(DEF)|(EFG)|(FGH)|(GHI)|(HIJ)|(IJK)|(JKL)|(KLM)|(LMN)|(MNO)|(NOP)|(OPQ)|(PQR)|(QRS)|(RST)|(STU)|(TUV)|(UVW)|(VWX)|(WXY)|(XYZ)|(QWER)|(WERT)|(ERTY)|(RTYU)|(TYUI)|(YUIO)|(UIOP)|(ASDF)|(SDFG)|(DFGH)|(FGHJ)|(GHJK)|(HJKL)|(ZXCV)|(XCVB)|(CVBN)|(VBNM)|(zyx)|(yxw)|(xwv)|(wvu)|(vut)|(uts)|(tsr)|(srq)|(rqp)|(qpo)|(pon)|(onm)|(nml)|(mlk)|(lkj)|(kji)|(jih)|(ihg)|(hgf)|(gfe)|(fed)|(edc)|(dcb)|(cba)|(poiu)|(oiuy)|(iuyt)|(uytr)|(ytre)|(trew)|(rewq)|(lkjh)|(kjhg)|(jhgf)|(hgfd)|(gfds)|(fdsa)|(mnbv)|(nbvc)|(bvcx)|(vcxz)|(ZYX)|(YXW)|(XWV)|(WVU)|(VUT)|(UTS)|(TSR)|(SRQ)|(RQP)|(QPO)|(PON)|(ONM)|(NML)|(MLK)|(LKJ)|(KJI)|(JIH)|(IHG)|(HGF)|(GFE)|(FED)|(EDC)|(DCB)|(CBA)|(POIU)|(OIUY)|(IUYT)|(UYTR)|(YTRE)|(TREW)|(REWQ)|(LKJH)|(KJHG)|(JHGF)|(HGFD)|(GFDS)|(FDSA)|(MNBV)|(NBVC)|(BVCX)|(VCXZ)|(012)|(123)|(234)|(345)|(456)|(567)|(678)|(789)|(890)|(987)|(876)|(765)|(654)|(432)|(321)|(210)/;
          var filter = {
            combination: [
              /\d+/,
              /[a-z]+/,
              /[A-Z]+/,
              /[\~\`\!\@\#\$\%\^\&\*\(\)\_\-\+\=\{\}\[\]\:\;\"\'\,\.\<\>\/\?\\\|]+/,
            ],
            outOfRange:
              /[^0-9a-zA-Z\~\`\!\@\#\$\%\^\&\*\(\)\_\-\+\=\{\}\[\]\:\;\"\'\,\.\<\>\/\?\\\|]+/, // not ascii code and 1 ~ 32, 127 ~
            continueSame: /([\d\D])\1\1/,
          };
          var isValid = !filter.outOfRange.test(value);
          if (!isValid) {
            check.$errorMsg.find(".out-of-range").show();
            return false;
          }
          // inherit ["newpassword"]
          if (char1.test(value)) {
            check.$errorMsg.find(".password3").show();
            return false;
          }
          // new:emp case
          var passedComninationFlag = (function () {
            var count = 0;
            var isPassed = null;
            var array = filter.combination;
            for (var i = 0; i < array.length; i++) {
              array[i].test(value) && count++;
            }
            console.log("count :", count);
            isPassed = 3 <= count ? true : false;
            return !isPassed;
          })();
          if (passedComninationFlag) {
            check.$errorMsg.find(".fail-to-combination").show();
            return false;
          }
          var isThreetimesAndMore = filter.continueSame.test(value);
          if (isThreetimesAndMore) {
            check.$errorMsg.find(".continue-three-times").show();
            return false;
          }
          return isValid;
        },
        // EMP 20220215 END 이상현
        postcode: function (e) {
          var t = /^[a-zA-Z0-9]/;
          if (t.test(e.val())) {
            check.$errorMsg.find(".invalid").hide();
            return true;
          } else {
            check.$errorMsg.find(".invalid").show();
            return false;
          }
        },
        cpf: function (el) {
          var cpfNum = el.val().replace(/[^\d]/g, "");
          var numbers, modulus, multiplied, tmp, mod;
          var verifierDigit, sendErr;

          verifierDigit = function (numbers) {
            numbers = numbers.split("");
            modulus = numbers.length + 1;
            multiplied = [];
            tmp = 0;

            $.each(numbers, function (idx, number) {
              multiplied.push(parseInt(number, 10) * (modulus - idx));
            });

            $.each(multiplied, function (idx, number) {
              tmp += number;
            });

            mod = tmp % 11;
            return mod < 2 ? 0 : 11 - mod;
          };

          sendErr = function () {
            check.$errorMsg.find(".invalid").show();
            return false;
          };

          numbers = cpfNum.substr(0, 9);
          numbers += verifierDigit(numbers);
          numbers += verifierDigit(numbers);

          if (cpfNum.length !== 11) {
            return sendErr();
          }
          if (numbers.substr(-2) !== cpfNum.substr(-2)) return sendErr();

          return true;
        },
        /* LGECL-174 add */
        rut: function (el) {
          var cpfNum = el.val().replace(/[^0-9kK]+/g, "");
          var numbers, sum, multiplo, mod, dv, rutNumbers;
          var verifierDigit, sendErr;

          verifierDigit = function (numbers) {
            numbers = numbers
              .toString()
              .replace(/[^0-9kK]+/g, "")
              .toUpperCase();
            sum = 0;
            multiplo = 2;

            for (i = 1; i <= numbers.length; i++) {
              index = multiplo * cpfNum.charAt(numbers.length - i);
              sum = sum + index;
              if (multiplo < 7) {
                multiplo = multiplo + 1;
              } else {
                multiplo = 2;
              }
            }

            mod = 11 - (sum % 11);

            dv = dv == "K" ? 10 : dv;
            dv = dv == 0 ? 11 : dv;
            return dv;
          };

          sendErr = function () {
            check.$errorMsg.find(".invalid").show();
            check.$errorMsg.show();
            return false;
          };

          numbers = cpfNum.slice(0, -1);
          dv = cpfNum.slice(-1).toUpperCase();

          rutNumbers = verifierDigit(numbers);

          var hasDuplicates = /\b([0-9])\1\1\1\1\1\1\1+/.test(numbers);
          if (cpfNum.length !== 9 || hasDuplicates) {
            return sendErr();
          }
          if (mod != rutNumbers) return sendErr();

          return true;
        },
        /* LGECL-174 End */
        cnpj: function (e) {
          var t = e.val().replace(/[^\d]/g, ""),
            n,
            r,
            i;
          return (
            (r = function (e) {
              var t = e.split(""),
                n = 2,
                r = 0,
                i = [],
                s,
                o,
                u,
                a;
              o = u = t.length;
              for (a = 0; a < o; a++) i.unshift(parseInt(t[a], 10));
              while (u--)
                (r += parseInt(t[u], 10) * n), (n = n === 9 ? 2 : n + 1);
              return (s = r % 11), s < 2 ? 0 : 11 - s;
            }),
            (i = function () {
              //return ("" + formerror.invalid).split("%title%").join(e.attr("title"))
              check.$errorMsg.find(".invalid").show();
              return false;
            }),
            (n = t.substr(0, 12)),
            (n += r(n)),
            (n += r(n)),
            !t || t.length !== 14
              ? i()
              : n.substr(-2) !== t.substr(-2)
              ? i()
              : !0
          );
        },
        ukPostCheck: function (t) {
          if (!t.data("validCountryTarget")) {
            var form = t.parents("form");
            if ($(form.get(0).countryCode).val() != "GB") {
              check.$errorMsg.find(".invalid").hide();
              return true;
            }
          } else {
            var n = $("[name=" + t.data("validCountryTarget") + "]").val();
            if (n != "GB") {
              check.$errorMsg.find(".invalid").hide();
              return true;
            }
          }
          var r = /^[A-Za-z0-9]{1,4}\s{1}[A-Za-z0-9]{3}$/;
          if (r.test(t.val())) {
            check.$errorMsg.find(".invalid").hide();
            return true;
          } else {
            check.$errorMsg.find(".invalid").show();
            return false;
          }
        },
        nlPostCheck: function (t) {
          var n;
          if (t.data("validCountryTarget")) {
            n = $("[name=" + t.data("validCountryTarget") + "]")[0];
          } else {
            var form = t.parents("form");
            n = form.get(0).countryCode;
          }

          if (n.value == "BE" || n.value == 0) {
            var r = /^[1-9]{1}[0-9]{3}$/i;
            if (r.test(t.val())) {
              check.$errorMsg.find(".invalid").hide();
              return true;
            } else {
              check.$errorMsg
                .find(".invalid")
                .text("Geldig Postcode is verplicht.")
                .show();
              return "Geldig Postcode is verplicht.";
            }
          }
          if (n.value == "NL") {
            var r = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i;
            if (r.test(t.val())) {
              check.$errorMsg.find(".invalid").hide();
              return true;
            } else {
              check.$errorMsg
                .find(".invalid")
                .text(
                  "vul 4 cijfers gevolgd door een spatie en twee hoofdletters"
                )
                .show();
              return "vul 4 cijfers gevolgd door een spatie en twee hoofdletters";
            }
          }
        },
        caPostCheck: function (e) {
          var t = new RegExp(
              /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i
            ),
            n = e.val().toString().trim();
          //return t.test(n.toString()) ? !0 : e.data("valid-rule-msg") ? e.data("valid-rule-msg") : ("" + formerror.required).split("%title%").join(e.attr("title"))
          if (t.test(n.toString())) {
            check.$errorMsg.find(".invalid").hide();
            return true;
          } else {
            check.$errorMsg.find(".invalid").show();
            return false;
          }
        },
        /* LGEPL-342 210316 add */
        plPostCheck: function (t) {
          var r = /^\d{2}-\d{3}$/;
          if (r.test(t.val())) {
            check.$errorMsg.find(".invalid").hide();
            return true;
          } else {
            check.$errorMsg.find(".invalid").show();
            return false;
          }
        },
        /*//LGEPL-342 210316 add */
        /*//LGEBE-44 210319 add */
        bePostCheck: function (t) {
          var n;
          if (t.data("validCountryTarget")) {
            n = $("[name=" + t.data("validCountryTarget") + "]")[0];
          } else {
            var form = t.parents("form");
            n = form.get(0).countryCode;
          }

          if (n.value == "BE") {
            var r = /\d{4}$/;
            if (r.test(t.val())) {
              check.$errorMsg.find(".invalid").hide();
              return true;
            } else {
              check.$errorMsg.find(".invalid").show();
              return false;
            }
          }
          if (n.value == "LU") {
            var r = /^[L]{1}-\d{4}$/;
            if (r.test(t.val())) {
              check.$errorMsg.find(".invalid").hide();
              return true;
            } else {
              check.$errorMsg.find(".invalid").show();
              return false;
            }
          }
        },
        /*//LGETH-216 210319 add */
        pcCodeCheck: function (t) {
          var r = /^[A-Za-z0-9]+$/;
          if (r.test(t.val())) {
            check.$errorMsg.find(".invalid").hide();
            return true;
          } else {
            check.$errorMsg.find(".invalid").show();
            return false;
          }
        },
        /*//LGEBE-44 210319 add */
        imei: function (t) {
          var n = /^[0-9]{15}$/;
          var r = $("input[name=checkIMEI]");

          if (!n.test(t.val())) {
            return r.val("N");
          } else {
            return true;
          }
          var i = 0,
            s = 2,
            o = 14;
          for (var u = 0; u < o; u++) {
            var a = t.val().substring(o - u - 1, o - u),
              f = parseInt(a, 10) * s;
            f >= 10 ? (i += (f % 10) + 1) : (i += f), s == 1 ? s++ : s--;
          }
          var l = (10 - (i % 10)) % 10;
          return l != parseInt(t.val().substring(14, 15), 10)
            ? (r.val("N"), !0)
            : (r.val("Y"), !0);
        },
        huMobile: function (e) {
          var t = /^[0-9|\+0-9]+$/;
          return e.val() == "+36"
            ? ("" + formerror.huMobile).split("%title%").join(e.attr("title"))
            : t.test(e.val())
            ? !0
            : ("" + formerror.huMobile).split("%title%").join(e.attr("title"));
        },
        receipt: function (e) {
          var t = /^(CN|RN)+([A-Za-z0-9]{0,14}?)$/,
            n = /^[0-9]{15}$/;
          return !t.test(e.val().toUpperCase()) &&
            !n.test(e.val().toUpperCase())
            ? ("" + formerror.invalid).split("%title%").join(e.attr("title"))
            : !0;
        },
        brForgotPW: function (t) {
          var n = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/,
            r = /^\s*\d+\s*$/,
            i = t.closest("form").find("input[name=cpfFlag]");
          if (
            n.test(t.val()) ||
            (!t.attr("required") &&
              !t.is("[required]") &&
              (!t.val() || t.val() == t.attr("placeholder")))
          )
            return i.val("N"), !0;
          if (!n.test(t.val())) {
            var s = t.val().replace(/[^\d]/g, ""),
              o,
              u,
              a,
              f,
              l,
              c,
              h;
            return (
              (c = function (t) {
                return (
                  (t = t.split("")),
                  (u = t.length + 1),
                  (a = []),
                  (f = 0),
                  e.each(t, function (e, t) {
                    a.push(parseInt(t, 10) * (u - e));
                  }),
                  e.each(a, function (e, t) {
                    f += t;
                  }),
                  (l = f % 11),
                  l < 2 ? 0 : 11 - l
                );
              }),
              (h = function () {
                return ("" + formerror.invalid)
                  .split("%title%")
                  .join(t.attr("title"));
              }),
              (o = s.substr(0, 9)),
              (o += c(o)),
              (o += c(o)),
              s.length !== 11
                ? h()
                : o.substr(-2) !== s.substr(-2)
                ? h()
                : (i.val("Y"), !0)
            );
          }
          return ("" + formerror.invalid)
            .split("%title%")
            .join(t.attr("title"));
        },
        emailCaptcha: function (t) {
          var n = t.closest(".validateForm"),
            r = "";
          if (t.closest(".validateForm").hasClass("addCaptchaEmail"))
            return (
              e.ajax({
                url: n.attr("data-captcha-url"),
                type: n.attr("method"),
                async: !1,
                data: {
                  LBD_VCID_customizedCaptcha: e(
                    "input[name=LBD_VCID_customizedCaptcha]"
                  ).val(),
                  getInstanceId: e("input[name=getInstanceId]").val(),
                  getCodeCollection: e("input[name=getCodeCollection]").val(),
                  captchaCodeTextBox: e("input[name=captchaCodeTextBox]").val(),
                },
                dataType: "json",
                beforeSend: function () {
                  n.addClass("process");
                },
                success: function (e) {
                  e.result
                    ? n.addClass("success")
                    : e.error &&
                      (n.removeClass("success"),
                      (r = e.error.captchaCodeTextBox));
                },
                complete: function (e) {
                  n.removeClass("process");
                },
              }),
              n.hasClass("success")
                ? !0
                : (e("#customizedCaptcha_ReloadLink").trigger("click"), "" + r)
            );
        },
        keywordCheck: function (t) {
          var n = $("input[name=keyword]");
          return n.val() == null
            ? ("" + formerror.required).split("%title%").join(t.attr("title"))
            : n.val() != t.val()
            ? ("" + formerror.required).split("%title%").join(t.attr("title"))
            : !0;
        },
        ukSerialNumber: function (e) {
          if (locale == "ca_en" || locale == "ca_fr") {
            var t = new Date();
            t = t.getFullYear() % 10;
            var n = e.val()[0];
            if (isNaN(n) == 0)
              if ((t - n > -3 && t - n < 0) || t - n > 7) {
                //return e.nextAll(".msg-error").css("z-index", "20");
                if (!opt.onlyBoolean) {
                  check.$errorMsg.find(".invalid_ca").length
                    ? check.$errorMsg.find(".invalid_ca").show()
                    : check.$errorMsg.find(".invalid").show();
                }
                if (opt.trigger) $(t).trigger("invalid.invalid");
                return false;
              }
          }
          /* LGEUK-324 Start */
          if (e.attr("ismobile") == "Y") var r = /^([0-9]{14})([0-9 ]{0,2})$/;
          else if (e.attr("ismobile") == "N" || e.attr("ismobile") == undefined)
            var r = /^(\d{3})([A-Za-z]{4})([A-Za-z0-9]{5})([A-Za-z0-9]{0,4})$/; // LGEUK-324
          /* LGEUK-324 End */
          if (r.test(e.val().toUpperCase())) {
            if (!opt.onlyBoolean) check.$errorMsg.find(".invalid").hide();
            if (opt.trigger) $(t).trigger("valid.invalid");
            return true;
          } else {
            if (!opt.onlyBoolean) check.$errorMsg.find(".invalid").show();
            if (opt.trigger) $(t).trigger("invalid.invalid");
            return false;
          }
          // return r.test(e.val().toUpperCase()) ? !0 : false; //("" + formerror.ukSerialNumber).split("%title%").join(e.attr("title"))
        },
      },
      pattern: function (t) {
        var pattern = t.getAttribute("pattern")
          ? t.getAttribute("pattern")
          : t.getAttribute("data-pattern");

        if (pattern && t.value != "") {
          pattern = pattern == "\\d*" ? "^[0-9]*$" : pattern; // zip code only

          var val = t.value;
          var regex = new RegExp(pattern, "i");

          if (!regex.test(val)) {
            if (!opt.onlyBoolean) check.$errorMsg.find(".invalid").show();
            if (opt.trigger) $(t).trigger("invalid.pattern");
            //console.log('check case 2');
            return false;
          } else {
            if (!opt.onlyBoolean) check.$errorMsg.find(".invalid").hide();
            return true;
          }
        } else if (t.getAttribute("data-date-format") && t.value != "") {
          var formatArray = t.getAttribute("data-date-format").split("/");
          var regex = "";
          for (var i = 0, len = formatArray.length; i < len; i++) {
            if (formatArray[i] == "mm") {
              regex += "(0[1-9]|1[012])";
            }

            if (formatArray[i] == "dd") {
              regex += "(0[1-9]|[12][0-9]|3[01])";
            }

            if (formatArray[i] == "yy" || formatArray[i] == "yyyy") {
              regex += "(19|20)\\d\\d";
            }

            if (i !== len - 1) {
              regex += "/";
            }
          }
          //console.log('date format regex', regex);

          if (new RegExp(regex).test(t.value)) {
            if (!opt.onlyBoolean) check.$errorMsg.find(".invalid").hide();
            return true;
          } else {
            if (!opt.onlyBoolean) check.$errorMsg.find(".invalid").show();
            if (opt.trigger) $(t).trigger("invalid.pattern");
            return false;
          }
        } else return true;
      },
      // maxLength: function(t){
      // 	var max = t.getAttribute('data-max');
      // 	if(max) {
      // 		var length = t.value.length;
      // 		if(length > max) {// valiation error
      // 			// trigger invalid
      // 			if(opt.trigger) $(t).trigger('invalid.max');
      // 			return false;
      // 		}
      // 	}
      // 	else return true;
      // },
      minLength: function (t) {
        var min = t.getAttribute("minLength");

        if (min) {
          var length = t.value.length;
          if (length < min && length > 0) {
            // valiation error
            // trigger invalid
            if (!opt.onlyBoolean) check.$errorMsg.find(".min-length").show();
            if (opt.trigger) $(t).trigger("invalid.min");
            return false;
          } else {
            if (!opt.onlyBoolean) check.$errorMsg.find(".min-length").hide();
            return true;
          }
        } else return true;
      },
      email: function (t) {
        var val = t.value;
        var regex = new RegExp(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );

        if (!regex.test(val) && $.trim(val)) {
          if (!opt.onlyBoolean) check.$errorMsg.find(".invalid").show();
          if (opt.trigger) $(t).trigger("invalid.email");
          return false;
        } else {
          if (!opt.onlyBoolean) check.$errorMsg.find(".invalid").hide();
          return true;
        }
      },
      tel: function (t) {
        var val = t.value;
        // var regex = new RegExp(/^[+]?[0-9]{9,12}$/);
        var regex = new RegExp(/^[0-9]*$/);
        if (!regex.test(val)) {
          if (!opt.onlyBoolean) check.$errorMsg.find(".invalid").show();
          if (opt.trigger) $(t).trigger("invalid.tel");
          return false;
        } else {
          if (!opt.onlyBoolean) check.$errorMsg.find(".invalid").hide();
          return true;
        }
      },
      match: function (t) {
        // match check;
        if (t.value != $(t.getAttribute("data-match-target")).val()) {
          // console.log(check.$errorMsg);
          if (!opt.onlyBoolean) check.$errorMsg.find(".match").show();
          return false;
        } else {
          if (!opt.onlyBoolean) check.$errorMsg.find(".match").hide();
          return true;
        }
      },
      radio: function (t) {
        var _selected = form.radios[t.name].checkedField,
          _related = _selected.getAttribute("data-related-input");
        if (_related && $(_related).val() == "") {
          // is it related text input was empty?
          var _$relatedBlock = $(_related).parent(".field-block");
          if (!opt.onlyBoolean) {
            _$relatedBlock.find(".error-msg .required").show();
            $(_related).focus();
          }
          return false;
        } else {
          return true;
        }
      },
      file: function (t) {
        if (!t.files[0]) return true;

        // check file size
        var maxSize = $(t).data("max"),
          extension = $(t).data("extension"), // 허용되는 파일 확장자 목록, |로 구분 되어 있음
          filesize = 0,
          browser = navigator.appName,
          file = $(t).get(),
          ext,
          fileExtension;

        if (!maxSize && !extension) return true;

        if (maxSize.indexOf("MB") != -1) {
          maxSize = parseInt(maxSize.split("MB")[0]) * 1024 * 1024;
        }
        if (window.FileReader) {
          fileSize = $(t)[0].files[0].size;
          ext = $(t)[0].files[0].name;
        } else {
          var fileobj = new ActiveXObject("Scripting.FileSystemObject");
          fileSize = fileobj.getFile(file.value).size;
          ext = $(t).val().split("/").pop().split("\\").pop();
        }

        // Check file size
        if (fileSize > maxSize) {
          if (!opt.onlyBoolean) check.$errorMsg.find(".size").show();
          if (opt.trigger) $(t).trigger("invalid.file");
          return false;
        }

        // Check file extension
        fileExtension = ext.split(".")[ext.split(".").length - 1].toLowerCase();

        if ($.inArray(fileExtension, extension.split("|")) == -1) {
          if (!opt.onlyBoolean) check.$errorMsg.find(".invalid").show();
          if (opt.trigger) $(t).trigger("invalid.file");
          return false;
        }

        if (opt.trigger) $(t).trigger("valid.file");
        return true;
      },
    };

    this.each(function () {
      form.init();
    });

    return form.result;
  };
})(jQuery);

$(document).ready(function () {
  $('input[type="radio"], input[type="checkbox"]').on({
    change: function (e) {
      var _this = e.currentTarget,
        _target = _this.getAttribute("data-related-input");
      $block = $(_this).parents(".field-block");

      // LGCOMUS-246

      // 200311 START 전호근 - 접근성 관련 수정
      //$block.removeClass('error');
      // 200311 END 전호근

      if (_this.checked) {
        //$block.find('input[type="text"]').attr('disabled','disabled');

        $block.find("[data-related-input]").each(function () {
          $($(this).data("relatedInput"))
            .attr("disabled", true)
            .removeAttr("required");
        });

        if (_target) {
          $(_target)
            .attr("disabled", false)
            .attr("required", "required")
            .eq(0)
            .focus();
        }
      } else {
        $(_target).attr("disabled", true).removeAttr("required");
      }
    },
  });
  $(".auto-validation-form").on({
    submit: function (e) {
      // e.preventDefault();
      $("body").trigger("ajaxLoadBefore");
      var $this = $(this);
      if (!$this.checkValidation()) {
        e.preventDefault();
        $this.trigger("validationFail", [this]); // validation result event trigger
        $("body").trigger("ajaxLoadEnd");
      } else {
        // console.log('submit!');
        $this.trigger("validationSuccess", [this]); // validation result event trigger
        $("body").trigger("ajaxLoadEnd");
      }
    },
  });

  // LGEEG-190 Start
  // *********************************************************
  // 모바일 입력 UX 향상을 위해 type tel을 number 변경하려 하였으나,
  // maxlength 기능 X + FF/IE 크로스브라우징 X + 하이픈(-) 입력됨
  // => type=tel 유지 + number only 기능 개선
  // *********************************************************
  // data-oninput="~" 존재 : 실시간 입력 rule check = Y
  // data-oninput="number" : rule = number only
  $('input[type="tel"]').on("input", function (e) {
    var onInput = $(this).data("oninput") ? $(this).data("oninput") : ""; // 실시간 입력 rule check 여부 + data null check
    if (onInput == "number") {
      $(this).val(
        $(this)
          .val()
          .replace(/[^0-9]/gi, "")
      );
    }
  });
  // LGEEG-190 End
});
// DOM.event.move
//
// 2.0.0
//
// Stephen Band
//
// Triggers 'movestart', 'move' and 'moveend' events after
// mousemoves following a mousedown cross a distance threshold,
// similar to the native 'dragstart', 'drag' and 'dragend' events.
// Move events are throttled to animation frames. Move event objects
// have the properties:
//
// pageX:
// pageY:     Page coordinates of pointer.
// startX:
// startY:    Page coordinates of pointer at movestart.
// distX:
// distY:     Distance the pointer has moved since movestart.
// deltaX:
// deltaY:    Distance the finger has moved since last event.
// velocityX:
// velocityY: Average velocity over last few events.

(function (fn) {
  if (typeof define === "function" && define.amd) {
    define([], fn);
  } else if (
    typeof module !== "undefined" &&
    module !== null &&
    module.exports
  ) {
    module.exports = fn;
  } else {
    fn();
  }
})(function () {
  var assign = Object.assign || (window.jQuery && jQuery.extend);

  // Number of pixels a pressed pointer travels before movestart
  // event is fired.
  var threshold = 8;

  // Shim for requestAnimationFrame, falling back to timer. See:
  // see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  var requestFrame = (function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (fn, element) {
        return window.setTimeout(function () {
          fn();
        }, 25);
      }
    );
  })();

  // Shim for customEvent
  // see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
  (function () {
    if (typeof window.CustomEvent === "function") return false;
    function CustomEvent(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined,
      };
      var evt = document.createEvent("CustomEvent");
      evt.initCustomEvent(
        event,
        params.bubbles,
        params.cancelable,
        params.detail
      );
      return evt;
    }

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
  })();

  var ignoreTags = {
    textarea: true,
    input: true,
    select: true,
    button: true,
  };

  var mouseevents = {
    move: "mousemove",
    cancel: "mouseup dragstart",
    end: "mouseup",
  };

  var touchevents = {
    move: "touchmove",
    cancel: "touchend",
    end: "touchend",
  };

  var rspaces = /\s+/;

  // DOM Events

  var eventOptions = { bubbles: true, cancelable: true };

  var eventsSymbol = typeof Symbol === "function" ? Symbol("events") : {};

  function createEvent(type) {
    return new CustomEvent(type, eventOptions);
  }

  function getEvents(node) {
    return node[eventsSymbol] || (node[eventsSymbol] = {});
  }

  function on(node, types, fn, data, selector) {
    types = types.split(rspaces);

    var events = getEvents(node);
    var i = types.length;
    var handlers, type;

    function handler(e) {
      fn(e, data);
    }

    while (i--) {
      type = types[i];
      handlers = events[type] || (events[type] = []);
      handlers.push([fn, handler]);
      node.addEventListener(type, handler);
    }
  }

  function off(node, types, fn, selector) {
    types = types.split(rspaces);

    var events = getEvents(node);
    var i = types.length;
    var type, handlers, k;

    if (!events) {
      return;
    }

    while (i--) {
      type = types[i];
      handlers = events[type];
      if (!handlers) {
        continue;
      }
      k = handlers.length;
      while (k--) {
        if (handlers[k][0] === fn) {
          node.removeEventListener(type, handlers[k][1]);
          handlers.splice(k, 1);
        }
      }
    }
  }

  function trigger(node, type, properties) {
    // Don't cache events. It prevents you from triggering an event of a
    // given type from inside the handler of another event of that type.
    var event = createEvent(type);
    if (properties) {
      assign(event, properties);
    }
    node.dispatchEvent(event);
  }

  // Constructors

  function Timer(fn) {
    var callback = fn,
      active = false,
      running = false;

    function trigger(time) {
      if (active) {
        callback();
        requestFrame(trigger);
        running = true;
        active = false;
      } else {
        running = false;
      }
    }

    this.kick = function (fn) {
      active = true;
      if (!running) {
        trigger();
      }
    };

    this.end = function (fn) {
      var cb = callback;

      if (!fn) {
        return;
      }

      // If the timer is not running, simply call the end callback.
      if (!running) {
        fn();
      }
      // If the timer is running, and has been kicked lately, then
      // queue up the current callback and the end callback, otherwise
      // just the end callback.
      else {
        callback = active
          ? function () {
              cb();
              fn();
            }
          : fn;

        active = true;
      }
    };
  }

  // Functions

  function noop() {}

  function preventDefault(e) {
    e.preventDefault();
  }

  function isIgnoreTag(e) {
    return !!ignoreTags[e.target.tagName.toLowerCase()];
  }

  function isPrimaryButton(e) {
    // Ignore mousedowns on any button other than the left (or primary)
    // mouse button, or when a modifier key is pressed.
    return e.which === 1 && !e.ctrlKey && !e.altKey;
  }

  function identifiedTouch(touchList, id) {
    var i, l;

    if (touchList.identifiedTouch) {
      return touchList.identifiedTouch(id);
    }

    // touchList.identifiedTouch() does not exist in
    // webkit yet… we must do the search ourselves...

    i = -1;
    l = touchList.length;

    while (++i < l) {
      if (touchList[i].identifier === id) {
        return touchList[i];
      }
    }
  }

  function changedTouch(e, data) {
    var touch = identifiedTouch(e.changedTouches, data.identifier);

    // This isn't the touch you're looking for.
    if (!touch) {
      return;
    }

    // Chrome Android (at least) includes touches that have not
    // changed in e.changedTouches. That's a bit annoying. Check
    // that this touch has changed.
    if (touch.pageX === data.pageX && touch.pageY === data.pageY) {
      return;
    }

    return touch;
  }

  // Handlers that decide when the first movestart is triggered

  function mousedown(e) {
    // Ignore non-primary buttons
    if (!isPrimaryButton(e)) {
      return;
    }

    // Ignore form and interactive elements
    if (isIgnoreTag(e)) {
      return;
    }

    on(document, mouseevents.move, mousemove, e);
    on(document, mouseevents.cancel, mouseend, e);
  }

  function mousemove(e, data) {
    checkThreshold(e, data, e, removeMouse);
  }

  function mouseend(e, data) {
    removeMouse();
  }

  function removeMouse() {
    off(document, mouseevents.move, mousemove);
    off(document, mouseevents.cancel, mouseend);
  }

  function touchstart(e) {
    // Don't get in the way of interaction with form elements
    if (ignoreTags[e.target.tagName.toLowerCase()]) {
      return;
    }

    var touch = e.changedTouches[0];

    // iOS live updates the touch objects whereas Android gives us copies.
    // That means we can't trust the touchstart object to stay the same,
    // so we must copy the data. This object acts as a template for
    // movestart, move and moveend event objects.
    var data = {
      target: touch.target,
      pageX: touch.pageX,
      pageY: touch.pageY,
      identifier: touch.identifier,

      // The only way to make handlers individually unbindable is by
      // making them unique.
      touchmove: function (e, data) {
        touchmove(e, data);
      },
      touchend: function (e, data) {
        touchend(e, data);
      },
    };

    on(document, touchevents.move, data.touchmove, data);
    on(document, touchevents.cancel, data.touchend, data);
  }

  function touchmove(e, data) {
    var touch = changedTouch(e, data);
    if (!touch) {
      return;
    }
    checkThreshold(e, data, touch, removeTouch);
  }

  function touchend(e, data) {
    var touch = identifiedTouch(e.changedTouches, data.identifier);
    if (!touch) {
      return;
    }
    removeTouch(data);
  }

  function removeTouch(data) {
    off(document, touchevents.move, data.touchmove);
    off(document, touchevents.cancel, data.touchend);
  }

  function checkThreshold(e, data, touch, fn) {
    var distX = touch.pageX - data.pageX;
    var distY = touch.pageY - data.pageY;

    // Do nothing if the threshold has not been crossed.
    if (distX * distX + distY * distY < threshold * threshold) {
      return;
    }

    triggerStart(e, data, touch, distX, distY, fn);
  }

  function triggerStart(e, data, touch, distX, distY, fn) {
    var touches = e.targetTouches;
    var time = e.timeStamp - data.timeStamp;

    // Create a movestart object with some special properties that
    // are passed only to the movestart handlers.
    var template = {
      altKey: e.altKey,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      startX: data.pageX,
      startY: data.pageY,
      distX: distX,
      distY: distY,
      deltaX: distX,
      deltaY: distY,
      pageX: touch.pageX,
      pageY: touch.pageY,
      velocityX: distX / time,
      velocityY: distY / time,
      identifier: data.identifier,
      targetTouches: touches,
      finger: touches ? touches.length : 1,
      enableMove: function () {
        this.moveEnabled = true;
        this.enableMove = noop;
        e.preventDefault();
      },
    };

    // Trigger the movestart event.
    trigger(data.target, "movestart", template);

    // Unbind handlers that tracked the touch or mouse up till now.
    fn(data);
  }

  // Handlers that control what happens following a movestart

  function activeMousemove(e, data) {
    var timer = data.timer;

    data.touch = e;
    data.timeStamp = e.timeStamp;
    timer.kick();
  }

  function activeMouseend(e, data) {
    var target = data.target;
    var event = data.event;
    var timer = data.timer;

    removeActiveMouse();

    endEvent(target, event, timer, function () {
      // Unbind the click suppressor, waiting until after mouseup
      // has been handled.
      setTimeout(function () {
        off(target, "click", preventDefault);
      }, 0);
    });
  }

  function removeActiveMouse() {
    off(document, mouseevents.move, activeMousemove);
    off(document, mouseevents.end, activeMouseend);
  }

  function activeTouchmove(e, data) {
    var event = data.event;
    var timer = data.timer;
    var touch = changedTouch(e, event);

    if (!touch) {
      return;
    }

    // Stop the interface from gesturing
    e.preventDefault();

    event.targetTouches = e.targetTouches;
    data.touch = touch;
    data.timeStamp = e.timeStamp;

    timer.kick();
  }

  function activeTouchend(e, data) {
    var target = data.target;
    var event = data.event;
    var timer = data.timer;
    var touch = identifiedTouch(e.changedTouches, event.identifier);

    // This isn't the touch you're looking for.
    if (!touch) {
      return;
    }

    removeActiveTouch(data);
    endEvent(target, event, timer);
  }

  function removeActiveTouch(data) {
    off(document, touchevents.move, data.activeTouchmove);
    off(document, touchevents.end, data.activeTouchend);
  }

  // Logic for triggering move and moveend events

  function updateEvent(event, touch, timeStamp) {
    var time = timeStamp - event.timeStamp;

    event.distX = touch.pageX - event.startX;
    event.distY = touch.pageY - event.startY;
    event.deltaX = touch.pageX - event.pageX;
    event.deltaY = touch.pageY - event.pageY;

    // Average the velocity of the last few events using a decay
    // curve to even out spurious jumps in values.
    event.velocityX = 0.3 * event.velocityX + (0.7 * event.deltaX) / time;
    event.velocityY = 0.3 * event.velocityY + (0.7 * event.deltaY) / time;
    event.pageX = touch.pageX;
    event.pageY = touch.pageY;
  }

  function endEvent(target, event, timer, fn) {
    timer.end(function () {
      trigger(target, "moveend", event);
      return fn && fn();
    });
  }

  // Set up the DOM

  function movestart(e) {
    if (e.defaultPrevented) {
      return;
    }
    if (!e.moveEnabled) {
      return;
    }

    var event = {
      startX: e.startX,
      startY: e.startY,
      pageX: e.pageX,
      pageY: e.pageY,
      distX: e.distX,
      distY: e.distY,
      deltaX: e.deltaX,
      deltaY: e.deltaY,
      velocityX: e.velocityX,
      velocityY: e.velocityY,
      identifier: e.identifier,
      targetTouches: e.targetTouches,
      finger: e.finger,
    };

    var data = {
      target: e.target,
      event: event,
      timer: new Timer(update),
      touch: undefined,
      timeStamp: e.timeStamp,
    };

    function update(time) {
      updateEvent(event, data.touch, data.timeStamp);
      trigger(data.target, "move", event);
    }

    if (e.identifier === undefined) {
      // We're dealing with a mouse event.
      // Stop clicks from propagating during a move
      on(e.target, "click", preventDefault);
      on(document, mouseevents.move, activeMousemove, data);
      on(document, mouseevents.end, activeMouseend, data);
    } else {
      // In order to unbind correct handlers they have to be unique
      data.activeTouchmove = function (e, data) {
        activeTouchmove(e, data);
      };
      data.activeTouchend = function (e, data) {
        activeTouchend(e, data);
      };

      // We're dealing with a touch.
      on(document, touchevents.move, data.activeTouchmove, data);
      on(document, touchevents.end, data.activeTouchend, data);
    }
  }

  on(document, "mousedown", mousedown);
  on(document, "touchstart", touchstart);
  on(document, "movestart", movestart);

  // jQuery special events
  //
  // jQuery event objects are copies of DOM event objects. They need
  // a little help copying the move properties across.

  if (!window.jQuery) {
    return;
  }

  var properties =
    "startX startY pageX pageY distX distY deltaX deltaY velocityX velocityY".split(
      " "
    );

  function enableMove1(e) {
    e.enableMove();
  }
  function enableMove2(e) {
    e.enableMove();
  }
  function enableMove3(e) {
    e.enableMove();
  }

  function add(handleObj) {
    var handler = handleObj.handler;

    handleObj.handler = function (e) {
      // Copy move properties across from originalEvent
      var i = properties.length;
      var property;

      while (i--) {
        property = properties[i];
        e[property] = e.originalEvent[property];
      }

      handler.apply(this, arguments);
    };
  }

  jQuery.event.special.movestart = {
    setup: function () {
      // Movestart must be enabled to allow other move events
      on(this, "movestart", enableMove1);

      // Do listen to DOM events
      return false;
    },

    teardown: function () {
      off(this, "movestart", enableMove1);
      return false;
    },

    add: add,
  };

  jQuery.event.special.move = {
    setup: function () {
      on(this, "movestart", enableMove2);
      return false;
    },

    teardown: function () {
      off(this, "movestart", enableMove2);
      return false;
    },

    add: add,
  };

  jQuery.event.special.moveend = {
    setup: function () {
      on(this, "movestart", enableMove3);
      return false;
    },

    teardown: function () {
      off(this, "movestart", enableMove3);
      return false;
    },

    add: add,
  };
});

/* globals JQClass */
/*! Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function () {
  "use strict";
  var initializing = false;

  // The base JQClass implementation (does nothing)
  window.JQClass = function () {};

  // Collection of derived classes
  JQClass.classes = {};

  // Create a new JQClass that inherits from this class
  JQClass.extend = function extender(prop) {
    var base = this.prototype;

    // Instantiate a base class (but only create the instance, don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // jshint loopfunc:true
      // Check if we're overwriting an existing function
      if (
        typeof prop[name] === "function" &&
        typeof base[name] === "function"
      ) {
        prototype[name] = (function (name, fn) {
          return function () {
            var __super = this._super;
            // Add a new ._super() method that is the same method but on the super-class
            this._super = function (args) {
              return base[name].apply(this, args || []);
            };
            var ret = fn.apply(this, arguments);
            // The method only needs to be bound temporarily, so we remove it when we're done executing
            this._super = __super;
            return ret;
          };
        })(name, prop[name]);
        // Check if we're overwriting existing default options.
      } else if (
        typeof prop[name] === "object" &&
        typeof base[name] === "object" &&
        name === "defaultOptions"
      ) {
        var obj1 = base[name];
        var obj2 = prop[name];
        var obj3 = {};
        var key;
        for (key in obj1) {
          // jshint forin:false
          obj3[key] = obj1[key];
        }
        for (key in obj2) {
          // jshint forin:false
          obj3[key] = obj2[key];
        }
        prototype[name] = obj3;
      } else {
        prototype[name] = prop[name];
      }
    }

    // The dummy class constructor
    function JQClass() {
      // All construction is actually done in the init method
      if (!initializing && this._init) {
        this._init.apply(this, arguments);
      }
    }

    // Populate our constructed prototype object
    JQClass.prototype = prototype;

    // Enforce the constructor to be what we expect
    JQClass.prototype.constructor = JQClass;

    // And make this class extendable
    JQClass.extend = extender;

    return JQClass;
  };
})();
/*! Abstract base class for collection plugins v1.0.2.
	Written by Keith Wood (wood.keith{at}optusnet.com.au) December 2013.
	Licensed under the MIT license (http://keith-wood.name/licence.html). */
(function ($) {
  // Ensure $, encapsulate
  "use strict";

  /** <p>Abstract base class for collection plugins v1.0.2.</p>
		<p>Written by Keith Wood (wood.keith{at}optusnet.com.au) December 2013.</p>
		<p>Licensed under the MIT license (http://keith-wood.name/licence.html).</p>
		<p>Use {@link $.JQPlugin.createPlugin} to create new plugins using this framework.</p>
		<p>This base class provides common functionality such as:</p>
		<ul>
			<li>Creates jQuery bridge - allowing you to invoke your plugin on a collection of elements.</li>
			<li>Handles initialisation including reading settings from metadata -
				an instance object is attached to the affected element(s) containing all the necessary data.</li>
			<li>Handles option retrieval and update - options can be set through default values,
				through inline metadata, or through instantiation settings.<br>
				Metadata is specified as an attribute on the element:
				<code>data-&lt;pluginName>="&lt;option name>: '&lt;value>', ..."</code>.
				Dates should be specified as strings in this format: <code>'new Date(y, m-1, d)'</code>.</li>
			<li>Handles method calling - inner functions starting with '_'are inaccessible,
				whereas others can be called via <code>$(selector).pluginName('functionName')</code>.</li>
			<li>Handles plugin destruction - removing all trace of the plugin.</li>
		</ul>
		@module JQPlugin
		@abstract */
  JQClass.classes.JQPlugin = JQClass.extend({
    /** Name to identify this plugin.
			@example name: 'tabs' */
    name: "plugin",

    /** Default options for instances of this plugin (default: {}).
			@example defaultOptions: {
  selectedClass: 'selected',
  triggers: 'click'
} */
    defaultOptions: {},

    /** Options dependent on the locale.
			Indexed by language and (optional) country code, with '' denoting the default language (English/US).
			Normally additional languages would be provided as separate files to all them to be included as needed.
			@example regionalOptions: {
  '': {
    greeting: 'Hi'
  }
} */
    regionalOptions: {},

    /** Whether or not a deep merge should be performed when accumulating options.
			The default is <code>true</code> but can be overridden in a sub-class. */
    deepMerge: true,

    /** Retrieve a marker class for affected elements.
			In the format: <code>is-&lt;pluginName&gt;</code>.
			@protected
			@return {string} The marker class. */
    _getMarker: function () {
      return "is-" + this.name;
    },

    /** Initialise the plugin.
			Create the jQuery bridge - plugin name <code>xyz</code>
			produces singleton <code>$.xyz</code> and collection function <code>$.fn.xyz</code>.
			@protected */
    _init: function () {
      // Apply default localisations
      $.extend(
        this.defaultOptions,
        (this.regionalOptions && this.regionalOptions[""]) || {}
      );
      // Camel-case the name
      var jqName = camelCase(this.name);
      // Expose jQuery singleton manager
      $[jqName] = this;
      // Expose jQuery collection plugin
      $.fn[jqName] = function (options) {
        var otherArgs = Array.prototype.slice.call(arguments, 1);
        var inst = this;
        var returnValue = this;
        this.each(function () {
          if (typeof options === "string") {
            if (options[0] === "_" || !$[jqName][options]) {
              throw "Unknown method: " + options;
            }
            var methodValue = $[jqName][options].apply(
              $[jqName],
              [this].concat(otherArgs)
            );
            if (methodValue !== inst && methodValue !== undefined) {
              returnValue = methodValue;
              return false;
            }
          } else {
            $[jqName]._attach(this, options);
          }
        });
        return returnValue;
      };
    },

    /** Set default options for all subsequent instances.
			@param {object} options The new default options.
			@example $.pluginName.setDefaults({name: value, ...}) */
    setDefaults: function (options) {
      $.extend(this.defaultOptions, options || {});
    },

    /** Initialise an element. Called internally only.
			Adds an instance object as data named for the plugin.
			Override {@linkcode module:JQPlugin~_postAttach|_postAttach} for plugin-specific processing.
			@private
			@param {Element} elem The element to enhance.
			@param {object} options Overriding settings. */
    _attach: function (elem, options) {
      elem = $(elem);
      if (elem.hasClass(this._getMarker())) {
        return;
      }
      elem.addClass(this._getMarker());
      options = $.extend(
        this.deepMerge,
        {},
        this.defaultOptions,
        this._getMetadata(elem),
        options || {}
      );
      var inst = $.extend(
        { name: this.name, elem: elem, options: options },
        this._instSettings(elem, options)
      );
      elem.data(this.name, inst); // Save instance against element
      this._postAttach(elem, inst);
      this.option(elem, options);
    },

    /** Retrieve additional instance settings.
			Override this in a sub-class to provide extra settings.
			These are added directly to the instance object.
			Default attributes of an instance object are shown as properties below:
			@protected
			@param {jQuery} elem The current jQuery element.
			@param {object} options The instance options.
			@return {object} Any extra instance values.
			@property {Element} elem The element to which this instance applies.
			@property {string} name The name of this plugin.
			@property {object} options The accumulated options for this instance.
			@example _instSettings: function(elem, options) {
  return {nav: elem.find(options.navSelector)};
} */
    _instSettings: function (elem, options) {
      // jshint unused:false
      return {};
    },

    /** Plugin specific post initialisation.
			Override this in a sub-class to perform extra activities.
			This is where you would implement your plugin's main functionality.
			@protected
			@param {jQuery} elem The current jQuery element.
			@param {object} inst The instance settings.
			@example _postAttach: function(elem, inst) {
  elem.on('click.' + this.name, function() {
    ...
  });
} */
    _postAttach: function (elem, inst) {
      // jshint unused:false
    },

    /** Retrieve metadata configuration from the element.
			Metadata is specified as an attribute:
			<code>data-&lt;pluginName>="&lt;option name>: '&lt;value>', ..."</code>.
			Dates should be specified as strings in this format: <code>'new Date(y, m-1, d)'</code>.
			@private
			@param {jQuery} elem The source element.
			@return {object} The inline configuration or {}. */
    _getMetadata: function (elem) {
      try {
        var data = elem.data(this.name.toLowerCase()) || "";
        data = data
          .replace(/(\\?)'/g, function (e, t) {
            return t ? "'" : '"';
          })
          .replace(/([a-zA-Z0-9]+):/g, function (match, group, i) {
            var count = data.substring(0, i).match(/"/g); // Handle embedded ':'
            return !count || count.length % 2 === 0
              ? '"' + group + '":'
              : group + ":";
          })
          .replace(/\\:/g, ":");
        data = $.parseJSON("{" + data + "}");
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            var value = data[key];
            if (
              typeof value === "string" &&
              value.match(/^new Date\(([-0-9,\s]*)\)$/)
            ) {
              // Convert dates
              data[key] = eval(value); // jshint ignore:line
            }
          }
        }
        return data;
      } catch (e) {
        return {};
      }
    },

    /** Retrieve the instance data for element.
			@protected
			@param {Element} elem The source element.
			@return {object} The instance data or <code>{}</code> if none. */
    _getInst: function (elem) {
      return $(elem).data(this.name) || {};
    },

    /** Retrieve or reconfigure the settings for a plugin.
			If new settings are provided they are applied to the instance options.
			If an option name only is provided the value of that option is returned.
			If no name or value is provided, all options are returned.
			Override {@linkcode module:JQPlugin~_optionsChanged|_optionsChanged}
			for plugin-specific processing when option values change.
			@param {Element} elem The source element.
			@param {object|string} [name] The collection of new option values or the name of a single option.
			@param {any} [value] The value for a single named option.
			@return {any|object} If retrieving a single value or all options.
			@example $(selector).plugin('option', 'name', value) // Set one option
$(selector).plugin('option', {name: value, ...}) // Set multiple options
var value = $(selector).plugin('option', 'name') // Get one option
var options = $(selector).plugin('option') // Get all options */
    option: function (elem, name, value) {
      elem = $(elem);
      var inst = elem.data(this.name);
      var options = name || {};
      if (!name || (typeof name === "string" && typeof value === "undefined")) {
        options = (inst || {}).options;
        return options && name ? options[name] : options;
      }
      if (!elem.hasClass(this._getMarker())) {
        return;
      }
      if (typeof name === "string") {
        options = {};
        options[name] = value;
      }
      this._optionsChanged(elem, inst, options);
      $.extend(inst.options, options);
    },

    /** Plugin specific options processing.
			Old value available in <code>inst.options[name]</code>, new value in <code>options[name]</code>.
			Override this in a sub-class to perform extra activities.
			@protected
			@param {jQuery} elem The current jQuery element.
			@param {object} inst The instance settings.
			@param {object} options The new options.
			@example _optionsChanged: function(elem, inst, options) {
  if (options.name != inst.options.name) {
    elem.removeClass(inst.options.name).addClass(options.name);
  }
} */
    _optionsChanged: function (elem, inst, options) {
      // jshint unused:false
    },

    /** Remove all trace of the plugin.
			Override {@linkcode module:JQPlugin~_preDestroy|_preDestroy} for plugin-specific processing.
			@param {Element} elem The source element.
			@example $(selector).plugin('destroy') */
    destroy: function (elem) {
      elem = $(elem);
      if (!elem.hasClass(this._getMarker())) {
        return;
      }
      this._preDestroy(elem, this._getInst(elem));
      elem.removeData(this.name).removeClass(this._getMarker());
    },

    /** Plugin specific pre destruction.
			It is invoked as part of the {@linkcode module:JQPlugin~destroy|destroy} processing.
			Override this in a sub-class to perform extra activities and undo everything that was
			done in the {@linkcode module:JQPlugin~_postAttach|_postAttach} or
			{@linkcode module:JQPlugin~_optionsChanged|_optionsChanged} functions.
			@protected
			@param {jQuery} elem The current jQuery element.
			@param {object} inst The instance settings.
			@example _preDestroy: function(elem, inst) {
  elem.off('.' + this.name);
} */
    _preDestroy: function (elem, inst) {
      // jshint unused:false
    },
  });

  /** Convert names from hyphenated to camel-case.
		@private
		@param {string} value The original hyphenated name.
		@return {string} The camel-case version. */
  function camelCase(name) {
    return name.replace(/-([a-z])/g, function (match, group) {
      return group.toUpperCase();
    });
  }

  /** Expose the plugin base.
		@namespace $.JQPlugin */
  $.JQPlugin = {
    /** Create a new collection plugin.
			@memberof $.JQPlugin
			@param {string} [superClass='JQPlugin'] The name of the parent class to inherit from.
			@param {object} overrides The property/function overrides for the new class.
				See {@link module:JQPlugin|JQPlugin} for the base functionality.
			@example $.JQPlugin.createPlugin({ // Define the plugin
  name: 'tabs',
  defaultOptions: {selectedClass: 'selected'},
  _initSettings: function(elem, options) { return {...}; },
  _postAttach: function(elem, inst) { ... }
});
$('selector').tabs(); // And instantiate it */
    createPlugin: function (superClass, overrides) {
      if (typeof superClass === "object") {
        overrides = superClass;
        superClass = "JQPlugin";
      }
      superClass = camelCase(superClass);
      var className = camelCase(overrides.name);
      JQClass.classes[className] =
        JQClass.classes[superClass].extend(overrides);
      new JQClass.classes[className](); // jshint ignore:line
    },
  };
})(jQuery);

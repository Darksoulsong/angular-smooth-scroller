/*!
 * @preserve Copyright (c) 2016 Thyago Weber
 * MIT License
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */
!function(modules) {
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) return installedModules[moduleId].exports;
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: !1,
            exports: {}
        };
        return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
        module.l = !0, module.exports;
    }
    var installedModules = {};
    return __webpack_require__.m = modules, __webpack_require__.c = installedModules, 
    __webpack_require__.i = function(value) {
        return value;
    }, __webpack_require__.d = function(exports, name, getter) {
        Object.defineProperty(exports, name, {
            configurable: !1,
            enumerable: !0,
            get: getter
        });
    }, __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ? function() {
            return module["default"];
        } : function() {
            return module;
        };
        return __webpack_require__.d(getter, "a", getter), getter;
    }, __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 4);
}([ function(module, exports, __webpack_require__) {
    "use strict";
    var easing_functions_1 = __webpack_require__(1), element_helper_1 = __webpack_require__(2), SmoothScroller = function() {
        function SmoothScroller($q, $window) {
            this.$q = $q, this.$window = $window, this.elementHelper = new element_helper_1.ElementHelper(), 
            this.requestAnimationFrameShim(), this.easingFunctions = new easing_functions_1.EasingFunctions();
        }
        return SmoothScroller.prototype.setScrollableContainer = function(elementSelector) {
            this.elementHelper.setMainContainer(elementSelector);
        }, SmoothScroller.prototype.scrollTo = function(el, speed, offset, easingFn) {
            void 0 === offset && (offset = 0), void 0 === easingFn && (easingFn = "easeInOutQuint");
            var startY, stopY, distance, element = "string" == typeof el ? document.querySelector(el) : el, deferred = this.$q.defer();
            return this.elementHelper.mainContainer || this.elementHelper.setMainContainer(this.$window), 
            element ? (startY = this.elementHelper.getPosition(this.elementHelper.mainContainer), 
            stopY = this.elementHelper.getElementY(element), distance = stopY > startY ? stopY - startY : startY - stopY, 
            distance === startY && (stopY = startY), distance > offset && (stopY -= offset), 
            this.scrollToY(stopY, speed, easingFn).then(function(elementScrollPosition) {
                deferred.resolve(elementScrollPosition);
            })) : deferred.reject(), deferred.promise;
        }, SmoothScroller.prototype.requestAnimationFrameShim = function() {
            var _this = this, self = this;
            this.$window.requestAnimationFrame = function() {
                return _this.$window.requestAnimationFrame || _this.$window.webkitRequestAnimationFrame || function(callback) {
                    self.$window.setTimeout(callback, 1e3 / 60);
                };
            }();
        }, SmoothScroller.prototype.scrollToY = function(scrollTargetY, speed, easing, callback) {
            var _this = this;
            void 0 === scrollTargetY && (scrollTargetY = 0), void 0 === speed && (speed = 2e3), 
            void 0 === easing && (easing = "easeOutSine");
            var time, PI_D2, self = this, deferred = this.$q.defer(), currentTime = 0, scrollY = function() {
                return _this.elementHelper.mainContainer instanceof Window ? _this.elementHelper.mainContainer.scrollY : _this.elementHelper.mainContainer.scrollTop;
            }();
            return time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8)), 
            PI_D2 = Math.PI / 2, function() {
                if (!self.easingFunctions.has(easing)) throw new Error("Invalid easing option " + easing + ". Try " + self.easingFunctions.list().join(" or ") + " instead.");
            }(), function tick() {
                currentTime += 1 / 60;
                var p = currentTime / time, t = self.easingFunctions.execute(easing, p);
                p < 1 ? (self.$window.requestAnimationFrame(tick), self.elementHelper.mainContainer.scrollTop = scrollY + (scrollTargetY - scrollY) * t) : (self.elementHelper.mainContainer.scrollTop = scrollTargetY, 
                "undefined" != typeof callback ? callback(scrollTargetY) : deferred.resolve(scrollTargetY));
            }(), deferred.promise;
        }, SmoothScroller.$inject = [ "$q", "$window" ], SmoothScroller;
    }();
    exports.SmoothScroller = SmoothScroller;
}, function(module, exports) {
    "use strict";
    var Easing = function() {
        function Easing(name, fn) {
            this.name = name, this.fn = fn;
        }
        return Easing;
    }(), EasingFunctions = function() {
        function EasingFunctions() {
            this.easings = [], this.init();
        }
        return EasingFunctions.prototype.has = function(fnName) {
            for (var found = !1, i = 0; i < this.easings.length; i++) {
                var easing = this.easings[i];
                easing.name === fnName && (found = !0);
            }
            return found;
        }, EasingFunctions.prototype.list = function() {
            return this.easings.map(function(easing) {
                return easing.name;
            });
        }, EasingFunctions.prototype.execute = function(name, pos) {
            var fn = this.get(name);
            return fn(pos);
        }, EasingFunctions.prototype.init = function() {
            this.set("easeOutSine", function(pos) {
                return Math.sin(pos * (Math.PI / 2));
            }), this.set("easeInOutSine", function(pos) {
                return -.5 * (Math.cos(Math.PI * pos) - 1);
            }), this.set("easeInOutQuint", function(pos) {
                return (pos /= .5) < 1 ? .5 * Math.pow(pos, 5) : .5 * (Math.pow(pos - 2, 5) + 2);
            });
        }, EasingFunctions.prototype.set = function(name, fn) {
            var easing = new Easing(name, fn);
            this.easings.push(easing);
        }, EasingFunctions.prototype.get = function(name) {
            var easingFn;
            return this.easings.forEach(function(easing) {
                easing.name === name && (easingFn = easing.fn);
            }), easingFn;
        }, EasingFunctions;
    }();
    exports.EasingFunctions = EasingFunctions;
}, function(module, exports, __webpack_require__) {
    "use strict";
    var errors_1 = __webpack_require__(3), ElementHelper = function() {
        function ElementHelper() {}
        return ElementHelper.prototype.isHTMLElement = function(el) {
            return el.constructor.name.toLowerCase().indexOf("html") !== -1;
        }, ElementHelper.prototype.isJQuery = function(el) {
            return "Object" === el.constructor.name && "bind" in el;
        }, ElementHelper.prototype.elementHasScrollbar = function(el, horizontal) {
            var hasScrollbar, method = horizontal ? "Width" : "Height", gap = 30, elementHasLayout = el["scroll" + method] > 0;
            return elementHasLayout || (el.style.display = "block", el.style.overflow = "auto"), 
            hasScrollbar = el["scroll" + method] > el["client" + method] + gap, elementHasLayout || (el.style.display = "", 
            el.style.overflow = ""), hasScrollbar;
        }, ElementHelper.prototype.getElementY = function(element) {
            for (var elementDistanceFromTop, scrollableParent = this.mainContainer || this.getFirstParentNodeWithScrollbars(element), parentTop = scrollableParent.offsetTop, elementTop = 0; element !== scrollableParent.offsetParent; ) elementTop += element.offsetTop, 
            element = element.offsetParent;
            return elementDistanceFromTop = elementTop - parentTop;
        }, ElementHelper.prototype.getFirstParentNodeWithScrollbars = function(el) {
            for (var elem = "string" == typeof el ? document.querySelector(el) : el; elem && !this.elementHasScrollbar(elem); ) elem = elem.parentNode;
            return elem;
        }, ElementHelper.prototype.setMainContainer = function(containerElement) {
            var container;
            if ("string" == typeof containerElement && (container = document.querySelector(containerElement)), 
            this.isHTMLElement(containerElement) && (container = containerElement), this.isJQuery(containerElement) && (container = containerElement[0]), 
            !container) throw new errors_1.ElementNotFoundError(containerElement);
            this.mainContainer = container;
        }, ElementHelper.prototype.getPosition = function(elem) {
            return elem instanceof Window ? elem.pageYOffset : elem.scrollTop;
        }, ElementHelper;
    }();
    exports.ElementHelper = ElementHelper;
}, function(module, exports) {
    "use strict";
    var __extends = this && this.__extends || function(d, b) {
        function __() {
            this.constructor = d;
        }
        for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
    }, ElementNotFoundError = function(_super) {
        function ElementNotFoundError(selector) {
            var sel = "";
            selector && "string" == typeof selector && (sel = "with selector " + selector), 
            _super.call(this, "Element " + sel + " not found."), this.name = "ElementNotFoundError", 
            this.stack = new Error().stack;
        }
        return __extends(ElementNotFoundError, _super), ElementNotFoundError;
    }(Error);
    exports.ElementNotFoundError = ElementNotFoundError;
}, function(module, exports, __webpack_require__) {
    "use strict";
    var smooth_scroller_1 = __webpack_require__(0);
    exports.SmoothScroller = smooth_scroller_1.SmoothScroller, exports.angularSmoothScrollerModule = "angularSmoothScroller";
    var win = window;
    win.angular.module(exports.angularSmoothScrollerModule, []).factory("angularSmoothScroller", [ "$q", "$window", function($q, $window) {
        return new smooth_scroller_1.SmoothScroller($q, $window);
    } ]);
} ]);
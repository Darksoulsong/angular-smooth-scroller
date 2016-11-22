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
(function(modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) return installedModules[moduleId].exports;
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        };
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.l = true;
        return module.exports;
    }
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.i = function(value) {
        return value;
    };
    __webpack_require__.d = function(exports, name, getter) {
        Object.defineProperty(exports, name, {
            configurable: false,
            enumerable: true,
            get: getter
        });
    };
    __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ? function getDefault() {
            return module["default"];
        } : function getModuleExports() {
            return module;
        };
        __webpack_require__.d(getter, "a", getter);
        return getter;
    };
    __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };
    __webpack_require__.p = "";
    return __webpack_require__(__webpack_require__.s = 4);
})([ function(module, exports, __webpack_require__) {
    "use strict";
    "use strict";
    var easing_functions_1 = __webpack_require__(1);
    var element_helper_1 = __webpack_require__(2);
    var SmoothScroller = function() {
        function SmoothScroller($q, $window) {
            this.$q = $q;
            this.$window = $window;
            this.elementHelper = new element_helper_1.ElementHelper();
            this.requestAnimationFrameShim();
            this.easingFunctions = new easing_functions_1.EasingFunctions();
        }
        SmoothScroller.prototype.setScrollableContainer = function(elementSelector) {
            this.elementHelper.setMainContainer(elementSelector);
        };
        SmoothScroller.prototype.scrollTo = function(el, speed, offset, easingFn) {
            if (speed === void 0) {
                speed = 2e3;
            }
            if (offset === void 0) {
                offset = 0;
            }
            if (easingFn === void 0) {
                easingFn = "easeInOutQuint";
            }
            var element = typeof el === "string" ? document.querySelector(el) : el;
            var startY;
            var stopY;
            var distance;
            var deferred = this.$q.defer();
            if (!this.elementHelper.mainContainer) {
                this.elementHelper.setMainContainer(this.$window);
            }
            if (element) {
                startY = this.elementHelper.getPosition(this.elementHelper.mainContainer);
                stopY = this.elementHelper.getElementY(element);
                distance = stopY > startY ? stopY - startY : startY - stopY;
                if (distance > offset) {
                    stopY = stopY - offset;
                }
                this.scrollToY(stopY, speed, easingFn).then(function(elementScrollPosition) {
                    deferred.resolve(elementScrollPosition);
                });
            } else {
                deferred.reject();
            }
            return deferred.promise;
        };
        SmoothScroller.prototype.requestAnimationFrameShim = function() {
            var _this = this;
            var self = this;
            this.$window.requestAnimationFrame = function() {
                return _this.$window.requestAnimationFrame || _this.$window.webkitRequestAnimationFrame || function(callback) {
                    self.$window.setTimeout(callback, 1e3 / 60);
                };
            }();
        };
        SmoothScroller.prototype.scrollToY = function(scrollTargetY, speed, easing, callback) {
            var _this = this;
            if (scrollTargetY === void 0) {
                scrollTargetY = 0;
            }
            if (easing === void 0) {
                easing = "easeOutSine";
            }
            var self = this;
            var deferred = this.$q.defer();
            var currentTime = 0;
            var time;
            var PI_D2;
            var scrollY = function() {
                if (_this.elementHelper.mainContainer instanceof Window) {
                    return _this.elementHelper.mainContainer.scrollY;
                }
                return _this.elementHelper.mainContainer.scrollTop;
            }();
            time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8));
            PI_D2 = Math.PI / 2;
            (function checkEasing() {
                if (!self.easingFunctions.has(easing)) {
                    throw new Error("Invalid easing option " + easing + ". Try " + self.easingFunctions.list().join(" or ") + " instead.");
                }
            })();
            (function tick() {
                currentTime += 1 / 60;
                var p = currentTime / time;
                var t = self.easingFunctions.execute(easing, p);
                if (p < 1) {
                    self.$window.requestAnimationFrame(tick);
                    self.elementHelper.mainContainer.scrollTop = scrollY + (scrollTargetY - scrollY) * t;
                } else {
                    self.elementHelper.mainContainer.scrollTop = scrollTargetY;
                    if (typeof callback !== "undefined") {
                        callback(scrollTargetY);
                    } else {
                        deferred.resolve(scrollTargetY);
                    }
                }
            })();
            return deferred.promise;
        };
        SmoothScroller.$inject = [ "$q", "$window" ];
        return SmoothScroller;
    }();
    exports.SmoothScroller = SmoothScroller;
}, function(module, exports) {
    "use strict";
    "use strict";
    var Easing = function() {
        function Easing(name, fn) {
            this.name = name;
            this.fn = fn;
        }
        return Easing;
    }();
    var EasingFunctions = function() {
        function EasingFunctions() {
            this.easings = [];
            this.init();
        }
        EasingFunctions.prototype.has = function(fnName) {
            var found = false;
            for (var i = 0; i < this.easings.length; i++) {
                var easing = this.easings[i];
                if (easing.name === fnName) {
                    found = true;
                }
            }
            return found;
        };
        EasingFunctions.prototype.list = function() {
            return this.easings.map(function(easing) {
                return easing.name;
            });
        };
        EasingFunctions.prototype.execute = function(name, pos) {
            var fn = this.get(name);
            return fn(pos);
        };
        EasingFunctions.prototype.init = function() {
            this.set("easeOutSine", function(pos) {
                return Math.sin(pos * (Math.PI / 2));
            });
            this.set("easeInOutSine", function(pos) {
                return -.5 * (Math.cos(Math.PI * pos) - 1);
            });
            this.set("easeInOutQuint", function(pos) {
                if ((pos /= .5) < 1) {
                    return .5 * Math.pow(pos, 5);
                }
                return .5 * (Math.pow(pos - 2, 5) + 2);
            });
        };
        EasingFunctions.prototype.set = function(name, fn) {
            var easing = new Easing(name, fn);
            this.easings.push(easing);
        };
        EasingFunctions.prototype.get = function(name) {
            var easingFn;
            this.easings.forEach(function(easing) {
                if (easing.name === name) {
                    easingFn = easing.fn;
                }
            });
            return easingFn;
        };
        return EasingFunctions;
    }();
    exports.EasingFunctions = EasingFunctions;
}, function(module, exports, __webpack_require__) {
    "use strict";
    "use strict";
    var errors_1 = __webpack_require__(3);
    var ElementHelper = function() {
        function ElementHelper() {}
        ElementHelper.prototype.isHTMLElement = function(el) {
            return el.constructor.name.toLowerCase().indexOf("html") !== -1;
        };
        ElementHelper.prototype.isJQuery = function(el) {
            return el.constructor.name === "Object" && "bind" in el;
        };
        ElementHelper.prototype.elementHasScrollbar = function(el, horizontal) {
            var method = horizontal ? "Width" : "Height";
            var gap = 30;
            var elementHasLayout = el["scroll" + method] > 0;
            var hasScrollbar;
            if (!elementHasLayout) {
                el.style.display = "block";
                el.style.overflow = "auto";
            }
            hasScrollbar = el["scroll" + method] > el["client" + method] + gap;
            if (!elementHasLayout) {
                el.style.display = "";
                el.style.overflow = "";
            }
            return hasScrollbar;
        };
        ElementHelper.prototype.getElementY = function(element) {
            var scrollableParent = this.mainContainer || this.getFirstParentNodeWithScrollbars(element);
            var parentTop = scrollableParent.offsetTop;
            var elementTop = 0;
            var elementDistanceFromTop;
            while (element !== scrollableParent.offsetParent) {
                elementTop += element.offsetTop;
                element = element.offsetParent;
            }
            elementDistanceFromTop = elementTop - parentTop;
            return elementDistanceFromTop;
        };
        ElementHelper.prototype.getFirstParentNodeWithScrollbars = function(el) {
            var elem = typeof el === "string" ? document.querySelector(el) : el;
            while (elem) {
                if (this.elementHasScrollbar(elem)) {
                    break;
                } else {
                    elem = elem.parentNode;
                }
            }
            return elem;
        };
        ElementHelper.prototype.setMainContainer = function(containerElement) {
            var container;
            if (typeof containerElement === "string") {
                container = document.querySelector(containerElement);
            }
            if (this.isHTMLElement(containerElement)) {
                container = containerElement;
            }
            if (this.isJQuery(containerElement)) {
                container = containerElement[0];
            }
            if (!container) {
                throw new errors_1.ElementNotFoundError(containerElement);
            }
            this.mainContainer = container;
        };
        ElementHelper.prototype.getPosition = function(elem) {
            if (elem instanceof Window) {
                return elem.pageYOffset;
            }
            return elem.scrollTop;
        };
        return ElementHelper;
    }();
    exports.ElementHelper = ElementHelper;
}, function(module, exports) {
    "use strict";
    "use strict";
    var __extends = this && this.__extends || function(d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var ElementNotFoundError = function(_super) {
        __extends(ElementNotFoundError, _super);
        function ElementNotFoundError(selector) {
            var sel = "";
            if (selector && typeof selector === "string") {
                sel = "with selector " + selector;
            }
            _super.call(this, "Element " + sel + " not found.");
            this.name = "ElementNotFoundError";
            this.stack = new Error().stack;
        }
        return ElementNotFoundError;
    }(Error);
    exports.ElementNotFoundError = ElementNotFoundError;
}, function(module, exports, __webpack_require__) {
    "use strict";
    "use strict";
    var smooth_scroller_1 = __webpack_require__(0);
    exports.SmoothScroller = smooth_scroller_1.SmoothScroller;
    exports.angularSmoothScrollerModule = "angularSmoothScroller";
    var win = window;
    win.angular.module(exports.angularSmoothScrollerModule, []).factory("angularSmoothScroller", [ "$q", "$window", function($q, $window) {
        return new smooth_scroller_1.SmoothScroller($q, $window);
    } ]);
} ]);
import {Easing} from './easing-functions';

export class SmoothScroller {
	static $inject = ['$q', '$window'];

	mainContainer: HTMLElement;

	constructor (private $q: ng.IQService, private $window: any) {
        this.requestAnimationFrameShim();
	}

    setMainContainer (containerElementId: string | HTMLElement | ng.IAugmentedJQuery) {
		let container;

		if (typeof containerElementId === 'string') {
			container = document.querySelector(containerElementId);
		}
		if (this.isHTMLElement(containerElementId)) {
			container = containerElementId;
		}
		if (this.isJQuery(containerElementId)) {
			container = containerElementId[0];
		}

		this.mainContainer = container;
	}

	scrollTo (el: string | HTMLElement, speed: number, offset: number = 0, easingFn: string = 'easeInOutQuint') {
		let element = typeof el === 'string' ? document.querySelector(el) : el;
		let startY;
		let stopY;
		let distance;
		let deferred = this.$q.defer();

		this.mainContainer = this.mainContainer || this.$window;

		if (element) {
			// startY = this.getPosition(this.mainContainer);
			startY = this.getPosition(element as HTMLElement);
			stopY = this.getElementY(element);
			distance = stopY > startY ? stopY - startY : startY - stopY;

			if (distance > offset) { stopY = stopY - offset; }

			this.scrollToY(stopY, speed, easingFn, (elementScrollPosition) => {
				deferred.resolve(elementScrollPosition);
			});
		} else {
			deferred.reject();
		}

		return deferred.promise;
	}

    /**
     * first add request animation frame shim
     * http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
     */
    private requestAnimationFrameShim () {
		var self = this;

        this.$window.requestAnimationFrame = (() => {
            return this.$window.requestAnimationFrame    ||
                this.$window.webkitRequestAnimationFrame ||
                function (callback: Function) {
                    self.$window.setTimeout(callback, 1000 / 60);
                };
        })();
    }

	private isHTMLElement (el: any): boolean {
		return el.constructor.name.toLowerCase().indexOf('html') !== -1;
	}

    private isJQuery (el: any): boolean {
        return el.constructor.name === 'Object' && 'bind' in el;
    }

	private getPosition (container: HTMLElement | Window): number {
		if (container instanceof Window) {
			return container.pageYOffset;
		}
		return container.scrollTop;
		// return container.getBoundingClientRect().top;
	}

	private elementHasScrollbar (el: HTMLElement | Node, horizontal?: boolean): boolean {
		let method = horizontal ? 'Width' : 'Height';
		return el[`scroll${method}`] > el[`client${method}`];
	}

	private getFirstParentNodeWithScrollbars (el: any): Node {
		let elem: Node = typeof el === 'string' ? document.getElementById(el) : el;
		while (elem) {
			if (this.elementHasScrollbar(elem)) {
				break;
			} else {
				elem = elem.parentNode;
			}
		}
		return elem;
	}

	private getElementY (element: any): number {
		let y = element.offsetTop;

		while (!this.elementHasScrollbar(element)) {
			y += element.offsetTop;
			element = element.offsetParent;
		}
		return y;
	}

	/**
	 * Main method 
	 */
	private scrollToY (scrollTargetY: number = 0, speed: number = 2000, easing: string = 'easeOutSine', callback: Function) {
		this.mainContainer = this.mainContainer || this.$window;

		const self = this;
		let deferred = this.$q.defer();
		let currentTime = 0;
		let time;
		let PI_D2;
		let easingEquations = new Easing();
		let easingOptions = [];
		let scrollY = (() => {
            if (this.mainContainer instanceof Window) {
                return this.mainContainer.scrollY;
            }
            return this.mainContainer.scrollTop;
        })();

		// min time .1, max time .8 seconds
		time = Math.max(0.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, 0.8));

		// easing equations from https://github.com/danro/easing-js/blob/master/easing.js
		PI_D2 = Math.PI / 2;

		(function getEasingOptions () {
			for (let key in easingEquations) {
				easingOptions.push(key);
			}
		})();

		(function checkEasing (easingOpt: string) {
			if ((easingOpt in easingEquations) === false) {
                throw new Error(`Invalid easing option ${easingOpt}.Try ${easingOptions.join(' or ')} instead.`);
			}
		})(easing);

		// add animation loop
		// and call it once to get started
		(function tick () {
			currentTime += 1 / 60;

			var p = currentTime / time;
			var t = easingEquations[easing](p);

			if (p < 1) {
				self.$window.requestAnimationFrame(tick);
				self.mainContainer.scrollTop = scrollY + ((scrollTargetY - scrollY) * t);
			} else {
				self.mainContainer.scrollTop = scrollTargetY;
				if (typeof callback !== 'undefined') {
					callback(scrollTargetY);
				} else {
					deferred.resolve(scrollTargetY);
				}
			}
		})();

		return deferred.promise;
	}
}

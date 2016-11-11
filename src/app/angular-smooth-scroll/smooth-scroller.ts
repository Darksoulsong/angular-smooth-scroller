import {Easing} from './easing-functions';

export class SmoothScroller {
	mainContainer: HTMLElement;

	constructor (private $q: ng.IQService, private $window: any) {
        this.requestAnimationFrameShim();
	}

    setMainContainer (containerElementId: string | HTMLElement | ng.IAugmentedJQuery) {
		let container;

		if (typeof containerElementId === 'string') {
			container = document.getElementById(containerElementId);
		}
		if (this.isHTMLElement(containerElementId)) {
			container = containerElementId;
		}
		if (this.isJQuery(containerElementId)) {
			container = containerElementId[0];
		}

		this.mainContainer = container;
	}

	scrollTo (elementId: string, speed: number, offset: number, easingFn: string) {
		let element = document.getElementById(elementId);
		let startY;
		let stopY;
		let distance;
		let deferred = this.$q.defer();

		this.mainContainer = this.mainContainer || this.$window;
		offset = offset || 0;
		easingFn = easingFn || 'easeInOutQuint';

		if (element) {
			startY = this.getPosition(this.mainContainer);
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
        this.$window.requestAnimationFrame = (function doShim () {
            return this.$window.requestAnimationFrame    ||
                this.$window.webkitRequestAnimationFrame ||
                function (callback: Function) {
                    this.$window.setTimeout(callback, 1000 / 60);
                };
        })();
    }

	private isHTMLElement (el: any): boolean {
		return el.constructor.name.toLowerCase().indexOf('html') !== -1;
	}

    private isJQuery (el: any): boolean {
        return el.constructor.name === 'Object' && 'bind' in el;
    }

	private getPosition (container: any): number {
		return container.pageYOffset || container.scrollTop;
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
	private scrollToY (scrollTargetY: number, speed: number, easing: string, callback: Function) {
		this.mainContainer = this.mainContainer || this.$window;

		let deferred = this.$q.defer();
		let currentTime = 0;
		let time;
		let PI_D2;
		let easingEquations = new Easing();
		let scrollY = (() => {
            if (this.mainContainer instanceof Window) {
                return this.mainContainer.scrollY;
            }
            return this.mainContainer.scrollTop;
        })();

		scrollTargetY = scrollTargetY || 0;
		speed = speed || 2000;
		easing = easing || 'easeOutSine';

		// min time .1, max time .8 seconds
		time = Math.max(0.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, 0.8));

		// easing equations from https://github.com/danro/easing-js/blob/master/easing.js
		PI_D2 = Math.PI / 2;

		(function checkEasing (easingOpt: string) {
			if (!easingEquations.hasOwnProperty(easingOpt)) {
                throw new Error(`
                    Invalid easing option ${easingOpt}.
                    Try ${Object.keys(easingEquations).join(' or ')} instead.
                `);
			}
		})(easing);

		// add animation loop
		// and call it once to get started
		(function tick () {
			currentTime += 1 / 60;

			var p = currentTime / time;
			var t = easingEquations[easing](p);

			if (p < 1) {
				this.$window.requestAnimationFrame(tick);
				this.mainContainer.scrollTop = scrollY + ((scrollTargetY - scrollY) * t);
			} else {
				this.mainContainer.scrollTop = scrollTargetY;
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

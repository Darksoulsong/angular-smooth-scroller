import {EasingFunctions} from './easing-functions';
import {ElementHelper} from './element-helper';

export class SmoothScroller {
	static $inject = ['$q', '$window'];

	private elementHelper: ElementHelper;
	private easingFunctions: EasingFunctions;

	constructor (private $q: ng.IQService, private $window: any) {
		this.elementHelper = new ElementHelper();
        this.requestAnimationFrameShim();
		this.easingFunctions = new EasingFunctions();
	}

	setScrollableContainer (elementSelector: string | HTMLElement | ng.IAugmentedJQuery) {
		this.elementHelper.setMainContainer(elementSelector);
	}

	/**
	 * Scroll the scrollable element to the given element position
	 * with an offset (if provided)
	 */
	scrollTo (el: string | HTMLElement, speed: number, offset: number = 0, easingFn: string = 'easeInOutQuint') {
		let element = typeof el === 'string' ? document.querySelector(el) : el;
		let startY;
		let stopY;
		let distance;
		let deferred = this.$q.defer();

		if (!this.elementHelper.mainContainer) {
			this.elementHelper.setMainContainer(this.$window);
		}

		if (element) {
			startY = this.elementHelper.getPosition(this.elementHelper.mainContainer);
			stopY = this.elementHelper.getElementY(element);
			distance = stopY > startY ? stopY - startY : startY - stopY;

			if (distance === startY) { stopY = startY; }
			if (distance > offset) { stopY = stopY - offset; }

			this.scrollToY(stopY, speed, easingFn)
				.then((elementScrollPosition) => {
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

	/**
	 * Scroll the scrollable element to the given Y position
	 */
	private scrollToY (scrollTargetY: number = 0, speed: number = 2000, easing: string = 'easeOutSine', callback?: Function) {
		const self = this;
		const deferred = this.$q.defer();
		let currentTime = 0;
		let time;
		let PI_D2;
		const scrollY = (() => {
            if (this.elementHelper.mainContainer instanceof Window) {
                return this.elementHelper.mainContainer.scrollY;
            }
            return this.elementHelper.mainContainer.scrollTop;
        })();

		// min time .1, max time .8 seconds
		time = Math.max(0.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, 0.8));

		PI_D2 = Math.PI / 2;

		(function checkEasing () {
			if (!self.easingFunctions.has(easing)) {
                throw new Error(
					`Invalid easing option ${easing}. Try ${self.easingFunctions.list().join(' or ')} instead.`
				);
			}
		})();

		// add animation loop
		// and call it once to get started
		(function tick () {
			currentTime += 1 / 60;

			let p = currentTime / time;
			let t = self.easingFunctions.execute(easing, p);

			if (p < 1) {
				self.$window.requestAnimationFrame(tick);
				self.elementHelper.mainContainer.scrollTop = scrollY + ((scrollTargetY - scrollY) * t);
			} else {
				self.elementHelper.mainContainer.scrollTop = scrollTargetY;
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

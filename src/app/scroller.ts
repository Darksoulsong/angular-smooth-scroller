import {SmoothScroller} from './angular-smooth-scroller/index';

export class Scroller {
	static $inject = ['angularSmoothScroller'];

	constructor (protected angularSmoothScroller: SmoothScroller) {}

	doScroll (item: string) {
		let isPageScroll = (item === 'top' || item === 'bottom');

		if (isPageScroll) {
			this.doPageScroll(item);
		} else {
			this.doRestrictedScroll(item);
		}
	}

    protected getItemByIndex (index: number, containerElementSelector?: string): HTMLElement {
		let $elements = document.querySelectorAll(containerElementSelector);
		let $el;

		if ($elements.length) {
			for (let i = 0; i < $elements.length; i++) {
				if (i === index) {
					$el = $elements[i];
					break;
				}
			}
		}

		return $el;
	}

	private doPageScroll (item: string) {
        let $el = document.querySelectorAll(`.${item} toolbar`);

		console.log(`page scroll: ${$el}`);
	}

	private doRestrictedScroll (idx: string) {
        const containerElementSelector = '.scrollable .techs fountain-tech';
		const itemIndex = parseInt(idx, 10) - 1;
		const $el = this.getItemByIndex(itemIndex, containerElementSelector);

        this.angularSmoothScroller.setMainContainer('.scrollable .scrollable-body');
        this.angularSmoothScroller.scrollTo($el, 1000, 100);

		console.log(`restricted scroll: element: ${$el}`);
	}
}
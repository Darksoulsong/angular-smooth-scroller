import {SmoothScroller} from './angular-smooth-scroller/index';
import {Scroller} from './scroller';

class MainController extends Scroller {
	static $inject = ['angularSmoothScroller'];

	constructor (protected angularSmoothScroller: SmoothScroller) {
		super(angularSmoothScroller);
	}

	protected getItemByIndex (index: number): HTMLElement {
		let $elements = document.querySelectorAll('.scrollable .techs fountain-tech');
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
}

export const main: angular.IComponentOptions = {
	template: require('./main.html'),
	controller: MainController,
	controllerAs: '$mainCtrl'
};

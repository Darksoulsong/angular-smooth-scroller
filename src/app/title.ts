import * as angular from 'angular';
import {Scroller} from './scroller';
import {SmoothScroller} from './angular-smooth-scroller/index';

class TitleController extends Scroller {
	constructor (protected angularSmoothScroller: SmoothScroller) {
		super(angularSmoothScroller);
	}

  	protected getItemByIndex (index: number, containerElementSelector: string): HTMLElement {
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
}

export const title: angular.IComponentOptions = {
  template: require('./title.html'),
  controller: TitleController,
  controllerAs: '$titleCtrl'
};

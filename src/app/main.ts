import {SmoothScroller} from './angular-smooth-scroller/index';
import {Scroller} from './scroller';

class MainController extends Scroller {
	static $inject = ['angularSmoothScroller'];

	constructor (protected angularSmoothScroller: SmoothScroller) {
		super(angularSmoothScroller);
	}
}

export const main: angular.IComponentOptions = {
	template: require('./main.html'),
	controller: MainController,
	controllerAs: '$mainCtrl'
};

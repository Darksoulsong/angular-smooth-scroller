class MainController {
	doScroll (item: string) {
		let isPageScroll = item === 'top' || item === 'bottom';

		if (isPageScroll) {
			this.doPageScroll();
		} else {
			this.doRestrictedScroll(item);
		}
	}

	private doPageScroll () {
		console.log('page scroll');
	}

	private doRestrictedScroll (idx: string) {
		let itemIndex = parseInt(idx, 10) - 1;
		// let $el = document.querySelectorAll();
		console.log('restricted scroll');
	}

}

export const main: angular.IComponentOptions = {
	template: require('./main.html'),
	controller: MainController,
	controllerAs: '$mainCtrl'
};

import {ITechService} from './tech-service';

class Tech {
	constructor(
		public logo: string,
		public title: string,
		public text1: string,
		public text2: string
	) {}
}


class TechsController {
  	public techs: Tech[];

  	/** @ngInject */
	constructor(private $http: angular.IHttpService, private fountainTechService: ITechService) {

		this.fountainTechService.list()
			.then((data) => {
				this.techs = data;
		});
	}
}

export const techs: angular.IComponentOptions = {
  template: require('./techs.html'),
  controller: TechsController
};

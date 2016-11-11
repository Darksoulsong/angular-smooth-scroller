import * as angular from 'angular';

class TitleController {
  MainController;
  doScroll;
  doRestrictedScroll;

  $onInit () {
    this.doScroll = this.MainController.doScroll;
    this.doRestrictedScroll = this.MainController.doRestrictedScroll;
  }
}

export const title: angular.IComponentOptions = {
  template: require('./title.html'),
  require: {
    MainController: '^app'
  },
  controller: TitleController,
  controllerAs: '$titleCtrl'
};

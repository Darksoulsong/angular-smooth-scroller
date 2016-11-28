import * as angular from 'angular';

import {tech} from './tech';
import {techs} from './techs';
import {TechService} from './tech-service';

export const techsModule = 'techs';

angular
  .module(techsModule, [])
  .factory('fountainTechService', ['$http', '$q', ($http, $q) => new TechService($http, $q)])
  .component('fountainTech', tech)
  .component('fountainTechs', techs);

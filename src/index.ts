/// <reference path="../typings/index.d.ts" />

import * as angular from 'angular';

import {techsModule} from './app/techs/index';
import 'angular-ui-router';
import routesConfig from './routes';
import {angularSmoothScrollModule} from './app/angular-smooth-scroll/index';

import {main} from './app/main';
import {header} from './app/header';
import {title} from './app/title';
import {footer} from './app/footer';

import './index.scss';

angular
  .module('app', [techsModule, angularSmoothScrollModule, 'ui.router'])
  .config(routesConfig)
  .component('app', main)
  .component('fountainHeader', header)
  .component('fountainTitle', title)
  .component('fountainFooter', footer);

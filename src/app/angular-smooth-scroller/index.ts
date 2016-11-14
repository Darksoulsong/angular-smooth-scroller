import * as angular from 'angular';
import {SmoothScroller} from './smooth-scroller';

export const angularSmoothScrollerModule = 'angularSmoothScroll';
export {SmoothScroller};

angular
    .module(angularSmoothScrollerModule, [])
    .service('angularSmoothScroller', SmoothScroller);

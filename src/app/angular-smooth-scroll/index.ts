import * as angular from 'angular';
import {SmoothScroller} from './smooth-scroller';

export const angularSmoothScrollModule = 'angularSmoothScroll';

angular
    .module(angularSmoothScrollModule, [])
    .factory(SmoothScroller);

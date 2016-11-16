// import * as angular from 'angular';
import {SmoothScroller} from './smooth-scroller';

export const angularSmoothScrollerModule = 'angularSmoothScroller';
export {SmoothScroller};

interface IWindow extends Window {
    angular: {
        module: any,
        service: any
    };
}

let win = window as IWindow;

win.angular
    .module(angularSmoothScrollerModule, [])
    .factory('angularSmoothScroller', ['$q', '$window', ($q, $window) => new SmoothScroller($q, $window)]);

# angular-smooth-scroller

This is an angular service that smoothly scrolls the page or the chosen scrollable element to a given target element vertical position. 

## Usage

1. Register the `angularSmoothScroller` module into your app's module.
    
    ```javascript
    angular.module( 'myApp', [ 'angularSmoothScroller' ] );
    ```

2. Inject the `angularSmoothScroller` service into your controller:

    ```javascript
    myApp.controller('AppController', function ( angularSmoothScroller ) {
        // your code here
    });
    ```

3. Set the scrollable element (default is `window`):

    ```javascript
    angularSmoothScroller.setScrollableContainer( 'content' );
    ```

4. Scroll the scrollable container to the target element:

    ```javascript
    angularSmoothScroller.scrollTo( 'targetId', 1000, 100 );
    ```

## Methods

### `angularSmoothScroller.setScrollableContainer(elementSelector)`
- @param { string | HTMLElement } `elementSelector` The element selector. Defaults to `window`. 

### `angularSmoothScroller.scrollTo(el, speed, offset, easingFn')`
- @param { string | HTMLElement } `el` The element selector.
- @param { number } `speed` The scrolling speed (in ms).
- @param { number } `offset` The distance between the top of the viewport to the target element. Default: `0`;
- @param { string } `easingFn` The easing function name. Default: `easeInOutQuint`. Other options: `easeOutSine`, `easeInOutSine` and `easeInOutQuint`.

**NOTE:** The scrollable element must have a vertical scrollbar. Only vertical scrolling is supported ATM.

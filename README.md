# angularSmoothScroller

This is an angular service that smoothly scrolls the page or the chosen scrollable element to a given target element vertical position. 

## Installation
Install it with npm:

    npm install angular-smooth-scroller

Install it with bower:

    bower install angular-smooth-scroller

## Usage

1. Register the `angularSmoothScroller` module into your app's module.
    
    ```javascript
    angular.module( 'myApp', [ 'angularSmoothScroller' ] );
    ```

2. Inject the `angularSmoothScroller` service into your controller:

    ```javascript
    myApp.controller( 'AppController', function ( angularSmoothScroller ) {
        // your code here
    } );
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
Param | Type | Description | Default Value | Options
------| ---- | ----------- | ------------- | -------
elementSelector | `string | HTMLElement` | The element selector or object | `window` | --    

### `angularSmoothScroller.scrollTo(el, speed, offset, easingFn)`
Param | Type | Description | Default Value | Options
------| ---- | ----------- | ------------- | -------
el | `string | HTMLElement` | The element selector or object | `window` | --    
speed | `number` | The scrolling speed (in ms) | `2000` | --
offset | `number` | The distance between the top of the viewport and the target element | `0` | --   
easingFn | `string` | The easing function name. | `easeInOutQuint` | `easeOutSine`, `easeInOutSine` and `easeInOutQuint`

@returns `Promise` 

**NOTE:** The scrollable element must have a vertical scrollbar. Only vertical scrolling is supported ATM.
